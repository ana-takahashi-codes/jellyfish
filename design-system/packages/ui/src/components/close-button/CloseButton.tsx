import React, { forwardRef, useMemo } from 'react'
import { cn } from '../../variants'
import { Icon } from '../icon'
import type { CloseButtonProps } from './CloseButton.types'
import { closeButtonVariants } from './CloseButton.variants'

/**
 * CloseButton
 *
 * Square icon-only button (36×36px) used to dismiss dialogs, panels, alerts,
 * and other overlay elements.
 *
 * - Always provide `aria-label` describing what is being closed (e.g. "Fechar modal").
 * - Focus-visible, hover and active states come from .interactive (utilities.css).
 * - Disabled state applies `var(--jf-opacity-disabled)` opacity.
 *
 * @example
 * ```tsx
 * <CloseButton aria-label="Fechar modal" onClick={onClose} />
 * <CloseButton aria-label="Fechar" disabled />
 * ```
 */
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  (
    {
      onClick,
      className,
      disabled = false,
      'aria-label': ariaLabel = 'Fechar',
      style,
      ...props
    },
    ref
  ) => {
    const { className: variantClassName } = useMemo(
      () => closeButtonVariants(),
      []
    )

    const resolvedStyle = useMemo(
      (): React.CSSProperties => ({
        border: 'none',
        ...(disabled ? { opacity: 'var(--jf-opacity-disabled, 0.4)' } : {}),
        ...style,
      }),
      [disabled, style]
    )

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-disabled={disabled ? true : undefined}
        className={cn(
          variantClassName,
          disabled && 'cursor-not-allowed',
          className
        )}
        style={resolvedStyle}
        {...props}
      >
        <Icon name="x" size="md" fill="muted" decorative />
      </button>
    )
  }
)

CloseButton.displayName = 'CloseButton'
