import React, { forwardRef, useState, useMemo } from 'react'
import { cn } from '../../variants'
import { Icon } from '../icon'
import { Float } from '../float'
import { Circle } from '../utils/circle'
import type { AvatarProps, AvatarType, AvatarSize, AvatarBgColor } from './Avatar.types'
import {
  avatarVariants,
  initialsFont,
  iconSizeMap,
  badgeSizeMap,
  badgeOffsetMap,
  bgColorTokens,
  bgColorClasses,
  badgeColorMap,
  badgeLabelMap,
  BG_COLORS,
} from './Avatar.variants'

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveType(
  type: AvatarType | undefined,
  src: string | undefined,
  icon: string | undefined,
  imgError: boolean,
): AvatarType {
  if (type) {
    if (type === 'photo' && (imgError || !src)) return 'initials'
    if (type === 'icon' && !icon) return 'initials'
    return type
  }
  if (src && !imgError) return 'photo'
  if (icon) return 'icon'
  return 'initials'
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

function getColorFromName(name: string): AvatarBgColor {
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return BG_COLORS[hash % BG_COLORS.length]
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Avatar
 *
 * Exibe a identidade visual de um usuário em três modos:
 * - **photo**: imagem (src). Fallback silencioso para initials se a imagem falhar.
 * - **initials**: iniciais geradas do name. Cor de fundo determinística pelo name.
 * - **icon**: ícone Tabler (icon). Cor de fundo determinística ou via bgColor.
 *
 * O tipo é inferido automaticamente: src → icon → initials.
 *
 * @example
 * ```tsx
 * <Avatar name="João Silva" src="/avatar.jpg" size="md" />
 * <Avatar name="Ana Lima" size="lg" ring badge={{ status: 'online' }} />
 * <Avatar name="Bot" icon="robot" bgColor="accent" size="sm" />
 * ```
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      name,
      src,
      icon,
      type,
      size = 'md',
      bgColor,
      ring = false,
      badge,
      className,
      onClick,
      'aria-label': ariaLabel,
      style,
      ...props
    },
    ref,
  ) => {
    const [imgError, setImgError] = useState(false)

    const resolvedType = useMemo(
      () => resolveType(type, src, icon, imgError),
      [type, src, icon, imgError],
    )

    const resolvedBgColor = useMemo(
      () => bgColor ?? getColorFromName(name),
      [bgColor, name],
    )

    const { className: variantClassName } = useMemo(
      () => avatarVariants({ size }),
      [size],
    )

    const { bg: bgToken, fg: fgToken, iconFill } = bgColorTokens[resolvedBgColor]
    const colorClasses = bgColorClasses[resolvedBgColor]

    const containerStyle = useMemo((): React.CSSProperties => {
      const tokenFallback: React.CSSProperties = {}

      // Quando não houver utility de background, usa token como fallback.
      if (!colorClasses?.bg) {
        tokenFallback.background = bgToken
      }

      // Quando não houver utility de foreground, usa token como fallback.
      if (!colorClasses?.fg) {
        tokenFallback.color = fgToken
      }

      return {
        ...tokenFallback,
        ...style,
      }
    }, [bgToken, fgToken, colorClasses, style])

    const iconInfo  = iconSizeMap[size]
    const badgeSize = badgeSizeMap[size]
    const badgeOffset = badgeOffsetMap[size]

    const handleKeyDown = useMemo(() => {
      if (!onClick) return undefined
      return (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }
    }, [onClick])

    return (
      <div
        ref={ref}
        className={cn(
          variantClassName,
          initialsFont[size],
          colorClasses?.bg,
          colorClasses?.fg,
          ring && 'ring',
          onClick && 'interactive cursor-pointer',
          className,
        )}
        style={containerStyle}
        role={onClick ? 'button' : 'img'}
        aria-label={ariaLabel ?? name}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* ── Photo ── */}
        {resolvedType === 'photo' && src && (
          <img
            src={src}
            alt=""
            aria-hidden
            className="pos-absolute corner-pill"
            style={{ inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        )}

        {/* ── Initials ── */}
        {resolvedType === 'initials' && (
          <span aria-hidden style={{ userSelect: 'none' }}>
            {getInitials(name)}
          </span>
        )}

        {/* ── Icon ── */}
        {resolvedType === 'icon' && icon && (
          <Icon
            name={icon}
            size={iconInfo.size}
            fill={iconFill}
            className={iconInfo.className}
            decorative
          />
        )}

        {/* ── Badge ── */}
        {badge && (
          <Float
            placement="bottom-end"
            offset={badgeOffset}
            role="img"
            aria-label={`Status: ${badgeLabelMap[badge.status] ?? badge.status}`}
          >
            <Circle
              size={badgeSize}
              bg={badgeColorMap[badge.status]}
              outline="2px solid"
              outlineColor="var(--jf-color-bg-page, white)"
            />
          </Float>
        )}
      </div>
    )
  },
)

Avatar.displayName = 'Avatar'
