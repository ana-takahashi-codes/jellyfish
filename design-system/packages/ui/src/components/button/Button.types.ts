import type { ComponentPropsWithoutRef } from 'react'

/** Visual style (Figma): solid, outline, ghost. */
export type ButtonVariant = 'solid' | 'outline' | 'ghost'

/** Semantic color (Figma): neutral, brand-primary, accent, critical. */
export type ButtonColor = 'neutral' | 'brand-primary' | 'accent' | 'critical'

/** Size (height and padding from Control tokens). */
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  /** Visual style. Default: `solid`. */
  variant?: ButtonVariant
  /** Semantic color. Default: `accent`. */
  color?: ButtonColor
  /** Size (height, padding). Default: `md`. */
  size?: ButtonSize
  /** When true, button is square (icon-only); min-width follows Control. When false, min-width is w-min-40. Default: `false`. */
  iconOnly?: boolean
  /** Makes the button occupy 100% of container width. Default: `false`. */
  fullWidth?: boolean
  /** Border radius. Default: `default`. */
  radius?: 'none' | 'default' | 'pill'
  /** Disables the button and applies disabled styling. Default: `false`. */
  disabled?: boolean
  /** Icon name (Tabler) shown before the label. Rendered as Icon; size/fill controlled by Button. */
  startIcon?: string
  /** Icon name (Tabler) shown after the label. Rendered as Icon; size/fill controlled by Button. */
  endIcon?: string
  /** When true, applies loading opacity and spins startIcon with .motion-spin; button keeps width. Default: `false`. */
  loading?: boolean
  /** Additional CSS classes. */
  className?: string
}
