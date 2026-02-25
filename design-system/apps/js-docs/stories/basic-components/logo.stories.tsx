import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from '@jellyfish-ds/ui/logo'

const meta: Meta<typeof Logo> = {
  title: 'Basic/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Logo

Componente de logo multi-brand do design system. Suporta as marcas **JellyFish** e **Decoded** com controle de variante e tamanho via tokens.

## Quando usar

- Cabeçalhos, navbars e splash screens que precisam exibir a identidade visual.
- Contextos multi-brand onde a mesma interface pode carregar a marca JellyFish ou Decoded.

## Quando NÃO usar

- Ícones decorativos sem relação com marca → use \`<Icon>\`.
- Imagens de produto ou ilustrações → use \`<img>\` diretamente.

## Anatomia

- **Wrapper \`<span>\`**: recebe \`role="img"\` e \`aria-label\` com o nome da marca; altura controlada por utility class de token (\`h-{N}\`).
- **SVG inline**: escala via \`height="100%" width="auto"\` e \`viewBox\`, preservando aspect ratio sem media queries.

## Regras de variante por brand

| brand | variant disponível |
|-------|--------------------|
| \`jellyfish\` | \`default\` (ícone + wordmark) · \`compact\` (somente ícone) |
| \`decoded\` | \`compact\` (somente ícone) |

## Acessibilidade

- O \`<span>\` wrapper possui \`role="img"\` e \`aria-label\` com o nome da marca.
- O SVG interno tem \`aria-hidden="true"\` para evitar leitura duplicada.

## Figma

- [Componente](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2202-1945)
        `,
      },
    },
  },
  argTypes: {
    brand: {
      control: 'select',
      options: ['jellyfish', 'decoded'],
      description: 'Marca a ser exibida.',
      table: {
        type: { summary: "'jellyfish' | 'decoded'" },
        defaultValue: { summary: 'jellyfish' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description:
        'Variante do logo. `default` = ícone + wordmark (somente jellyfish). `compact` = somente ícone.',
      table: {
        type: { summary: "'default' | 'compact'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Altura do logo mapeada para token (xs=32px, sm=48px, md=64px, lg=80px). Width é auto.',
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    colorScheme: {
      control: 'select',
      options: ['light', 'dark'],
      description:
        'Versão de cor para o contexto de fundo. `light` = texto/ícone escuro (fundo claro). `dark` = texto/ícone branco (fundo escuro). O ícone jellyfish compact é roxo em ambos.',
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: 'light' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais.',
    },
  },
}

export default meta

type Story = StoryObj<typeof Logo>

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    brand: 'jellyfish',
    variant: 'default',
    size: 'md',
    colorScheme: 'light',
  },
}

// ─── Brands ────────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = { fontFamily: 'sans-serif', fontSize: 11 }

export const Brands: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* Light */}
      <div style={{ padding: 32, background: '#ffffff', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <small style={{ ...labelStyle, color: '#888' }}>colorScheme="light"</small>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <small style={{ ...labelStyle, color: '#aaa' }}>jellyfish — default</small>
          <Logo brand="jellyfish" variant="default" size="md" colorScheme="light" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <small style={{ ...labelStyle, color: '#aaa' }}>jellyfish — compact</small>
          <Logo brand="jellyfish" variant="compact" size="md" colorScheme="light" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <small style={{ ...labelStyle, color: '#aaa' }}>decoded — compact</small>
          <Logo brand="decoded" size="md" colorScheme="light" />
        </div>
      </div>
      {/* Dark */}
      <div style={{ padding: 32, background: '#18181B', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <small style={{ ...labelStyle, color: '#666' }}>colorScheme="dark"</small>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <small style={{ ...labelStyle, color: '#555' }}>jellyfish — default</small>
          <Logo brand="jellyfish" variant="default" size="md" colorScheme="dark" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <small style={{ ...labelStyle, color: '#555' }}>jellyfish — compact</small>
          <Logo brand="jellyfish" variant="compact" size="md" colorScheme="dark" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <small style={{ ...labelStyle, color: '#555' }}>decoded — compact</small>
          <Logo brand="decoded" size="md" colorScheme="dark" />
        </div>
      </div>
    </div>
  ),
}

// ─── Color Schemes ─────────────────────────────────────────────────────────────

export const ColorSchemes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* Light */}
      <div style={{ padding: 32, background: '#ffffff', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
        <small style={{ color: '#888', fontFamily: 'sans-serif' }}>colorScheme="light"</small>
        <Logo brand="jellyfish" variant="default" size="sm" colorScheme="light" />
        <Logo brand="jellyfish" variant="compact" size="sm" colorScheme="light" />
        <Logo brand="decoded" size="sm" colorScheme="light" />
      </div>
      {/* Dark */}
      <div style={{ padding: 32, background: '#18181B', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
        <small style={{ color: '#666', fontFamily: 'sans-serif' }}>colorScheme="dark"</small>
        <Logo brand="jellyfish" variant="default" size="sm" colorScheme="dark" />
        <Logo brand="jellyfish" variant="compact" size="sm" colorScheme="dark" />
        <Logo brand="decoded" size="sm" colorScheme="dark" />
      </div>
    </div>
  ),
}

// ─── Sizes ─────────────────────────────────────────────────────────────────────

export const SizesJellyfish: Story = {
  name: 'Sizes — Jellyfish Default',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
      <Logo brand="jellyfish" variant="default" size="xs" />
      <Logo brand="jellyfish" variant="default" size="sm" />
      <Logo brand="jellyfish" variant="default" size="md" />
      <Logo brand="jellyfish" variant="default" size="lg" />
    </div>
  ),
}

export const SizesJellyfishCompact: Story = {
  name: 'Sizes — Jellyfish Compact',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
      <Logo brand="jellyfish" variant="compact" size="xs" />
      <Logo brand="jellyfish" variant="compact" size="sm" />
      <Logo brand="jellyfish" variant="compact" size="md" />
      <Logo brand="jellyfish" variant="compact" size="lg" />
    </div>
  ),
}

export const SizesDecoded: Story = {
  name: 'Sizes — Decoded',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
      <Logo brand="decoded" size="xs" />
      <Logo brand="decoded" size="sm" />
      <Logo brand="decoded" size="md" />
      <Logo brand="decoded" size="lg" />
    </div>
  ),
}
