import Anthropic from '@anthropic-ai/sdk'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const client = new Anthropic()

// Caminho dos tokens em relação à raiz do repositório (funciona em monorepo)
const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
const tokensPath = path.relative(repoRoot, path.resolve(process.cwd(), 'packages/tokens/src/tokens-studio'))
  .replace(/\\/g, '/')

const diff = execSync(
  `git diff origin/main -- "${tokensPath}"`,
  { encoding: 'utf-8', maxBuffer: 2 * 1024 * 1024 }
)

if (!diff) {
  console.log('Nenhuma mudança nos tokens.')
  process.exit(0)
}

const message = await client.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 1024,
  messages: [{
    role: 'user',
    content: `Você é especialista em design systems. Analise este git diff de design tokens do Tokens Studio e gere um changelog claro em português para o body de um Pull Request, voltado para designers e desenvolvedores.

Git diff:
${diff}

Formate em markdown assim:
## 🎨 O que mudou nos tokens

Resumo geral em 1-2 frases.

### Adicionados
### Modificados
### Depreciados
### Removidos

Para cada token, descreva de forma humana. Ex: "Cor primária atualizada de #0066FF para #0055EE"`
  }]
})

console.log(message.content[0].text)