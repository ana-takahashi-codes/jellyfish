import type { ComponentPropsWithoutRef, ElementType } from 'react'

/** Spinner color: border color of the visible arc. */
export type SpinnerColor = 'brand-primary' | 'accent' | 'neutral'

/** Size (same as Icon: maps to --jf-font-size-* via size-* utilities). */
export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'g'

export interface SpinnerProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
  /** Color of the spinning arc (border). */
  color?: SpinnerColor

  /** Size (same as Icon). */
  size?: SpinnerSize

  /** Root element type. Default `span`. */
  as?: ElementType

  /** Additional CSS classes. */
  className?: string
}
