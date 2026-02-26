import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from '@jellyfish-ds/ui/text-field'

const meta: Meta<typeof TextField> = {
  title: 'Basic/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `

Campo de texto de linha única construído sobre o layout do Control. Suporta ícones, prefixo/sufixo, botão de limpeza e contagem de caracteres. Integra-se com \`FormControl\` via contexto para label, hint, erro e estado de validação.

## Quando usar

- Campos de texto, email, senha, busca
- Qualquer entrada de texto de linha única em formulários

## Quando NÃO usar

- Entrada de múltiplas linhas → use \`TextArea\`
- Seleção de opções → use \`Select\`

## Anatomia

- **Wrapper \`<span>\`**: Control layout (height, padding, gap, radius, bg, border)
- **\`<input>\`**: elemento nativo com \`flex: 1\`; recebe a \`ref\` forwarded
- **startIcon / endIcon**: \`<Icon size="md">\` decorativos
- **prefix / suffix**: texto decorativo (e.g. "$", "%")
- **clear button**: \`<Icon name="x">\` interativo quando \`clearable\` e campo preenchido
- **char count**: exibido abaixo do wrapper quando \`showCharCount + maxLength\`

## Variantes

| variant | Aparência |
|---------|-----------|
| \`default\` | borda + radius (default do Control) |
| \`ghost\` | fundo plano, sem borda, sem radius |

## Com FormControl

\`FormControl\` fornece label, hint e mensagem de erro via contexto React. As três opções de label são:

| labelType | Comportamento |
|-----------|---------------|
| \`top\` | label acima do campo (padrão) |
| \`float\` | label animada que flutua ao focar/preencher |
| \`inline\` | label e campo lado a lado |

## Acessibilidade

- \`id\` em FormControl conecta \`<label htmlFor>\` ao \`<input id>\`
- \`isRequired\` → \`aria-required\` + asterisco visual
- \`isInvalid\` → \`aria-invalid\` + \`role="alert"\` na mensagem de erro
- hint e error são ligados via \`aria-describedby\`
- Clear button tem \`ariaLabel\` e \`role="button"\`
- Char count usa \`aria-live="polite"\`

## Figma

- [Componente](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2105-1089)
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost'],
      description: 'Estilo visual do campo.',
      table: { type: { summary: "'default' | 'ghost'" }, defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Altura do Control.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa 100% da largura.',
      table: { defaultValue: { summary: 'false' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'default', 'pill'],
      description: 'Raio da borda (ignorado em ghost).',
      table: { type: { summary: "'none' | 'default' | 'pill'" }, defaultValue: { summary: 'default' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo.',
      table: { defaultValue: { summary: 'false' } },
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder do input.',
    },
    startIcon: {
      control: 'text',
      description: 'Nome de ícone Tabler no início do campo.',
    },
    endIcon: {
      control: 'text',
      description: 'Nome de ícone Tabler no fim do campo.',
    },
    prefix: {
      control: 'text',
      description: 'Texto antes do input (ex: "$").',
    },
    suffix: {
      control: 'text',
      description: 'Texto depois do input (ex: "%").',
    },
    clearable: {
      control: 'boolean',
      description: 'Exibe botão × para limpar o campo quando há conteúdo.',
      table: { defaultValue: { summary: 'false' } },
    },
    showCharCount: {
      control: 'boolean',
      description: 'Exibe contagem de caracteres (requer maxLength).',
      table: { defaultValue: { summary: 'false' } },
    },
    maxLength: {
      control: 'number',
      description: 'Limite máximo de caracteres.',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais.',
    },
  },
}

export default meta

type Story = StoryObj<typeof TextField>

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    placeholder: 'Placeholder…',
    fullWidth: false,
    radius: 'default',
    disabled: false,
    clearable: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}

// ─── Variants ────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <TextField variant="default" placeholder="default — border + radius" />
      <TextField variant="ghost" placeholder="ghost — flat, no border" />
    </div>
  ),
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <TextField size="sm" placeholder="size=sm (36px)" />
      <TextField size="md" placeholder="size=md (44px)" />
      <TextField size="lg" placeholder="size=lg (48px)" />
    </div>
  ),
}

// ─── Icons ───────────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <TextField startIcon="search" placeholder="Search…" />
      <TextField endIcon="calendar" placeholder="Select date…" />
      <TextField startIcon="user" endIcon="chevron-down" placeholder="Select user…" />
      <TextField startIcon="lock" type="password" placeholder="Password" />
    </div>
  ),
}

// ─── Prefix / Suffix ─────────────────────────────────────────────────────────

export const PrefixSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
      <TextField prefix="$" placeholder="0.00" />
      <TextField suffix="%" placeholder="Tax rate" />
      <TextField prefix="+55" placeholder="(11) 99999-9999" />
      <TextField prefix="https://" suffix=".com" placeholder="yoursite" />
    </div>
  ),
}

// ─── Clearable ───────────────────────────────────────────────────────────────

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState('Type something to see the clear button')
    return (
      <div style={{ width: 360 }}>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
          startIcon="search"
          placeholder="Search…"
        />
      </div>
    )
  },
}

// ─── Char count ──────────────────────────────────────────────────────────────

export const CharCount: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: 320 }}>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={100}
          showCharCount
          placeholder="Max 100 characters…"
        />
      </div>
    )
  },
}

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <TextField placeholder="enabled (default)" />
      <TextField disabled placeholder="disabled" defaultValue="Disabled value" />
    </div>
  ),
}

// ─── Full width ───────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <TextField fullWidth placeholder="Full width field…" startIcon="search" clearable />
    </div>
  ),
}

// Stories de integração com FormControl serão adicionadas em um arquivo próprio
// quando o componente FormControl estiver definido.
