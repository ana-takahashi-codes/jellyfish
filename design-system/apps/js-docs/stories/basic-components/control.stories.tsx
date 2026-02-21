import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Control, controlInnerStyles } from '@jellyfish/ui/control'
import { Icon } from '@jellyfish/ui/icon'

/** Botão interno estilizado para demo; usa `interactive` e `controlInnerStyles` (gap, paddingInline) para refletir o layout real do control. */
function DemoButton ({ children }: { children?: Parameters<typeof Control>[0]['children'] }) {
  return (
    <button
      type="button"
      className="interactive bd-muted bg-surface-default fg-strong font-label-sm"
      style={{
        border: '1px solid var(--jf-color-bd-muted, #ccc)',
        borderRadius: 'inherit',
        width: '100%',
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: 'inherit',
        ...controlInnerStyles,
      }}
    >
      {children}
    </button>
  )
}

const meta: Meta<typeof Control> = {
  title: 'Basic/Control',
  component: Control,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Altura e largura mínima.',
      table: { type: { summary: 'sm | md | lg' }, defaultValue: { summary: 'md' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Faz o control ocupar 100% da largura do container.',
      table: { defaultValue: { summary: 'false' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'default', 'pill'],
      description: 'Raio da borda.',
      table: { type: { summary: 'none | default | pill' }, defaultValue: { summary: 'default' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o control e aplica estilo de disabled.',
      table: { defaultValue: { summary: 'false' } },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais para o wrapper.',
    },
  },
}

export default meta

type Story = StoryObj<typeof Control>

export const Default: Story = {
  args: {
    size: 'md',
    fullWidth: false,
    radius: 'default',
    disabled: false,
  },
  render: (args) => (
    <Control {...args}>
      <DemoButton>Label</DemoButton>
    </Control>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Control size="sm">
        <DemoButton>Small</DemoButton>
      </Control>
      <Control size="md">
        <DemoButton>Medium</DemoButton>
      </Control>
      <Control size="lg">
        <DemoButton>Large</DemoButton>
      </Control>
    </div>
  ),
}

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Control radius="none">
        <DemoButton>None</DemoButton>
      </Control>
      <Control radius="default">
        <DemoButton>Default</DemoButton>
      </Control>
      <Control radius="pill">
        <DemoButton>Pill</DemoButton>
      </Control>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Control size="md">
        <DemoButton>
          <Icon name="plus" size="sm" />
          Label
        </DemoButton>
      </Control>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Control>
        <DemoButton>Enabled</DemoButton>
      </Control>
      <Control disabled>
        <DemoButton>Disabled</DemoButton>
      </Control>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Control fullWidth>
        <DemoButton>Full width</DemoButton>
      </Control>
    </div>
  ),
}
