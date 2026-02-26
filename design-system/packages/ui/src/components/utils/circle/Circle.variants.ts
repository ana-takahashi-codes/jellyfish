import { variants } from '../../../variants'
import type { VariantPropsOf } from '../../../variants'

/**
 * Circle base — lays out children, applies corner-circle.
 * Size, background and outline are driven by props → inline styles.
 */
export const circleVariants = variants({
  base: {
    class: 'd-inline-flex items-center justify-center corner-circle',
  },
})

export type CircleVariants = VariantPropsOf<typeof circleVariants>
