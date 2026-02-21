/**
 * Duration tokens (DTCG): $value as { value, unit } or { $value, unit } → output "{value}{unit}" (e.g. "100ms", "0.5s").
 * Handles $value: "0" (instant), $value: { value: "100", unit: "ms" }, and $value: { $value: "100", unit: "ms" } (Tokens Studio export).
 */
function isDurationLike(token) {
  const v = token.value ?? token.$value ?? token.original?.$value
  if (token.type === 'duration' || token.$type === 'duration' || token.original?.$type === 'duration') return true
  if (typeof v !== 'object' || v == null) return false
  return ('unit' in v && ('value' in v || '$value' in v))
}

function durationObjectToCss(obj) {
  const val = obj.value ?? obj.$value
  const unit = obj.unit || ''
  return String(val) + unit
}

export function registerDurationTransform(StyleDictionary) {
  StyleDictionary.registerTransform({
    name: 'value/duration',
    type: 'value',
    filter: isDurationLike,
    transform: (token) => {
      const v = token.value ?? token.$value ?? token.original?.$value
      if (v == null) return ''
      if (typeof v === 'object' && 'unit' in v && ('value' in v || '$value' in v)) {
        return durationObjectToCss(v)
      }
      if (v === 0 || v === '0') return '0'
      return String(v)
    }
  })
}

