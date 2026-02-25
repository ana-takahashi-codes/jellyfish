import type { ComponentPropsWithoutRef } from 'react'

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg'

type JellyfishLogoProps = {
  brand?: 'jellyfish'
  /** 'default' (icon + wordmark) ou 'compact' (somente ícone) */
  variant?: 'default' | 'compact'
}

type DecodedLogoProps = {
  brand: 'decoded'
  /** Decoded só suporta 'compact' */
  variant?: 'compact'
}

export type LogoColorScheme = 'light' | 'dark'

export type LogoProps = (JellyfishLogoProps | DecodedLogoProps) & {
  /** Altura controlada por token; width é auto. Default: 'md' */
  size?: LogoSize
  /**
   * Versão de cor do logo conforme o fundo onde será exibido.
   * - `light` → texto/ícone escuro, para fundos claros (default)
   * - `dark`  → texto/ícone branco, para fundos escuros
   *
   * O ícone jellyfish compact é todo roxo (#7465FB) e não muda entre esquemas.
   */
  colorScheme?: LogoColorScheme
  className?: string
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>
