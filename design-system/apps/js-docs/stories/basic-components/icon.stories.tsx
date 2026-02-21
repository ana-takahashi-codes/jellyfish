import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '@jellyfish/ui/icon'

const meta: Meta<typeof Icon> = {
  title: 'Basic/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nome do ícone Tabler em kebab-case (ex.: bag, arrow-left, chevron-down).',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'g'],
      description: 'Tamanho; mapeado para token / utility class.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } },
    },
    fill: {
      control: 'select',
      options: [
        'muted',
        'moderated',
        'strong',
        'brand-primary',
        'accent',
        'neutral',
        'warning',
        'critical',
        'positive',
        'dataviz1',
        'dataviz2',
        'dataviz3',
        'dataviz4',
      ],
      description: 'Cor / preenchimento semântico.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'strong' } },
    },
    decorative: {
      control: 'boolean',
      description: 'Se true, o ícone é decorativo (aria-hidden). Se false, use ariaLabel para ícones interativos.',
      table: { defaultValue: { summary: 'true' } },
    },
    ariaLabel: {
      control: 'text',
      description: 'Rótulo acessível; obrigatório quando decorative é false (ex.: botão com ícone).',
    },
    onClick: {
      action: 'clicked',
      description: 'Torna o ícone interativo (aplica classe interactive).',
    },
  },
}

export default meta

type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'cheese',
    size: 'lg',
    fill: 'moderated',
    decorative: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <Icon name="check" size="xs" />
      <Icon name="check" size="sm" />
      <Icon name="check" size="md" />
      <Icon name="check" size="lg" />
      <Icon name="check" size="xl" />
      <Icon name="check" size="2xl" />
      <Icon name="check" size="3xl" />
      <Icon name="check" size="g" />
    </div>
  ),
}

export const Fills: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Icon name="heart" fill="muted" size="xl" />
      <Icon name="heart" fill="moderated" size="xl" />
      <Icon name="heart" fill="strong" size="xl" />
      <Icon name="heart" fill="brand-primary" size="xl" />
      <Icon name="heart" fill="accent" size="xl" />
      <Icon name="heart" fill="positive" size="xl" />
      <Icon name="heart" fill="warning" size="xl" />
      <Icon name="heart" fill="critical" size="xl" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Icon name="check" size="lg" decorative />
        <small>Decorativo (aria-hidden)</small>
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Icon
          name="trash"
          size="lg"
          fill="critical"
          onClick={() => {}}
          ariaLabel="Excluir"
          decorative={false}
        />
        <small>Interativo (com ariaLabel)</small>
      </span>
    </div>
  ),
}
