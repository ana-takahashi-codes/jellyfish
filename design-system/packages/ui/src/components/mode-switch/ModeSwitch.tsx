import React, { forwardRef, useCallback, useMemo } from 'react'
import { controlVariants } from '../utils/control/Control.variants'
import { Icon } from '../icon'
import { cn } from '../../variants'
import { useTheme } from '../../theme'
import type { ModeSwitchProps } from './ModeSwitch.types'

const CONTROL_HEIGHT_BY_SIZE = {
  sm: 'var(--jf-control-height-sm, 36px)',
  md: 'var(--jf-control-height-md, 44px)',
  lg: 'var(--jf-control-height-lg, 48px)',
} as const

/**
 * ModeSwitch
 *
 * Button toggle to switch between light and dark theme. Built on Control (size, radius).
 * Uses ThemeProvider's useTheme; cycles between 'light' and 'dark' (ignores 'system' for the toggle).
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <ModeSwitch aria-label="Alternar tema claro/escuro" />
 * </ThemeProvider>
 * ```
 */
export const ModeSwitch = forwardRef<HTMLButtonElement, ModeSwitchProps>(
  (
    {
      size = 'md',
      radius = 'default',
      className,
      'aria-label': ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    const { resolved, setMode } = useTheme()

    const nextMode = resolved === 'light' ? 'dark' : 'light'

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setMode(nextMode)
        onClick?.(e)
      },
      [nextMode, setMode, onClick]
    )

    const { className: controlClassName, style: controlStyle } = useMemo(
      () => controlVariants({ size, fullWidth: false, radius }),
      [size, radius]
    )

    const style = useMemo(
      () => ({
        ...controlStyle,
        width: CONTROL_HEIGHT_BY_SIZE[size],
        minWidth: CONTROL_HEIGHT_BY_SIZE[size],
        height: CONTROL_HEIGHT_BY_SIZE[size],
      }),
      [controlStyle, size]
    )

    const label =
      ariaLabel ??
      (nextMode === 'dark'
        ? 'Alternar para tema escuro'
        : 'Alternar para tema claro')

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          controlClassName,
          'interactive',
          'cursor-pointer',
          'justify-center',
          'd-inline-flex',
          'items-center',
          'border-none',
          'bg-transparent',
          'fg-moderated',
          className
        )}
        style={style}
        aria-label={label}
        onClick={handleClick}
        {...props}
      >
        <Icon
          name={resolved === 'light' ? 'moon' : 'sun'}
          size={size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'md'}
          fill="strong"
          decorative
        />
      </button>
    )
  }
)

ModeSwitch.displayName = 'ModeSwitch'
