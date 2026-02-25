import type { LogoSize } from './Logo.types'

/**
 * Mapeia o size para a utility class de altura.
 * Figma: xs=32px (jf-size-16), sm=48px (jf-size-24), md=64px (jf-size-32), lg=80px (jf-size-40)
 * Width é sempre auto — o SVG mantém aspect ratio via viewBox.
 */
export const logoSizeClasses: Record<LogoSize, string> = {
  xs: 'h-16',
  sm: 'h-24',
  md: 'h-32',
  lg: 'h-40',
} as const

export interface LogoVariants {
  size?: LogoSize
}
