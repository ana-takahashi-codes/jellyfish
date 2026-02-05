/**
 * cubicBezier tokens: $value "[0.3, 0, 1, 1]" → "cubic-bezier(0.3, 0, 1, 1)".
 * Keeps "linear" as-is.
 */
export function registerCubicBezierTransform(StyleDictionary) {
  StyleDictionary.registerTransform({
    name: 'value/cubic-bezier',
    type: 'value',
    filter: (token) =>
      token.type === 'cubicBezier' ||
      token.$type === 'cubicBezier' ||
      token.original?.$type === 'cubicBezier',
    transform: (token) => {
      const raw = token.value ?? token.$value ?? token.original?.$value
      if (raw == null) return ''
      if (raw === 'linear') return 'linear'

      if (typeof raw === 'string') {
        const trimmed = raw.trim()
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          const inner = trimmed.slice(1, -1)
          const parts = inner.split(',').map((p) => p.trim()).join(', ')
          return `cubic-bezier(${parts})`
        }
        return trimmed
      }

      if (Array.isArray(raw)) {
        const parts = raw.map((p) => String(p).trim()).join(', ')
        return `cubic-bezier(${parts})`
      }

      return String(raw)
    }
  })
}

