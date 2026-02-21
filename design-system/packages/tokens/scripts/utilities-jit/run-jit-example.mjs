/**
 * Exemplo de uso do JIT: gera CSS apenas para as classes listadas.
 * Não usa PostCSS; apenas matchers + geração de regras, para validar o fluxo.
 *
 * Uso: node scripts/utilities-jit/run-jit-example.mjs
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { buildMatchers, resolveClassName } from './matchers.mjs'
import { extractTokensFromCSS } from '../utilities/lib/shared-utils.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..')

const DYNAMIC_MAPPING_PATH = path.join(__dirname, '..', 'utilities', 'utilities-mapping-dynamic.json')
const TOKEN_PATHS = [
  path.join(PACKAGE_ROOT, 'build', 'css', 'themes', 'core', 'primitives.css'),
  path.join(PACKAGE_ROOT, 'build', 'css', 'themes', 'core', 'foundations.css'),
  path.join(PACKAGE_ROOT, 'build', 'css', 'themes', 'core', 'color-modes', 'light.css')
]

const EXAMPLE_CLASSES = [
  'p-2',
  'pt-4',
  'm-x-4',
  'gap-2',
  'gap-x-4',
  'w-full',
  'h-4',
  'bg-surface-default',
  'bd-muted',
  'fg-strong',
  'rounded-default'
]

function loadTokens () {
  let combined = ''
  for (const p of TOKEN_PATHS) {
    try {
      combined += fs.readFileSync(p, 'utf-8')
    } catch (_) {}
  }
  return extractTokensFromCSS(combined)
}

function ruleCss (className, token, properties) {
  const decls = properties.map((p) => `  ${p}: var(--${token});`).join('\n')
  return `.${className} {\n${decls}\n}`
}

function main () {
  const tokens = loadTokens()
  if (Object.keys(tokens).length === 0) {
    console.error('Nenhum token carregado. Rode o build de tokens primeiro: pnpm run build')
    process.exit(1)
  }
  const raw = fs.readFileSync(DYNAMIC_MAPPING_PATH, 'utf-8')
  const dynamicMapping = JSON.parse(raw)
  const matchers = buildMatchers(dynamicMapping, tokens)

  const rules = []
  for (const cls of EXAMPLE_CLASSES) {
    const resolved = resolveClassName(cls, matchers, tokens)
    if (resolved) rules.push(ruleCss(cls, resolved.token, resolved.properties))
  }

  const css = '/* JIT example – only used utilities */\n\n' + rules.join('\n\n')
  console.log(css)
}

main()
