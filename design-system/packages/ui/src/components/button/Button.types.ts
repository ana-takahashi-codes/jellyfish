import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { ControlRadius, ControlSize } from '../utils/control/Control.types'

/** Visual style of the button. */
export type ButtonVariant = 'solid' | 'outline' | 'ghost'

/** Semantic color of the button. */
export type ButtonColor = 'neutral' | 'brand-primary' | 'accent' | 'critical'

/** Size (height and padding from Control tokens). */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button props extend Control (size, fullWidth, radius, disabled, className)
 * and native button attributes. type defaults to 'button' to avoid accidental submit.
 */
export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  /** Native button type. Default `button` to avoid accidental form submit. */
  type?: 'button' | 'submit' | 'reset'

  /** Visual variant. */
  variant?: ButtonVariant

  /** Semantic color. */
  color?: ButtonColor

  /** Size (height and padding from Control). */
  size?: ControlSize

  /** When true, control takes full width of container (from Control). */
  fullWidth?: boolean

  /** Border radius (from Control). */
  radius?: ControlRadius

  /** When true, only startIcon is shown; no label. Requires aria-label. Width = height (Control height). */
  iconOnly?: boolean

  /** Shows loading state (spinner on icon, aria-busy, non-clickable). */
  loading?: boolean

  /** Icon or element before the label. Same color as label when using Icon (fill is set from variant × color). */
  startIcon?: string

  /** Icon or element after the label. Same color as label when using Icon (fill is set from variant × color). */
  endIcon?: string

  /** Additional CSS classes. */
  className?: string

  /** Accessibility: visible or screen-reader label. Required when iconOnly. */
  'aria-label'?: string

  /** Accessibility: ID of element that describes the button. */
  'aria-describedby'?: string

  /** Accessibility: ID of controlled element (e.g. menu). */
  'aria-controls'?: string

  /** Accessibility: expanded state of controlled element. */
  'aria-expanded'?: boolean

  /** Accessibility: pressed state for toggle buttons. */
  'aria-pressed'?: boolean

  /** Accessibility: indicates popup type (menu, listbox, etc.). */
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
}
