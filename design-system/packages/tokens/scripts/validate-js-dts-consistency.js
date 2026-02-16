/**
 * Validates consistency between built tokens.js and tokens.d.ts:
 * - Every export in JS exists in .d.ts
 * - Deprecation metadata (JSDoc @deprecated) exists only in .d.ts, not in JS
 * Run after build. Exits 1 on failure.
 */

import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..')

const JS_EXPORT_RE = /^\s*export\s+const\s+(\w+)\s*=/
const DTS_EXPORT_RE = /^\s*export\s+const\s+(\w+)\s*:\s*\w+;/
const DTS_DEPRECATED_RE = /@deprecated/

/**
 * @param {string} content
 * @param {RegExp} re
 * @returns {string[]}
 */
function extractNames(content, re) {
  const names = new Set()
  for (const line of content.split('\n')) {
    const m = line.match(re)
    if (m) names.add(m[1])
  }
  return [...names].sort()
}

/**
 * @param {string} content
 * @returns {{ name: string, deprecated: boolean }[]}
 */
function extractDtsExportsWithDeprecation(content) {
  const lines = content.split('\n')
  const result = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const declMatch = line.match(DTS_EXPORT_RE)
    if (declMatch) {
      const name = declMatch[1]
      let deprecated = false
      let j = i - 1
      while (j >= 0 && (lines[j].trim().startsWith('*') || lines[j].trim().startsWith('/**'))) {
        if (lines[j].includes('@deprecated')) deprecated = true
        j--
      }
      result.push({ name, deprecated })
    }
    i++
  }
  return result
}

async function main() {
  const themesDir = join(packageRoot, 'build', 'js', 'themes')
  const corePath = join(themesDir, 'core')
  const jsPath = join(corePath, 'tokens.js')
  const dtsPath = join(corePath, 'tokens.d.ts')

  let jsContent, dtsContent
  try {
    jsContent = await readFile(jsPath, 'utf-8')
    dtsContent = await readFile(dtsPath, 'utf-8')
  } catch (e) {
    console.error('[validate-js-dts] Run tokens build first. Missing:', e.code === 'ENOENT' ? jsPath : e.message)
    process.exit(1)
  }

  const jsExports = extractNames(jsContent, JS_EXPORT_RE)
  const dtsExports = extractDtsExportsWithDeprecation(dtsContent)
  const dtsNames = new Set(dtsExports.map((e) => e.name))

  const onlyInJs = jsExports.filter((n) => !dtsNames.has(n))
  const onlyInDts = dtsNames.size === 0 ? [] : [...dtsNames].filter((n) => !jsExports.includes(n))
  const hasDeprecationInJs = DTS_DEPRECATED_RE.test(jsContent)

  let failed = false
  if (onlyInJs.length > 0) {
    console.error('[validate-js-dts] Exports in tokens.js missing from tokens.d.ts:', onlyInJs.join(', '))
    failed = true
  }
  if (onlyInDts.length > 0) {
    console.error('[validate-js-dts] Exports in tokens.d.ts missing from tokens.js:', onlyInDts.join(', '))
    failed = true
  }
  if (hasDeprecationInJs) {
    console.error('[validate-js-dts] tokens.js must not contain @deprecated or deprecation comments; only tokens.d.ts should.')
    failed = true
  }

  if (failed) process.exit(1)
  console.log('[validate-js-dts] OK: JS and .d.ts exports match; deprecation only in .d.ts.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
