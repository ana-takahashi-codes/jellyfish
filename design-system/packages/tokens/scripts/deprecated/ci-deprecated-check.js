/**
 * CI check for deprecated token usage.
 * Runs the scanner and git diff to mark findings as "new" (error) vs "legacy" (warning).
 * Exits 1 if any new usage. Outputs JSON and optional markdown for PR comment.
 */

import { spawn } from 'child_process'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..', '..')

/**
 * Run scan-deprecated-usage.js with --json and return parsed output.
 * @param {string} scanDir
 * @param {string} dtsPath
 * @returns {Promise<{ deprecated: { name: string, since?: string, replacement?: string }[], findings: { file: string, line: string, lineNumber: number, tokenName: string, since?: string, replacement?: string }[] }>}
 */
function runScanner(scanDir, dtsPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [join(__dirname, 'scan-deprecated-usage.js'), '--json', '--scan-dir', scanDir, '--dts', dtsPath],
      { cwd: packageRoot, stdio: ['ignore', 'pipe', 'pipe'] }
    )
    let out = ''
    let err = ''
    child.stdout.on('data', (c) => { out += c })
    child.stderr.on('data', (c) => { err += c })
    child.on('close', (code) => {
      try {
        const data = JSON.parse(out || '{"deprecated":[],"findings":[]}')
        resolve(data)
      } catch (_) {
        reject(new Error('Scanner did not output valid JSON. ' + (err || out)))
      }
    })
  })
}

/**
 * Get set of (file, lineNumber) that are added in diff base...HEAD.
 * @param {string} repoRoot
 * @param {string} baseRef
 * @returns {Promise<Set<string>>} Keys like "path/to/file.ts:42"
 */
async function getAddedLines(repoRoot, baseRef) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['diff', '--no-color', baseRef + '...HEAD'], {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let out = ''
    child.stdout.on('data', (c) => { out += c })
    child.stderr.on('data', (c) => { out += c })
    child.on('close', (code) => {
      const added = new Set()
      let currentFile = null
      let newLineNum = 0
      for (const line of out.split('\n')) {
        if (line.startsWith('+++ b/')) {
          currentFile = line.slice(6).trim()
        } else if (line.startsWith('@@') && currentFile) {
          const m = line.match(/\+(\d+),?(\d*)/)
          if (m) newLineNum = parseInt(m[1], 10)
        } else if (currentFile) {
          if (line.startsWith('+') && !line.startsWith('+++')) {
            added.add(currentFile + ':' + newLineNum)
            newLineNum++
          } else if (line.startsWith(' ')) {
            newLineNum++
          }
        }
      }
      resolve(added)
    })
  })
}

async function main() {
  const argv = process.argv.slice(2)
  let baseRef = 'main'
  let scanDir = process.cwd()
  let dtsPath = join(packageRoot, 'build', 'js', 'themes', 'core', 'tokens.d.ts')
  let repoRoot = process.cwd()
  let markdown = false
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--base' && argv[i + 1]) baseRef = argv[++i]
    else if (argv[i] === '--scan-dir' && argv[i + 1]) scanDir = argv[++i]
    else if (argv[i] === '--repo-root' && argv[i + 1]) repoRoot = argv[++i]
    else if (argv[i] === '--dts' && argv[i + 1]) dtsPath = argv[++i]
    else if (argv[i] === '--markdown') markdown = true
  }

  const data = await runScanner(scanDir, dtsPath)
  if (data.findings.length === 0) {
    if (markdown) console.log('✅ Nenhum uso de token deprecated encontrado.')
    process.exit(0)
  }

  const addedKeys = await getAddedLines(repoRoot, baseRef)
  const findingsWithNew = data.findings.map((f) => {
    const key = f.file.replace(/\\/g, '/') + ':' + f.lineNumber
    const isNew = addedKeys.has(key)
    return { ...f, new: isNew }
  })

  const newCount = findingsWithNew.filter((f) => f.new).length
  const legacyCount = findingsWithNew.filter((f) => !f.new).length

  if (markdown) {
    console.log('## Deprecated design tokens – resultado do scan\n')
    if (newCount > 0) {
      console.log('### ❌ Uso **novo** de token deprecated (bloqueia merge)\n')
      findingsWithNew.filter((f) => f.new).forEach((f) => {
        console.log(`- **${f.file}:${f.lineNumber}** – \`${f.tokenName}\``)
        if (f.replacement) console.log(`  - Substituição: \`${f.replacement}\``)
        if (f.since) console.log(`  - Deprecated desde: ${f.since}`)
      })
      console.log('')
    }
    if (legacyCount > 0) {
      console.log('### ⚠️ Uso **legado** (apenas aviso)\n')
      findingsWithNew.filter((f) => !f.new).forEach((f) => {
        console.log(`- **${f.file}:${f.lineNumber}** – \`${f.tokenName}\` → use \`${f.replacement || 'token de substituição'}\``)
      })
    }
  } else {
    console.log(JSON.stringify({ findings: findingsWithNew, newCount, legacyCount }, null, 2))
  }

  if (newCount > 0) {
    process.exit(1)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
