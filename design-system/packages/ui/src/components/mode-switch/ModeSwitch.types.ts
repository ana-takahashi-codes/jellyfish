import type { ComponentPropsWithoutRef } from 'react'
import type { ControlRadius, ControlSize } from '../utils/control/Control.types'

export interface ModeSwitchProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  /** Size (from Control). Default: `md`. */
  size?: ControlSize
  /** Border radius (from Control). Default: `default`. */
  radius?: ControlRadius
  /** Additional CSS classes. */
  className?: string
  /** Accessibility: visible or screen-reader label. */
  'aria-label'?: string
}
