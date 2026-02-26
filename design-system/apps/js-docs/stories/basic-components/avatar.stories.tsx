import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '@jellyfish-ds/ui/avatar'
import type { AvatarBgColor, AvatarSize } from '@jellyfish-ds/ui/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Basic/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Exibe a identidade visual de um usuário em três modos: **foto**, **iniciais** e **ícone**.

## Quando usar

- Identificar um usuário em listas, comentários, chats, tabelas ou cabeçalhos de perfil.
- Indicar presença/status com o badge.
- Agrupar múltiplos usuários em um avatar stack.

## Quando NÃO usar

- Para imagens decorativas genéricas — use \`<img>\` diretamente.
- Para logotipos de produtos — use \`<Logo>\`.

## Tipo inferido automaticamente

| Condição | Tipo ativo |
|----------|-----------|
| \`src\` fornecido e sem erro de carregamento | \`photo\` |
| \`src\` falha ao carregar | Fallback silencioso para \`initials\` |
| \`icon\` fornecido (sem src) | \`icon\` |
| Nenhum dos anteriores | \`initials\` |

## Cor determinística

Para \`initials\` e \`icon\` sem \`bgColor\` explícito, a cor é gerada via hash simples do \`name\`.
O mesmo nome sempre produz a mesma cor, em qualquer contexto (lista, header, chat).

## Composição de Badge

O badge de status usa \`<Float>\` + \`<Circle>\`. Está sempre em \`placement="bottom-end"\`.

## Acessibilidade

- Usa \`role="img"\` com \`aria-label\` (fallback para \`name\`).
- Quando clicável (\`onClick\`): \`role="button"\`, \`tabIndex={0}\`, suporte a Enter/Space.
- Badge tem \`role="img"\` e \`aria-label\` descritivo.

## Figma

- [Avatar — Variantes](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2234-2082)
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Sempre obrigatório. Gera iniciais e seed de cor.',
    },
    src: {
      control: 'text',
      description: 'URL da imagem. Activa type="photo".',
    },
    icon: {
      control: 'text',
      description: 'Nome do ícone Tabler. Activa type="icon".',
    },
    type: {
      control: 'select',
      options: ['photo', 'initials', 'icon'],
      description: 'Forçar tipo. Normalmente inferido automaticamente.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies AvatarSize[],
      description: 'Tamanho: xs=32px, sm=44px, md=64px, lg=80px, xl=112px.',
      table: { defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded'],
      description: 'Forma do avatar.',
      table: { defaultValue: { summary: 'circle' } },
    },
    bgColor: {
      control: 'select',
      options: ['brand-primary', 'accent', 'neutral', 'dataviz1', 'dataviz2', 'dataviz3', 'dataviz4'] satisfies AvatarBgColor[],
      description: 'Cor de fundo para initials/icon. Default: determinística pelo name.',
    },
    ring: {
      control: 'boolean',
      description: 'Exibe anel ao redor do avatar.',
      table: { defaultValue: { summary: 'false' } },
    },
    ringColor: {
      control: 'text',
      description: 'Cor do anel (ex.: "accent"). Mapeia para var(--jf-color-{ringColor}-500).',
    },
    badge: {
      control: 'object',
      description: 'Badge de status: { status: "online" | "offline" | "busy" | "away" }.',
    },
    onClick: {
      action: 'clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    name: 'Ana Lima',
    size: 'md',
    shape: 'circle',
    ring: false,
  },
}

// ─── Photo ─────────────────────────────────────────────────────────────────────

export const Photo: Story = {
  args: {
    name: 'João Silva',
    src: 'https://i.pravatar.cc/150?img=3',
    size: 'md',
  },
}

// ─── Iniciais ──────────────────────────────────────────────────────────────────

export const Initials: Story = {
  render: () => {
    const BG_COLORS: AvatarBgColor[] = [
      'brand-primary', 'accent', 'neutral',
      'dataviz1', 'dataviz2', 'dataviz3', 'dataviz4',
    ]
    return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {BG_COLORS.map((color) => (
          <div
            key={color}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <Avatar name="AA" bgColor={color} size="md" />
            <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>{color}</span>
          </div>
        ))}
      </div>
    )
  },
}

// ─── Ícone ─────────────────────────────────────────────────────────────────────

export const Icon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Avatar name="Bot"     icon="robot"    bgColor="brand-primary" size="md" />
      <Avatar name="Suporte" icon="headset"  bgColor="accent"        size="md" />
      <Avatar name="Admin"   icon="shield"   bgColor="neutral"       size="md" />
      <Avatar name="Dev"     icon="terminal" bgColor="dataviz1"      size="md" />
    </div>
  ),
}

// ─── Tamanhos ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {SIZES.map((size) => (
          <div
            key={size}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <Avatar
              name="Ana Lima"
              src="https://i.pravatar.cc/150?img=5"
              size={size}
            />
            <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>{size}</span>
          </div>
        ))}
      </div>
    )
  },
}

export const SizesInitials: Story = {
  name: 'Sizes — Iniciais',
  render: () => {
    const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {SIZES.map((size) => (
          <div
            key={size}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <Avatar name="Ana Lima" size={size} bgColor="brand-primary" />
            <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>{size}</span>
          </div>
        ))}
      </div>
    )
  },
}

// ─── Com Ring ──────────────────────────────────────────────────────────────────

export const WithRing: Story = {
  name: 'Com Ring',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar name="Ana Lima" src="https://i.pravatar.cc/150?img=5" size="md" ring />
        <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>default</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar name="Ana Lima" size="md" bgColor="brand-primary" ring ringColor="accent" />
        <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>ringColor="accent"</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar name="Ana Lima" size="md" bgColor="accent" ring ringColor="brand-primary" />
        <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>ringColor="brand-primary"</span>
      </div>
    </div>
  ),
}

// ─── Com Badge ────────────────────────────────────────────────────────────────

export const WithBadge: Story = {
  name: 'Com Badge',
  render: () => {
    const statuses = ['online', 'busy', 'away', 'offline'] as const
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        {statuses.map((status) => (
          <div
            key={status}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <Avatar
              name="Ana Lima"
              src="https://i.pravatar.cc/150?img=5"
              size="md"
              badge={{ status }}
            />
            <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>{status}</span>
          </div>
        ))}
      </div>
    )
  },
}

// ─── Ring + Badge ─────────────────────────────────────────────────────────────

export const WithRingAndBadge: Story = {
  name: 'Ring + Badge',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as AvatarSize[]).map((size) => (
        <Avatar
          key={size}
          name="Ana Lima"
          src="https://i.pravatar.cc/150?img=5"
          size={size}
          ring
          badge={{ status: 'online' }}
        />
      ))}
    </div>
  ),
}

// ─── Fallback de imagem ────────────────────────────────────────────────────────

export const FallbackPhoto: Story = {
  name: 'Fallback — Imagem Quebrada',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar name="Ana Lima" src="https://i.pravatar.cc/150?img=5" size="md" />
        <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>src válido</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar name="Ana Lima" src="https://url-quebrada.invalid/foto.jpg" size="md" />
        <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>src inválido → iniciais</span>
      </div>
    </div>
  ),
}

// ─── Cores Determinísticas ────────────────────────────────────────────────────

export const DeterministicColors: Story = {
  name: 'Cores Determinísticas',
  render: () => {
    const users = [
      'Ana Lima', 'Bruno Costa', 'Carla Mendes', 'Diego Rocha',
      'Elena Ferreira', 'Felipe Souza', 'Gabriela Nunes', 'Hélio Martins',
    ]
    return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {users.map((name) => (
          <div
            key={name}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <Avatar name={name} size="md" />
            <span style={{ fontSize: 10, color: 'var(--jf-color-fg-muted)', textAlign: 'center', maxWidth: 72 }}>
              {name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    )
  },
}

// ─── Shape Rounded ────────────────────────────────────────────────────────────

export const ShapeRounded: Story = {
  name: 'Shape — Rounded',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Avatar name="Ana Lima" src="https://i.pravatar.cc/150?img=5" size="md" shape="rounded" />
      <Avatar name="Ana Lima" size="md" shape="rounded" bgColor="brand-primary" />
      <Avatar name="Bot" icon="robot" size="md" shape="rounded" bgColor="accent" />
    </div>
  ),
}

// ─── Clicável ────────────────────────────────────────────────────────────────

export const Clickable: Story = {
  name: 'Clicável',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar
        name="Ana Lima"
        src="https://i.pravatar.cc/150?img=5"
        size="md"
        onClick={() => alert('Avatar clicado!')}
        aria-label="Ver perfil de Ana Lima"
      />
      <Avatar
        name="Bot"
        icon="robot"
        bgColor="accent"
        size="md"
        onClick={() => alert('Avatar clicado!')}
        aria-label="Ver perfil do Bot"
      />
    </div>
  ),
}

// ─── Stack de Avatars ─────────────────────────────────────────────────────────

export const AvatarStack: Story = {
  name: 'Avatar Stack',
  render: () => {
    const users = [
      { name: 'Ana Lima',     src: 'https://i.pravatar.cc/150?img=5' },
      { name: 'Bruno Costa',  src: 'https://i.pravatar.cc/150?img=3' },
      { name: 'Carla Mendes', src: 'https://i.pravatar.cc/150?img=7' },
      { name: 'Diego Rocha' },
      { name: 'Elena Ferreira' },
    ]
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {users.map((user, i) => (
          <Avatar
            key={user.name}
            name={user.name}
            src={user.src}
            size="sm"
            ring
            style={{ marginLeft: i === 0 ? 0 : -8, zIndex: users.length - i }}
            aria-label={user.name}
          />
        ))}
        <span style={{ marginLeft: 8, fontSize: 'var(--jf-font-size-sm)', color: 'var(--jf-color-fg-muted)' }}>
          Ana, Bruno e +3
        </span>
      </div>
    )
  },
}
