import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from '@jellyfish-ds/ui/spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Basic/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `

Indicador de carregamento construído com borda circular (estilo Chakra). Dois lados usam \`--spinner-track-color\` (transparente); os outros dois usam a cor da variante. Usa \`corner-circle\`, \`motion-spin\` e \`var(--jf-bd-width-3)\` dos tokens.

## Quando usar

- Estados de loading em botões, cards ou páginas
- Feedback visual de processamento (submit, refresh, carregamento de dados)

## Anatomia

- Círculo com borda sólida: dois lados transparentes (track), dois com a cor da variante
- Tamanhos iguais ao \`Icon\` (sm a g)
- \`role="status"\` e \`aria-label="Loading"\` para acessibilidade

## Variantes

| color | Token de borda |
|-------|----------------|
| \`brand-primary\` | \`--jf-color-bd-brand-primary\` |
| \`accent\` | \`--jf-color-bd-accent\` |
| \`neutral\` | \`--jf-color-bd-moderated\` |

## Composição

- \`as\`: elemento raiz (default \`span\`)
        `,
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['brand-primary', 'accent', 'neutral'],
      description: 'Cor do arco visível (borda).',
      table: {
        type: { summary: "'brand-primary' | 'accent' | 'neutral'" },
        defaultValue: { summary: 'brand-primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'g'],
      description: 'Tamanho (mesmo mapeamento do Icon).',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'g'" },
        defaultValue: { summary: 'md' },
      },
    },
    as: {
      control: false,
      description: 'Elemento raiz (span, div, etc.). Não exposto no Playground para evitar valor inválido.',
      table: { type: { summary: 'ElementType' }, defaultValue: { summary: 'span' } },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais.',
    },
  },
}

export default meta

type Story = StoryObj<typeof Spinner>

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    color: 'brand-primary',
    size: 'md',
  },
}

// ─── Colors ──────────────────────────────────────────────────────────────────

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <Spinner color="brand-primary" size="md" />
      <Spinner color="accent" size="md" />
      <Spinner color="neutral" size="md" />
    </div>
  ),
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
      <Spinner size="2xl" />
      <Spinner size="3xl" />
      <Spinner size="g" />
    </div>
  ),
}
