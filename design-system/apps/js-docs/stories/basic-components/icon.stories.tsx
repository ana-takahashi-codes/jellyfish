import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '@jellyfish/ui/icon'

const meta: Meta<typeof Icon> = {
  title: 'Basic/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Icon is a visual component used to represent actions, states, or concepts. It uses the Tabler Icons library with design token-based size and fill.',
      },
    },
  },
  argTypes: {
    name: { control: 'text', description: 'Tabler icon name (e.g. bag, arrow-left)' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'g'],
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
    },
    decorative: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof Icon>

export const Playground: Story = {
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

export const Interactive: Story = {
  render: () => (
    <Icon
      name="trash"
      size="lg"
      fill="critical"
      onClick={() => alert('Clicked')}
      ariaLabel="Delete"
      decorative={false}
    />
  ),
}
