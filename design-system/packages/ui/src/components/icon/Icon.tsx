import React, { forwardRef } from 'react'
import type { KeyboardEvent } from 'react'
import * as tablerIcons from '@tabler/icons-react'
import type { IconProps } from './Icon.types'
import { iconSizeMap, iconFillMap } from './Icon.variants'
import { toIconComponentKey } from './icon-name-utils'

/**
 * Icon
 *
 * Visual component used to represent actions, states, or concepts in a symbolic way.
 * Consumes the Tabler Icons library with design token-based size and fill variants.
 *
 * @example
 * ```tsx
 * <Icon name="bag" size="md" fill="strong" />
 * <Icon name="arrow-left" size="xl" fill="brand-primary" decorative />
 * <Icon name="chevron-down" onClick={handleClick} ariaLabel="Expand" />
 * ```
 *
 * @see {@link https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2012-56 | Figma Design}
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

    const sizeValue = iconSizeMap[size]
    const fillValue = iconFillMap[fill]
    const isInteractive = typeof onClick === 'function'

    const iconElement = (
      <IconComponent
        aria-hidden={decorative}
        color={fillValue}
        size={undefined}
        stroke={1.5}
        style={{ width: '100%', height: '100%' }}
      />
    )

    const interactiveClassName = isInteractive ? 'jf-interactive' : ''
    const resolvedClassName = [interactiveClassName, className].filter(Boolean).join(' ') || undefined

    const sharedProps = {
      ref,
      className: resolvedClassName,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizeValue,
        height: sizeValue,
        ...(isInteractive && { cursor: 'pointer' }),
        ...style,
      },
      ...rest,
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
