import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@jellyfish/ui/button'

const meta: Meta<typeof Button> = {
  title: 'Basic/Button',
  component: Button,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  name: 'Primary',
  args: {
    children: 'Hello',
    type: 'button',
    style: {
      color: 'blue',
      border: '1px solid gray',
      padding: 10,
      borderRadius: 10,
    },
  },
}

