/**
 * Format: SCSS mixins and classes for typography tokens ($type: typography).
 * Outputs @mixin font-title-sm { ... } and .font-title-sm { @include font-title-sm; }
 * Resolves references {token.path} to var(--token-path).
 */

const PROP_MAP = {
  fontFamily: 'font-family',
  fontWeight: 'font-weight',
  fontSize: 'font-size',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  textDecoration: 'text-decoration',
  textTransform: 'text-transform',
  textCase: 'text-transform',
  paragraphSpacing: 'margin-bottom',
  paragraphIndent: 'text-indent'
}

/**
 * Resolve reference {jf.font-family.sans} to var(--jf-font-family-sans).
 * @param {string} value
 * @returns {string}
 */
function resolveReference(value) {
  if (typeof value !== 'string') return String(value)
  const trimmed = value.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    const tokenPath = trimmed.slice(1, -1).replace(/\./g, '-')
    return `var(--${tokenPath})`
  }
  return value
}

/**
 * @param {import('style-dictionary').FormatFnArguments} args
 * @returns {string}
 */
export default {
  name: 'scss/typography-classes',
  format: ({ dictionary, file }) => {
    let tokens = dictionary.allTokens ?? []
    if (typeof file?.filter === 'function') {
      tokens = tokens.filter(file.filter)
    }
    const typographyTokens = tokens.filter(
      (t) => t.$type === 'typography' || t.type === 'typography'
    )
    if (typographyTokens.length === 0) {
      return '/* Typography Mixins & Classes */\n'
    }

    const lines = ['/* Typography Mixins & Classes */', '']
    for (const token of typographyTokens) {
      const value =
        token.original?.$value ?? token.original?.value ?? token.$value ?? token.value
      if (!value || typeof value !== 'object') continue
      const className = (token.path ?? []).join('-')
      if (!className) continue

      const mixinName = className
      lines.push(`@mixin ${mixinName} {`)
      const seen = new Set()
      for (const [key, cssProp] of Object.entries(PROP_MAP)) {
        if (seen.has(cssProp)) continue
        const v = key === 'textTransform' ? (value.textTransform ?? value.textCase) : value[key]
        if (v === undefined) continue
        seen.add(cssProp)
        const resolved = resolveReference(v)
        lines.push(`  ${cssProp}: ${resolved};`)
      }
      lines.push('}', '')
      lines.push(`.${className} {`)
      lines.push(`  @include ${mixinName};`)
      lines.push('}', '')
    }
    return lines.join('\n')
  }
}
