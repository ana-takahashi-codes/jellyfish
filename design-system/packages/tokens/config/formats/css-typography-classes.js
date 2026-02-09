/**
 * Format: CSS classes for typography tokens ($type: typography).
 * Supports both composite typography tokens and expanded tokens (SD expands typography into fontFamily, fontSize, etc.).
 * Outputs .font-title-sm { font-family: var(--jf-font-family-sans); ... }
 * Resolves references {token.path} to var(--token-path).
 */

const TYPOGRAPHY_PROP_KEYS = [
  'fontFamily', 'fontWeight', 'fontSize', 'lineHeight', 'letterSpacing',
  'textDecoration', 'textTransform', 'textCase', 'paragraphSpacing', 'paragraphIndent'
]

const PROP_TO_CSS = {
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
 * Collect typography groups: either composite tokens or expanded tokens grouped by path prefix.
 * @param {import('style-dictionary').TransformedToken[]} tokens
 * @returns {Map<string, Record<string, string>>} className -> { cssProp: resolvedValue }
 */
function collectTypographyGroups(tokens) {
  const groups = new Map()

  for (const token of tokens) {
    const type = token.$type ?? token.type
    const path = token.path ?? []

    if (type === 'typography') {
      const value =
        token.original?.$value ?? token.original?.value ?? token.$value ?? token.value
      if (value && typeof value === 'object') {
        const className = path.join('-')
        if (!className) continue
        const props = {}
        let seenTextTransform = false
        for (const [key, cssProp] of Object.entries(PROP_TO_CSS)) {
          if (cssProp === 'text-transform' && seenTextTransform) continue
          const v = key === 'textTransform' ? (value.textTransform ?? value.textCase) : value[key]
          if (v === undefined) continue
          if (cssProp === 'text-transform') seenTextTransform = true
          props[cssProp] = resolveReference(v)
        }
        if (Object.keys(props).length > 0) groups.set(className, props)
      }
      continue
    }

    const last = path[path.length - 1]
    if (path.length > 1 && TYPOGRAPHY_PROP_KEYS.includes(last)) {
      const groupKey = path.slice(0, -1).join('-')
      const cssProp = last === 'textCase' ? 'text-transform' : PROP_TO_CSS[last]
      if (!cssProp) continue
      const value = token.value ?? token.$value ?? token.original?.$value
      if (value === undefined) continue
      let existing = groups.get(groupKey)
      if (!existing) {
        existing = {}
        groups.set(groupKey, existing)
      }
      if (cssProp === 'text-transform' && existing['text-transform'] !== undefined) continue
      existing[cssProp] = resolveReference(String(value))
    }
  }

  return groups
}

/**
 * @param {import('style-dictionary').FormatFnArguments} args
 * @returns {string}
 */
export default {
  name: 'css/typography-classes',
  format: ({ dictionary, file }) => {
    let tokens = dictionary.allTokens ?? []
    if (typeof file?.filter === 'function') {
      tokens = tokens.filter(file.filter)
    }
    const groups = collectTypographyGroups(tokens)
    if (groups.size === 0) {
      return '/* Typography Classes */\n'
    }

    const lines = ['/* Typography Classes */', '']
    for (const [className, props] of groups) {
      lines.push(`.${className} {`)
      for (const [cssProp, value] of Object.entries(props)) {
        lines.push(`  ${cssProp}: ${value};`)
      }
      lines.push('}', '')
    }
    return lines.join('\n')
  }
}
