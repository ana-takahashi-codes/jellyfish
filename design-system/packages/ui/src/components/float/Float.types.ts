import type { ComponentPropsWithoutRef } from 'react'

export type FloatPlacement =
  | 'bottom-end'
  | 'bottom-start'
  | 'top-end'
  | 'top-start'
  | 'bottom-center'
  | 'top-center'
  | 'middle-center'
  | 'middle-end'
  | 'middle-start'

export interface FloatProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Anchor position within the nearest relatively-positioned container.
   * The Float element is centered on the chosen anchor point.
   * @default 'bottom-end'
   */
  placement?: FloatPlacement

  /**
   * Horizontal nudge applied after placement.
   * Numbers are treated as pixels. Accepts any valid CSS length (e.g. `8`, `'0.5rem'`).
   * Overrides the X component of `offset` when both are set.
   */
  offsetX?: string | number

  /**
   * Vertical nudge applied after placement.
   * Numbers are treated as pixels. Accepts any valid CSS length.
   * Overrides the Y component of `offset` when both are set.
   */
  offsetY?: string | number

  /**
   * Shorthand that sets both `offsetX` and `offsetY` to the same value.
   * Individual `offsetX` / `offsetY` take precedence over this.
   */
  offset?: string | number
}
