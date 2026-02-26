import type { VariantPropsOf } from '../../variants'
import { textFieldVariants } from '../text-field/TextField.variants'

/** Reuse TextField visual variants (default/ghost) for TextArea. */
export const textAreaVariants = textFieldVariants

export type TextAreaVariants = VariantPropsOf<typeof textAreaVariants>

