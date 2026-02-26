import type { ComponentPropsWithoutRef } from 'react'

export interface CircleProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Background of the circle. Accepts:
   * - Utility class name starting with `bg-` → applied as a CSS class (e.g. `'bg-brand-primary'`, `'bg-accent'`)
   * - Any CSS value → applied as inline `background` (e.g. `'var(--jf-color-positive-500)'`, `'#fff'`)
   */
  bg?: string

  /**
   * Width and height of the circle. Accepts:
   * - Utility class name starting with `size-` → applied as a CSS class (e.g. `'size-4'`, `'size-8'`)
   * - Number → treated as pixels (e.g. `20` → `'20px'`)
   * - Any CSS length string → applied as inline width + height (e.g. `'var(--jf-size-20)'`, `'1.25rem'`)
   */
  size?: string | number

  /**
   * CSS outline shorthand excluding the color (e.g. `'2px solid'`).
   * When combined with `outlineColor`, produces `outline: <outline> <outlineColor>`.
   * When used alone the value must be a complete CSS outline shorthand.
   */
  outline?: string

  /**
   * Color applied to the CSS outline (e.g. `'var(--jf-color-bg-page)'`).
   * Requires `outline` to be set.
   */
  outlineColor?: string
}
