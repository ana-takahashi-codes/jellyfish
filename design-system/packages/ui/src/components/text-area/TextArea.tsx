import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../variants'
import { controlVariants } from '../utils/control/Control.variants'
import type { TextAreaProps } from './TextArea.types'
import { textAreaVariants } from './TextArea.variants'

// ─── Placeholder + scrollbar style injection ───────────────────────────────────

const PLACEHOLDER_STYLE_ID = 'jf-ta-ph-style'

function injectTextAreaStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(PLACEHOLDER_STYLE_ID)) return
  const el = document.createElement('style')
  el.id = PLACEHOLDER_STYLE_ID
  el.textContent = `
.jf-ta-input::placeholder {
  color: var(--jf-color-fg-muted);
  opacity: 1;
}
/* Scrollbar: alinhado ao protótipo Figma (track discreto, thumb arredondado) */
.jf-ta-input {
  scrollbar-width: thin;
  scrollbar-color: var(--jf-color-fg-muted) transparent;
}
.jf-ta-input::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.jf-ta-input::-webkit-scrollbar-track {
  background: transparent;
}
.jf-ta-input::-webkit-scrollbar-thumb {
  background: var(--jf-color-fg-muted);
  border-radius: var(--jf-corner-radius-pill, 999px);
}
.jf-ta-input::-webkit-scrollbar-thumb:hover {
  background: var(--jf-color-fg-moderated);
}
.jf-ta-input::-webkit-scrollbar-corner {
  background: transparent;
}
`
  document.head.appendChild(el)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
 * TextArea
 *
 * Multi-line text input built on Control layout. Shares the same visual
 * variants as TextField (default/ghost) and supports auto-resize, maxLength
 * and character count.
 *
 * - `variant="default"`: bordered + rounded.
 * - `variant="ghost"`: flat bg, no border; focus shows bottom border only.
 * - `resize="auto"`: grows vertically with content, clamped by minRows/maxRows.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = 'default',
      fullWidth = false,
      radius = 'default',
      disabled = false,
      readOnly = false,
      rows = 3,
      minRows,
      maxRows,
      resize = 'vertical',
      maxLength,
      showCharCount = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      className,
      style,
      id,
      inputRef,
      ...textareaProps
    },
    ref
  ) => {
    // ── Inject placeholder + scrollbar styles once ───────────────────────────
    useEffect(() => {
      injectTextAreaStyles()
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
    const innerRef = useRef<HTMLTextAreaElement>(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const mergedRef = useCallback(
      mergeRefs<HTMLTextAreaElement>(ref, innerRef, inputRef),
      [ref, inputRef]
    )

    // ── Auto-resize (resize = auto) ─────────────────────────────────────────
    const effectiveMinRows = minRows ?? rows ?? 3

    const autoResize = useCallback(() => {
      if (resize !== 'auto') return
      if (typeof window === 'undefined') return
      const el = innerRef.current
      if (!el) return

      el.style.height = 'auto'
      const scrollHeight = el.scrollHeight
      if (!scrollHeight) return

      const computed = window.getComputedStyle(el)
      const lineHeightPx = parseFloat(computed.lineHeight || '0') || 0
      const paddingTop = parseFloat(computed.paddingTop || '0') || 0
      const paddingBottom = parseFloat(computed.paddingBottom || '0') || 0

      const minHeight =
        lineHeightPx > 0
          ? lineHeightPx * effectiveMinRows + paddingTop + paddingBottom
          : undefined
      const maxHeight =
        lineHeightPx > 0 && maxRows
          ? lineHeightPx * maxRows + paddingTop + paddingBottom
          : undefined

      let height = scrollHeight
      if (minHeight !== undefined && height < minHeight) height = minHeight
      if (maxHeight !== undefined && height > maxHeight) height = maxHeight
      el.style.height = `${height}px`
    }, [resize, effectiveMinRows, maxRows])

    useLayoutEffect(() => {
      autoResize()
    }, [autoResize, displayValue])

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setInternalValue(e.target.value)
        onChange?.(e)
      },
      [isControlled, onChange]
    )

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true)
        onFocus?.(e)
      },
      [onFocus]
    )

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    // ── Control layout variants ───────────────────────────────────────────────
    const resolvedRadius = radius
    const { className: controlClass, style: controlStyleRaw } = useMemo(
      () => controlVariants({ size: 'md', fullWidth, radius: resolvedRadius }),
      [fullWidth, resolvedRadius]
    )

    // TextArea não possui variações de altura de Control; altura é ditada pelo conteúdo.
    const controlStyle = useMemo((): React.CSSProperties => {
      const base = (controlStyleRaw ?? {}) as React.CSSProperties
      const { height, minHeight, maxHeight, ...rest } = base
      return rest
    }, [controlStyleRaw])

    // ── Visual variants (JFV) + estados ──────────────────────────────────────
    const { className: visualClass, style: visualStyle } = useMemo(
      () => textAreaVariants({ variant }),
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
    const showCount = showCharCount && maxLength !== undefined
    const cssResize =
      resize === 'auto' ? 'none' : resize === 'vertical' || resize === 'both' || resize === 'none'
        ? resize
        : 'vertical'

    // ── Render ────────────────────────────────────────────────────────────────
    return (
      <div
        className={className}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: showCount ? 'var(--jf-size-2)' : undefined,
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
            cursor: isDisabled ? 'not-allowed' : readOnly ? 'default' : 'text',
            opacity: isDisabled ? 'var(--jf-opacity-disabled, 0.4)' : undefined,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => innerRef.current?.focus()}
          aria-disabled={isDisabled ? true : undefined}
          aria-readonly={readOnly ? true : undefined}
        >
          {/* Textarea */}
          <textarea
            ref={mergedRef}
            id={resolvedId}
            className="jf-ta-input"
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--jf-color-fg-strong)',
              font: 'inherit',
              width: '100%',
              paddingTop: 'var(--jf-size-6, 12px)',
              paddingBottom: 'var(--jf-size-6, 12px)',
              paddingRight: 'var(--jf-control-horizontal-padding-default, 12px)',
              marginRight: 'calc(-1 * var(--jf-control-horizontal-padding-default, 12px))',
              resize: cssResize,
              cursor: isDisabled ? 'not-allowed' : readOnly ? 'default' : undefined,
            }}
            disabled={isDisabled}
            readOnly={readOnly}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            rows={resize === 'auto' ? undefined : rows}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...textareaProps}
          />
        </span>

        {/* ── Character count (below the control, bottom-right) ───────────── */}
        {showCount && (
          <span
            style={{
              fontSize: 'var(--jf-font-size-xs, 0.75rem)',
              color:
                displayValue.length >= (maxLength as number)
                  ? 'var(--jf-color-critical-default, oklch(0.55 0.22 27))'
                  : 'var(--jf-color-fg-muted)',
              textAlign: 'right',
              alignSelf: 'flex-end',
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

TextArea.displayName = 'TextArea'

