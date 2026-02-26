import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextArea } from '@jellyfish-ds/ui/text-area'

const meta: Meta<typeof TextArea> = {
  title: 'Basic/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `

Campo de texto de múltiplas linhas construído sobre o layout do Control. Reaproveita os mesmos estilos visuais do TextField (\`variant="default" | "ghost"\`), mas com suporte a auto-resize, limite de linhas e contador de caracteres.

## Quando usar

- Mensagens longas (comentários, descrições, observações)
- Campos de feedback, bio, anotações

## Quando NÃO usar

- Entrada de linha única → use \`TextField\`
- Seleção de opções → use \`Select\`

## Anatomia

- **Wrapper \`<span>\`**: Control layout (height dinâmico, padding, gap, radius, bg, border)
- **\`<textarea>\`**: elemento nativo com \`flex: 1\`; recebe a \`ref\` forwarded
- **Contador de caracteres**: exibido abaixo do wrapper, alinhado à direita, quando \`showCharCount + maxLength\`

## Variantes

| variant | Aparência |
|---------|-----------|
| \`default\` | borda + radius (default do Control) |
| \`ghost\` | fundo plano, sem borda; em foco mostra apenas borda inferior |

## Acessibilidade

- \`id\` conecta \`<label htmlFor>\` ao \`<textarea id>\` quando usado com um label externo
- Atributos como \`aria-invalid\`, \`aria-required\` e \`aria-describedby\` podem ser passados diretamente nas props
- O contador usa \`aria-live="polite"\` para anunciar o número de caracteres ao leitor de tela

## Figma

- [Componente](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2122-2055)
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
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa 100% da largura.',
      table: { defaultValue: { summary: 'false' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'default', 'pill'],
      description: 'Raio da borda.',
      table: { type: { summary: "'none' | 'default' | 'pill'" }, defaultValue: { summary: 'default' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo.',
      table: { defaultValue: { summary: 'false' } },
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder do textarea.',
    },
    rows: {
      control: 'number',
      description: 'Número de linhas visíveis (quando resize ≠ "auto").',
      table: { defaultValue: { summary: 3 } },
    },
    minRows: {
      control: 'number',
      description: 'Número mínimo de linhas (quando resize = "auto").',
    },
    maxRows: {
      control: 'number',
      description: 'Número máximo de linhas (quando resize = "auto").',
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'both', 'auto'],
      description: 'Comportamento de resize do textarea.',
      table: { type: { summary: "'none' | 'vertical' | 'both' | 'auto'" }, defaultValue: { summary: 'vertical' } },
    },
    maxLength: {
      control: 'number',
      description: 'Limite máximo de caracteres.',
    },
    showCharCount: {
      control: 'boolean',
      description: 'Exibe contagem de caracteres (requer maxLength).',
      table: { defaultValue: { summary: 'false' } },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais.',
    },
  },
}

export default meta

type Story = StoryObj<typeof TextArea>

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'default',
    placeholder: 'Escreva sua mensagem…',
    fullWidth: false,
    radius: 'default',
    disabled: false,
    rows: 3,
    resize: 'vertical',
    showCharCount: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
}

// ─── Variants ────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
      <TextArea variant="default" placeholder="default — border + radius" rows={3} />
      <TextArea variant="ghost" placeholder="ghost — flat, bottom border on focus" rows={3} />
    </div>
  ),
}

// ─── Resize modes ────────────────────────────────────────────────────────────

export const ResizeModes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420 }}>
      <TextArea placeholder="resize='none'" resize="none" rows={3} />
      <TextArea placeholder="resize='vertical'" resize="vertical" rows={3} />
      <TextArea placeholder="resize='both'" resize="both" rows={3} />
    </div>
  ),
}

// ─── Auto rows ───────────────────────────────────────────────────────────────

export const AutoRows: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: 420 }}>
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          resize="auto"
          minRows={3}
          maxRows={8}
          placeholder="resize='auto' (minRows=3, maxRows=8). Digite múltiplas linhas para ver o crescimento."
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
      <div style={{ width: 420 }}>
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          showCharCount
          rows={4}
          placeholder="Max 200 caracteres. O contador aparece no canto inferior direito."
        />
      </div>
    )
  },
}

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420 }}>
      <TextArea placeholder="enabled (default)" />
      <TextArea disabled placeholder="disabled" defaultValue="Valor desabilitado" />
    </div>
  ),
}

// ─── Full width ──────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <TextArea fullWidth placeholder="Full width text area…" rows={4} />
    </div>
  ),
}

