/**
 * PostCSS plugin: Jellyfish Utilities JIT
 * Gera apenas as utility classes usadas no conteúdo, usando os mesmos tokens e mapeamento
 * do build estático (utilities-mapping-dynamic.json).
 */

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { buildMatchers, resolveClassName } from './matchers.mjs'
import { scanFilesForClassNames, parseResponsiveClass } from './content-scanner.mjs'
import { extractTokensFromCSS } from '../utilities/lib/shared-utils.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..')

const DEFAULT_BREAKPOINTS = [
  { name: 'xs', token: 'jf-screen-xs' },
  { name: 'sm', token: 'jf-screen-sm' },
  { name: 'md', token: 'jf-screen-md' },
  { name: 'lg', token: 'jf-screen-lg' },
  { name: 'xl', token: 'jf-screen-xl' }
]

/**
 * Gera a regra CSS para uma utility (uma classe).
 */
function ruleForUtility (className, token, properties) {
  const decls = properties.map((prop) => `  ${prop}: var(--${token});`).join('\n')
  return `.${escapeSelector(className)} {\n${decls}\n}`
}

function escapeSelector (name) {
  return name.replace(/:/g, '\\:')
}

/**
 * Coleta todas as classes usadas: do options.content (scan de arquivos) e,
 * opcionalmente, do próprio CSS (selectores que parecem utility).
 */
function collectUsedClassNames (opts, root) {
  const names = new Set()
  if (opts.content && Array.isArray(opts.content) && opts.content.length > 0) {
    const cwd = opts.cwd || process.cwd()
    const scanned = scanFilesForClassNames(opts.content, cwd)
    scanned.forEach((c) => names.add(c))
  }
  if (opts.includeFromCSS && root) {
    root.walkRules((rule) => {
      rule.selectors.forEach((sel) => {
        const m = sel.match(/\.([a-zA-Z0-9_-]+(?:\:[a-zA-Z0-9_-]+)*)/)
        if (m) names.add(m[1])
      })
    })
  }
  return names
}

/**
 * Gera o bloco de CSS (string) para as utilities resolvidas, incluindo variantes responsivas.
 * resolvedByClass: Map(className -> { token, properties, breakpoint? })
 */
function generateJITCSS (resolvedByClass, breakpoints) {
  const baseRules = []
  const responsiveGroups = new Map() // breakpoint name -> [{ className, token, properties }]

  for (const [className, data] of resolvedByClass.entries()) {
    const { token, properties, breakpoint } = data
    const rule = ruleForUtility(className, token, properties)
    if (breakpoint) {
      if (!responsiveGroups.has(breakpoint)) responsiveGroups.set(breakpoint, [])
      responsiveGroups.get(breakpoint).push({ className, token, properties })
    } else {
      baseRules.push(rule)
    }
  }

  let out = '/* Jellyfish Utilities (JIT) */\n\n' + baseRules.join('\n\n')

  for (const bp of breakpoints) {
    const items = responsiveGroups.get(bp.name)
    if (!items || items.length === 0) continue
    const token = bp.token || `jf-screen-${bp.name}`
    const rules = items.map(({ className, token: t, properties }) => ruleForUtility(className, t, properties))
    out += `\n\n@media (min-width: var(--${token})) {\n\n`
    out += rules.join('\n\n')
    out += '\n}\n'
  }

  return out
}

/**
 * Carrega tokens a partir de arquivos CSS (concatena e extrai --var: value).
 */
function loadTokensFromCSS (cssPaths) {
  let combined = ''
  for (const p of cssPaths) {
    const full = path.isAbsolute(p) ? p : path.join(PACKAGE_ROOT, p)
    try {
      combined += fs.readFileSync(full, 'utf-8')
    } catch (err) {
      // skip
    }
  }
  return extractTokensFromCSS(combined)
}

export default function postcssJellyfishUtilitiesJIT (opts = {}) {
  const content = opts.content || []
  const cwd = opts.cwd || process.cwd()
  const breakpoints = opts.breakpoints || DEFAULT_BREAKPOINTS
  const mappingPath = opts.mappingPath || path.join(__dirname, '..', 'utilities', 'utilities-mapping-dynamic.json')
  const tokensPath = opts.tokensPath || opts.tokensPaths
  let tokens = opts.tokens || null
  let dynamicMapping = opts.dynamicMapping || null

  return {
    postcssPlugin: 'postcss-jellyfish-utilities-jit',
    async Once (root, { result }) {
      if (!tokens && tokensPath) {
        const paths = Array.isArray(tokensPath) ? tokensPath : [tokensPath]
        tokens = loadTokensFromCSS(paths)
      }
      if (!tokens) {
        const defaultPaths = [
          path.join(PACKAGE_ROOT, 'build', 'css', 'themes', 'core', 'primitives.css'),
          path.join(PACKAGE_ROOT, 'build', 'css', 'themes', 'core', 'foundations.css'),
          path.join(PACKAGE_ROOT, 'build', 'css', 'themes', 'core', 'color-modes', 'light.css')
        ]
        tokens = loadTokensFromCSS(defaultPaths)
      }
      if (!dynamicMapping && mappingPath) {
        try {
          const raw = fs.readFileSync(path.isAbsolute(mappingPath) ? mappingPath : path.join(cwd, mappingPath), 'utf-8')
          dynamicMapping = JSON.parse(raw)
        } catch (err) {
          result.warn('postcss-jellyfish-utilities-jit: could not load mapping from ' + mappingPath)
          return
        }
      }
      if (!dynamicMapping || !tokens) return

      const matchers = buildMatchers(dynamicMapping, tokens)
      const usedClassNames = collectUsedClassNames({ ...opts, content, cwd, includeFromCSS: opts.includeFromCSS !== false }, root)
      const resolvedByClass = new Map()

      for (const rawClass of usedClassNames) {
        const { breakpoint, base } = parseResponsiveClass(rawClass)
        const resolved = resolveClassName(base, matchers, tokens)
        if (!resolved) continue
        const key = breakpoint ? `screen-${breakpoint}:${base}` : base
        if (resolvedByClass.has(key)) continue
        resolvedByClass.set(key, { token: resolved.token, properties: resolved.properties, breakpoint })
      }

      if (resolvedByClass.size === 0) return

      const css = generateJITCSS(resolvedByClass, breakpoints)
      const postcss = (await import('postcss')).default
      const jitRoot = postcss.parse(css, { from: result.opts.from || undefined })
      root.append(jitRoot)
    }
  }
}
postcssJellyfishUtilitiesJIT.postcss = true
