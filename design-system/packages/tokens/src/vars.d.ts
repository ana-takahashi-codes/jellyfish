/**
 * Tipos para @jellyfish/tokens/vars.
 * Valores são strings var(--jf-*) em runtime.
 */

export const colors: {
  readonly fg: {
    readonly strong: string
    readonly muted: string
    readonly moderated: string
    readonly accent: string
    readonly 'brand-primary': string
    readonly 'on-brand-primary': string
    readonly positive: string
    readonly warning: string
    readonly critical: string
  }
  readonly bg: {
    readonly 'surface-default': string
    readonly 'surface-secondary': string
    readonly 'surface-tertiary': string
    readonly 'brand-primary': string
    readonly accent: string
    readonly neutral: string
    readonly page: string
  }
  readonly border: {
    readonly muted: string
    readonly strong: string
    readonly accent: string
  }
}

export const size: {
  readonly 0: string
  readonly 1: string
  readonly 2: string
  readonly 3: string
  readonly 4: string
  readonly 5: string
  readonly 6: string
  readonly 8: string
  readonly 10: string
  readonly 12: string
  readonly 16: string
  readonly 20: string
  readonly 24: string
  readonly full: string
  readonly half: string
}

export const radius: {
  readonly 0: string
  readonly default: string
  readonly sm: string
  readonly lg: string
  readonly full: string
}

export const fontSize: {
  readonly xs: string
  readonly sm: string
  readonly md: string
  readonly lg: string
  readonly xl: string
  readonly '2xl': string
  readonly '3xl': string
  readonly g: string
}

/**
 * Retorna var(--jf-{name}) para um nome de token.
 */
export function tokenVar (name: string): string
