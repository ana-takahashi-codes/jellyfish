import React, { forwardRef, useMemo } from 'react'
import type { FloatProps, FloatPlacement } from './Float.types'
import { floatOriginStyles, floatBaseTransform } from './Float.variants'

function toCss(val: string | number): string {
  return typeof val === 'number' ? `${val}px` : val
}

function buildStyle(
  placement: FloatPlacement,
  offsetX?: string | number,
  offsetY?: string | number,
  offset?: string | number,
): React.CSSProperties {
  const xVal = offsetX !== undefined ? offsetX : offset
  const yVal = offsetY !== undefined ? offsetY : offset

  const transforms: string[] = [floatBaseTransform[placement]]
  if (xVal !== undefined) transforms.push(`translateX(${toCss(xVal)})`)
  if (yVal !== undefined) transforms.push(`translateY(${toCss(yVal)})`)

  return {
    position: 'absolute',
    ...floatOriginStyles[placement],
    transform: transforms.join(' '),
  }
}

/**
 * Float
 *
 * Positions children absolutely, centered on a corner or edge of the nearest
 * relatively-positioned ancestor. Useful for badges, indicators, and overlays.
 *
 * The parent container must have `position: relative` (or equivalent).
 *
 * @example
 * ```tsx
 * <div style={{ position: 'relative', display: 'inline-flex' }}>
 *   <Avatar />
 *   <Float placement="bottom-end" offset={-4}>
 *     <Badge />
 *   </Float>
 * </div>
 * ```
 */
export const Float = forwardRef<HTMLDivElement, FloatProps>(
  (
    {
      placement = 'bottom-end',
      offsetX,
      offsetY,
      offset,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const floatStyle = useMemo(
      () => buildStyle(placement, offsetX, offsetY, offset),
      [placement, offsetX, offsetY, offset]
    )

    const mergedStyle = useMemo(
      () => ({ ...floatStyle, ...style }),
      [floatStyle, style]
    )

    return (
      <div ref={ref} className={className} style={mergedStyle} {...props}>
        {children}
      </div>
    )
  }
)

Float.displayName = 'Float'
