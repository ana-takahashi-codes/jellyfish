import type { CSSProperties } from 'react'
import { variants } from '../../../variants'
import type { VariantPropsOf } from '../../../variants'

/** Shared inner layout styles (gap, padding) for Control and inner elements. */
export const controlInnerStyles: CSSProperties = {
  gap: 'var(--jf-control-gap, 4px)',
  paddingInline: 'var(--jf-control-horizontal-padding-default, 12px)',
}

/**
 * Layout variants for Control (size, fullWidth, radius).
 * Uses utility classes (d-inline-flex, items-center, font-label-sm, w-full, corner-0, corner-pill)
 * and CSS variables (--jf-control-height-*, --jf-control-corner-radius, etc.).
 *
 * Divergences from Figma:
 * - Focus is not a variant; each interactive child uses the .interactive class from utilities.css.
 * - minWidth is not applied here; each consuming component handles its own min-width.
 */
export const controlVariants = variants({
  base: {
    class: [
      'd-inline-flex',
      'items-center',
      'font-label-sm',
    ],
    ...controlInnerStyles,
  },
  variants: {
    size: {
      sm: { height: 'var(--jf-control-height-sm, 36px)' } as CSSProperties,
      md: { height: 'var(--jf-control-height-md, 44px)' } as CSSProperties,
      lg: { height: 'var(--jf-control-height-lg, 48px)' } as CSSProperties,
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
    radius: {
      none: 'corner-0',
      default: {
        borderRadius: 'var(--jf-control-corner-radius)',
      } as CSSProperties,
      pill: 'corner-pill',
    },
  },
  defaultVariants: {
    size: 'md',
    fullWidth: false,
    radius: 'default',
  },
})

export type ControlVariants = VariantPropsOf<typeof controlVariants>
