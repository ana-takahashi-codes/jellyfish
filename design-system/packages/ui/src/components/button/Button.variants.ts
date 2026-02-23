import type { CSSProperties } from 'react'
import { variants } from '../../variants'
import type { VariantPropsOf } from '../../variants'

/**
 * Button visual variants aligned with Figma (node 2040-5016).
 *
 * variant = solid | outline | ghost
 * color   = neutral | brand-primary | accent | critical
 *
 * Focus / hover / active states come from .interactive in utilities.css.
 * Border reset for solid/ghost is via inline style { border: 'none' } so it
 * wins over the browser UA stylesheet without needing a non-existent utility class.
 * Outline uses the 'bd-0-5 box-border' utility classes + borderStyle via compound variant.
 */
export const buttonVariants = variants({
  base: {
    class: [
      'interactive',
      'cursor-pointer',
      'justify-center',
      'jf-button-font-label',
    ],
  },
  variants: {
    variant: {
      solid:   { border: 'none' } as CSSProperties,
      outline: 'bd-0-5 box-border',
      ghost:   { border: 'none' } as CSSProperties,
    },
    color: {
      neutral:        '',
      'brand-primary': '',
      accent:         '',
      critical:       '',
    },
  },
  compoundVariants: [
    // Outline: borderStyle applied to all outline variants (cannot be in the string variant value)
    { variant: 'outline', style: { borderStyle: 'solid' } as CSSProperties },

    // Solid
    { variant: 'solid', color: 'neutral',       class: 'bg-neutral      fg-on-neutral'       },
    { variant: 'solid', color: 'brand-primary', class: 'bg-brand-primary fg-on-brand-primary' },
    { variant: 'solid', color: 'accent',        class: 'bg-accent        fg-on-accent'        },
    { variant: 'solid', color: 'critical',      class: 'bg-critical      fg-on-critical'      },

    // Outline (transparent bg + semantic border-color + semantic fg)
    { variant: 'outline', color: 'neutral',       class: 'bd-neutral       bg-transparent fg-strong'        },
    { variant: 'outline', color: 'brand-primary', class: 'bd-brand-primary bg-transparent fg-brand-primary' },
    { variant: 'outline', color: 'accent',        class: 'bd-accent        bg-transparent fg-accent'        },
    { variant: 'outline', color: 'critical',      class: 'bd-critical      bg-transparent fg-critical'      },

    // Ghost (no border, transparent bg, semantic fg)
    { variant: 'ghost', color: 'neutral',       class: 'bg-neutral-soft fg-strong'        },
    { variant: 'ghost', color: 'brand-primary', class: 'bg-brand-primary-soft fg-brand-primary' },
    { variant: 'ghost', color: 'accent',        class: 'bg-accent-soft fg-accent'        },
    { variant: 'ghost', color: 'critical',      class: 'bg-critical-soft fg-critical'      },
  ],
  defaultVariants: {
    variant: 'solid',
    color:   'brand-primary',
  },
})

export type ButtonVariants = VariantPropsOf<typeof buttonVariants>