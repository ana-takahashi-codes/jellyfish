/**
 * Icon size and fill variants mapped to design tokens.
 * Size uses font-size tokens for consistent icon scaling.
 * Fill uses foreground color tokens for theming.
 */

export const iconSizeMap = {
  xs: 'var(--jf-font-size-xs)',
  sm: 'var(--jf-font-size-sm)',
  md: 'var(--jf-font-size-md)',
  lg: 'var(--jf-font-size-lg)',
  xl: 'var(--jf-font-size-xl)',
  '2xl': 'var(--jf-font-size-2xl)',
  '3xl': 'var(--jf-font-size-3xl)',
  g: 'var(--jf-font-size-g)',
} as const

export const iconFillMap = {
  muted: 'var(--jf-color-fg-muted)',
  moderated: 'var(--jf-color-fg-moderated)',
  strong: 'var(--jf-color-fg-strong)',
  'brand-primary': 'var(--jf-color-fg-brand-primary)',
  accent: 'var(--jf-color-fg-accent)',
  neutral: 'var(--jf-color-fg-moderated)',
  warning: 'var(--jf-color-fg-warning)',
  critical: 'var(--jf-color-fg-critical)',
  positive: 'var(--jf-color-fg-positive)',
  dataviz1: 'var(--jf-color-dataviz1-500)',
  dataviz2: 'var(--jf-color-dataviz2-500)',
  dataviz3: 'var(--jf-color-dataviz3-500)',
  dataviz4: 'var(--jf-color-dataviz4-500)',
} as const

export type IconSize = keyof typeof iconSizeMap
export type IconFill = keyof typeof iconFillMap

export interface IconVariants {
  size?: IconSize
  fill?: IconFill
}
