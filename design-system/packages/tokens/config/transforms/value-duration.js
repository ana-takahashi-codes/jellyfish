/**
 * Duration tokens (DTCG): $value as { value, unit } → output "{value}{unit}" (e.g. "100ms", "0.5s").
 * Handles $value: "0" (instant) and $value: { value: "100", unit: "ms" }.
 */
export function registerDurationTransform(StyleDictionary) {
  StyleDictionary.registerTransform({
    name: 'value/duration',
    type: 'value',
    filter: (token) =>
      token.type === 'duration' ||
      token.$type === 'duration' ||
      token.original?.$type === 'duration',
    transform: (token) => {
      const v = token.value ?? token.$value ?? token.original?.$value
      if (v == null) return ''
      if (typeof v === 'object' && 'value' in v && 'unit' in v) {
        return String(v.value) + (v.unit || '')
      }
      if (v === 0 || v === '0') return '0'
      return String(v)
    }
  })
}

