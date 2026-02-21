/**
 * Sistema de Variantes Jellyfish (JFV)
 * Alinhado com as utility classes do @jellyfish/tokens (JIT ou estático).
 * Breakpoints usam o prefixo screen-* (ex.: screen-md:p-4).
 */

import type { CSSProperties } from 'react'

// ============================================================================
// TYPES
// ============================================================================

type ClassValue =
  | string
  | string[]
  | Record<string, unknown>
  | undefined
  | null
  | false

type ResponsiveValue<T> =
  | T
  | {
      initial?: T
      xs?: T
      sm?: T
      md?: T
      lg?: T
      xl?: T
    }

type VariantValue = string | CSSProperties

type VariantConfig =
  | Record<string, VariantValue>
  | Record<'true' | 'false', VariantValue>

type BooleanVariant = Record<'true' | 'false', VariantValue>

type BaseConfig =
  | CSSProperties
  | ClassValue
  | (CSSProperties & { class?: ClassValue })

type VariantsConfig<T extends Record<string, VariantConfig>> = {
  base?: BaseConfig
  variants?: T
  defaultVariants?: {
    [K in keyof T]?: T[K] extends BooleanVariant ? boolean : keyof T[K]
  }
  compoundVariants?: Array<
    Partial<{
      [K in keyof T]: T[K] extends BooleanVariant ? boolean : keyof T[K]
    }> & {
      class?: ClassValue
      className?: ClassValue
      style?: CSSProperties
    }
  >
  responsiveVariants?: (keyof T)[]
}

type VariantProps<T extends Record<string, VariantConfig>> = {
  [K in keyof T]?: T[K] extends BooleanVariant
    ? ResponsiveValue<boolean>
    : ResponsiveValue<keyof T[K]>
} & {
  className?: string
  class?: string
  style?: CSSProperties
}

type VariantResult = {
  className: string
  style?: CSSProperties
}

// ============================================================================
// UTILITIES
// ============================================================================

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string') {
      classes.push(input)
    } else if (Array.isArray(input)) {
      const result = cn(...input)
      if (result) classes.push(result)
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key)
      }
    }
  }

  return classes.join(' ')
}

const variantCache = new Map<string, VariantResult>()

function getCacheKey(props: Record<string, unknown>): string {
  return JSON.stringify(props)
}

// ============================================================================
// RESPONSIVE – Jellyfish breakpoints (screen-*)
// ============================================================================

const BREAKPOINTS = [
  { key: 'initial', prefix: '' },
  { key: 'xs', prefix: 'screen-xs:' },
  { key: 'sm', prefix: 'screen-sm:' },
  { key: 'md', prefix: 'screen-md:' },
  { key: 'lg', prefix: 'screen-lg:' },
  { key: 'xl', prefix: 'screen-xl:' }
] as const

type BreakpointKey = (typeof BREAKPOINTS)[number]['key']

function isResponsiveValue<T>(
  value: unknown
): value is Record<BreakpointKey, T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    BREAKPOINTS.some((bp) => bp.key in (value as object))
  )
}

function processResponsiveValue<T>(
  value: ResponsiveValue<T>,
  processor: (val: T) => string | CSSProperties | undefined
): { classes: string[]; styles?: CSSProperties } {
  const classes: string[] = []
  let styles: CSSProperties | undefined

  if (isResponsiveValue(value)) {
    for (const { key, prefix } of BREAKPOINTS) {
      const val = (value as Record<string, T>)[key]
      if (val === undefined) continue

      const processed = processor(val)
      if (!processed) continue

      if (typeof processed === 'string') {
        classes.push(prefix ? `${prefix}${processed}` : processed)
      } else if (typeof processed === 'object' && !prefix) {
        styles = { ...styles, ...processed }
      }
    }
  } else if (value !== undefined) {
    const processed = processor(value as T)
    if (processed) {
      if (typeof processed === 'string') {
        classes.push(processed)
      } else if (typeof processed === 'object') {
        styles = processed
      }
    }
  }

  return { classes, styles }
}

// ============================================================================
// JELLYFISH VARIANTS (JFV)
// ============================================================================

export function jfv<T extends Record<string, VariantConfig>>(
  config: VariantsConfig<T>
) {
  const {
    base,
    variants: variantsConfig = {} as T,
    defaultVariants = {},
    compoundVariants = [],
    responsiveVariants = []
  } = config

  return (props: VariantProps<T> = {}) => {
    const {
      className: userClassName,
      class: userClass,
      style: userStyle,
      ...variantProps
    } = props

    if (!userClassName && !userClass && !userStyle) {
      const cacheKey = getCacheKey(variantProps)
      const cached = variantCache.get(cacheKey)
      if (cached) return cached
    }

    const classes: string[] = []
    let styles: CSSProperties | undefined

    if (base) {
      if (typeof base === 'object' && !Array.isArray(base)) {
        const { class: baseClass, ...baseStyle } = base as CSSProperties & {
          class?: ClassValue
        }
        if (baseClass) classes.push(cn(baseClass))
        if (Object.keys(baseStyle).length > 0) {
          styles = { ...styles, ...(baseStyle as CSSProperties) }
        }
      } else {
        classes.push(cn(base as ClassValue))
      }
    }

    const mergedProps = { ...defaultVariants, ...variantProps }

    for (const variantKey of Object.keys(variantsConfig) as Array<keyof T>) {
      const rawValue = mergedProps[variantKey as keyof typeof mergedProps]
      if (rawValue === undefined) continue

      const variantValues = variantsConfig[variantKey] as T[typeof variantKey]
      const isBooleanVariant =
        'true' in (variantValues as Record<string, unknown>) &&
        'false' in (variantValues as Record<string, unknown>)
      const isResponsive =
        (responsiveVariants as Array<keyof T>).indexOf(variantKey) !== -1

      const propValue =
        isBooleanVariant && typeof rawValue === 'boolean'
          ? (String(rawValue) as keyof typeof variantValues)
          : rawValue

      if (isResponsive || isResponsiveValue(propValue)) {
        const result = processResponsiveValue(
          propValue as ResponsiveValue<keyof (typeof variantValues) & boolean>,
          (val) => {
            const key = (
              isBooleanVariant && typeof val === 'boolean'
                ? String(val)
                : (val as keyof typeof variantValues)
            ) as keyof typeof variantValues
            const v = (variantValues as Record<
              string | number | symbol,
              VariantValue
            >)[key as string]
            return v as string | CSSProperties | undefined
          }
        )
        classes.push(...result.classes)
        if (result.styles) {
          styles = { ...styles, ...result.styles }
        }
      } else {
        const key = propValue as keyof typeof variantValues
        const variantValue = (variantValues as Record<
          string | number | symbol,
          VariantValue
        >)[key as string] as VariantValue

        if (typeof variantValue === 'string') {
          classes.push(variantValue)
        } else if (typeof variantValue === 'object') {
          styles = { ...styles, ...variantValue }
        }
      }
    }

    for (const compound of compoundVariants) {
      const {
        class: compoundClass,
        className: compoundClassName,
        style: compoundStyle,
        ...conditions
      } = compound

      const isMatch = (Object.keys(conditions) as Array<keyof typeof conditions>).every((key) => {
        const value = conditions[key]
        const propValue = mergedProps[key as keyof typeof mergedProps]
        if (isResponsiveValue(propValue)) {
          const baseValue =
            (propValue as { initial?: unknown }).initial ??
            (propValue as { sm?: unknown }).sm
          return baseValue === value || String(baseValue) === String(value)
        }
        if (typeof value === 'boolean' && typeof propValue === 'boolean') {
          return propValue === value
        }
        if (typeof propValue === 'boolean') {
          return String(propValue) === String(value)
        }
        return propValue === value
      })

      if (isMatch) {
        if (compoundClass || compoundClassName) {
          classes.push(cn(compoundClass ?? compoundClassName))
        }
        if (compoundStyle) {
          styles = { ...styles, ...compoundStyle }
        }
      }
    }

    if (userClassName || userClass) {
      classes.push(cn(userClassName ?? userClass))
    }
    if (userStyle) {
      styles = { ...styles, ...userStyle }
    }

    const result: VariantResult = {
      className: cn(classes),
      ...(styles && Object.keys(styles).length > 0 ? { style: styles } : {})
    }

    if (!userClassName && !userClass && !userStyle) {
      const cacheKey = getCacheKey(variantProps)
      variantCache.set(cacheKey, result)
    }

    return result
  }
}

export const variants = jfv

// ============================================================================
// HELPERS & TYPES
// ============================================================================

export type VariantPropsOf<T> = T extends (props?: infer P) => unknown
  ? P
  : never

export function clearVariantCache(): void {
  variantCache.clear()
}
