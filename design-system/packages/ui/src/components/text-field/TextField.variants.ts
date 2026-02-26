import type { CSSProperties } from 'react'
import { variants } from '../../variants'
import type { VariantPropsOf } from '../../variants'
import type { TextFieldVariant } from './TextField.types'

/**
 * Visual variants do TextField alinhadas ao Figma.
 *
 * - `variant="default"`: fundo padrão + borda padrão.
 * - `variant="ghost"`: fundo transparente, sem borda.
 *
 * Estados de foco/hover são aplicados no componente usando os mesmos tokens
 * (`--jf-input-color-bd-*`) sobre estes estilos base.
 */
export const textFieldVariants = variants<{
  variant: Record<TextFieldVariant, string | CSSProperties>
}>({
  base: {
    transition: [
      'border-color var(--jf-transition-state-change)',
      'box-shadow var(--jf-transition-state-change)',
      'background-color var(--jf-transition-state-change)',
    ].join(','),
  } as CSSProperties,
  variants: {
    variant: {
      default: {
        background: 'var(--jf-input-bg-default)',
        border: 'var(--jf-bd-width-0-5) solid var(--jf-input-color-bd-default)',
      } as CSSProperties,
      ghost: {
        border: 'none',
        background: 'transparent',
      } as CSSProperties,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type TextFieldVariants = VariantPropsOf<typeof textFieldVariants>

