# Guia de Desenvolvimento de Componentes UI

> **Objetivo**: Garantir consistência, performance, acessibilidade e escalabilidade em todos os componentes do design system Jellyfish.

Toda a documentação de construção de componentes fica em **`packages/ui/docs/`**.

**Regra Cursor**: Ao criar um novo componente, você **DEVE** ler todos os arquivos desta pasta (`packages/ui/docs/`) antes de implementar. Estes guias são a fonte única de verdade.

---

## Processo obrigatório de criação

Siga este fluxo em toda criação de componente. **Nunca pule etapas nem agrupe etapas em um único passo.**

```
[1. Análise Figma] → [2. Mapeamento Tokens] → [3. Estrutura de arquivos]
       → [4. Implementação] → [5. Testes] → [6. Stories] → [7. Changelog] → [8. Validação]
```

---

### Etapa 1 — Análise do Figma (obrigatória antes de qualquer código)

Use o MCP do Figma para acessar o arquivo. Leia **sempre dois frames**:
- Frame de **variantes** — extrai estrutura visual, estados, combinações
- Frame de **API** — extrai props, tipos, valores default, comportamentos

**O que extrair e listar antes de continuar:**

| O que extrair | Como usar |
|---------------|-----------|
| Props e valores possíveis | Base para `.types.ts` e `.variants.ts` |
| Estados visuais (default, hover, focus, loading, disabled, error) | Estados nas variantes JFV |
| Tokens de cor (variáveis Figma) | Mapear para `@jellyfish/tokens` na Etapa 2 |
| Tokens de espaçamento, tipografia, borda | Mapear para utility classes ou `var(--jf-*)` |
| Se `width = height` em qualquer variante | Usar `.size-{N}` de `utilities.css` |
| Comportamentos implícitos (ex: iconOnly sem label) | Requisitos funcionais e de acessibilidade |
| Subtipos com comportamento distinto (ex: `type="submit"`) | Documentar na implementação |

**Resposta esperada após esta etapa**: apresentar o levantamento completo e perguntar se há correções antes de avançar. **Não gerar código nesta etapa.**

> ⚠️ **NUNCA** começar a implementar sem concluir e validar esta etapa.

---

### Etapa 2 — Mapeamento Figma → Tokens

Para cada variável Figma extraída na Etapa 1, mapear para o token correspondente:

```
Figma: color/bg/brand-primary  →  Token: var(--jf-color-bg-brand-primary)  →  Utility: bg-brand-primary
Figma: size/spacing/2          →  Token: var(--jf-size-2)                  →  Utility: gap-2 / p-x-2
Figma: corner-radius/default   →  Token: var(--jf-corner-radius-default)   →  Utility: rounded-default
```

**Regra**: se não existir token correspondente para uma variável do Figma, **sinalizar imediatamente** antes de continuar. Nunca usar valor hardcoded como substituto silencioso.

---

### Etapa 3 — Estrutura de arquivos

Todo componente deve seguir esta estrutura **sem exceções**:

```
ComponentName/
├── ComponentName.tsx          # Implementação principal
├── ComponentName.variants.ts  # Definição de variantes (JFV)
├── ComponentName.types.ts     # TypeScript types (NÃO .tsx)
├── index.ts                   # Barrel export
└── README.md                  # Documentação (opcional)
```

**Não fazer:**
- `ComponentName.types.tsx` — TSX desnecessário para tipos puros
- `Component.tsx` — nome inconsistente
- `types.ts` — sem prefixo do componente

---

### Etapa 4 — Implementação

Ordem obrigatória dentro desta etapa: **variants → types → component**.

#### 4a) ComponentName.variants.ts

```typescript
import { jfv } from '../../variants'
import type { VariantPropsOf } from '../../variants'

export const componentVariants = jfv({
  base: [
    // Apenas classes exclusivas deste componente.
    // NÃO duplicar classes que já vêm de controlVariants (ex: d-inline-flex, items-center).
  ],
  variants: {
    variant: {
      solid:   [],
      outline: ['bd-0-5', 'box-border'],
      ghost:   [],
    },
    color: {
      neutral:       [],
      'brand-primary': [],
      accent:        [],
      critical:      [],
    },
    size: {
      sm: [],
      md: [],
      lg: [],
    },
  },
  compoundVariants: [
    // Outline: borderStyle via compound variant (VariantValue não suporta objeto misto)
    { variant: 'outline', style: { borderStyle: 'solid' } as CSSProperties },

    // Solid × color
    { variant: 'solid', color: 'neutral',       class: 'bg-neutral fg-on-neutral' },
    { variant: 'solid', color: 'brand-primary',  class: 'bg-brand-primary fg-on-brand-primary' },
    { variant: 'solid', color: 'accent',         class: 'bg-accent fg-on-accent' },
    { variant: 'solid', color: 'critical',       class: 'bg-critical fg-on-critical' },

    // Outline × color
    { variant: 'outline', color: 'neutral',      class: 'bd-neutral bg-transparent fg-strong' },
    { variant: 'outline', color: 'brand-primary', class: 'bd-brand-primary bg-transparent fg-brand-primary' },
    { variant: 'outline', color: 'accent',        class: 'bd-accent bg-transparent fg-accent' },
    { variant: 'outline', color: 'critical',      class: 'bd-critical bg-transparent fg-critical' },

    // Ghost × color
    { variant: 'ghost', color: 'neutral',        class: 'bg-neutral-soft fg-strong' },
    { variant: 'ghost', color: 'brand-primary',  class: 'bg-brand-primary-soft fg-brand-primary' },
    { variant: 'ghost', color: 'accent',         class: 'bg-accent-soft fg-accent' },
    { variant: 'ghost', color: 'critical',       class: 'bg-critical-soft fg-critical' },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'brand-primary',
    size: 'md',
  },
})

export type ComponentVariants = VariantPropsOf<typeof componentVariants>
```

**Regras de variantes:**
- `base` contém **apenas** classes exclusivas do componente — nunca duplicar o que vem de `controlVariants`
- Solid e ghost **não** recebem borda (nem transparente)
- Outline usa `bd-0-5 box-border` + compound variant para `borderStyle: 'solid'` — **nunca** via `if (variant === 'outline')` manual
- Compound variants por color seguem o padrão: solid `bg-{color} fg-on-{color}`, outline `bd-{color} bg-transparent fg-{color}`, ghost `bg-{color}-soft fg-{color}`
- Se `width = height` no Figma, usar `.size-{N}` correspondente em `utilities.css`

#### 4b) ComponentName.types.ts

```typescript
import type { ComponentPropsWithoutRef } from 'react'

export interface ComponentProps extends ComponentPropsWithoutRef<'button'> {
  // Props visuais
  variant?: 'solid' | 'outline' | 'ghost'
  color?: 'neutral' | 'brand-primary' | 'accent' | 'critical'
  size?: 'sm' | 'md' | 'lg'

  // Props comportamentais
  type?: 'button' | 'submit' | 'reset'  // default: 'button'
  iconOnly?: boolean
  loading?: boolean
  disabled?: boolean
  startIcon?: ReactNode
  children?: ReactNode
  className?: string

  // Props de acessibilidade (quando necessário para o componente)
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-controls'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean | 'mixed'
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
}
```

**Regras de tipos:**
- Use `ComponentPropsWithoutRef<T>` como base — nunca `any`
- Agrupe props por categoria com comentário
- Tipos públicos (variants, sizes) devem ser exportados separadamente para uso externo
- Subtipos com comportamento distinto (ex: `type`) devem ser explicitamente tipados

#### 4c) ComponentName.tsx

```typescript
const Component = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      variant = 'solid',
      color = 'brand-primary',
      size = 'md',
      type = 'button',        // ← default explícito: evita submit acidental
      iconOnly = false,
      loading = false,
      disabled = false,
      startIcon,
      children,
      ...props
    },
    ref
  ) => {
    // Avisar em dev se iconOnly sem aria-label
    if (process.env.NODE_ENV !== 'production' && iconOnly && !props['aria-label']) {
      console.warn('[Button] iconOnly=true requer aria-label para acessibilidade.')
    }

    const { className: variantClassName, style: variantStyle } = useMemo(
      () => componentVariants({ variant, color, size }),
      [variant, color, size]
    )

    const { className: controlClassName, style: controlStyle } = useMemo(
      () => controlVariants({ size, fullWidth: props.fullWidth, radius: props.radius }),
      [size, props.fullWidth, props.radius]
    )

    const resolvedStyle = { ...controlStyle, ...variantStyle }

    return (
      <button
        ref={ref}
        type={type}
        className={cn(controlClassName, variantClassName, className)}
        style={resolvedStyle}
        disabled={disabled || undefined}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {startIcon && (
          <Icon
            className={cn(loading && 'motion-spin')}
            aria-hidden="true"
          >
            {startIcon}
          </Icon>
        )}
        {!iconOnly && children}
      </button>
    )
  }
)
```

**Regras de implementação:**
- `type="button"` é o default — nunca deixar implícito
- `useMemo` obrigatório para resultado de variantes — nunca chamar direto no render
- `data-loading` + `aria-busy` para loading — o `.interactive[data-loading]` de `utilities.css` já aplica opacidade e `pointer-events: none`
- `disabled` nativo — não usar apenas `aria-disabled` sem o atributo nativo (remove do fluxo de Tab)
- `iconOnly`: `width = height`; ícone com `aria-hidden="true"`; sem children no DOM
- Ícone em loading recebe `motion-spin` via className
- `resolvedStyle` mescla `controlStyle + variantStyle` — nunca adicionar `if (variant === 'outline')` manual

---

### Etapa 5 — Testes unitários

Gere os testes **após** a implementação ser validada. Use [Vitest/Jest + Testing Library].

**Cobertura obrigatória para componentes interativos:**

```typescript
describe('ComponentName', () => {
  // Renderização
  it('renderiza com props padrão')
  it('renderiza cada variante visual corretamente')

  // Comportamento de tipo (para componentes com type nativo)
  it('tem type="button" como default')
  it('aceita type="submit" e type="reset" explicitamente')

  // Estados
  it('aplica aria-busy e data-loading quando loading=true')
  it('aplica disabled nativo corretamente')
  it('não dispara onClick quando disabled')
  it('não dispara onClick quando loading')

  // Acessibilidade
  it('emite console.warn quando iconOnly=true sem aria-label (dev)')
  it('ícone tem aria-hidden="true"')

  // Preferir queries semânticas
  // getByRole('button', { name: 'Label' }) > getByTestId
})
```

**Regras de testes:**
- Prefira queries por `role`, `label` e `text` — use `data-testid` apenas quando não houver seletor semântico
- Inclua testes com `jest-axe` / `axe` para validação automática de acessibilidade
- Testes de acessibilidade são obrigatórios, não opcionais

---

### Etapa 6 — Stories do Storybook

Stories ficam em **`apps/js-docs/stories/`**. Sempre `.stories.tsx` — nunca `.stories.mdx`.

**Estrutura obrigatória:**

```typescript
const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',
  component: Component,
  tags: ['autodocs'],           // obrigatório — gera docs automático
  parameters: {
    docs: {
      description: {
        component: `
Descrição do componente.

## Acessibilidade
- Notas de acessibilidade relevantes para o consumidor
- Quando usar aria-label, aria-expanded, etc.

## Figma
[Link para o frame de variantes]
        `,
      },
    },
  },
}

// 1ª story: sempre Playground (nunca Default)
export const Playground: Story = { ... }

// Stories por variante
export const Variants: Story = { ... }
export const Colors: Story = { ... }
export const Sizes: Story = { ... }

// Stories de estado
export const States: Story = { ... }        // loading, disabled
export const IconOnly: Story = { ... }      // com aria-label obrigatório

// Story de acessibilidade (obrigatória para interativos)
export const Accessibility: Story = {
  // Exemplos de: iconOnly com aria-label, aria-expanded, aria-pressed,
  // type="submit" em form, loading com aria-busy
}
```

**Regras de stories:**
- Primeira story exportada: sempre `Playground`
- `tags: ['autodocs']` obrigatório
- Documentação markdown em `parameters.docs.description.component`
- Story de acessibilidade obrigatória para componentes interativos e de feedback
- Siga o template completo em [STORYBOOK_STORY_MODEL.md](../docs/STORYBOOK_STORY_MODEL.md)

---

### Etapa 7 — Changelog

O projeto usa GitHub Releases como registro de mudanças.
O agente deve gerar:

1. **Commit message** (Conventional Commits)
   - `feat(ui):` para componente novo
   - `fix(ui):` para correção
   - `refactor(ui):` para refatoração
   - Body descrevendo variantes, estados e dependências
   - Footer: `Closes #[número da issue]`

2. **PR description** em markdown
   - Será usada como base da GitHub Release Note
   - Deve conter: descrição, tabela de props, notas de
     acessibilidade, links para issue e Figma

**Estrutura mínima:**

```markdown
## [versão] - YYYY-MM-DD

### Added
- `ComponentName`: descrição do que foi adicionado

### Props
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| variant | 'solid' \| 'outline' \| 'ghost' | 'solid' | Estilo visual |
| ... | | | |

### Acessibilidade
- Nota sobre requisitos de acessibilidade relevantes para o consumidor
  (ex: iconOnly requer aria-label)

### Breaking Changes
- Nenhum (componente novo) / listar se houver
```

---

### Etapa 8 — Validação

#### Checklist de acessibilidade por categoria de componente

**Componentes interativos** (Button, Input, Select, Toggle...):
- [ ] Navegação por teclado (`Tab`, `Enter`, `Space` — conforme padrão APG)
- [ ] `focus-visible` visível com contraste mínimo 3:1 (WCAG 1.4.11)
- [ ] Contraste de texto mínimo 4.5:1 (WCAG 1.4.3)
- [ ] Área clicável mínima 44×44px para iconOnly (WCAG 2.5.5)
- [ ] `type` nativo explícito (`button` | `submit` | `reset`) — default `button`
- [ ] `disabled` nativo (não apenas `aria-disabled`)
- [ ] `aria-busy` + label visível mantido no estado `loading`
- [ ] `aria-label` obrigatório para `iconOnly` — warning em dev se ausente
- [ ] Ícone com `aria-hidden="true"` sempre que decorativo

**Componentes de feedback** (Toast, Alert, Modal, Tooltip...):
- [ ] `aria-live="polite"` para feedback informativo; `assertive` apenas para erros críticos
- [ ] `role="dialog"` + `aria-modal="true"` + `aria-labelledby` para modais
- [ ] Gerenciamento de foco: abrir → foco no container; fechar → foco retorna ao trigger
- [ ] Trap de foco ativo em modais
- [ ] `Escape` fecha o componente
- [ ] Severidade nunca comunicada apenas por cor — sempre ícone + texto (WCAG 1.4.1)

**Componentes de dados** (Table, List, Badge...):
- [ ] `<table>` com `<caption>` ou `aria-label`
- [ ] `<th scope="col">` / `<th scope="row">` em tabelas
- [ ] `aria-sort` em colunas ordenáveis
- [ ] `aria-selected` em linhas selecionáveis
- [ ] Badge/status com texto, não apenas cor

**Componentes de layout** (Grid, Stack, Divider...):
- [ ] Prop `as` documentada — trocar `div` por elemento semântico exige label
- [ ] Ordem DOM corresponde à ordem visual (WCAG 1.3.2)

#### Checklist final (antes de considerar completo)

- [ ] Extraiu todas as informações do Figma (variantes + API)
- [ ] Se `width = height` no Figma, usou `.size-{N}` de `utilities.css`
- [ ] Mapeou variáveis Figma → tokens — sem valores hardcoded
- [ ] Estrutura de arquivos obrigatória criada
- [ ] `type="button"` como default em componentes com `<button>`
- [ ] `useMemo` para resultado de variantes
- [ ] `forwardRef` implementado
- [ ] Tipos completos exportados
- [ ] Estados interativos via classe `interactive` de `utilities.css` — sem estilos próprios para focus/hover/active
- [ ] Testes unitários + jest-axe implementados
- [ ] Stories com `Playground`, variantes, estados e acessibilidade
- [ ] Changelog atualizado
- [ ] Acessibilidade validada conforme categoria do componente

#### Code review checklist

- **Estrutura**: nomenclatura `ComponentName.*`, tipos em `.types.ts`, variants em `.variants.ts`, `index.ts` exporta o necessário
- **Performance**: `useMemo` para variantProps; sem re-renders desnecessários
- **Tokens**: apenas `var(--jf-*)` ou utility classes; sem hardcode
- **Utilities**: preferir classes de `utilities.css`; se `width = height`, usar `.size-{N}`
- **Estados interativos**: classe `interactive` de `utilities.css`; sem estilos próprios para focus/hover/active (salvo exceção documentada)
- **Acessibilidade**: `type` nativo explícito; `aria-*` corretos por estado; `disabled` nativo; warning de dev para `iconOnly` sem `aria-label`
- **TypeScript**: sem `any`/`as any` sem justificativa; tipos exportados

---

## Estrutura do monorepo (referência)

| O quê | Onde | Como importar |
|-------|------|----------------|
| **Sistema de variantes (JFV)** | `@jellyfish/ui` | `import { jfv, cn, VariantPropsOf } from '@jellyfish/ui/variants'` |
| **Referências de tokens (vars)** | `@jellyfish/tokens` | `import { colors, size, radius, fontSize, tokenVar } from '@jellyfish/tokens/vars'` |
| **Re-export de tokens no UI** | `@jellyfish/ui` | `import { colors, size, radius, fontSize, tokenVar } from '@jellyfish/ui/tokens'` |
| **Utility classes CSS** | `@jellyfish/tokens` | `design-system/packages/tokens/build/css/utilities.css` |

---

## Estados interativos (focus, hover, active, disabled)

O design system expõe a classe **`.interactive`** em `utilities.css`. Ela fornece hover, active, focus-visible e estados opcionais (`[data-loading]`, `[data-dragging]`).

**Regras:**
- Componentes interativos **devem** usar a classe `interactive` no elemento que recebe foco/clique
- **Raramente** criar estilos próprios para focus/hover/active — exceção: inputs com borda de foco própria (`jf-input-color-bd-focus`) quando o design exigir, e documentar a exceção
- `cursor-pointer` obrigatório em elementos clicáveis
- Loading: `data-loading={loading || undefined}` — o `.interactive[data-loading]` de `utilities.css` já aplica opacidade e `pointer-events: none`

---

## Componentes baseados em Control

- Reutilizar variantes de `Control.variants.ts` (`size`, `fullWidth`, `radius`, etc.)
- `controlVariants` e as variantes do componente são aplicadas **no mesmo elemento** — sem wrapper extra
- Control não define borda — borda é responsabilidade do componente filho
- `resolvedStyle` mescla `controlStyle + componentVariantStyle`
- **Nunca** duplicar no `base` classes que já vêm de `controlVariants` (`d-inline-flex`, `items-center`, `w-full`, `h-full`)

---

## Integração com design tokens

| Categoria | Uso em CSS | Referência JS |
|-----------|-----------|---------------|
| Cores | `var(--jf-color-bg-*)`, `--jf-color-fg-*` | `colors.bg`, `colors.fg` |
| Tamanhos | `var(--jf-size-1)` | `size[1]` |
| Raio | `var(--jf-corner-radius-*)` | `radius.default` |
| Genérico | — | `tokenVar('jf-size-24')` |

**Ordem de preferência**: 1) Utility classes → 2) `var(--jf-*)` onde não há utility → 3) Valores calculados apenas se necessário.

---

## Responsividade

JFV usa prefixo `screen-*` (ex: `screen-md:p-4`). Variantes aceitam objeto responsivo `{ initial, sm, md, lg, xl }`. Consulte `packages/ui/src/variants.ts` para breakpoints disponíveis.

---

## Referências no monorepo

| Recurso | Caminho |
|---------|--------|
| Storybook | `design-system/apps/js-docs` |
| Template de stories | `STORYBOOK_STORY_MODEL.md` |
| Variants (JFV) | `design-system/packages/ui/src/variants.ts` |
| Tokens (vars) | `design-system/packages/tokens/src/vars.js` |
| Utilities CSS | `design-system/packages/tokens/build/css/utilities.css` |
| Guia de utilities | `UTILITY_CLASSES_GUIDE.md` |

Externas: [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) · [APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) · [Radix UI](https://www.radix-ui.com/)

---

**Última atualização**: 2026-02-23