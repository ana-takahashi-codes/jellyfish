import React, { forwardRef, useMemo } from 'react'
import { cn } from '../../../variants'
import type { CircleProps } from './Circle.types'
import { circleVariants } from './Circle.variants'

/**
 * `size` accepts either:
 * - a utility class string starting with `size-` → applied as className
 * - a number → converted to px inline style
 * - any other CSS length string → applied as inline width + height
 */
function resolveSize(val: string | number | undefined): {
  sizeClass?: string
  sizeStyle?: React.CSSProperties
} {
  if (val === undefined) return {}
  if (typeof val === 'number') return { sizeStyle: { width: `${val}px`, height: `${val}px` } }
  if (/^size-/.test(val)) return { sizeClass: val }
  return { sizeStyle: { width: val, height: val } }
}

/**
 * `bg` accepts either:
 * - a utility class string starting with `bg-` → applied as className
 * - any CSS value (var, hex, rgb, …) → applied as inline `background`
 */
function resolveBg(val: string | undefined): {
  bgClass?: string
  bgStyle?: React.CSSProperties
} {
  if (val === undefined) return {}
  if (/^bg-/.test(val)) return { bgClass: val }
  return { bgStyle: { background: val } }
}

/**
 * Circle
 *
 * Utility component that renders a perfectly circular container.
 * Useful as a building block for badges, status indicators, and avatars.
 *
 * `size` and `bg` accept both **utility class names** and **CSS values / token vars**:
 *
 * @example
 * ```tsx
 * // utility classes
 * <Circle size="size-4" bg="bg-brand-primary" />
 *
 * // CSS values / token vars
 * <Circle size={20} bg="var(--jf-color-brand-primary-500)" />
 *
 * // with outline ring
 * <Circle size="size-4" bg="bg-positive" outline="2px solid" outlineColor="var(--jf-color-bg-page)" />
 * ```
 */
export const Circle = forwardRef<HTMLSpanElement, CircleProps>(
  ({ bg, size, outline, outlineColor, className, style, children, ...props }, ref) => {
    const { className: variantClass } = useMemo(() => circleVariants(), [])

    const { sizeClass, sizeStyle } = useMemo(() => resolveSize(size), [size])
    const { bgClass, bgStyle } = useMemo(() => resolveBg(bg), [bg])

    const computedStyle = useMemo((): React.CSSProperties => {
      const outlineValue = outline
        ? outlineColor
          ? `${outline} ${outlineColor}`
          : outline
        : undefined

      return {
        ...sizeStyle,
        ...bgStyle,
        ...(outlineValue ? { outline: outlineValue } : {}),
        ...style,
      }
    }, [sizeStyle, bgStyle, outline, outlineColor, style])

    return (
      <span
        ref={ref}
        className={cn(variantClass, sizeClass, bgClass, className)}
        style={computedStyle}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Circle.displayName = 'Circle'
