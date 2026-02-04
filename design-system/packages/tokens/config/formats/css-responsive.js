/**
 * Responsive CSS format: base tokens (mobile-first / screen-xs) in :root,
 * then @media (min-width: <breakpoint>) blocks for each platform set.
 * Breakpoint values are read from tokens --jf-screen-xs, --jf-screen-sm, etc.
 *
 * Used by the post-build script that composes responsive.css from built files,
 * since SD merges sources and we need per-breakpoint token sets from separate builds.
 * This module also exports formatResponseCss(breakpoints, tokenGroups) for that script.
 */

const BREAKPOINT_KEYS = ['xs', 'sm', 'md', 'lg', 'xl']

/**
 * Extract breakpoint values from foundation tokens (e.g. jf-screen-xs -> 540px).
 * @param {Record<string, string>} tokenNameToValue - map of token name (e.g. 'jf-screen-xs') to value
 * @returns {Record<string, string>} e.g. { xs: '540px', sm: '900px', ... }
 */
export function getBreakpointsFromTokens(tokenNameToValue) {
  const out = {}
  for (const key of BREAKPOINT_KEYS) {
    const name = `jf-screen-${key}`
    const value = tokenNameToValue[name]
    if (value) out[key] = value
  }
  return out
}

/**
 * Group tokens by platform set using token.filePath (e.g. .../Platforms-screen-xs.json).
 * @param {{ path?: string[], filePath?: string, name: string, value: string }[]} allTokens
 * @returns {{ base: typeof allTokens, xs: typeof allTokens, sm: typeof allTokens, md: typeof allTokens, lg: typeof allTokens, xl: typeof allTokens }}
 */
export function groupTokensByPlatform(allTokens) {
  const base = []
  const xs = []
  const sm = []
  const md = []
  const lg = []
  const xl = []

  for (const token of allTokens) {
    const p = (token.filePath || '').replace(/\\/g, '/')
    if (p.includes('Platforms-screen-xl')) xl.push(token)
    else if (p.includes('Platforms-screen-lg')) lg.push(token)
    else if (p.includes('Platforms-screen-md')) md.push(token)
    else if (p.includes('Platforms-screen-sm')) sm.push(token)
    else if (p.includes('Platforms-screen-xs')) xs.push(token)
    else base.push(token)
  }

  return { base, xs, sm, md, lg, xl }
}

/**
 * Generate responsive CSS: only @media (min-width: <breakpoint>) { :root { tokens } }
 * for each platform set (screen-xs, screen-md, screen-lg, etc.). No initial :root.
 * @param {Record<string, string>} breakpoints - e.g. { xs: '540px', md: '1200px', lg: '1536px' }
 * @param {{ base?: Array<{name: string, value: string}>, xs: Array<{name: string, value: string}>, sm?: Array, md: Array, lg: Array, xl?: Array }} groups
 * @param {{ header?: string }} opts
 * @returns {string}
 */
export function formatResponsiveCss(breakpoints, groups, opts = {}) {
  const header =
    opts.header ??
    `/**
 * Do not edit directly, this file was auto-generated.
 */
`
  const indent = '  '
  const mediaIndent = indent + indent

  const toLines = (tokens, variableIndent = indent) =>
    tokens.map((t) => `${variableIndent}--${t.name}: ${t.value};`).join('\n')

  let css = header
  for (const key of ['xs', 'sm', 'md', 'lg', 'xl']) {
    const value = breakpoints[key]
    const tokens = groups[key] ?? []
    if (value && tokens.length > 0) {
      css += `/* ${key} */\n@media (min-width: ${value}) {\n${indent}:root {\n`
      css += toLines(tokens, mediaIndent)
      css += `\n${indent}}\n}\n\n`
    }
  }

  return css
}

/**
 * Style Dictionary format: responsive CSS.
 * Uses dictionary (filtered for this file) and extracts breakpoints from tokens.
 * Note: When using merged sources, only one value per path exists; for correct
 * responsive output use the post-build script that composes from per-group built files.
 * @param {import('style-dictionary').FormatFnArguments} args
 * @returns {string}
 */
export function formatResponsive(args) {
  const { dictionary } = args
  const allTokens = dictionary.allTokens ?? []

  const tokenMap = {}
  for (const t of allTokens) {
    tokenMap[t.name] = t.value
  }
  const breakpoints = getBreakpointsFromTokens(tokenMap)
  const groups = groupTokensByPlatform(allTokens)

  return formatResponsiveCss(breakpoints, groups, {
    header: `/**
 * Do not edit directly, this file was auto-generated.
 */
`
  })
}

export default {
  name: 'css/responsive',
  format: formatResponsive
}
