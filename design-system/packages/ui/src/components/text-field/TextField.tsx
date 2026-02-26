import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../variants'
import { controlVariants } from '../utils/control/Control.variants'
import { Icon } from '../icon'
import type { TextFieldProps } from './TextField.types'
import { textFieldVariants } from './TextField.variants'

// ─── Placeholder style injection ──────────────────────────────────────────────

const PLACEHOLDER_STYLE_ID = 'jf-tf-ph-style'

function injectPlaceholderStyle() {
  if (typeof document === 'undefined') return
  if (document.getElementById(PLACEHOLDER_STYLE_ID)) return
  const el = document.createElement('style')
  el.id = PLACEHOLDER_STYLE_ID
  el.textContent =
    '.jf-tf-input::placeholder{color:var(--jf-color-fg-muted);opacity:1}'
  document.head.appendChild(el)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const affixStyle: React.CSSProperties = {
  color: 'var(--jf-color-fg-muted)',
  flexShrink: 0,
  userSelect: 'none',
  whiteSpace: 'nowrap',
}

const inputFontClassBySize: Record<NonNullable<TextFieldProps['size']>, string> = {
  sm: 'font-text-sm',
  md: 'font-text-md',
  lg: 'font-text-lg',
}

const affixFontClassBySize: Record<NonNullable<TextFieldProps['size']>, string> = {
  sm: 'font-label-sm',
  md: 'font-label-md',
  lg: 'font-label-lg',
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return (node: T | null) => {
    for (const r of refs) {
      if (!r) continue
      if (typeof r === 'function') r(node)
      else (r as React.MutableRefObject<T | null>).current = node
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * TextField
 *
 * Single-line text input built on Control layout. Supports icons, prefix/suffix,
 * clear button, and character count.
 *
 * - `variant="default"`: bordered + rounded.
 * - `variant="ghost"`: flat bg, no border, square corners.
 * - `ref` forwards to the inner `<input>` element.
 *
 * @example
 * ```tsx
 * <TextField placeholder="Search…" startIcon="search" clearable />
 * ```
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      variant = 'default',
      size = 'md',
      fullWidth = false,
      radius = 'default',
      disabled = false,
      startIcon,
      endIcon,
      prefix,
      suffix,
      clearable = false,
      showCharCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      className,
      style,
      id,
      inputRef,
      ...inputProps
    },
    ref
  ) => {
    // ── Inject placeholder style once ────────────────────────────────────────
    useEffect(() => {
      injectPlaceholderStyle()
    }, [])

    const resolvedId = id
    const isDisabled = disabled

    // ── Value state ──────────────────────────────────────────────────────────
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState<string>(
      typeof defaultValue === 'string' ? defaultValue : ''
    )
    const displayValue = isControlled ? String(value) : internalValue

    // ── Focus / hover state ──────────────────────────────────────────────────
    const [isFocused, setIsFocused] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // ── Refs ─────────────────────────────────────────────────────────────────
    const innerRef = useRef<HTMLInputElement>(null)
    // mergeRefs is recreated only when the forwarded ref changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const mergedRef = useCallback(
      mergeRefs<HTMLInputElement>(ref, innerRef, inputRef),
      [ref, inputRef]
    )

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalValue(e.target.value)
        onChange?.(e)
      },
      [isControlled, onChange]
    )

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        onFocus?.(e)
      },
      [onFocus]
    )

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    const handleClear = useCallback(() => {
      const input = innerRef.current
      if (!input) return
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      )?.set
      nativeSetter?.call(input, '')
      input.dispatchEvent(new Event('input', { bubbles: true }))
      if (!isControlled) {
        setInternalValue('')
      }
      input.focus()
    }, [isControlled])

    // ── Control layout variants ───────────────────────────────────────────────
    const resolvedRadius = radius
    const { className: controlClass, style: controlStyle } = useMemo(
      () => controlVariants({ size, fullWidth, radius: resolvedRadius }),
      [size, fullWidth, resolvedRadius]
    )

    const inputFontClass = inputFontClassBySize[size] ?? inputFontClassBySize.md
    const affixFontClass = affixFontClassBySize[size] ?? affixFontClassBySize.md

    // ── Visual variants (JFV) + estados ──────────────────────────────────────
    const { className: visualClass, style: visualStyle } = useMemo(
      () => textFieldVariants({ variant }),
      [variant]
    )

    const borderStyle = useMemo((): React.CSSProperties => {
      const base = (visualStyle ?? {}) as React.CSSProperties

      // Ghost: sem borda por padrão; em hover/focus ganha bg; em focus ganha border-bottom customizada.
      if (variant === 'ghost') {
        const style: React.CSSProperties = {
          ...base,
          border: 'none',
          // Hover OU focus: fundo do input, para ficar alinhado ao Figma.
          background:
            isHovered || isFocused
              ? 'var(--jf-input-bg-default)'
              : base.background,
        }

        // Mantém corner radius do Control no topo/direita, zera cantos inferiores.
        style.borderBottomLeftRadius = 0
        style.borderBottomRightRadius = 0

        if (isFocused) {
          style.borderBottom = `var(--jf-bd-width-0-5) solid var(--jf-input-color-bd-focus)`
          style.boxShadow = undefined
        }

        return style
      }

      // Default: borda completa com cores dinâmicas + halo de focus.
      const bdColor = isFocused
        ? 'var(--jf-input-color-bd-focus)'
        : isHovered
        ? 'var(--jf-input-color-bd-hover)'
        : 'var(--jf-input-color-bd-default)'

      return {
        ...base,
        border: `1px solid ${bdColor}`,
        boxShadow: isFocused ? '0 0 0 3px oklch(0.603 0.215 282.35 / 18%)' : base.boxShadow,
      }
    }, [visualStyle, variant, isFocused, isHovered])

    // ── Derived ───────────────────────────────────────────────────────────────
    const showClear = clearable && displayValue.length > 0 && !isDisabled
    const showCount = showCharCount && maxLength !== undefined

    // ── Render ────────────────────────────────────────────────────────────────
    // Always render an outer wrapper div so className/style apply consistently.
    // The wrapper is d-inline-flex or d-flex depending on fullWidth.
    return (
      <div
        className={className}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: showCount ? '4px' : undefined,
          width: fullWidth ? '100%' : undefined,
          ...style,
        }}
      >
        {/* ── Control span (the visible bordered container) ──────────────── */}
        <span
          className={cn(controlClass, visualClass, fullWidth && 'w-full')}
          style={{
            ...controlStyle,
            ...borderStyle,
            cursor: isDisabled ? 'not-allowed' : 'text',
            opacity: isDisabled ? 'var(--jf-opacity-disabled, 0.4)' : undefined,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => innerRef.current?.focus()}
          aria-disabled={isDisabled ? true : undefined}
        >
          {/* Start icon */}
          {startIcon && (
            <Icon
              name={startIcon}
              size="md"
              fill={isFocused ? 'moderated' : 'muted'}
              decorative
            />
          )}

          {/* Prefix */}
          {prefix && (
            <span className={affixFontClass} style={affixStyle}>
              {prefix}
            </span>
          )}

          {/* Input */}
          <input
            ref={mergedRef}
            id={resolvedId}
            className={cn('jf-tf-input', inputFontClass)}
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--jf-color-fg-strong)',
              width: '100%',
              padding: 0,
              cursor: isDisabled ? 'not-allowed' : undefined,
            }}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            disabled={isDisabled}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...inputProps}
          />

          {/* Suffix (hidden when clear button is visible) */}
          {suffix && !showClear && (
            <span className={affixFontClass} style={affixStyle}>
              {suffix}
            </span>
          )}

          {/* Clear button */}
          {showClear && (
            <Icon
              name="x"
              size="md"
              fill="muted"
              ariaLabel="Limpar campo"
              onClick={handleClear}
              style={{ flexShrink: 0, cursor: 'pointer' }}
            />
          )}

          {/* End icon (hidden when clear button is visible) */}
          {endIcon && !showClear && (
            <Icon
              name={endIcon}
              size="md"
              fill={isFocused ? 'moderated' : 'muted'}
              decorative
            />
          )}
        </span>

        {/* ── Character count (below the control) ────────────────────────── */}
        {showCount && (
          <span
            style={{
              fontSize: 'var(--jf-font-size-xs, 0.75rem)',
              color:
                displayValue.length >= (maxLength as number)
                  ? 'var(--jf-color-critical-default, oklch(0.55 0.22 27))'
                  : 'var(--jf-color-fg-muted)',
              textAlign: 'right',
              userSelect: 'none',
            }}
            aria-live="polite"
          >
            {displayValue.length}/{maxLength}
          </span>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
