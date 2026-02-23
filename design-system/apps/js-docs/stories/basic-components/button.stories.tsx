import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@jellyfish/ui/button'

const meta: Meta<typeof Button> = {
  title: 'Basic/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Componente interativo para acionar ações, enviar formulários ou iniciar fluxos. Estende Control (size, fullWidth, radius); usa type="button" por padrão para evitar submit acidental.',
          '',
          '## Quando usar',
          '',
          '- Ações primárias ou secundárias em formulários e telas',
          '- Submissão de formulários (type="submit") ou reset (type="reset") quando explícito',
          '- Botões apenas com ícone (iconOnly) com aria-label obrigatório',
          '',
          '## Quando NÃO usar',
          '',
          '- Links de navegação (use <a> ou componente Link)',
          '- Quando precisar apenas de texto clicável sem aparência de botão',
          '',
          '## Anatomia',
          '',
          '- Base: interactive, cursor-pointer, justify-center, jf-button-font-label',
          '- Layout: controlVariants (d-inline-flex, items-center, height, gap, paddingInline, fullWidth, radius)',
          '- Visual: buttonVariants (variant x color: solid, outline, ghost x neutral, brand-primary, accent, critical)',
          '- iconOnly: width = height (altura do Control)',
          '- startIcon/endIcon: ao usar Icon, o fill é definido automaticamente para a mesma cor da label (variant x color)',
          '- solid/ghost: border: 0 para remover borda do user-agent',
          '',
          '## Acessibilidade',
          '',
          '- type="button" é o default; use type="submit" ou type="reset" apenas quando intencional',
          '- iconOnly exige aria-label (warning em dev se ausente)',
          '- Loading: aria-busy e label mantido visível',
          '- Navegação por teclado: Tab, Enter, Space (comportamento nativo de <button>)',
          '- Classe .interactive fornece focus-visible e estados hover/active',
          '',
          '## Design tokens',
          '',
          '| Token / classe | Uso |',
          '|----------------|-----|',
          '| --jf-control-height-sm/md/lg | Altura por size |',
          '| jf-button-font-label | Tipografia do label |',
          '| --jf-control-corner-radius | Raio (radius="default") |',
          '',
          '## Figma',
          '',
          '- [Variantes](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2040-5016)'
        ].join('\n')
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Tipo nativo do botão. Default "button" evita submit acidental.',
      table: { type: { summary: 'button | submit | reset' }, defaultValue: { summary: 'button' } }
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: 'Estilo visual.',
      table: { type: { summary: 'solid | outline | ghost' }, defaultValue: { summary: 'solid' } }
    },
    color: {
      control: 'select',
      options: ['neutral', 'brand-primary', 'accent', 'critical'],
      description: 'Cor semântica.',
      table: { type: { summary: 'neutral | brand-primary | accent | critical' }, defaultValue: { summary: 'brand-primary' } }
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Altura e padding (Control).',
      table: { type: { summary: 'sm | md | lg' }, defaultValue: { summary: 'md' } }
    },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa 100% da largura do container (Control).',
      table: { defaultValue: { summary: 'false' } }
    },
    radius: {
      control: 'select',
      options: ['none', 'default', 'pill'],
      description: 'Raio da borda (Control).',
      table: { type: { summary: 'none | default | pill' }, defaultValue: { summary: 'default' } }
    },
    iconOnly: {
      control: 'boolean',
      description: 'Apenas ícone; exige aria-label. Largura = altura do Control.',
      table: { defaultValue: { summary: 'false' } }
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento (aria-busy, motion-spin no ícone).',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o botão.',
      table: { defaultValue: { summary: 'false' } }
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais.'
    }
  }
}

export default meta

type Story = StoryObj<typeof Button>


export const Playground: Story = {
  args: {
    type: 'button',
    variant: 'solid',
    color: 'brand-primary',
    size: 'md',
    fullWidth: false,
    radius: 'default',
    iconOnly: false,
    loading: false,
    startIcon: 'plus',
    endIcon: 'arrow-right',
    disabled: false,
    children: 'Label'
  }
}

// ─── Variantes (variant × color) ────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="solid" color="neutral">Neutral</Button>
        <Button variant="solid" color="brand-primary">Brand</Button>
        <Button variant="solid" color="accent">Accent</Button>
        <Button variant="solid" color="critical">Critical</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="outline" color="neutral">Neutral</Button>
        <Button variant="outline" color="brand-primary">Brand</Button>
        <Button variant="outline" color="accent">Accent</Button>
        <Button variant="outline" color="critical">Critical</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="ghost" color="neutral">Neutral</Button>
        <Button variant="ghost" color="brand-primary">Brand</Button>
        <Button variant="ghost" color="accent">Accent</Button>
        <Button variant="ghost" color="critical">Critical</Button>
      </div>
    </div>
  )
}

// ─── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}

// ─── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button>Enabled</Button>
      <Button disabled>Disabled</Button>
      <Button loading startIcon="refresh">
        Loading
      </Button>
    </div>
  )
}

// ─── With startIcon / endIcon (Icon fill = label color) ──────────────────────────

export const WithStartIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button startIcon="plus">
        Add
      </Button>
      <Button variant="outline" startIcon="arrow-left">
        Back
      </Button>
    </div>
  )
}

export const WithEndIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button endIcon="arrow-right">
        Next
      </Button>
      <Button variant="ghost" color="critical" endIcon="trash">
        Remove
      </Button>
    </div>
  )
}

// ─── IconOnly ──────────────────────────────────────────────────────────────────

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button iconOnly startIcon="plus" aria-label="Add" />
      <Button iconOnly variant="outline" startIcon="pencil" aria-label="Edit" />
      <Button iconOnly variant="ghost" startIcon="trash" aria-label="Delete" />
    </div>
  )
}

// ─── FullWidth & Radius ────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Button fullWidth>Full width</Button>
    </div>
  )
}

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button radius="none">None</Button>
      <Button radius="default">Default</Button>
      <Button radius="pill">Pill</Button>
    </div>
  )
}

// ─── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p>iconOnly com aria-label (obrigatório):</p>
      <Button iconOnly startIcon="plus" aria-label="Add item" />
      <p>type=submit em form (label claro):</p>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
        <input type="text" placeholder="Name" aria-label="Name" />
        <Button type="submit">Save</Button>
      </form>
      <p>aria-expanded para menu/dropdown:</p>
      <Button aria-expanded={false} aria-haspopup="menu" aria-controls="menu-id">
        Open menu
      </Button>
    </div>
  )
}
