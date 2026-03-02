import type { ComponentPropsWithoutRef } from 'react'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarType  = 'photo' | 'initials' | 'icon'

export type AvatarBgColor =
  | 'brand-primary'
  | 'accent'
  | 'neutral'
  | 'dataviz1'
  | 'dataviz2'
  | 'dataviz3'
  | 'dataviz4'

export interface AvatarBadge {
  /** Status de presença — determina a cor do indicador. */
  status: 'online' | 'offline' | 'busy' | 'away'
}

export interface AvatarProps extends ComponentPropsWithoutRef<'div'> {
  /** Sempre obrigatório: gera as iniciais e seed da cor determinística. */
  name: string
  /** URL da imagem (activa type="photo" automaticamente). */
  src?: string
  /** Nome do ícone Tabler (activa type="icon" automaticamente). */
  icon?: string
  /** Forçar tipo. Default: inferido de src → icon → initials. */
  type?: AvatarType
  size?: AvatarSize
  /**
   * Cor de fundo para type="initials" e type="icon".
   * Quando omitido, cor determinística gerada via hash do name.
   */
  bgColor?: AvatarBgColor
  /** Exibe anel ao redor do avatar (classe utility `.ring`). */
  ring?: boolean
  /** Badge de status de presença. */
  badge?: AvatarBadge
  className?: string
  onClick?: () => void
  'aria-label'?: string
}
