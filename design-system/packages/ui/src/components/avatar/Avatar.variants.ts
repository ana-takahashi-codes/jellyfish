import { variants } from '../../variants'
import type { VariantPropsOf } from '../../variants'
import type { IconSize, IconFill } from '../icon/Icon.variants'
import type { AvatarSize, AvatarBgColor } from './Avatar.types'

// ── Base variants ─────────────────────────────────────────────────────────────

export const avatarVariants = variants({
  base: {
    class: [
      'd-inline-flex',
      'items-center',
      'justify-center',
      'pos-relative',
      'select-none',
      'corner-pill', // Avatar é sempre circular
    ],
  },
  variants: {
    size: {
      xs: 'size-16', // 32px
      sm: 'size-22', // 44px
      md: 'size-32', // 64px
      lg: 'size-40', // 80px
      xl: 'size-56', // 112px
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type AvatarVariants = VariantPropsOf<typeof avatarVariants>

// ── Typography for initials ───────────────────────────────────────────────────

/** Font utility class applied to the avatar container for initials text. */
export const initialsFont: Record<AvatarSize, string> = {
  xs: 'font-label-sm', // 14px w500
  sm: 'font-label-sm', // 14px w500
  md: 'font-label-lg', // 18px w500 (Figma: jf/font/label/lg)
  lg: 'font-title-md', // 24px w500 (Figma: jf/font/title/md = font-size/2xl)
  xl: 'font-title-lg', // 30px w700 (Figma: jf/font/title/lg = font-size/3xl)
}

// ── Icon size map (avatar size → Icon component size + optional override) ─────

/**
 * Maps avatar size to Icon size prop.
 * xl (56px) has no direct Icon size → override via className="size-28".
 * size-28 appears after size-24 (2xl) in utilities.css, so className wins.
 */
export const iconSizeMap: Record<AvatarSize, { size: IconSize; className?: string }> = {
  xs: { size: 'md' },                          // 24px
  sm: { size: 'md' },                          // 24px
  md: { size: 'lg' },                          // 32px
  lg: { size: 'xl' },                          // 40px
  xl: { size: '2xl', className: 'size-28' },   // 56px (override 48px → 56px)
}

// ── Badge sizes ───────────────────────────────────────────────────────────────

/** Circle size (px) for each avatar size. */
export const badgeSizeMap: Record<AvatarSize, number> = {
  xs:  8,
  sm:  8,
  md: 12,
  lg: 16,
  xl: 24,
}

/**
 * Float offset (px) to position the badge so its corner aligns
 * with the avatar's corner — matching Figma's bottom-0 / right-0.
 * = -(badgeSize / 2)
 */
export const badgeOffsetMap: Record<AvatarSize, number> = {
  xs:  -4,
  sm:  -4,
  md:  -6,
  lg:  -8,
  xl: -12,
}

// ── Background + foreground color tokens ──────────────────────────────────────

export const bgColorTokens: Record<AvatarBgColor, { bg: string; fg: string; iconFill: IconFill }> = {
  'brand-primary': {
    bg:       'var(--jf-color-bg-brand-primary)',
    fg:       'var(--jf-color-fg-on-brand-primary)',
    iconFill: 'on-brand-primary',
  },
  'accent': {
    bg:       'var(--jf-color-bg-accent)',
    fg:       'var(--jf-color-fg-on-accent)',
    iconFill: 'on-accent',
  },
  'neutral': {
    bg:       'var(--jf-color-bg-neutral)',
    fg:       'var(--jf-color-fg-on-neutral)',
    iconFill: 'on-neutral',
  },
  'dataviz1': {
    bg:       'var(--jf-color-dataviz1-500)',
    fg:       'var(--jf-color-fg-on-accent)', // white — no on-dataviz token
    iconFill: 'on-accent',
  },
  'dataviz2': {
    bg:       'var(--jf-color-dataviz2-500)',
    fg:       'var(--jf-color-fg-on-accent)',
    iconFill: 'on-accent',
  },
  'dataviz3': {
    bg:       'var(--jf-color-dataviz3-500)',
    fg:       'var(--jf-color-fg-on-accent)',
    iconFill: 'on-accent',
  },
  'dataviz4': {
    bg:       'var(--jf-color-dataviz4-500)',
    fg:       'var(--jf-color-fg-on-accent)',
    iconFill: 'on-accent',
  },
}

/**
 * Utility-based background + foreground classes for Avatar.
 * Sempre que existir utility (`bg-*` / `fg-*`), ela é preferida;
 * tokens acima são usados como fallback quando não houver utility.
 */
export const bgColorClasses: Record<AvatarBgColor, { bg?: string; fg?: string }> = {
  'brand-primary': {
    bg: 'bg-brand-primary',
    fg: 'fg-on-brand-primary',
  },
  accent: {
    bg: 'bg-accent',
    fg: 'fg-on-accent',
  },
  neutral: {
    bg: 'bg-neutral',
    fg: 'fg-on-neutral',
  },
  dataviz1: {
    // Sem utility específica de background; usa fg via utility e bg via token.
    fg: 'fg-on-accent',
  },
  dataviz2: {
    fg: 'fg-on-accent',
  },
  dataviz3: {
    fg: 'fg-on-accent',
  },
  dataviz4: {
    fg: 'fg-on-accent',
  },
}

// ── Badge status colors (preferindo utilities) ────────────────────────────────

export const badgeColorMap: Record<string, string> = {
  online:  'bg-positive',
  busy:    'bg-critical',
  away:    'bg-warning',
  offline: 'bg-neutral-soft',
}

export const badgeLabelMap: Record<string, string> = {
  online:  'online',
  busy:    'ocupado',
  away:    'ausente',
  offline: 'offline',
}

// ── Deterministic color from name ─────────────────────────────────────────────

export const BG_COLORS: AvatarBgColor[] = [
  'brand-primary', 'accent', 'neutral',
  'dataviz1', 'dataviz2', 'dataviz3', 'dataviz4',
]
