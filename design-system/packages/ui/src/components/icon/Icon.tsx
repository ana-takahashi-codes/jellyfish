import React, { forwardRef } from 'react'
import type { KeyboardEvent } from 'react'
import * as tablerIcons from '@tabler/icons-react'
import type { IconProps } from './Icon.types'
import { iconSizeClasses, iconFillClasses } from './Icon.variants'
import { toIconComponentKey } from './icon-name-utils'

/**
 * Icon
 *
 * Visual component used to represent actions, states, or concepts in a symbolic way.
 * Consumes the Tabler Icons library; size and fill use JIT utility classes (icon-*, fg-*)
 * so the app's PostCSS JIT generates only the rules used.
 *
 * @example
 * ```tsx
 * <Icon name="bag" size="md" fill="strong" />
 * <Icon name="arrow-left" size="xl" fill="brand-primary" decorative />
 * <Icon name="chevron-down" onClick={handleClick} ariaLabel="Expand" />
 * ```
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      size = 'md',
      fill = 'strong',
      onClick,
      ariaLabel,
      decorative = true,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const componentKey = toIconComponentKey(name)
    const IconComponent = tablerIcons[componentKey as keyof typeof tablerIcons] as
      | React.ComponentType<{
          'aria-hidden'?: boolean
          color?: string
          size?: number
          stroke?: number
          style?: React.CSSProperties
        }>
      | undefined

    if (IconComponent === undefined) {
      return null
    }

    const isInteractive = typeof onClick === 'function'
    const sizeClass = iconSizeClasses[size]
    const fillClass = iconFillClasses[fill]
    const interactiveClass = isInteractive ? 'interactive' : ''
    // When parent passes an fg-* class (e.g. control icon color), do not apply default fill
    // so the parent's color is not overridden by fg-strong in the cascade.
    const useDefaultFill = !className || !/\bfg-[a-z0-9-]+/.test(className)
    const resolvedClassName = [
      sizeClass,
      useDefaultFill ? fillClass : '',
      interactiveClass,
      className
    ]
      .filter(Boolean)
      .join(' ')
      .trim() || undefined

    const iconElement = (
      <IconComponent
        aria-hidden={decorative}
        color="currentColor"
        size={undefined}
        stroke={1.5}
        style={{ width: '100%', height: '100%' }}
      />
    )

    const sharedProps = {
      ref,
      className: resolvedClassName,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(isInteractive && { cursor: 'pointer' }),
        ...style
      },
      ...rest
    }

    if (isInteractive) {
      const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }
      return (
        <span
          {...sharedProps}
          aria-label={ariaLabel}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          {iconElement}
        </span>
      )
    }

    return (
      <span
        {...sharedProps}
        aria-hidden={decorative}
        aria-label={decorative ? undefined : ariaLabel}
      >
        {iconElement}
      </span>
    )
  }
)

Icon.displayName = 'Icon'
