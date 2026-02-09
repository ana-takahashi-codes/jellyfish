function toKebab(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function refToCssVar(ref) {
  if (typeof ref !== 'string') return ''
  const m = ref.match(/^\{(.+)\}$/)
  if (!m) return ''
  const path = m[1].split('.')
  if (path[0] !== 'jf') return ''

  if (path[1] === 'motion' && path[2] === 'duration') {
    const name = toKebab(path.slice(3).join('-'))
    return `var(--jf-duration-${name})`
  }

  if (path[1] === 'motion' && path[2] === 'easing') {
    const name = toKebab(path.slice(3).join('-'))
    return `var(--jf-motion-easing-${name})`
  }

  const name = toKebab(path.join('-'))
  return `var(--${name})`
}

/**
 * transition tokens: shorthand CSS com delay default 0s.
 * Corrige saídas tipo "150ms cubic-bezier(...) undefined" → "150ms cubic-bezier(...) 0s".
 */
export function registerTransitionTransform(StyleDictionary) {
  StyleDictionary.registerTransform({
    name: 'value/transition-shorthand',
    type: 'value',
    transitive: true,
    filter: (token) =>
      token.type === 'transition' ||
      token.$type === 'transition' ||
      token.original?.$type === 'transition' ||
      token.path?.[1] === 'transition' ||
      (typeof token.name === 'string' && token.name.startsWith('jf-transition-')),
    transform: (token) => {
      const current = token.value
      if (typeof current === 'string') {
        // Se já veio montado por outro transform, apenas normaliza delay ausente para 0s
        if (current.includes('undefined')) {
          return current.replace(/\s+undefined\b/, ' 0s')
        }
        return current
      }

      const original = token.original?.$value ?? token.$value
      if (!original || typeof original !== 'object') return token.value

      const durationVar = refToCssVar(original.duration)
      const timingVar = refToCssVar(original.timingFunction)
      const delay = original.delay ? refToCssVar(original.delay) : '0s'
      return [durationVar, timingVar, delay].filter(Boolean).join(' ').trim()
    }
  })
}

