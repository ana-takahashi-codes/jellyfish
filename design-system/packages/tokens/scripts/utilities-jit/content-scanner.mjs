/**
 * Extrai nomes de classes de arquivos (HTML, JSX, TSX, Vue, etc.)
 * para alimentar o JIT com a lista de utilities usadas.
 */

import fs from 'fs'
import path from 'path'

const CLASS_ATTR_PATTERNS = [
  /class=["']([^"']+)["']/g,
  /className=["']([^"']+)["']/g,
  /class\s*=\s*\{[^}]*["']([^"']+)["']/g,
  /:class=["']([^"']+)["']/g,
  /\bclassList\.(add|toggle)\(["']([^"']+)["']/g
]

/**
 * Extrai tokens de classe de uma string (ex.: "p-2 bg-muted" → ["p-2", "bg-muted"]).
 * Remove prefixos responsivos tipo screen-md: para tratar separadamente se necessário.
 */
export function extractClassNamesFromString (str) {
  const names = new Set()
  const parts = str.split(/\s+/).filter(Boolean)
  for (const part of parts) {
    const base = part.replace(/^[a-z]+-[a-z]+:/, '') // screen-md: → vazio no base
    if (base) names.add(base)
    if (part !== base) names.add(part) // manter também com prefixo para variante responsiva
  }
  return names
}

/**
 * Extrai todos os nomes de classe de um conteúdo de arquivo.
 */
export function extractClassNamesFromContent (content) {
  const names = new Set()
  for (const re of CLASS_ATTR_PATTERNS) {
    let m
    re.lastIndex = 0
    while ((m = re.exec(content)) !== null) {
      const attrValue = m[2] ?? m[1]
      const classes = extractClassNamesFromString(attrValue)
      classes.forEach((c) => names.add(c))
    }
  }
  // Também capturar classes em template literals comuns: className={`p-2 ${x}`}
  const templateRe = /className=\{[^}]*?["'`]([^"'`]+)["'`]/g
  let tm
  while ((tm = templateRe.exec(content)) !== null) {
    extractClassNamesFromString(tm[1]).forEach((c) => names.add(c))
  }
  // Literais em aspas que parecem utility classes (ex.: em variants: 'bg-brand-primary')
  const literalRe = /["'`]([a-z][a-z0-9]*(?:-[a-z0-9]+)+)["'`]/g
  let lm
  while ((lm = literalRe.exec(content)) !== null) {
    const candidate = lm[1]
    if (candidate.length > 2 && candidate.length < 80) names.add(candidate)
  }
  return names
}

/**
 * Escaneia uma lista de arquivos e retorna um Set de todas as classes encontradas.
 * @param {string[]} filePaths - caminhos absolutos ou relativos aos arquivos
 * @param {string} cwd - diretório base para paths relativos
 * @returns {Set<string>}
 */
export function scanFilesForClassNames (filePaths, cwd = process.cwd()) {
  const allNames = new Set()
  for (const file of filePaths) {
    const fullPath = path.isAbsolute(file) ? file : path.join(cwd, file)
    try {
      if (!fs.statSync(fullPath).isFile()) continue
      const content = fs.readFileSync(fullPath, 'utf-8')
      const names = extractClassNamesFromContent(content)
      names.forEach((n) => allNames.add(n))
    } catch (err) {
      // ignorar erros de leitura
    }
  }
  return allNames
}

/**
 * Normaliza classe com prefixo responsivo para (baseClass, breakpoint).
 * Ex.: "screen-md:p-2" → { base: "p-2", breakpoint: "md" }
 */
export function parseResponsiveClass (className) {
  const m = className.match(/^screen-([a-z]+):(.+)$/)
  if (m) return { breakpoint: m[1], base: m[2] }
  return { breakpoint: null, base: className }
}
