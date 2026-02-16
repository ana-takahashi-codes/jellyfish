/**
 * Post-build: composes responsive.css from built CSS files.
 * Reads breakpoints from foundations.css and tokens from screen-*.css only.
 * Output: only @media (min-width: <breakpoint>) { :root { tokens } } per breakpoint (no initial :root).
 */

import { readFile, writeFile, mkdir, readdir, unlink } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { formatResponsiveCss, getBreakpointsFromTokens } from '../../config/formats/css-responsive.js'
import { BUILD_DIR } from '../../config/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..', '..')

/** Discover theme names from build output (build/css/themes/*). */
async function discoverThemes() {
  const dir = join(packageRoot, BUILD_DIR, 'css', 'themes')
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
  } catch (e) {
    if (e?.code === 'ENOENT') return []
    throw e
  }
}

const FILE_HEADER = `/**
 * Do not edit directly, this file was auto-generated.
 */
`

/** @param {string} css - full file content */
function parseRootVariables(css) {
  const tokens = []
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/m)
  if (!rootMatch) return tokens
  const block = rootMatch[1]
  const lineRe = /--([\w-]+):\s*(.+?);/g
  let m
  while ((m = lineRe.exec(block)) !== null) {
    tokens.push({ name: m[1], value: m[2].trim() })
  }
  return tokens
}

/** @param {string} css - foundations.css content */
function parseBreakpoints(css) {
  const tokenMap = {}
  const lineRe = /--(jf-screen-(?:xs|sm|md|lg|xl)):\s*(.+?);/g
  let m
  while ((m = lineRe.exec(css)) !== null) {
    tokenMap[m[1]] = m[2].trim()
  }
  return getBreakpointsFromTokens(tokenMap)
}

/**
 * @param {string} theme
 * @returns {Promise<void>}
 */
async function buildResponsiveForTheme(theme) {
  const basePath = join(packageRoot, BUILD_DIR, 'css', 'themes', theme)

  let foundationsCss = ''
  const platformCss = { xs: '', md: '', lg: '', sm: '', xl: '' }

  try {
    foundationsCss = await readFile(join(basePath, 'foundations.css'), 'utf-8')
  } catch (e) {
    if (e?.code === 'ENOENT') return
    throw e
  }

  let hasAnyPlatform = false
  for (const key of ['xs', 'sm', 'md', 'lg', 'xl']) {
    try {
      platformCss[key] = await readFile(
        join(basePath, `screen-${key}.css`),
        'utf-8'
      )
      if (platformCss[key].trim().length > 0) hasAnyPlatform = true
    } catch (_) {
      platformCss[key] = ''
    }
  }

  const responsivePath = join(basePath, 'responsive.css')
  if (!hasAnyPlatform) {
    try {
      await unlink(responsivePath)
    } catch (e) {
      if (e?.code !== 'ENOENT') throw e
    }
    return
  }

  const breakpoints = parseBreakpoints(foundationsCss)
  const groups = {
    xs: parseRootVariables(platformCss.xs),
    sm: parseRootVariables(platformCss.sm),
    md: parseRootVariables(platformCss.md),
    lg: parseRootVariables(platformCss.lg),
    xl: parseRootVariables(platformCss.xl)
  }

  const css = formatResponsiveCss(breakpoints, groups, { header: FILE_HEADER })
  await mkdir(basePath, { recursive: true })
  await writeFile(responsivePath, css, 'utf-8')
}

export async function buildResponsiveCss() {
  const themes = await discoverThemes()
  for (const theme of themes) {
    await buildResponsiveForTheme(theme)
  }
}
