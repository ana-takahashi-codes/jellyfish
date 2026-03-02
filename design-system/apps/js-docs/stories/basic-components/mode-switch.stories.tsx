import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@jellyfish-ds/ui/theme'
import { ModeSwitch } from '@jellyfish-ds/ui/mode-switch'

const meta: Meta<typeof ModeSwitch> = {
  title: 'Basic/ModeSwitch',
  component: ModeSwitch,
  decorators: [
    (Story) => (
      <ThemeProvider defaultMode="light" storageKey="storybook-mode-switch">
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Botão toggle para alternar entre tema claro e escuro. Baseado em Control (size, radius).',
          'Requer ThemeProvider; usa useTheme() para setMode entre light e dark.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['none', 'default', 'pill'],
    },
  },
}

export default meta

type Story = StoryObj<typeof ModeSwitch>

export const Playground: Story = {
  args: {
    size: 'md',
    radius: 'default',
    'aria-label': 'Alternar tema claro ou escuro',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="d-flex items-center gap-12">
      <ModeSwitch size="sm" aria-label="Tema (small)" />
      <ModeSwitch size="md" aria-label="Tema (medium)" />
      <ModeSwitch size="lg" aria-label="Tema (large)" />
    </div>
  ),
}
