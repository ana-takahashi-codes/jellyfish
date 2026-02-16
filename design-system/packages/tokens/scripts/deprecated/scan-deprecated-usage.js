/**
 * Scans .js, .ts, .tsx files for usage of deprecated design tokens.
 * Outputs JSON with file, line, tokenName, since, replacement.
 * Use in CI: compare with git diff to treat new usages as errors and legacy as warnings.
 */

import { readFile, readdir } from 'fs/promises'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..', '..')

/**
 * Parse tokens.d.ts for deprecated exports. Returns list of { name, since, replacement }.
 * @param {string} dtsPath
 * @returns {Promise<{ name: string, since?: string, replacement?: string }[]>}
 */
async function getDeprecatedTokens(dtsPath) {
  const content = await readFile(dtsPath, 'utf-8')
  const lines = content.split('\n')
  const result = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*export\s+const\s+(\w+)\s*:\s*\w+;\s*$/)
    if (!m) continue
    const name = m[1]
    let since, replacement
    for (let j = i - 1; j >= 0; j--) {
      const line = lines[j]
      if (line.includes('@deprecated')) {
        const sinceMatch = line.match(/since\s+([^\s*]+)/)
        if (sinceMatch) since = sinceMatch[1].trim()
      }
      if (line.includes('Use ') && line.trim().startsWith('*')) {
        const useMatch = line.match(/\*\s*Use\s+(.+?)\s*$/)
        if (useMatch) replacement = useMatch[1].trim()
      }
      if (line.trim() === '/**') break
    }
    const hasDeprecation = lines.slice(Math.max(0, i - 10), i).some((l) => l.includes('@deprecated'))
    if (hasDeprecation) result.push({ name, since, replacement })
  }
  return result
}

/**
 * Recursively list files with given extensions under dir.
 * @param {string} dir
 * @param {Set<string>} ext
 * @param {string} root
 * @returns {Promise<string[]>}
 */
async function listFiles(dir, ext, root = dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'build') continue
      files.push(...(await listFiles(full, ext, root)))
    } else if (e.isFile()) {
      const lower = e.name.toLowerCase()
      if ([...ext].some((x) => lower.endsWith(x))) {
        files.push(relative(root, full))
      }
    }
  }
  return files
}

/**
 * Find usages of token name as identifier (word boundary).
 * @param {string} content
 * @param {string} tokenName
 * @returns {{ line: string, lineNumber: number }[]}
 */
function findUsages(content, tokenName) {
  const re = new RegExp('\\b' + tokenName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g')
  const lines = content.split('\n')
  const findings = []
  lines.forEach((line, i) => {
    if (re.test(line)) findings.push({ line, lineNumber: i + 1 })
  })
  return findings
}

/**
 * @param {string[]} argv
 * @returns {{ scanDir: string, dtsPath: string, extensions: string[], json: boolean, baseRef: string | null }}
 */
function parseArgs(argv) {
  let scanDir = process.cwd()
  let dtsPath = join(packageRoot, 'build', 'js', 'themes', 'core', 'tokens.d.ts')
  let extensions = ['.js', '.ts', '.tsx']
  let json = false
  let baseRef = null
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--scan-dir' && argv[i + 1]) {
      scanDir = argv[++i]
    } else if (argv[i] === '--dts' && argv[i + 1]) {
      dtsPath = argv[++i]
    } else if (argv[i] === '--extensions' && argv[i + 1]) {
      extensions = argv[i + 1].split(',').map((e) => (e.startsWith('.') ? e : '.' + e))
      i++
    } else if (argv[i] === '--json') {
      json = true
    } else if (argv[i] === '--base' && argv[i + 1]) {
      baseRef = argv[++i]
    }
  }
  return { scanDir, dtsPath, extensions, json, baseRef }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const extSet = new Set(args.extensions)

  let deprecatedList
  try {
    deprecatedList = await getDeprecatedTokens(args.dtsPath)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('[scan-deprecated] Build tokens first. Missing:', args.dtsPath)
      process.exit(1)
    }
    throw e
  }

  if (deprecatedList.length === 0) {
    if (args.json) console.log(JSON.stringify({ deprecated: [], findings: [] }, null, 2))
    else console.log('[scan-deprecated] No deprecated tokens in .d.ts. Nothing to scan.')
    return
  }

  const nameToMeta = new Map(deprecatedList.map((d) => [d.name, d]))
  const files = await listFiles(args.scanDir, extSet, args.scanDir)
  /** @type {{ file: string, line: string, lineNumber: number, tokenName: string, since?: string, replacement?: string }[]} */
  const findings = []

  for (const rel of files) {
    const full = join(args.scanDir, rel)
    const content = await readFile(full, 'utf-8').catch(() => '')
    for (const { name } of deprecatedList) {
      const usages = findUsages(content, name)
      const meta = nameToMeta.get(name)
      for (const u of usages) {
        findings.push({
          file: rel,
          line: u.line.trim(),
          lineNumber: u.lineNumber,
          tokenName: name,
          since: meta?.since,
          replacement: meta?.replacement
        })
      }
    }
  }

  if (args.json) {
    const out = { deprecated: deprecatedList, findings }
    if (args.baseRef) out.baseRef = args.baseRef
    console.log(JSON.stringify(out, null, 2))
    return
  }

  if (findings.length === 0) {
    console.log('[scan-deprecated] No usage of deprecated tokens found.')
    return
  }
  for (const f of findings) {
    console.log(`${f.file}:${f.lineNumber}: ${f.tokenName}${f.replacement ? ` → use ${f.replacement}` : ''}`)
  }
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
