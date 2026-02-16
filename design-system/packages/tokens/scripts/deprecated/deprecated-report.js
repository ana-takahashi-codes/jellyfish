/**
 * Lists deprecated tokens and generates:
 * - deprecated-report.json: all deprecated tokens with since, replacement, reason
 * - deprecated-to-remove.json: tokens deprecated for >= minVersions (candidates for major release)
 * Use deprecationWindow.removal = "major" and minVersionsBeforeRemoval from config.
 */

import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { deprecationConfig } from '../../config/deprecation-config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..', '..')

/** Default: consider for removal after 2 minor versions deprecated */
const DEFAULT_MIN_VERSIONS_BEFORE_REMOVAL = 2

/**
 * Parse semver-ish string to { major, minor, patch }.
 * @param {string} v
 * @returns {{ major: number, minor: number, patch: number } | null}
 */
function parseVersion(v) {
  if (!v || typeof v !== 'string') return null
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!m) return null
  return { major: parseInt(m[1], 10), minor: parseInt(m[2], 10), patch: parseInt(m[3], 10) }
}

/**
 * Number of "minor" versions between since and current (same major).
 * If different major, returns Infinity so they're eligible for removal.
 * @param {string} since
 * @param {string} current
 * @returns {number}
 */
function versionsDeprecated(since, current) {
  const s = parseVersion(since)
  const c = parseVersion(current)
  if (!s || !c) return 0
  if (s.major !== c.major) return Infinity
  return Math.max(0, c.minor - s.minor)
}

/**
 * Parse tokens.d.ts for deprecated exports.
 * @param {string} dtsPath
 * @returns {Promise<{ name: string, since?: string, replacement?: string, reason?: string }[]>}
 */
async function getDeprecatedFromDts(dtsPath) {
  const content = await readFile(dtsPath, 'utf-8')
  const lines = content.split('\n')
  const result = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*export\s+const\s+(\w+)\s*:\s*\w+;\s*$/)
    if (!m) continue
    const name = m[1]
    let since, replacement, reason
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
      if (line.trim().startsWith('*') && !line.includes('@deprecated') && !line.includes('Use ') && line.trim().length > 2) {
        reason = line.replace(/^\s*\*\s*/, '').trim()
      }
      if (line.trim() === '/**') break
    }
    const hasDeprecation = lines.slice(Math.max(0, i - 10), i).some((l) => l.includes('@deprecated'))
    if (hasDeprecation) result.push({ name, since, replacement, reason })
  }
  return result
}

async function main() {
  const argv = process.argv.slice(2)
  let minVersions = DEFAULT_MIN_VERSIONS_BEFORE_REMOVAL
  let dtsPath = join(packageRoot, 'build', 'js', 'themes', 'core', 'tokens.d.ts')
  let outDir = packageRoot
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--min-versions' && argv[i + 1]) {
      minVersions = parseInt(argv[i + 1], 10) || minVersions
      i++
    } else if (argv[i] === '--dts' && argv[i + 1]) {
      dtsPath = argv[++i]
    } else if (argv[i] === '--out-dir' && argv[i + 1]) {
      outDir = argv[++i]
    }
  }

  let pkg
  try {
    pkg = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf-8'))
  } catch (_) {
    console.error('[deprecated-report] Could not read package.json')
    process.exit(1)
  }
  const currentVersion = pkg.version || '0.0.0'

  let deprecatedList
  try {
    deprecatedList = await getDeprecatedFromDts(dtsPath)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('[deprecated-report] Build tokens first. Missing:', dtsPath)
      process.exit(1)
    }
    throw e
  }

  const report = {
    generatedAt: new Date().toISOString(),
    currentVersion,
    deprecationWindow: deprecationConfig.deprecationWindow,
    minVersionsBeforeRemoval: minVersions,
    deprecated: deprecatedList.map((t) => ({
      ...t,
      versionsDeprecated: t.since ? versionsDeprecated(t.since, currentVersion) : 0
    }))
  }

  const toRemove = report.deprecated.filter((t) => t.versionsDeprecated >= minVersions)

  const reportPath = join(outDir, 'deprecated-report.json')
  const toRemovePath = join(outDir, 'deprecated-to-remove.json')
  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8')
  await writeFile(
    toRemovePath,
    JSON.stringify({ generatedAt: report.generatedAt, currentVersion, tokens: toRemove }, null, 2),
    'utf-8'
  )

  console.log('[deprecated-report] Written:', reportPath, toRemovePath)
  console.log('[deprecated-report] Deprecated:', report.deprecated.length, '| Candidates for removal:', toRemove.length)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
