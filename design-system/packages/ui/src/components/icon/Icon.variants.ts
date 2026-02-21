/**
 * Icon size and fill variants as JIT utility class names.
 * Size → icon-* (width/height from --jf-font-size-*). Fill → fg-* (color from --jf-color-fg-*).
 * The PostCSS JIT scanner picks these up from the UI package and generates only the rules used.
 */

export const iconSizeClasses = {
  xs: 'size-8',
  sm: 'size-10',
  md: 'size-12',
  lg: 'size-16',
  xl: 'size-20',
  '2xl': 'size-24',
  '3xl': 'size-32',
  g: 'size-56'
} as const

export const iconFillClasses = {
  muted: 'fg-muted',
  moderated: 'fg-moderated',
  strong: 'fg-strong',
  'brand-primary': 'fg-brand-primary',
  accent: 'fg-accent',
  neutral: 'fg-moderated',
  'on-neutral': 'fg-on-neutral',
  'on-brand-primary': 'fg-on-brand-primary',
  'on-accent': 'fg-on-accent',
  'on-critical': 'fg-on-critical',
  warning: 'fg-warning',
  critical: 'fg-critical',
  positive: 'fg-positive',
  dataviz1: 'fg-dataviz1-500',
  dataviz2: 'fg-dataviz2-500',
  dataviz3: 'fg-dataviz3-500',
  dataviz4: 'fg-dataviz4-500'
} as const

export type IconSize = keyof typeof iconSizeClasses
export type IconFill = keyof typeof iconFillClasses

export interface IconVariants {
  size?: IconSize
  fill?: IconFill
}
