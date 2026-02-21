import type { ComponentPropsWithoutRef } from 'react'

/** Size variation for Control (height from --jf-control-height-*). Min-width is not applied; each consuming component handles it. */
export type ControlSize = 'sm' | 'md' | 'lg'

/** Border radius variant. */
export type ControlRadius = 'none' | 'default' | 'pill'

export interface ControlProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
  /** Defines the control height. Default: `md`. */
  size?: ControlSize
  /** Makes the control occupy 100% of its container width. Default: `false`. */
  fullWidth?: boolean
  /** Disables the control and applies disabled styling. Default: `false`. */
  disabled?: boolean
  /** Border radius. Default: `default`. */
  radius?: ControlRadius
  /** Additional CSS classes for custom styling. */
  className?: string
}
