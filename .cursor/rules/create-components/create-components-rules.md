# Regras para Criação de Componentes - Jellyfish Design System

## 1. Arquitetura de Arquivos

### Estrutura do Pacote UI
````
packages/ui/
├── src/
│   ├── components/
│   │   └── [ComponentName]/
│   │       ├── index.ts                 # Export público
│   │       ├── [ComponentName].tsx      # Componente principal
│   │       ├── [ComponentName].styles.ts # Styled Components
│   │       ├── [ComponentName].types.ts  # TypeScript types/interfaces
│   │       ├── [ComponentName].constants.ts # Constantes e mappings
│   │       └── variants/                # Variantes (se necessário)
│   │           ├── Primary.tsx
│   │           ├── Secondary.tsx
│   │           └── Ghost.tsx
│   ├── hooks/                           # Hooks compartilhados
│   ├── utils/                           # Utilitários
│   └── index.ts                         # Export barrel
└── package.json
````

### Estrutura de Documentação
````
apps/js-docs/
├── stories/
│   └── [ComponentName]/
│       ├── [ComponentName].stories.tsx  # Stories principais
│       ├── [ComponentName].mdx          # Documentação
│       └── examples/                    # Exemplos de uso
│           ├── Primary.stories.tsx
│           ├── Secondary.stories.tsx
│           └── AllVariants.stories.tsx
└── .storybook/
````

## 2. Estrutura de Componente

### Types (`ComponentName.types.ts`)
````typescript
export interface ComponentNameProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  // ... outras props específicas
}
````

### Constants (`ComponentName.constants.ts`)
````typescript
export const COMPONENT_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
} as const;

export const COMPONENT_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;
````

### Styles (`ComponentName.styles.ts`)
````typescript
import styled from 'styled-components';
import { tokens } from '@jellyfish/tokens';

export const StyledComponent = styled.div<ComponentNameProps>`
  /* Usar tokens CSS do @jellyfish/tokens */
  font-family: ${tokens.font.family.base};
  border-radius: ${tokens.border.radius.md};
  transition: ${tokens.transition.base};
  
  /* Variantes controladas por props */
  ${({ variant }) => variant === 'primary' && `
    background-color: ${tokens.color.primary[500]};
    color: ${tokens.color.white};
  `}
  
  ${({ variant }) => variant === 'secondary' && `
    background-color: ${tokens.color.secondary[500]};
    color: ${tokens.color.white};
  `}
  
  /* Sizes */
  ${({ size }) => size === 'small' && `
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    font-size: ${tokens.font.size.sm};
  `}
  
  ${({ size }) => size === 'medium' && `
    padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
    font-size: ${tokens.font.size.md};
  `}
  
  ${({ size }) => size === 'large' && `
    padding: ${tokens.spacing[4]} ${tokens.spacing[8]};
    font-size: ${tokens.font.size.lg};
  `}
  
  /* States */
  &:hover {
    opacity: ${tokens.opacity[90]};
  }
  
  &:disabled {
    opacity: ${tokens.opacity[50]};
    cursor: not-allowed;
  }
`;
````

### Component (`ComponentName.tsx`)
````typescript
import React from 'react';
import { StyledComponent } from './ComponentName.styles';
import { ComponentNameProps } from './ComponentName.types';

export const ComponentName = ({ 
  variant = 'primary', 
  size = 'medium',
  children,
  ...props 
}: ComponentNameProps) => {
  return (
    <StyledComponent 
      variant={variant} 
      size={size} 
      {...props}
    >
      {children}
    </StyledComponent>
  );
};

ComponentName.displayName = 'ComponentName';
````

### Export (`index.ts`)
````typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
export { COMPONENT_VARIANTS, COMPONENT_SIZES } from './ComponentName.constants';
````

## 3. Consumo de Tokens

### Regras Obrigatórias
- ✅ **SEMPRE** usar tokens do `@jellyfish/tokens`
- ❌ **NUNCA** usar valores hardcoded (cores, espaçamentos, tipografia, etc)
- ✅ Padrão de acesso: `tokens.categoria.subcategoria.valor`

### Categorias de Tokens

#### Cores
````typescript
// Cores primárias
tokens.color.primary[50]    // até [900]
tokens.color.secondary[50]  // até [900]

// Cores neutras
tokens.color.gray[50]       // até [900]
tokens.color.white
tokens.color.black

// Cores semânticas
tokens.color.success[500]
tokens.color.warning[500]
tokens.color.error[500]
tokens.color.info[500]
````

#### Espaçamento
````typescript
tokens.spacing[1]   // 4px
tokens.spacing[2]   // 8px
tokens.spacing[4]   // 16px
tokens.spacing[8]   // 32px
// ... etc
````

#### Tipografia
````typescript
// Tamanhos
tokens.font.size.xs
tokens.font.size.sm
tokens.font.size.md
tokens.font.size.lg
tokens.font.size.xl

// Peso
tokens.font.weight.light
tokens.font.weight.regular
tokens.font.weight.medium
tokens.font.weight.semibold
tokens.font.weight.bold

// Família
tokens.font.family.base
tokens.font.family.heading
tokens.font.family.mono

// Line height
tokens.font.lineHeight.tight
tokens.font.lineHeight.normal
tokens.font.lineHeight.relaxed
````

#### Border
````typescript
tokens.border.radius.none
tokens.border.radius.sm
tokens.border.radius.md
tokens.border.radius.lg
tokens.border.radius.full

tokens.border.width[1]
tokens.border.width[2]
tokens.border.width[4]
````

#### Shadow
````typescript
tokens.shadow.sm
tokens.shadow.md
tokens.shadow.lg
tokens.shadow.xl
````

#### Transition
````typescript
tokens.transition.fast
tokens.transition.base
tokens.transition.slow
````

#### Opacity
````typescript
tokens.opacity[10]  // 0.1
tokens.opacity[50]  // 0.5
tokens.opacity[90]  // 0.9
````

### Exemplos de Uso
````typescript
// ✅ CORRETO
const StyledButton = styled.button`
  padding: ${tokens.spacing[4]};
  color: ${tokens.color.primary[500]};
  font-size: ${tokens.font.size.md};
  border-radius: ${tokens.border.radius.md};
  transition: ${tokens.transition.base};
`;

// ❌ ERRADO
const StyledButton = styled.button`
  padding: 16px;
  color: #3B82F6;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
`;
````

## 4. Separação de Variantes

### Opção A: Variantes como Props (Recomendado)
Use quando as variantes diferem apenas visualmente.
````typescript
// ComponentName.styles.ts
const variantStyles = {
  primary: `
    background-color: ${tokens.color.primary[500]};
    color: ${tokens.color.white};
  `,
  secondary: `
    background-color: ${tokens.color.secondary[500]};
    color: ${tokens.color.white};
  `,
  ghost: `
    background-color: transparent;
    color: ${tokens.color.primary[500]};
  `,
};

export const StyledComponent = styled.button<{ variant: string }>`
  ${({ variant }) => variantStyles[variant]}
`;
````

### Opção B: Componentes Separados
Use quando as variantes têm comportamentos diferentes.
````typescript
// variants/Primary.tsx
import { ComponentName } from '../ComponentName';
import { ComponentNameProps } from '../ComponentName.types';

export const PrimaryComponent = (props: Omit<ComponentNameProps, 'variant'>) => (
  <ComponentName variant="primary" {...props} />
);
````

## 5. Documentação Storybook

### Stories Principais (`ComponentName.stories.tsx`)
````typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '@jellyfish/ui';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Variante visual do componente',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do componente',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Story padrão
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Component',
  },
};

// Variantes
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
  },
};

// Estados
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

// Showcase de todas as variantes
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: tokens.spacing[4], flexWrap: 'wrap' }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="ghost">Ghost</ComponentName>
    </div>
  ),
};

// Showcase de todos os tamanhos
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: tokens.spacing[4], alignItems: 'center' }}>
      <ComponentName size="small">Small</ComponentName>
      <ComponentName size="medium">Medium</ComponentName>
      <ComponentName size="large">Large</ComponentName>
    </div>
  ),
};
````

### Documentação MDX (`ComponentName.mdx`)
````mdx
import { Canvas, Meta, Controls, Story } from '@storybook/blocks';
import * as ComponentStories from './ComponentName.stories';

<Meta of={ComponentStories} />

# ComponentName

Breve descrição do componente e seu propósito no Design System.

## Quando usar

- Situação 1 onde o componente é apropriado
- Situação 2 onde o componente é apropriado
- Situação 3 onde o componente é apropriado

## Quando não usar

- Situação onde outro componente seria mais apropriado
- Situação onde o componente não deve ser usado

## Uso Básico
```tsx
import { ComponentName } from '@jellyfish/ui';

function App() {
  return (
    <ComponentName variant="primary" size="medium">
      Conteúdo
    </ComponentName>
  );
}
```

## Variantes

<Canvas of={ComponentStories.AllVariants} />

### Primary
Descrição da variante primary e quando usar.

<Canvas of={ComponentStories.Primary} />

### Secondary
Descrição da variante secondary e quando usar.

<Canvas of={ComponentStories.Secondary} />

### Ghost
Descrição da variante ghost e quando usar.

<Canvas of={ComponentStories.Ghost} />

## Tamanhos

<Canvas of={ComponentStories.AllSizes} />

## Estados

### Disabled
<Canvas of={ComponentStories.Disabled} />

## Props

<Controls of={ComponentStories.Default} />

## Tokens Utilizados

Esta seção documenta todos os tokens do `@jellyfish/tokens` utilizados no componente.

### Cores

| Propriedade | Token | Variante | Valor |
|-------------|-------|----------|-------|
| Background (Primary) | `tokens.color.primary[500]` | primary | #3B82F6 |
| Background (Secondary) | `tokens.color.secondary[500]` | secondary | #8B5CF6 |
| Text Color | `tokens.color.white` | primary, secondary | #FFFFFF |

### Espaçamento

| Propriedade | Token | Tamanho | Valor |
|-------------|-------|---------|-------|
| Padding Horizontal | `tokens.spacing[4]` | small | 16px |
| Padding Horizontal | `tokens.spacing[6]` | medium | 24px |
| Padding Horizontal | `tokens.spacing[8]` | large | 32px |

### Tipografia

| Propriedade | Token | Tamanho | Valor |
|-------------|-------|---------|-------|
| Font Size | `tokens.font.size.sm` | small | 14px |
| Font Size | `tokens.font.size.md` | medium | 16px |
| Font Size | `tokens.font.size.lg` | large | 18px |
| Font Weight | `tokens.font.weight.medium` | all | 500 |

### Border

| Propriedade | Token | Valor |
|-------------|-------|-------|
| Border Radius | `tokens.border.radius.md` | 8px |

### Efeitos

| Propriedade | Token | Valor |
|-------------|-------|-------|
| Transition | `tokens.transition.base` | all 200ms ease |
| Hover Opacity | `tokens.opacity[90]` | 0.9 |
| Disabled Opacity | `tokens.opacity[50]` | 0.5 |

## Acessibilidade

- Lista de recursos de acessibilidade implementados
- Suporte a keyboard navigation
- ARIA attributes utilizados
- Notas sobre screen readers

## Exemplos de Uso

### Exemplo 1: [Título do exemplo]
```tsx
// Código de exemplo
```

### Exemplo 2: [Título do exemplo]
```tsx
// Código de exemplo
```

## Boas Práticas

- ✅ Fazer X
- ✅ Fazer Y
- ❌ Evitar A
- ❌ Evitar B
````

## 6. Nomenclatura

### Padrões de Nomenclatura
- **Componentes**: PascalCase (`Button`, `TextField`, `DatePicker`)
- **Arquivos de Componente**: PascalCase (`Button.tsx`, `TextField.tsx`)
- **Styled Components**: Prefixo `Styled` + nome (`StyledButton`, `StyledTextField`)
- **Types/Interfaces**: Nome + `Props` (`ButtonProps`, `TextFieldProps`)
- **Constants**: UPPER_SNAKE_CASE (`BUTTON_VARIANTS`, `INPUT_SIZES`)
- **Funções/Métodos**: camelCase (`handleClick`, `formatValue`)
- **Variáveis**: camelCase (`isDisabled`, `currentValue`)

### Exemplos
````typescript
// ✅ CORRETO
export interface ButtonProps {}
export const BUTTON_VARIANTS = {};
const StyledButton = styled.button``;
export const Button = () => {};

// ❌ ERRADO
export interface buttonProps {}
export const buttonVariants = {};
const ButtonStyled = styled.button``;
export const button = () => {};
````

## 7. Acessibilidade

### Requisitos Obrigatórios
Todos os componentes devem incluir:

#### 1. Semantic HTML
````typescript
// ✅ Use elementos semânticos apropriados
<button type="button">Click me</button>
<nav>...</nav>
<main>...</main>

// ❌ Evite divs para tudo
<div onClick={handleClick}>Click me</div>
````

#### 2. ARIA Attributes
````typescript
export const Button = ({ 
  ariaLabel, 
  ariaDescribedBy,
  disabled,
  ...props 
}: ButtonProps) => (
  <StyledButton
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-disabled={disabled}
    disabled={disabled}
    {...props}
  />
);
````

#### 3. Keyboard Navigation
````typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
};

<StyledComponent
  onKeyDown={handleKeyDown}
  tabIndex={0}
/>
````

#### 4. Focus States
````typescript
// Use tokens para estados de foco
const StyledButton = styled.button`
  &:focus-visible {
    outline: ${tokens.border.width[2]} solid ${tokens.color.primary[500]};
    outline-offset: ${tokens.spacing[1]};
  }
`;
````

#### 5. Color Contrast
- Garantir contraste mínimo de 4.5:1 para texto normal
- Garantir contraste mínimo de 3:1 para texto grande
- Use tokens de cores que já atendem aos requisitos

## 8. Checklist de Criação

Siga esta ordem ao criar um componente:

### Fase 1: Análise
- [ ] Analisar o contexto do Figma fornecido
- [ ] Identificar todas as variantes do componente
- [ ] Identificar todos os estados (hover, active, disabled, focus)
- [ ] Identificar todas as props necessárias
- [ ] Listar todos os tokens necessários

### Fase 2: Estrutura
- [ ] Criar pasta do componente em `packages/ui/src/components/`
- [ ] Criar arquivo `[ComponentName].types.ts`
- [ ] Criar arquivo `[ComponentName].constants.ts`
- [ ] Criar arquivo `[ComponentName].styles.ts`
- [ ] Criar arquivo `[ComponentName].tsx`
- [ ] Criar arquivo `index.ts`
- [ ] Criar pasta `variants/` (se necessário)

### Fase 3: Implementação
- [ ] Definir interfaces TypeScript em `.types.ts`
- [ ] Definir constantes em `.constants.ts`
- [ ] Mapear tokens do `@jellyfish/tokens` em `.styles.ts`
- [ ] Implementar Styled Components
- [ ] Implementar lógica do componente principal
- [ ] Implementar variantes (se necessário)
- [ ] Adicionar exports no `index.ts`

### Fase 4: Documentação
- [ ] Criar pasta em `apps/js-docs/stories/[ComponentName]/`
- [ ] Criar `[ComponentName].stories.tsx`
- [ ] Criar todas as stories (Default, variantes, sizes, estados)
- [ ] Criar showcase de todas variantes (AllVariants)
- [ ] Criar showcase de todos tamanhos (AllSizes)
- [ ] Criar `[ComponentName].mdx`
- [ ] Documentar quando usar/não usar
- [ ] Documentar todos os tokens utilizados
- [ ] Adicionar exemplos de uso
- [ ] Documentar acessibilidade

### Fase 5: Validação
- [ ] Verificar uso exclusivo de tokens (zero valores hardcoded)
- [ ] Verificar acessibilidade (ARIA, keyboard, focus)
- [ ] Verificar nomenclatura (PascalCase, camelCase, etc)
- [ ] Verificar TypeScript types
- [ ] Verificar stories e documentação completa

## 9. Template de Prompt para IA

Use este template ao solicitar criação de componentes:
````
Crie o componente [NOME DO COMPONENTE] baseado no contexto do Figma fornecido.

**Regras obrigatórias:**

1. **Estruture** os arquivos conforme a arquitetura definida:
   - [ComponentName].tsx
   - [ComponentName].styles.ts
   - [ComponentName].types.ts
   - [ComponentName].constants.ts
   - index.ts
   - variants/ (se necessário)

2. **Use APENAS** tokens do `@jellyfish/tokens`:
   - Cores: tokens.color.*
   - Espaçamento: tokens.spacing[*]
   - Tipografia: tokens.font.*
   - Border: tokens.border.*
   - Etc.
   - NUNCA valores hardcoded

3. **Separe** as variantes:
   - Via props (se apenas visual)
   - Via componentes separados (se comportamento diferente)

4. **Documente** completamente no Storybook:
   - Criar [ComponentName].stories.tsx com todas as stories
   - Criar [ComponentName].mdx com documentação completa
   - Incluir showcase de variantes e tamanhos
   - Documentar todos os tokens utilizados

5. **Inclua**:
   - TypeScript types completos
   - Constants para variantes e tamanhos
   - Exports adequados
   - ARIA attributes
   - Keyboard navigation
   - Focus states

6. **Liste** na documentação MDX:
   - Todos os tokens utilizados (em tabelas)
   - Quando usar/não usar o componente
   - Exemplos de uso
   - Recursos de acessibilidade

**Siga o checklist de criação passo a passo.**

**Contexto do Figma:**
[COLAR AQUI O CONTEXTO DO FIGMA]
````

## 10. Exemplos Completos

### Exemplo: Button Component

<details>
<summary>Ver implementação completa</summary>

**Button.types.ts**
````typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
````

**Button.constants.ts**
````typescript
export const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
} as const;

export const BUTTON_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;
````

**Button.styles.ts**
````typescript
import styled from 'styled-components';
import { tokens } from '@jellyfish/tokens';
import { ButtonProps } from './Button.types';

const variantStyles = {
  primary: `
    background-color: ${tokens.color.primary[500]};
    color: ${tokens.color.white};
    border: ${tokens.border.width[1]} solid ${tokens.color.primary[500]};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.color.primary[600]};
      border-color: ${tokens.color.primary[600]};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.color.primary[700]};
      border-color: ${tokens.color.primary[700]};
    }
  `,
  secondary: `
    background-color: ${tokens.color.secondary[500]};
    color: ${tokens.color.white};
    border: ${tokens.border.width[1]} solid ${tokens.color.secondary[500]};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.color.secondary[600]};
      border-color: ${tokens.color.secondary[600]};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.color.secondary[700]};
      border-color: ${tokens.color.secondary[700]};
    }
  `,
  ghost: `
    background-color: transparent;
    color: ${tokens.color.primary[500]};
    border: ${tokens.border.width[1]} solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${tokens.color.primary[50]};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.color.primary[100]};
    }
  `,
};

const sizeStyles = {
  small: `
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    font-size: ${tokens.font.size.sm};
    gap: ${tokens.spacing[2]};
  `,
  medium: `
    padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
    font-size: ${tokens.font.size.md};
    gap: ${tokens.spacing[2]};
  `,
  large: `
    padding: ${tokens.spacing[4]} ${tokens.spacing[8]};
    font-size: ${tokens.font.size.lg};
    gap: ${tokens.spacing[3]};
  `,
};

export const StyledButton = styled.button<ButtonProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${tokens.font.family.base};
  font-weight: ${tokens.font.weight.medium};
  line-height: ${tokens.font.lineHeight.normal};
  border-radius: ${tokens.border.radius.md};
  transition: ${tokens.transition.base};
  cursor: pointer;
  white-space: nowrap;
  
  /* Variant styles */
  ${({ variant = 'primary' }) => variantStyles[variant]}
  
  /* Size styles */
  ${({ size = 'medium' }) => sizeStyles[size]}
  
  /* Full width */
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: ${tokens.opacity[50]};
    cursor: not-allowed;
  }
  
  /* Focus state */
  &:focus-visible {
    outline: ${tokens.border.width[2]} solid ${tokens.color.primary[500]};
    outline-offset: ${tokens.spacing[1]};
  }
`;
````

**Button.tsx**
````typescript
import React from 'react';
import { StyledButton } from './Button.styles';
import { ButtonProps } from './Button.types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      children,
      icon,
      iconPosition = 'left',
      disabled,
      loading,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const showIcon = icon && !loading;
    const content = (
      <>
        {showIcon && iconPosition === 'left' && icon}
        {children}
        {showIcon && iconPosition === 'right' && icon}
      </>
    );

    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        type={type}
        aria-busy={loading}
        {...props}
      >
        {content}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
````

**index.ts**
````typescript
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
export { BUTTON_VARIANTS, BUTTON_SIZES } from './Button.constants';
````

</details>

## 11. Padrões de Código

### Imports
````typescript
// Ordem de imports
import React from 'react';                           // 1. React
import styled from 'styled-components';              // 2. Bibliotecas externas
import { tokens } from '@jellyfish/tokens';          // 3. Pacotes internos
import { ComponentProps } from './Component.types';  // 4. Arquivos locais
````

### Props Destrutivas
````typescript
// ✅ CORRETO - Props com defaults
export const Component = ({ 
  variant = 'primary', 
  size = 'medium',
  ...props 
}: ComponentProps) => {
  // ...
};

// ❌ ERRADO - Props sem defaults adequados
export const Component = (props: ComponentProps) => {
  const variant = props.variant || 'primary';
  // ...
};
````

### Conditional Styling
````typescript
// ✅ CORRETO - Template literals limpos
${({ variant }) => variant === 'primary' && `
  background-color: ${tokens.color.primary[500]};
`}

// ✅ CORRETO - Objetos de estilos
const variantStyles = {
  primary: `...`,
  secondary: `...`,
};

${({ variant }) => variantStyles[variant]}

// ❌ ERRADO - Ternários complexos inline
${({ variant }) => variant === 'primary' ? 'background: blue;' : variant === 'secondary' ? 'background: red;' : 'background: gray;'}
````

---

## Resumo de Regras Críticas

1. ✅ **SEMPRE** usar tokens do `@jellyfish/tokens`
2. ❌ **NUNCA** usar valores hardcoded
3. ✅ **SEMPRE** seguir a arquitetura de arquivos definida
4. ✅ **SEMPRE** criar documentação completa no Storybook
5. ✅ **SEMPRE** listar todos os tokens utilizados na documentação
6. ✅ **SEMPRE** incluir acessibilidade (ARIA, keyboard, focus)
7. ✅ **SEMPRE** seguir padrões de nomenclatura
8. ✅ **SEMPRE** seguir o checklist de criação