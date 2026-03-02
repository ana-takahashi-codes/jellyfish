import type { ComponentPropsWithoutRef, Ref } from 'react'
import type { ControlRadius } from '../utils/control/Control.types'
import type { TextFieldVariant } from '../text-field/TextField.types'

export type TextAreaVariant = TextFieldVariant

export type TextAreaResize = 'none' | 'vertical' | 'both' | 'auto'

export interface TextAreaProps
  extends Omit<
    ComponentPropsWithoutRef<'textarea'>,
    | 'rows'
  > {
  /** Visual variant. 'default' = bordered + rounded; 'ghost' = flat bg, square corners. Default: 'default'. */
  variant?: TextAreaVariant

  /** Makes the field 100% width of its container. Default: false. */
  fullWidth?: boolean

  /** Border radius applied to the outer control. Default: 'default'. */
  radius?: ControlRadius

  /** When true, the field is not editable (native readOnly). Default: false. */
  readOnly?: boolean

  /** Initial visible rows for the textarea (when resize !== 'auto'). Default: 3. */
  rows?: number

  /** Minimum number of rows when resize = 'auto'. Default: rows or 3. */
  minRows?: number

  /** Maximum number of rows when resize = 'auto'. Optional. */
  maxRows?: number

  /** Resize behaviour of the textarea. 'auto' grows with content. Default: 'vertical'. */
  resize?: TextAreaResize

  /** Maximum number of characters. Passed to the native `maxLength` attribute. */
  maxLength?: number

  /** Shows character count below the field (bottom-right). Requires maxLength. Default: false. */
  showCharCount?: boolean

  /** Additional CSS classes applied to the outermost wrapper. */
  className?: string

  /** Optional ref pointing directly to the underlying <textarea>. */
  inputRef?: Ref<HTMLTextAreaElement>
}

