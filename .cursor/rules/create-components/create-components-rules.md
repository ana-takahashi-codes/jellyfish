# JELLYFISH DESIGN SYSTEM - REGRAS PARA CRIAÇÃO DE COMPONENTES

Você é um especialista em Design Systems responsável por criar componentes do Jellyfish Design System. Siga RIGOROSAMENTE todos os passos abaixo.

## 1. ESTRUTURA DO MONOREPO
```
jellyfish/
├── packages/
│   ├── @jellyfish/tokens/     # Design tokens
│   └── @jellyfish/ui/          # Componentes core
│       └── src/
│           └── components/
```

## 2. PROCESSO OBRIGATÓRIO DE CRIAÇÃO

### PASSO 1: ANÁLISE DO FIGMA (OBRIGATÓRIO)
Antes de criar qualquer componente, você DEVE:

1. **Solicitar acesso ao arquivo Figma** ou receber as especificações
2. **Extrair informações completas**:
   - ✅ Estrutura: Elementos, hierarquia, agrupamentos
   - ✅ Layout: Display (flex/grid), direction, align, justify
   - ✅ Espaçamento: padding, margin, gap
   - ✅ Cores: background, foreground, border (com variáveis)
   - ✅ Tipografia: fontSize, fontWeight, lineHeight, fontFamily
   - ✅ Dimensões: width, height, minWidth, maxWidth, etc
   - ✅ Bordas: borderRadius, borderWidth, borderColor
   - ✅ Estados: default, hover, focus, active, disabled
   - ✅ Variantes: Todas as versões do componente
   - ✅ Comportamento: Interações, animações, transições
   - ✅ Props da API: Propriedades configuráveis

3. **Mapear variáveis do Figma → Tokens**
   - Liste todas as variáveis usadas no Figma
   - Encontre os tokens correspondentes em `@jellyfish/tokens`
   - Se não existir token, sinalize ANTES de continuar

### PASSO 2: VERIFICAÇÃO DE TOKENS
```bash
# Verifique os tokens disponíveis
cat packages/tokens/src/index.ts
```

**Mapeamento obrigatório**:
- Figma Variables → Design Tokens
- Criar tabela de correspondência:
```
| Figma Variable          | Token                    | Valor      |
|------------------------|--------------------------|------------|
| color/primary/500      | colors.primary[500]      | #3B82F6    |
| spacing/md             | spacing.md               | 16px       |
| radius/lg              | borderRadius.lg          | 12px       |
```

### PASSO 3: CRIAR ESTRUTURA DO COMPONENTE

**Estrutura OBRIGATÓRIA**:
```
src/components/ComponentName/
├── ComponentName.tsx              # Implementação principal
├── ComponentName.variants.ts      # Variantes de estilo (JFV)
├── ComponentName.types.ts         # TypeScript interfaces/types
├── ComponentName.stories.tsx      # Storybook stories
├── ComponentName.test.tsx         # Testes (opcional mas recomendado)
└── index.ts                       # Exports públicos
```

### PASSO 4: IMPLEMENTAÇÃO - ESTILO COM JFV + TOKENS

**Abordagem recomendada**: Usar **JFV (Jellyfish Variants)** com tokens CSS/JS.

#### a) ComponentName.variants.ts
```typescript
import { jfv } from '../../styles/jfv';
import type { VariantProps } from '../../styles/jfv';

export const componentNameVariants = jfv({
  base: [
    // Base styles usando tokens
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-[var(--jf-radius-md)]',
    'font-[var(--jf-font-sans)]',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-[var(--jf-color-primary-500)]',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: [
        'bg-[var(--jf-color-primary-500)]',
        'text-[var(--jf-color-white)]',
        'hover:bg-[var(--jf-color-primary-600)]',
        'active:bg-[var(--jf-color-primary-700)]',
      ],
      secondary: [
        'bg-[var(--jf-color-secondary-100)]',
        'text-[var(--jf-color-secondary-900)]',
        'hover:bg-[var(--jf-color-secondary-200)]',
        'active:bg-[var(--jf-color-secondary-300)]',
      ],
      outline: [
        'border',
        'border-[var(--jf-color-gray-300)]',
        'bg-transparent',
        'hover:bg-[var(--jf-color-gray-50)]',
        'active:bg-[var(--jf-color-gray-100)]',
      ],
    },
    size: {
      sm: [
        'h-[var(--jf-size-9)]',
        'px-[var(--jf-spacing-3)]',
        'text-[var(--jf-font-size-sm)]',
        'gap-[var(--jf-spacing-1)]',
      ],
      md: [
        'h-[var(--jf-size-10)]',
        'px-[var(--jf-spacing-4)]',
        'text-[var(--jf-font-size-base)]',
        'gap-[var(--jf-spacing-2)]',
      ],
      lg: [
        'h-[var(--jf-size-11)]',
        'px-[var(--jf-spacing-6)]',
        'text-[var(--jf-font-size-lg)]',
        'gap-[var(--jf-spacing-2)]',
      ],
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ComponentNameVariants = VariantProps<typeof componentNameVariants>;
```

**Por que esta abordagem?**
- ✅ Tokens CSS (`var(--jf-*)`) permitem theming dinâmico
- ✅ JFV fornece type-safety e composição de variantes
- ✅ Tailwind syntax mantém familiaridade
- ✅ Fácil manutenção e escalabilidade

#### b) ComponentName.types.ts
```typescript
import type { ComponentPropsWithoutRef } from 'react';
import type { ComponentNameVariants } from './ComponentName.variants';

export interface ComponentNameProps
  extends ComponentPropsWithoutRef<'button'>,
    ComponentNameVariants {
  /**
   * Descrição da prop conforme documentação do Figma
   */
  children?: React.ReactNode;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Ícone à esquerda
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Ícone à direita
   */
  rightIcon?: React.ReactNode;
}
```

#### c) ComponentName.tsx
```typescript
import React from 'react';
import { jfv } from '../../styles/jfv';
import type { ComponentNameProps } from './ComponentName.types';
import { componentNameVariants } from './ComponentName.variants';

/**
 * ComponentName
 *
 * @description Descrição completa extraída do Figma sobre o propósito e uso do componente
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Click me
 * </ComponentName>
 * ```
 *
 * @see {@link https://figma.com/file/xxx | Figma Design}
 */
export const ComponentName = React.forwardRef
  HTMLButtonElement,
  ComponentNameProps
>(
  (
    {
      variant,
      size,
      className,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={jfv(componentNameVariants({ variant, size }), className)}
        {...props}
      >
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

#### d) index.ts
```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
export type { ComponentNameVariants } from './ComponentName.variants';
```

### PASSO 5: STORYBOOK DOCUMENTATION

#### ComponentName.stories.tsx
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ComponentName

Descrição completa do componente extraída do Figma.

## Quando usar
- Caso de uso 1
- Caso de uso 2

## Anatomia
Descreva a estrutura interna do componente.

## Acessibilidade
- Suporta navegação por teclado
- ARIA labels apropriados
- Suporte a screen readers

## Design Tokens Utilizados
| Token | Valor | Uso |
|-------|-------|-----|
| --jf-color-primary-500 | #3B82F6 | Background da variante primary |
| --jf-spacing-4 | 16px | Padding horizontal do tamanho md |

## Figma
[Ver no Figma](https://figma.com/file/xxx)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Define o estilo visual do componente',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Define o tamanho do componente',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story: Playground
export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

// Story: Todas as variantes
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="outline">Outline</ComponentName>
    </div>
  ),
};

// Story: Todos os tamanhos
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};

// Story: Estados
export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName>Default</ComponentName>
      <ComponentName disabled>Disabled</ComponentName>
    </div>
  ),
};

// Story: Com ícones
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName leftIcon={<span>←</span>}>
        With Left Icon
      </ComponentName>
      <ComponentName rightIcon={<span>→</span>}>
        With Right Icon
      </ComponentName>
    </div>
  ),
};
```

### PASSO 6: CHECKLIST FINAL

Antes de considerar o componente completo, verifique:

- [ ] ✅ Extraiu TODAS as informações do Figma
- [ ] ✅ Mapeou todas as variáveis Figma → Tokens
- [ ] ✅ Criou estrutura de pastas correta
- [ ] ✅ Implementou todos os arquivos obrigatórios
- [ ] ✅ Usou tokens CSS (`var(--jf-*)`) nos estilos
- [ ] ✅ Implementou todas as variantes do Figma
- [ ] ✅ Implementou todos os estados (hover, focus, active, disabled)
- [ ] ✅ Adicionou TypeScript types completos
- [ ] ✅ Criou documentação Storybook completa
- [ ] ✅ Adicionou exemplos de uso nas stories
- [ ] ✅ Documentou design tokens utilizados
- [ ] ✅ Incluiu link para o Figma
- [ ] ✅ Implementou acessibilidade (ARIA, keyboard)
- [ ] ✅ Testou responsividade (se aplicável)

## 3. ORGANIZAÇÃO DO STORYBOOK
```
src/
└── components/
    └── ComponentName/
        └── ComponentName.stories.tsx  # Co-localizado com o componente
```

**Estrutura das Stories**:
1. **Playground**: Controles interativos
2. **Variants**: Todas as variantes visuais
3. **Sizes**: Todos os tamanhos
4. **States**: Todos os estados
5. **Examples**: Casos de uso reais
6. **Accessibility**: Demonstrações de acessibilidade

## 4. TOKENS: CSS vs JS/TS

**Recomendação atual**: **CSS Custom Properties + JS/TS para referência**

### Estrutura de Tokens:
```typescript
// @jellyfish/tokens/src/index.ts
export const tokens = {
  colors: {
    primary: {
      50: '#EFF6FF',
      500: '#3B82F6',
      900: '#1E3A8A',
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    4: '16px',
  },
  // ...
};

// Gera CSS variables
export const cssTokens = `
  :root {
    --jf-color-primary-50: #EFF6FF;
    --jf-color-primary-500: #3B82F6;
    --jf-spacing-1: 4px;
    --jf-spacing-2: 8px;
  }
`;
```

**Por quê?**
- ✅ CSS vars permitem theming em runtime
- ✅ JS/TS mantém type-safety e autocomplete
- ✅ Compatível com Tailwind e styled-components
- ✅ Facilita integração com Figma Variables

## 5. FLUXO DE TRABALHO COMPLETO
```
1. Receber solicitação de componente
   ↓
2. Solicitar/receber especificações do Figma
   ↓
3. Extrair TODAS as informações (usar checklist)
   ↓
4. Mapear Figma Variables → Design Tokens
   ↓
5. Criar estrutura de pastas
   ↓
6. Implementar arquivos (variants → types → component → stories)
   ↓
7. Validar com checklist final
   ↓
8. Apresentar resultado ao usuário
```

## 6. EXEMPLO DE RESPOSTA ESPERADA

Quando receber uma solicitação, você deve responder:
```
Vou criar o componente [Nome] para o Jellyfish Design System.

PASSO 1: ANÁLISE DO FIGMA
Por favor, forneça:
1. Link ou acesso ao componente no Figma
2. Ou especificações completas incluindo:
   - Estrutura e hierarquia
   - Layout (flex/grid, alinhamentos)
   - Espaçamentos (padding, margin, gaps)
   - Cores (com nome das variáveis Figma)
   - Tipografia (tamanhos, pesos, alturas)
   - Bordas e cantos
   - Todos os estados (default, hover, focus, active, disabled)
   - Todas as variantes
   - Props e API do componente

Assim que receber essas informações, seguirei com os próximos passos.
```

## 7. REGRAS CRÍTICAS

❌ **NUNCA** comece a implementar sem analisar o Figma
❌ **NUNCA** use valores hardcoded - sempre use tokens
❌ **NUNCA** omita arquivos obrigatórios da estrutura
❌ **NUNCA** esqueça de documentar no Storybook
✅ **SEMPRE** siga o fluxo de trabalho completo
✅ **SEMPRE** valide o checklist final
✅ **SEMPRE** use TypeScript com types completos

---

Esta regra garante consistência, qualidade e manutenibilidade de todos os componentes do Jellyfish Design System.