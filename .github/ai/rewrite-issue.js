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

/** Retorna true se a issue tiver alguma das labels de token (design token). */
function isTokenIssue(issue) {
  const tokenLabels = ["token", "design-token", "design_token", "tokens"];
  return tokenLabels.some((name) => hasLabel(issue, name));
}

/** Retorna true se a issue tiver alguma das labels de componente. */
function isComponentIssue(issue) {
  const componentLabels = ["component", "components", "componente", "ui"];
  return componentLabels.some((name) => hasLabel(issue, name));
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
3. SOURCE OF TRUTH — The original issue body (e.g. the Slack message) is the source of truth for concrete data. Whatever the user wrote for token name, token value, hex code, number, description, or any specific detail MUST be copied exactly into the template. Do not replace, "correct", or reinterpret names or values from the message. Only fill from terminology/taxonomy when the user did NOT provide that information.
4. Preserve all information from the original issue: copy over any concrete details, links, names, and intent. Map them into the right template sections.
5. Do not invent information. If something is missing in the original, leave the template placeholder or write "A definir" / "A preencher". Never make up token names, values, or requirements.
6. Language: keep the same language as the original (Portuguese or English). Template section titles stay as in the template.
7. For Design Tokens: If the user specified a token name or value in the message, use it exactly (e.g. in "Nome proposto" and in the JSON "$value"). Use the JellyFish terminology (${TERMINOLOGIA_URL}) and taxonomy (${TAXONOMIA_URL}) only when the user did not give a name/value, or to suggest structure (jf.category.*) while keeping any user-provided name or value unchanged. For Components: keep the structure (Descrição, Objetivo, Requisitos, Design, Especificações).
8. ORIGINAL MESSAGE IN DESCRIPTION — Always keep the full original message (including any Slack link, e.g. "View in Slack", "View conversation") inside the Description section. Add a subsection such as "Mensagem original" or "Contexto (Slack)" and paste the original body there verbatim, so the link and context are preserved. Do not remove Slack links or the original text from the issue.
9. DESIGN TOKEN TEMPLATE — You MUST always include the section "## Categoria do Token" exactly as in the template, with:
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

Reference — terminology and taxonomy (use only when the user did NOT provide a token name in the message; if they did, keep their name/value exactly):
---
${terminologia}
---`
    } else {
      terminologiaBlock = `

When the user did not specify a token name in the message, use JellyFish terminology and structure jf.<category>.<...>. If they did specify a name or value, copy it exactly. Reference: ${TERMINOLOGIA_URL}`
    }
  }

  const tokenTipoReminder = isDesignToken
    ? `
For "## Categoria do Token": infer Tipo from the issue (novo → [x] Novo; alteração/modificação → [x] Modificação; depreciação → [x] Depreciação; remoção → [x] Remoção). Mark one Categoria (Color, Typography, Spacing, etc.). Keep this section intact.
`
    : ""

  const tokenSlackPriority = isDesignToken
    ? `
CRITICAL for Design Token: The text below ("Original issue (body)") is the user's message (e.g. from Slack). If it contains a token name, proposed name, or alias — copy it exactly into "Nome proposto" / "Referencia". If it contains a value, hex, number, or JSON — copy it exactly into the "Valor base" or theme JSON "$value" / "$type". Do NOT replace the user's name or value with a different suggestion. Only use terminology to complete when the message does not specify name or value.
`
    : ""

  const userPrompt = `Rewrite the following issue into the "${templateName}" template.
${terminologiaBlock}
${tokenTipoReminder}
${tokenSlackPriority}

Original issue (body) — this is the source of truth for names and values; copy them exactly:
---
${issue.body || "(empty)"}
---

Template to follow (structure and sections):
---
${template}
---

Remember: output only the rewritten issue body in Markdown, matching the template structure. No frontmatter, no extra text. In the Description section (## Descrição / Descrição do componente), include a subsection "Mensagem original" or "Contexto (Slack)" with the full original message and the Slack link, unchanged. For Design Token, preserve any name or value from the original message; always include "## Categoria do Token" with Tipo and Categoria checkboxes filled.`

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

      // Prioridade: token primeiro; uma única issue não deve cair em dois projetos
      if (isTokenIssue(issue)) {
        templatePath = ".github/ISSUE_TEMPLATE/design_tokens.md"
        projectId = process.env.TOKENS_PROJECT_ID
      } else if (isComponentIssue(issue)) {
        templatePath = ".github/ISSUE_TEMPLATE/components.md"
        projectId = process.env.UI_PROJECT_ID
      }

      if (!templatePath) {
        console.log(
          "[debug]   => SKIP: sem label de token (token, design-token, etc.) nem de componente (component, components, etc.)"
        )
        continue
      }

      console.log(
        "[debug]   => PROCESSANDO template:",
        templatePath,
        "| projeto:",
        projectId ? (templatePath.includes("design_tokens") ? "TOKENS_PROJECT_ID" : "UI_PROJECT_ID") : "(nenhum)"
      )
      const newBody = await rewriteIssue(issue, templatePath)

      await octokit.issues.update({
        owner,
        repo,
        issue_number: issue.number,
        body: newBody,
        labels: [...issue.labels.map((l) => l.name), "ai-processed"],
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
