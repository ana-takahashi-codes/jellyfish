import type { CSSProperties } from 'react'
import { variants } from '../../variants'
import type { VariantPropsOf } from '../../variants'
import type { SpinnerColor, SpinnerSize } from './Spinner.types'

/** CSS custom properties for spinner (not in React.CSSProperties). */
type SpinnerCSSVars = {
  '--spinner-track-color'?: string
  '--spinner-color'?: string
}

/** Same size mapping as Icon. Each class sets width and height to the same token (Spinner is always square). */
export const spinnerSizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-10',
  md: 'size-12',
  lg: 'size-16',
  xl: 'size-20',
  '2xl': 'size-24',
  '3xl': 'size-32',
  g: 'size-56'
}

const spinnerBaseStyle: CSSProperties & SpinnerCSSVars = {
  aspectRatio: '1 / 1',
  '--spinner-track-color': 'transparent',
  borderWidth: 'var(--jf-bd-width-3)',
  borderStyle: 'solid',
  borderBottomColor: 'var(--spinner-track-color)',
  borderInlineStartColor: 'var(--spinner-track-color)',
  borderTopColor: 'var(--spinner-color)',
  borderInlineEndColor: 'var(--spinner-color)'
}

export const spinnerVariants = variants<{
  color: Record<SpinnerColor, CSSProperties & SpinnerCSSVars>
  size: Record<SpinnerSize, string>
}>({
  base: {
    class: 'corner-circle motion-spin',
    ...spinnerBaseStyle
  } as (CSSProperties & SpinnerCSSVars) & { class: string },
  variants: {
    color: {
      'brand-primary': {
        '--spinner-color': 'var(--jf-color-bd-brand-primary)'
      } as SpinnerCSSVars,
      accent: {
        '--spinner-color': 'var(--jf-color-bd-accent)'
      } as SpinnerCSSVars,
      neutral: {
        '--spinner-color': 'var(--jf-color-bd-moderated)'
      } as SpinnerCSSVars
    },
    size: spinnerSizeClasses
  },
  defaultVariants: {
    color: 'brand-primary',
    size: 'md'
  }
})

export type SpinnerVariants = VariantPropsOf<typeof spinnerVariants>
