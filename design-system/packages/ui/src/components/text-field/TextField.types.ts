import type { ComponentPropsWithoutRef, Ref } from 'react'
import type { ControlSize, ControlRadius } from '../utils/control/Control.types'

export type TextFieldVariant = 'default' | 'ghost'

export interface TextFieldProps
  extends Omit<
    ComponentPropsWithoutRef<'input'>,
    | 'size'    // ControlSize ('sm'|'md'|'lg') wins over HTMLInput size (number)
    | 'prefix'  // we redefine as string
  > {
  /** Visual variant. 'default' = bordered + rounded; 'ghost' = flat bg, square corners. Default: 'default'. */
  variant?: TextFieldVariant

  /** Control height size. Default: 'md'. */
  size?: ControlSize

  /** Makes the field 100% width of its container. Default: false. */
  fullWidth?: boolean

  /** Border radius. Ignored in ghost variant (always none). Default: 'default'. */
  radius?: ControlRadius

  /** Tabler icon name at the start of the field. */
  startIcon?: string

  /** Tabler icon name at the end of the field. */
  endIcon?: string

  /** Text rendered before the input (e.g. "$", "+1"). */
  prefix?: string

  /** Text rendered after the input (e.g. "%", "kg"). */
  suffix?: string

  /** When true, the field is not editable (native readOnly). Default: false. */
  readOnly?: boolean

  /** Shows a × clear button when the field has content. Default: false. */
  clearable?: boolean

  /** Shows character count below the field. Requires maxLength. Default: false. */
  showCharCount?: boolean

  /** Additional CSS classes applied to the outermost wrapper. */
  className?: string

  /** Optional ref pointing directly to the underlying <input>. */
  inputRef?: Ref<HTMLInputElement>
}
