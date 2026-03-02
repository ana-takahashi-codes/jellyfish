/**
 * Gera escala brand-primary 100–900 a partir de uma cor base (hex),
 * seguindo o padrão de L/C do core (oklch), mantendo o H da cor base.
 */

import { oklch, formatCss, parseHex } from 'culori'

const CORE_L = [0.948, 0.868, 0.783, 0.691, 0.603, 0.519, 0.429, 0.339, 0.184] as const
const CORE_C = [0.026, 0.066, 0.113, 0.168, 0.215, 0.226, 0.209, 0.176, 0.0648] as const
const CORE_500_INDEX = 4
const STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const

export type BrandPrimaryScale = Record<number, string>

function hexToOklch (hex: string): { L: number, C: number, H: number } | null {
  const parsed = typeof hex === 'string' && hex.startsWith('#') ? parseHex(hex) : parseHex(`#${hex}`)
  if (!parsed) return null
  const oklchColor = oklch(parsed)
  if (!oklchColor || oklchColor.l === undefined) return null
  const L = oklchColor.l
  const C = oklchColor.c ?? 0
  const H = oklchColor.h ?? 0
  return { L, C, H }
}

export function buildBrandPrimaryScale (hex: string): BrandPrimaryScale | null {
  const base = hexToOklch(hex)
  if (!base) return null

  const scale: BrandPrimaryScale = {} as BrandPrimaryScale
  const ratioC = base.C / CORE_C[CORE_500_INDEX]

  for (let i = 0; i < STEPS.length; i++) {
    const L = CORE_L[i]
    const C = Math.min(0.4, Math.max(0, CORE_C[i] * ratioC))
    const H = base.H
    const color = { mode: 'oklch' as const, l: L, c: C, h: H }
    scale[STEPS[i]] = formatCss(color)
  }

  return scale
}

export function buildBrandPrimaryOverrideCss (scale: BrandPrimaryScale): string {
  const vars = STEPS.map(
    (step) => `  --jf-color-brand-primary-${step}: ${scale[step]};`
  ).join('\n')

  const semantic = [
    '  --jf-color-bg-brand-primary: var(--jf-color-brand-primary-500);',
    '  --jf-color-bd-brand-primary: var(--jf-color-brand-primary-500);',
    '  --jf-color-bg-brand-primary-soft: var(--jf-color-brand-primary-100);',
  ].join('\n')

  return `
:root, [data-theme="light"], [data-theme="dark"] {
${vars}
${semantic}
}
[data-theme="light"] {
  --jf-color-fg-brand-primary: var(--jf-color-brand-primary-600);
}
[data-theme="dark"] {
  --jf-color-fg-brand-primary: var(--jf-color-brand-primary-300);
}
`.trim()
}
