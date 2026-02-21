import type { ComponentPropsWithoutRef } from 'react'

/** Size variation for icons (maps to --jf-font-size-* tokens). */
export type IconSize =
  | '2xl'
  | '3xl'
  | 'g'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xl'
  | 'xs'

/** Fill color variation for icons (maps to --jf-color-fg-* tokens). */
export type IconFill =
  | 'accent'
  | 'brand-primary'
  | 'critical'
  | 'dataviz1'
  | 'dataviz2'
  | 'dataviz3'
  | 'dataviz4'
  | 'moderated'
  | 'muted'
  | 'neutral'
  | 'on-accent'
  | 'on-brand-primary'
  | 'on-critical'
  | 'on-neutral'
  | 'positive'
  | 'strong'
  | 'warning'

export interface IconProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
  /**
   * Icon name from Tabler library (e.g. "bag", "arrow-left", "chevron-down").
   * Resolved to IconBag, IconArrowLeft, IconChevronDown.
   */
  name: string

  /**
   * Size variation (design token --jf-font-size-*).
   */
  size?: IconSize

  /**
   * Fill color variation (design token --jf-color-fg-*).
   */
  fill?: IconFill

  /**
   * Function executed when icon is clicked. When provided, the icon is rendered as a button (role="button", tabIndex=0).
   */
  onClick?: () => void

  /**
   * Accessibility label for screen readers. Required when icon is interactive (onClick) or when decorative is false.
   */
  ariaLabel?: string

  /**
   * When true, adds aria-hidden="true" so the icon is ignored by assistive tech. Use for purely decorative icons.
   */
  decorative?: boolean

  /**
   * Additional CSS classes for custom styling.
   */
  className?: string
}
