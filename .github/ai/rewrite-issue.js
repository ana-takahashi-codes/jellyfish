import fs from "fs";
import OpenAI from "openai";
import { Octokit } from "@octokit/rest";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

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

async function rewriteIssue(issue, templatePath) {
  const template = fs.readFileSync(templatePath, "utf8");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a Design System Governance AI.
Rewrite the issue using the provided template.
Preserve the original intent and context.
Do not invent information.
        `
      },
      {
        role: "user",
        content: `
Original issue:
${issue.body}

Template:
${template}
        `
      }
    ],
  });

  return response.choices[0].message.content;
}

async function main() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  console.log("[debug] Repo:", owner + "/" + repo)
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
    } catch (err) {
      console.error("[debug]   => ERRO:", err.message)
    }
  }

  console.log("\n[debug] Fim. Issues processadas:", processed)
}

main();
