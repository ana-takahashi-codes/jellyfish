import React, { forwardRef, useMemo } from 'react'
import { controlVariants } from '../utils/control/Control.variants'
import { Icon, type IconFill } from '../icon'
import { cn } from '../../variants'
import type { ButtonProps, ButtonSize, ButtonVariant, ButtonColor } from './Button.types'
import { buttonVariants } from './Button.variants'
import type { ButtonVariants } from './Button.variants'

type Props = ButtonProps & ButtonVariants

/** Icon size derived from button size. */
const buttonSizeToIconSize: Record<ButtonSize, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

/**
 * Returns the Icon fill so the icon matches the button label color (Figma: icon same as text).
 * Using fill prop avoids Icon's default fg-strong, which can override fg-brand-primary/fg-accent
 * when they appear earlier than fg-strong in utilities.css.
 */
function getIconFill(variant: ButtonVariant, color: ButtonColor): IconFill {
  if (variant === 'solid') {
    const map: Record<ButtonColor, IconFill> = {
      neutral: 'on-neutral',
      'brand-primary': 'on-brand-primary',
      accent: 'on-accent',
      critical: 'on-critical',
    }
    return map[color]
  }
  const map: Record<ButtonColor, IconFill> = {
    neutral: 'strong',
    'brand-primary': 'brand-primary',
    accent: 'accent',
    critical: 'critical',
  }
  return map[color]
}

/** Height token per size — used for iconOnly square dimensions. */
const controlHeightBySize: Record<ButtonSize, string> = {
  sm: 'var(--jf-control-height-sm, 36px)',
  md: 'var(--jf-control-height-md, 44px)',
  lg: 'var(--jf-control-height-lg, 48px)',
}

/**
 * Button
 *
 * Interactive button built on Control. Inherits Control props (size, fullWidth,
 * radius) and adds visual variants (solid/outline/ghost) and semantic colors.
 *
 * - Focus-visible, hover and active states come from .interactive (utilities.css).
 * - Loading: [data-loading] applies opacity; start slot shows "loader-2" with .motion-spin;
 *   label and endIcon are hidden but keep layout so button width stays the same.
 * - iconOnly: square button (width = height = control height); min-width = control height.
 *   When NOT iconOnly: w-min-40 ensures a minimum content width.
 *
 * @example
 * ```tsx
 * <Button variant="solid" color="accent">Save</Button>
 * <Button variant="outline" color="neutral" startIcon="arrow-left">Back</Button>
 * <Button iconOnly startIcon="plus" aria-label="Add" />
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = 'solid',
      color = 'brand-primary',
      size = 'md',
      iconOnly = false,
      fullWidth = false,
      radius = 'default',
      disabled = false,
      type = 'button',
      startIcon,
      endIcon,
      loading = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = buttonSizeToIconSize[size]
    const iconFill = getIconFill(variant, color)

    const { className: controlClassName, style: controlStyle } = useMemo(
      () => controlVariants({ size, fullWidth, radius }),
      [size, fullWidth, radius]
    )

    const { className: buttonVariantClassName, style: buttonVariantStyle } = useMemo(
      () => buttonVariants({ variant, color }),
      [variant, color]
    )

    const resolvedStyle = useMemo((): React.CSSProperties => ({
      ...controlStyle,
      ...buttonVariantStyle,
      ...(iconOnly
        ? {
            width:    controlHeightBySize[size],
            minWidth: controlHeightBySize[size],
            height:   controlHeightBySize[size],
          }
        : {}),
      ...style,
      ...(disabled ? { opacity: 'var(--jf-opacity-disabled, 0.4)' } : {}),
    }), [controlStyle, buttonVariantStyle, iconOnly, size, style, disabled])

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          controlClassName,
          buttonVariantClassName,
          !iconOnly && 'w-min-40',
          loading && 'pos-relative',
          disabled && 'cursor-not-allowed',
          className
        )}
        style={resolvedStyle}
        aria-disabled={disabled ? true : undefined}
        data-loading={loading ? true : undefined}
        aria-busy={loading ? true : undefined}
        {...props}
      >
        {loading ? (
          <span className="pos-absolute top-0 right-0 bottom-0 left-0 d-flex items-center justify-center" aria-hidden>
            <Icon
              name="loader-2"
              size={iconSize}
              fill={iconFill}
              className="motion-spin"
              decorative
            />
          </span>
        ) : startIcon ? (
          <Icon
            name={startIcon}
            size={iconSize}
            fill={iconFill}
            decorative
          />
        ) : null}
        {loading ? (
          <span className="visibility-hidden pointer-events-none" aria-hidden>
            {children}
          </span>
        ) : (
          children
        )}
        {loading && endIcon ? (
          <span className="visibility-hidden pointer-events-none" aria-hidden>
            <Icon name={endIcon} size={iconSize} fill={iconFill} decorative />
          </span>
        ) : endIcon ? (
          <Icon
            name={endIcon}
            size={iconSize}
            fill={iconFill}
            decorative
          />
        ) : null}
      </button>
    )
  }
)

Button.displayName = 'Button'