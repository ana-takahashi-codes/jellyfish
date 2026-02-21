/**
 * Referências aos design tokens (var(--jf-*)) para uso em UI, apps e styled-components.
 * Fonte única no pacote @jellyfish/tokens.
 */

const VAR_PREFIX = '--jf-'

function varRef (tokenName) {
  return `var(${VAR_PREFIX}${tokenName})`
}

// ---- Cores (fg = foreground / text, bg = background, bd = border) ----
export const colors = {
  fg: {
    strong: varRef('color-fg-strong'),
    muted: varRef('color-fg-muted'),
    moderated: varRef('color-fg-moderated'),
    accent: varRef('color-fg-accent'),
    'brand-primary': varRef('color-fg-brand-primary'),
    'on-brand-primary': varRef('color-fg-on-brand-primary'),
    positive: varRef('color-fg-positive'),
    warning: varRef('color-fg-warning'),
    critical: varRef('color-fg-critical')
  },
  bg: {
    'surface-default': varRef('color-bg-surface-default'),
    'surface-secondary': varRef('color-bg-surface-secondary'),
    'surface-tertiary': varRef('color-bg-surface-tertiary'),
    'brand-primary': varRef('color-bg-brand-primary'),
    accent: varRef('color-bg-accent'),
    neutral: varRef('color-bg-neutral'),
    page: varRef('color-bg-page')
  },
  border: {
    muted: varRef('color-bd-muted'),
    strong: varRef('color-bd-strong'),
    accent: varRef('color-bd-accent')
  }
}

// ---- Spacing / size (para padding, margin, gap, width, height) ----
export const size = {
  0: varRef('size-0'),
  1: varRef('size-1'),
  2: varRef('size-2'),
  3: varRef('size-3'),
  4: varRef('size-4'),
  5: varRef('size-5'),
  6: varRef('size-6'),
  8: varRef('size-8'),
  10: varRef('size-10'),
  12: varRef('size-12'),
  16: varRef('size-16'),
  20: varRef('size-20'),
  24: varRef('size-24'),
  full: varRef('size-full'),
  half: varRef('size-half')
}

// ---- Border radius ----
export const radius = {
  0: varRef('corner-radius-0'),
  default: varRef('corner-radius-default'),
  sm: varRef('corner-radius-sm'),
  lg: varRef('corner-radius-lg'),
  full: varRef('corner-radius-circle')
}

// ---- Tipografia (font-size) ----
export const fontSize = {
  xs: varRef('font-size-xs'),
  sm: varRef('font-size-sm'),
  md: varRef('font-size-md'),
  lg: varRef('font-size-lg'),
  xl: varRef('font-size-xl'),
  '2xl': varRef('font-size-2xl'),
  '3xl': varRef('font-size-3xl'),
  g: varRef('font-size-g')
}

/**
 * Helper para usar um token por nome bruto (útil com tipos gerados em build/token-names.d.ts).
 * @param {string} name - Nome do token com ou sem prefixo --jf-
 * @returns {string} var(--jf-...)
 */
export function tokenVar (name) {
  const normalized = name.startsWith(VAR_PREFIX) ? name.slice(VAR_PREFIX.length) : name
  return varRef(normalized)
}
