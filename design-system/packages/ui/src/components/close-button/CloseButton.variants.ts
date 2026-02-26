import { variants } from '../../variants'
import type { VariantPropsOf } from '../../variants'

/**
 * CloseButton variants (Figma node 2107-1219).
 *
 * Single-size square button (36×36px) with transparent background.
 * Hover / active / focus states come from .interactive in utilities.css.
 * Disabled opacity is applied as an inline style in the component.
 */
export const closeButtonVariants = variants({
  base: {
    class: [
      'd-inline-flex',
      'items-center',
      'justify-center',
      'size-18',
      'corner-default',
      'bg-transparent',
      'interactive',
      'cursor-pointer',
    ],
  },
})

export type CloseButtonVariants = VariantPropsOf<typeof closeButtonVariants>
