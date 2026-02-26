import React, { forwardRef, useMemo } from 'react'
import { cn } from '../../variants'
import type { SpinnerProps } from './Spinner.types'
import { spinnerVariants } from './Spinner.variants'

const DEFAULT_AS = 'span'

function isValidElementType (
  as: React.ElementType | undefined
): as is React.ElementType {
  return typeof as === 'string' || typeof as === 'function'
}

/**
 * Spinner
 *
 * Loading indicator built with a circular border (Chakra-style). Two sides use
 * --spinner-track-color (transparent); the other two use the color variant.
 * Uses corner-circle, motion-spin, and bd-width-3 from tokens.
 *
 * @example
 * ```tsx
 * <Spinner color="brand-primary" size="md" />
 * ```
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      color = 'brand-primary',
      size = 'md',
      as,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const Comp = isValidElementType(as) ? as : DEFAULT_AS
    const { className: variantClass, style: variantStyle } = useMemo(
      () => spinnerVariants({ color, size }),
      [color, size]
    )

    const mergedClassName = cn(variantClass, className)
    const mergedStyle = useMemo(
      () => ({ ...variantStyle, ...style }),
      [variantStyle, style]
    )

    return (
      <Comp
        ref={ref as React.Ref<unknown>}
        role="status"
        aria-label="Loading"
        className={mergedClassName}
        style={mergedStyle}
        {...rest}
      />
    )
  }
)

Spinner.displayName = 'Spinner'
