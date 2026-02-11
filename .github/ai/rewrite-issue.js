import fs from "fs"
import OpenAI from "openai"
import { Octokit } from "@octokit/rest"

// Provedor de LLM: groq (gratuito) | gemini (gratuito) | openai
// Defina GROQ_API_KEY ou GEMINI_API_KEY para usar alternativa gratuita; senão usa OPENAI_API_KEY
function getLLMClient() {
  if (process.env.GROQ_API_KEY) {
    return {
      provider: "groq",
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      }),
      model: "llama-3.1-8b-instant",
    }
  }
  if (process.env.GEMINI_API_KEY) {
    return { provider: "gemini", client: null, model: "gemini-1.5-flash" }
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: "gpt-4o-mini",
    }
  }
  throw new Error(
    "Defina um secret: GROQ_API_KEY (gratuito), GEMINI_API_KEY (gratuito) ou OPENAI_API_KEY. Ver .github/workflows/jf-issues-governance.yml"
  )
}

const llm = getLLMClient()
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
const repo = process.env.GITHUB_REPOSITORY.split("/")[1];

function cameFromSlack(issue, debug = null) {
  // Label explícita (adicione "from-slack" ao criar a issue pelo Slack)
  if (hasLabel(issue, "from-slack")) {
    if (debug) debug.reason = "label from-slack"
    return true
  }
  // App GitHub no Slack: corpo costuma ter link (slack.com / app.slack.com) ou texto "from Slack"
  const body = (issue.body || "").toLowerCase()
  const slackBodySignals = [
    "slack.com",
    "app.slack.com",
    "sent from slack",
    "from slack",
    "opened from slack",
    "created from slack",
    "view in slack",
    "view conversation",
  ]
  const matched = slackBodySignals.find((s) => body.includes(s))
  if (matched) {
    if (debug) debug.reason = `body contains "${matched}"`
    return true
  }
  // Autor é bot ou usuário de integração Slack
  const authorMatch =
    issue.user?.type === "Bot" ||
    (issue.user?.login && issue.user.login.toLowerCase().includes("slack"))
  if (authorMatch && debug) debug.reason = `author: ${issue.user?.type} / ${issue.user?.login}`
  return !!authorMatch
}

function hasLabel(issue, label) {
  return issue.labels.some(l => l.name === label);
}

function alreadyProcessed(issue) {
  return hasLabel(issue, "processed-by-ai");
}

async function moveToProject(issueNodeId, projectId) {
  await octokit.graphql(`
    mutation {
      addProjectV2ItemById(input: {
        projectId: "${projectId}",
        contentId: "${issueNodeId}"
      }) {
        item { id }
      }
    }
  `);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callGemini(prompt, maxRetries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${llm.model}:generateContent?key=${process.env.GEMINI_API_KEY}`
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 },
  }
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let res
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || res.statusText)
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error("Resposta Gemini sem texto")
      return text
    } catch (err) {
      const is429 = res?.status === 429
      if (attempt === maxRetries) throw err
      const delay = is429 ? 60000 : 5000
      console.log("[debug] Gemini", err.message, "- retry em", delay / 1000, "s")
      await sleep(delay)
    }
  }
}

async function callOpenAICompatible(options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await llm.client.chat.completions.create(options)
      return response.choices[0].message.content
    } catch (err) {
      const is429 = err.status === 429
      const isRetryable = is429 || (err.status >= 500 && err.status < 600)
      if (!isRetryable || attempt === maxRetries) throw err
      const delay = is429 ? Math.min(60000, 2000 * Math.pow(2, attempt)) : 5000
      console.log("[debug]", llm.provider, err.status, err.message, "- retry em", delay / 1000, "s")
      await sleep(delay)
    }
  }
}

async function rewriteIssue(issue, templatePath) {
  const template = fs.readFileSync(templatePath, "utf8")
  const systemPrompt = `You are a Design System Governance AI.
Rewrite the issue using the provided template.
Preserve the original intent and context.
Do not invent information.`
  const userPrompt = `Original issue:
${issue.body}

Template:
${template}`

  if (llm.provider === "gemini") {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`
    return callGemini(fullPrompt)
  }

  return callOpenAICompatible({
    model: llm.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  })
}

async function main() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  console.log("[debug] Repo:", owner + "/" + repo)
  console.log("[debug] LLM:", llm.provider, "model:", llm.model)
  console.log("[debug] Buscando issues abertas atualizadas desde:", yesterday.toISOString())

  const { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: "open",
    since: yesterday.toISOString(),
    per_page: 100,
  })

  console.log("[debug] Total de issues retornadas:", issues.length)

  let processed = 0
  for (const issue of issues) {
    const labels = issue.labels.map((l) => l.name).join(", ")
    const bodyPreview = (issue.body || "").slice(0, 120).replace(/\n/g, " ")
    const debugSlack = {}
    const fromSlack = cameFromSlack(issue, debugSlack)

    console.log("\n[debug] --- Issue #" + issue.number + " ---")
    console.log("[debug]   title:", issue.title)
    console.log("[debug]   labels:", labels || "(nenhuma)")
    console.log("[debug]   author:", issue.user?.login, "type:", issue.user?.type)
    console.log("[debug]   body preview:", bodyPreview || "(vazio)")
    console.log("[debug]   cameFromSlack:", fromSlack, fromSlack ? "(" + (debugSlack.reason || "ok") + ")" : "")
    console.log("[debug]   alreadyProcessed:", alreadyProcessed(issue))

    try {
      if (!fromSlack) {
        console.log("[debug]   => SKIP: não identificada como do Slack")
        continue
      }
      if (alreadyProcessed(issue)) {
        console.log("[debug]   => SKIP: já processada (label processed-by-ai)")
        continue
      }

      let templatePath
      let projectId

      if (hasLabel(issue, "token")) {
        templatePath = ".github/ISSUE_TEMPLATE/design_tokens.md"
        projectId = process.env.TOKENS_PROJECT_ID
      }
      if (hasLabel(issue, "component")) {
        templatePath = ".github/ISSUE_TEMPLATE/components.md"
        projectId = process.env.UI_PROJECT_ID
      }

      if (!templatePath) {
        console.log("[debug]   => SKIP: sem label 'token' nem 'component' (necessário para escolher template)")
        continue
      }

      console.log("[debug]   => PROCESSANDO (template:", templatePath + ")")
      const newBody = await rewriteIssue(issue, templatePath)

      await octokit.issues.update({
        owner,
        repo,
        issue_number: issue.number,
        body: newBody,
        labels: [...issue.labels.map((l) => l.name), "processed-by-ai"],
      })

      if (projectId) {
        await moveToProject(issue.node_id, projectId)
      }
      processed++
      console.log("[debug]   => OK: issue reescrita e atualizada")

      const maxPerRun = process.env.MAX_ISSUES_PER_RUN ? parseInt(process.env.MAX_ISSUES_PER_RUN, 10) : 0
      if (maxPerRun > 0 && processed >= maxPerRun) {
        console.log("[debug] Limite MAX_ISSUES_PER_RUN atingido:", maxPerRun)
        break
      }
    } catch (err) {
      console.error("[debug]   => ERRO:", err.message)
    }
  }

  console.log("\n[debug] Fim. Issues processadas:", processed)
}

main();
