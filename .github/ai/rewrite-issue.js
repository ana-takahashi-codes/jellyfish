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
    return {
      provider: "gemini",
      client: null,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    }
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

const TERMINOLOGIA_URL = "https://coda.io/@ana-takahashi/jellyfish-design-system/terminologia-59"
const TAXONOMIA_URL = "https://coda.io/@ana-takahashi/jellyfish-design-system/taxonomia-56"
const TERMINOLOGIA_FILE = ".github/ai/terminologia-tokens.md"

const SYSTEM_CONTEXT = `You are a Design System Governance AI for the JellyFish Design System.
Your task: rewrite a raw issue (often created from Slack) into the exact structure of the given GitHub issue template.

RULES:
1. Output ONLY the issue body in Markdown. No YAML frontmatter (---), no "Here is the rewritten issue", no commentary.
2. Follow the template structure exactly: same sections (##), checkboxes (- [ ]), code blocks, and placeholders. Keep every section from the template.
3. Preserve all information from the original issue: copy over any concrete details, links, names, and intent. Map them into the right template sections.
4. Do not invent information. If something is missing in the original, leave the template placeholder or write "A definir" / "A preencher". Never make up token names, values, or requirements.
5. Language: keep the same language as the original (Portuguese or English). Template section titles stay as in the template.
6. For Design Tokens: use the taxonomy (e.g. jf.color.*, jf.size.*). Naming and allowed terms must follow the JellyFish terminology (${TERMINOLOGIA_URL}) and taxonomy (${TAXONOMIA_URL}). When suggesting token names, use only terms and structure from the terminology/taxonomy documentation provided in the prompt. For Components: keep the structure (Descrição, Objetivo, Requisitos, Design, Especificações).
7. Remove any Slack-specific text (e.g. "View in Slack", links to Slack) from the output; keep only content relevant to the issue.
8. DESIGN TOKEN TEMPLATE — You MUST always include the section "## Categoria do Token" exactly as in the template, with:
   - **Tipo:** Mark exactly ONE checkbox: [x] Novo | [ ] Modificação | [ ] Depreciação | [ ] Remoção. Infer from the original issue: new token / criar / adicionar → Novo; change / alterar / modificar / atualizar → Modificação; deprecar / descontinuar → Depreciação; remover / remoção → Remoção.
   - **Categoria:** Mark the checkbox that matches the token (Color, Typography, Spacing, Size, Border, Shadow, etc.). If unclear, leave one as [x] that best fits or "Outro".
   Do not omit or merge this section. Keep the exact heading and checkbox list from the template.`

function loadTerminologiaIfExists() {
  try {
    if (fs.existsSync(TERMINOLOGIA_FILE)) {
      const raw = fs.readFileSync(TERMINOLOGIA_FILE, "utf8").trim()
      const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, "").trim()
      return withoutComments.length >= 80 ? withoutComments : null
    }
  } catch {
    // ignore
  }
  return null
}

async function rewriteIssue(issue, templatePath) {
  const template = fs.readFileSync(templatePath, "utf8")
  const isDesignToken = templatePath.includes("design_tokens")
  const templateName = isDesignToken ? "Design Token" : "Componente"

  let terminologiaBlock = ""
  if (isDesignToken) {
    const terminologia = loadTerminologiaIfExists()
    if (terminologia) {
      terminologiaBlock = `

Reference — terminology and taxonomy for token names (use only these terms when suggesting names):
---
${terminologia}
---`
    } else {
      terminologiaBlock = `

When suggesting token names, follow the JellyFish terminology and taxonomy. If no terminology was provided in this prompt, use the structure jf.<category>.<...> and avoid inventing terms. Reference: ${TERMINOLOGIA_URL}`
    }
  }

  const tokenTipoReminder = isDesignToken
    ? `
For "## Categoria do Token": infer Tipo from the issue (novo → [x] Novo; alteração/modificação → [x] Modificação; depreciação → [x] Depreciação; remoção → [x] Remoção). Mark one Categoria (Color, Typography, Spacing, etc.). Keep this section intact.
`
    : ""

  const userPrompt = `Rewrite the following issue into the "${templateName}" template.
${terminologiaBlock}
${tokenTipoReminder}

Original issue (body):
---
${issue.body || "(empty)"}
---

Template to follow (structure and sections):
---
${template}
---

Remember: output only the rewritten issue body in Markdown, matching the template structure. No frontmatter, no extra text. For Design Token, always include "## Categoria do Token" with Tipo and Categoria checkboxes filled.`

  if (llm.provider === "gemini") {
    const fullPrompt = `${SYSTEM_CONTEXT}\n\n${userPrompt}`
    return callGemini(fullPrompt)
  }

  return callOpenAICompatible({
    model: llm.model,
    messages: [
      { role: "system", content: SYSTEM_CONTEXT },
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
