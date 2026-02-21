import React, { forwardRef, useMemo } from 'react'
import { cn } from '../../../variants'
import type { ControlProps } from './Control.types'
import { controlVariants } from './Control.variants'
import type { ControlVariants } from './Control.variants'

type Props = ControlProps & ControlVariants

/**
 * Control
 *
 * Utility wrapper for managing layout of inputs, selects, checkboxes, and buttons.
 * Provides consistent height, gap, padding, and radius. Min-width is handled by
 * each consuming component. Does not handle focus/hover/active — the inner
 * interactive element (button, input, etc.) must use the `interactive` class
 * from utilities.css for those states.
 *
 * @example
 * ```tsx
 * <Control size="md" radius="default">
 *   <button type="button" className="interactive">Label</button>
 * </Control>
 * ```
 *
 * @see [Figma – Control](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2025-1327)
 */
export const Control = forwardRef<HTMLSpanElement, Props>(
  (
    {
      size = 'md',
      fullWidth = false,
      radius = 'default',
      disabled = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const { className: variantClassName, style: variantStyle } = useMemo(
      () => controlVariants({ size, fullWidth, radius }),
      [size, fullWidth, radius]
    )

    const resolvedStyle = {
      ...variantStyle,
      ...style,
      ...(disabled ? { opacity: 'var(--jf-opacity-disabled, 0.4)' } : {}),
    }

    return (
      <span
        ref={ref}
        className={cn(variantClassName, disabled && 'cursor-not-allowed', className)}
        style={resolvedStyle}
        aria-disabled={disabled ? true : undefined}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Control.displayName = 'Control'
