import fs from "fs";
import OpenAI from "openai";
import { Octokit } from "@octokit/rest";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
const repo = process.env.GITHUB_REPOSITORY.split("/")[1];

function cameFromSlack(issue) {
  // Label explícita (adicione "from-slack" ao criar a issue pelo Slack)
  if (hasLabel(issue, "from-slack")) return true
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
  if (slackBodySignals.some((s) => body.includes(s))) return true
  // Autor é bot ou usuário de integração Slack
  return (
    issue.user?.type === "Bot" ||
    (issue.user?.login && issue.user.login.toLowerCase().includes("slack"))
  )
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: "open",
    since: yesterday.toISOString(),
    per_page: 100,
  });

  for (const issue of issues) {
    try {
      if (!cameFromSlack(issue)) continue
      if (alreadyProcessed(issue)) continue

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

      // Precisa ter label "token" ou "component" para saber qual template usar
      if (!templatePath) continue

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
    } catch (err) {
      console.error(`Erro ao processar issue #${issue.number}:`, err.message)
    }
  }
}

main();
