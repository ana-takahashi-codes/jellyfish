# Template de Stories — Storybook (TSX)

> **Regra**: Stories são **sempre `.stories.tsx`**. Não use arquivos `.stories.mdx` — o setup atual (Storybook 10 + `@storybook/react-vite`) não suporta MDX separado. Toda a documentação fica dentro do próprio `.stories.tsx` via `parameters.docs.description.component`.

A página de docs é gerada automaticamente pela tag **`autodocs`**. Ela inclui a descrição markdown, a tabela de ArgTypes e o canvas interativo de cada story exportada.

---

## Localização

```
design-system/apps/js-docs/stories/
└── basic-components/
    └── ComponentName.stories.tsx   ← único arquivo de story
```

---

## Template completo

```tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@jellyfish/ui/component-name'
// Importe outros componentes do DS se necessário (ex.: Icon)
// import { Icon } from '@jellyfish/ui/icon'

const meta: Meta<typeof ComponentName> = {
  title: 'Basic/ComponentName',   // ex.: 'Basic/Button', 'Basic/Control'
  component: ComponentName,
  tags: ['autodocs'],             // gera a página de docs automaticamente
  parameters: {
    layout: 'centered',           // 'centered' | 'fullscreen' | 'padded'
    docs: {
      description: {
        component: `
# ComponentName

Descrição curta e objetiva em 1-2 frases.

## Quando usar

- Caso de uso principal
- Situação secundária adequada

## Quando NÃO usar

- Situação onde outro componente é mais adequado

## Anatomia

Descreva as partes internas do componente (ex.: label, ícone, wrapper).

## Acessibilidade

- Regra de aria/role relevante
- Navegação por teclado quando aplicável

## Design tokens

| Token | Uso |
|-------|-----|
| \`--jf-component-token\` | Descrição |

## Figma

- [API](https://www.figma.com/design/FILE_KEY/FILE_NAME?node-id=NODE_ID)
- [Variantes](https://www.figma.com/design/FILE_KEY/FILE_NAME?node-id=NODE_ID)
        `,
      },
    },
  },
  argTypes: {
    // Documente cada prop relevante
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Altura e tamanho do componente.',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o componente.',
      table: { defaultValue: { summary: 'false' } },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais.',
    },
  },
}

export default meta

type Story = StoryObj<typeof ComponentName>

// ─── Playground ────────────────────────────────────────────────────────────────
// Story principal: sempre nomeada "Playground".
// Aparece primeiro na sidebar e é usada pelo Canvas interativo da página de docs.

export const Playground: Story = {
  args: {
    size: 'md',
    disabled: false,
  },
}

// ─── Variantes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <ComponentName>Enabled</ComponentName>
      <ComponentName disabled>Disabled</ComponentName>
    </div>
  ),
}

// Adicione mais stories conforme as variantes do componente:
// export const Radius, export const FullWidth, export const WithIcon, etc.
```

---

## Convenções obrigatórias

| Regra | Detalhe |
|-------|---------|
| **Arquivo único** | Um `.stories.tsx` por componente; nenhum `.mdx` |
| **`tags: ['autodocs']`** | Obrigatório em todo `meta` — gera a página de docs |
| **Primeira story = `Playground`** | Nome padrão para a story interativa principal; nunca `Default` |
| **`layout: 'centered'`** | Padrão; use `'fullscreen'` só para layouts de página |
| **Descrição em markdown** | Toda a doc fica em `parameters.docs.description.component` |
| **`render:` para grupos** | Stories com múltiplas variantes usam `render: () => <div>...</div>` |
| **Sem lógica no render** | Stories são exemplos estáticos; evite state/efeitos |

---

## Referência — stories reais do projeto

- `apps/js-docs/stories/basic-components/icon.stories.tsx` — Icon
- `apps/js-docs/stories/basic-components/control.stories.tsx` — Control

---

## Por que não MDX?

O Storybook 10 com `@storybook/react-vite` requer `@storybook/blocks` para MDX, que não está instalado como dependência direta neste workspace. A abordagem TSX + `autodocs` é equivalente e mais simples de manter — a página de docs gerada inclui descrição, ArgTypes e todos os Canvas das stories exportadas.
