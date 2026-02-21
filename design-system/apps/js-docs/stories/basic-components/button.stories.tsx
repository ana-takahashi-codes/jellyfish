import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@jellyfish/ui/button'

const meta: Meta<typeof Button> = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `

Botão de ação baseado no Control. Usa a classe \`interactive\` de \`utilities.css\` para focus visível, hover e active. Min-width: quando \`iconOnly\`, usa o min-width do Control (quadrado); quando não, usa \`w-min-40\`.

## Quando usar

- Ações principais (submit, confirmar, salvar).
- Ações secundárias (cancelar, voltar) com variant outline ou ghost e color adequada.
- Botão apenas ícone (iconOnly) para toolbars e ações compactas.

## Quando NÃO usar

- Navegação entre páginas → use link (\`<a>\`) ou componente de navegação.
- Ações destrutivas sem confirmação → considere confirmação ou variante crítica.

## Anatomia

- **Control (wrapper)**: altura, fullWidth, radius, disabled (Button herda as props do Control).
- **Botão (elemento nativo)**: \`variant\` (solid | outline | ghost) + \`color\` (neutral | brand-primary | accent | critical), estados via \`.interactive\`, min-width (w-min-40 ou Control quando iconOnly).
- **startIcon / endIcon**: componentes Icon (nome configurável); tamanho e cor controlados pelo Button. No loading, startIcon recebe \`.motion-spin\` e o botão mantém a mesma largura.

## Acessibilidade

- Elemento nativo \`<button>\` com \`type\`, \`disabled\`, \`aria-disabled\`.
- Foco visível via \`.interactive:focus-visible\` em \`utilities.css\`.
- Navegação por teclado (Tab, Enter, Space) nativa.

## Design tokens

| Token | Uso |
|-------|-----|
| \`--jf-control-height-*\` | Altura (sm/md/lg) |
| \`--jf-control-min-width-*\` | Min-width quando iconOnly |
| \`--jf-control-corner-radius\` | Raio default |
| \`--jf-control-gap\`, \`--jf-control-horizontal-padding-default\` | Gap e padding interno |
| \`--jf-control-color-bd-focus\` | Outline de focus (interactive) |
| \`--jf-color-bg-*\`, \`--jf-color-fg-on-*\` | Solid: bg + fg por color |
| \`--jf-color-bd-*\`, \`--jf-color-fg-*\` | Outline/Ghost: borda e texto por color |

## Figma

- [API (estrutura principal)](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2036-683)
- [Variantes](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2040-5016)
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: 'Estilo visual (Figma).',
      table: { type: { summary: 'solid | outline | ghost' }, defaultValue: { summary: 'solid' } },
    },
    color: {
      control: 'select',
      options: ['neutral', 'brand-primary', 'accent', 'critical'],
      description: 'Cor semântica (Figma).',
      table: { type: { summary: 'neutral | brand-primary | accent | critical' }, defaultValue: { summary: 'brand-primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Altura e padding (tokens do Control).',
      table: { type: { summary: 'sm | md | lg' }, defaultValue: { summary: 'md' } },
    },
    iconOnly: {
      control: 'boolean',
      description: 'Quando true, botão quadrado com min-width do Control; quando false, min-width w-min-40.',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa 100% da largura do container.',
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
      description: 'Desabilita o botão.',
      table: { defaultValue: { summary: 'false' } },
    },
    startIcon: {
      control: 'text',
      description: 'Nome do ícone (Tabler) antes do label. Tamanho/cor controlados pelo Button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'cheese' } },
    },
    endIcon: {
      control: 'text',
      description: 'Nome do ícone (Tabler) depois do label. Tamanho/cor controlados pelo Button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'cheese' } },
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento: opacidade no botão e .motion-spin no startIcon; largura mantida.',
      table: { defaultValue: { summary: 'false' } },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais no wrapper (Control).',
    },
  },
}

export default meta

type Story = StoryObj<typeof Button>

const defaultIconOptions = ['cheese', 'plus', 'arrow-left', 'settings', 'loader-2', ''] as const

export const Playground: Story = {
  args: {
    variant: 'solid',
    color: 'brand-primary',
    size: 'md',
    iconOnly: false,
    fullWidth: false,
    radius: 'default',
    disabled: false,
    startIcon: 'cheese',
    endIcon: 'chevron-down',
    loading: false,
  },
  argTypes: {
    startIcon: { control: 'select', options: [...defaultIconOptions] },
    endIcon: { control: 'select', options: [...defaultIconOptions] },
  },
  render: (args) => <Button {...args}>Button</Button>,
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="solid" color="accent">Solid accent</Button>
      <Button variant="outline" color="neutral">Outline neutral</Button>
      <Button variant="ghost" color="brand-primary">Ghost brand-primary</Button>
    </div>
  ),
}

export const VariantColorMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['solid', 'outline', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['neutral', 'brand-primary', 'accent', 'critical'] as const).map((color) => (
            <Button key={color} variant={variant} color={color} startIcon="cheese">
              Button
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button radius="none">None</Button>
      <Button radius="default">Default</Button>
      <Button radius="pill">Pill</Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button>Enabled</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button iconOnly variant="solid" color="brand-primary" size="sm" startIcon="plus" aria-label="Add" />
      <Button iconOnly variant="solid" color="brand-primary" size="md" startIcon="plus" aria-label="Add" />
      <Button iconOnly variant="outline" color="neutral" size="md" startIcon="settings" aria-label="Settings" />
    </div>
  ),
}

export const WithStartEndIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="solid" color="accent" startIcon="plus" endIcon="chevron-right">
        Add item
      </Button>
      <Button variant="outline" color="neutral" startIcon="arrow-left">
        Back
      </Button>
      <Button variant="ghost" color="brand-primary" endIcon="cheese">
        With cheese
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button loading >
        Loading
      </Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Button fullWidth>Full width</Button>
    </div>
  ),
}
