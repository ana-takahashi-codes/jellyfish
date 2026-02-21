# Guia de Desenvolvimento de Componentes UI

> **Objetivo**: Garantir consistência, performance, acessibilidade e escalabilidade em todos os componentes do design system Jellyfish.

Toda a documentação de construção de componentes fica em **`packages/ui/guides/`**.

**Regra Cursor**: Ao criar um novo componente, você **DEVE** ler todos os arquivos desta pasta (`packages/ui/guides/`) antes de implementar. Estes guias são a fonte única de verdade.

---

## Processo obrigatório de criação

Siga este fluxo em toda criação de componente:

1. **Análise do Figma** — Solicitar acesso ao arquivo Figma ou especificações; extrair estrutura, layout, espaçamento, cores (variáveis), tipografia, dimensões, bordas, estados (default, hover, focus, active, disabled), variantes e props. Se **width = height** no Figma, verificar em `utilities.css` a classe `.size-{N}` correspondente (ver [UTILITY_CLASSES_GUIDE.md](./UTILITY_CLASSES_GUIDE.md)).
2. **Mapeamento Figma → Tokens** — Listar variáveis do Figma e mapear para tokens em `@jellyfish/tokens`; se não existir token, sinalizar antes de continuar.
3. **Estrutura de arquivos** — Criar pasta do componente com os arquivos obrigatórios (ver abaixo).
4. **Implementação** — Variants → types → component; opcional: stories e testes.
5. **Validação** — Usar o checklist final e o code review checklist abaixo.

**Resposta esperada ao receber uma solicitação de componente**: informar que vai criar o componente e pedir link/specs do Figma (ou especificações completas: estrutura, layout, espaçamentos, cores com variáveis, tipografia, bordas, estados, variantes e API). Só seguir com os próximos passos após receber essas informações.

**Regras críticas**:
- **NUNCA** começar a implementar sem analisar o Figma (ou specs equivalentes).
- **NUNCA** usar valores hardcoded — sempre tokens ou utility classes.
- **NUNCA** omitir arquivos obrigatórios da estrutura.
- **SEMPRE** seguir o fluxo acima e validar com os checklists.
- **SEMPRE** que o componente tiver largura e altura iguais no Figma, usar `.size-{N}` correspondente em `utilities.css`.

---

## Estrutura do monorepo (referência)

| O quê | Onde | Como importar |
|-------|------|----------------|
| **Sistema de variantes (JFV)** | **`@jellyfish/ui`** | `import { jfv, cn, VariantPropsOf } from '@jellyfish/ui/variants'` ou path relativo `../../variants` |
| **Referências de tokens (vars)** | **`@jellyfish/tokens`** | `import { colors, size, radius, fontSize, tokenVar } from '@jellyfish/tokens/vars'` |
| **Re-export de tokens no UI** | **`@jellyfish/ui`** | `import { colors, size, radius, fontSize, tokenVar } from '@jellyfish/ui/tokens'` |
| **Utility classes CSS** | **`@jellyfish/tokens`** | Arquivo `design-system/packages/tokens/build/css/utilities.css` (incluir no app ou usar build do tokens) |

- **Variants** (`variants.ts`): fica no pacote **ui** — contém `jfv`, `cn`, `VariantPropsOf`, `variants` (alias de `jfv`).
- **Vars** (`vars.js` + `vars.d.ts`): fica no pacote **tokens** — contém referências aos tokens (`colors`, `size`, `radius`, `fontSize`, `tokenVar`). O pacote ui re-exporta em `@jellyfish/ui/tokens` para conveniência.

---

## Estrutura de arquivos do componente

Todo componente deve seguir esta estrutura:

```
ComponentName/
├── ComponentName.tsx          # Implementação principal
├── ComponentName.variants.ts  # Definição de variantes (JFV)
├── ComponentName.types.ts     # TypeScript types (NÃO .tsx)
├── index.ts                   # Barrel export
└── README.md                  # Documentação (opcional)
```

### Não fazer

- `ComponentName.types.tsx` — TSX desnecessário para tipos puros
- `Component.tsx` — nome inconsistente
- `types.ts` — sem prefixo do componente

---

## Storybook e stories

O **Storybook** do design system fica em **`design-system/apps/js-docs`**. Ao criar ou documentar um componente, os stories devem ficar em `apps/js-docs/stories/` (por exemplo em `stories/basic-components/`).

**Regras críticas de stories:**
- Stories são **sempre `.stories.tsx`** — nunca `.stories.mdx`. O setup atual (Storybook 10 + `@storybook/react-vite`) não suporta MDX sem `@storybook/blocks` instalado.
- O `meta` deve incluir **`tags: ['autodocs']`** — isso gera automaticamente a página de docs com descrição, ArgTypes e canvas de cada story.
- A primeira story exportada deve se chamar **`Playground`** (nunca `Default`).
- Toda documentação markdown fica em `parameters.docs.description.component`.

Siga o template completo em [STORYBOOK_STORY_MODEL.md](../docs/STORYBOOK_STORY_MODEL.md).

---

## Template de componente

### 1) ComponentName.types.ts

```typescript
import type { ComponentPropsWithoutRef } from 'react'

export type ComponentVariant = 'primary' | 'secondary' | 'tertiary'
export type ComponentSize = 'sm' | 'md' | 'lg'

export interface ComponentProps
  extends ComponentPropsWithoutRef<'div'> {
  variant?: ComponentVariant
  size?: ComponentSize
  disabled?: boolean
  children?: React.ReactNode
  label?: string
  className?: string
}
```

**Regras**: Use `ComponentPropsWithoutRef<T>` ou `React.HTMLAttributes<T>` como base; agrupe props por categoria; evite `any`/`unknown` sem justificativa.

---

### 2) ComponentName.variants.ts

O sistema de variantes (JFV) fica no **pacote ui** (`src/variants.ts`). Importe `jfv` (ou `variants`, que é alias) de `@jellyfish/ui/variants` ou por path relativo (ex.: `../../variants`).

```typescript
import { jfv } from '../../variants'
import type { VariantPropsOf } from '../../variants'

export const componentVariants = jfv({
  base: [
    'd-inline-flex',
    'items-center',
    'justify-center',
    'rounded-[var(--jf-corner-radius-2)]',
    'cursor-pointer',
  ],
  variants: {
    variant: {
      primary: ['bg-accent', 'fg-on-accent'],
      secondary: ['bg-neutral', 'fg-on-neutral'],
    },
    size: {
      sm: ['gap-1', 'h-8', 'p-x-3'],
      md: ['gap-2', 'h-10', 'p-x-4'],
      lg: ['gap-3', 'h-12', 'p-x-6'],
      // Se for quadrado (width = height), use .size-* — ver UTILITY_CLASSES_GUIDE.md
      icon: ['size-10'],
    },
    disabled: {
      true: ['cursor-not-allowed', 'opacity-50'],
      false: [],
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
})

export type ComponentVariants = VariantPropsOf<typeof componentVariants>
```

**Regras**:

- **SEMPRE prefira utility classes** para layout, spacing, cores e tipografia (ver [UTILITY_CLASSES_GUIDE.md](./UTILITY_CLASSES_GUIDE.md)).
- Quando **width = height** no Figma, use a classe **`.size-{N}`** correspondente ao token em `utilities.css`.
- Use tokens `var(--jf-*)` apenas onde não houver utility; nunca valores hardcoded.
- No JFV do jellyfish, `base` e variantes podem ser **array de strings** (classes) ou string única.

**Ordem de preferência**: 1) Utility classes  2) CSS/tokens quando não há utility  3) Valores calculados só se necessário.

---

### 3) ComponentName.tsx

```typescript
import React, { forwardRef, useMemo } from 'react'
import { jfv, cn, type VariantPropsOf } from '@jellyfish/ui/variants'
import type { ComponentProps } from './ComponentName.types'
import { componentVariants } from './ComponentName.variants'

type Props = ComponentProps & VariantPropsOf<typeof componentVariants>

const Component = forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const { className: variantClassName, style: variantStyle } = useMemo(
      () => componentVariants({ variant, size, disabled }),
      [variant, size, disabled]
    )

    return (
      <div
        ref={ref}
        className={cn(variantClassName, className)}
        style={variantStyle}
        aria-disabled={disabled ? true : undefined}
        role="button"
        {...props}
      >
        {children}
      </div>
    )
  }
)

Component.displayName = 'Component'
export { Component }
```

**Regras**:

- **Performance**: use `useMemo` para o resultado de `componentVariants`; evite chamar variantes direto no render.
- **Acessibilidade**: `role` e `aria-*` adequados; suporte a `ref` com `forwardRef`.
- **TypeScript**: use `VariantPropsOf<typeof componentVariants>` para as props de variante; tipagem estrita no `forwardRef`.

---

### 4) index.ts

```typescript
export { Component } from './ComponentName'
export type { ComponentProps, ComponentVariant, ComponentSize } from './ComponentName.types'
export type { ComponentVariants } from './ComponentName.variants'
```

Exporte componente, tipos públicos e tipo de variants.

---

## Estados interativos (focus, hover, active, disabled)

No Figma, componentes como o Control podem exibir um estado de **focus** (ou outros estados) por conveniência de design. **No código, focus não é uma variante**: cada componente interativo deve ter seu estado de foco (e hover, active) padrão fornecido pelas **utility classes** em `utilities.css`.

O design system expõe a classe **`.interactive`** em `design-system/packages/tokens/build/css/utilities.css` (seção "INTERACTIVE STATES"). Ela fornece:

- Hover (opacidade via `--jf-opacity-hover`)
- Active (overlay via `::after` com `--jf-color-bg-active`)
- Focus visível (outline com `--jf-control-color-bd-focus`)
- Estados opcionais: `[data-loading]`, `[data-dragging]`

**Regras:**

- **É obrigatório** que componentes interativos (botões, links, áreas clicáveis) consumam esses estilos — ou seja, apliquem a classe `interactive` no elemento que recebe foco/clique.
- **Sempre** que o componente for interativo e estiver disponível para clique, use **`cursor: pointer`** (ou a utility `cursor-pointer`).
- **Raramente** crie estilos específicos por componente para estados interativos (focus, hover, active). Use as utilities; exceção: inputs que sobrescrevem `:focus-visible` com borda própria (ex.: token `jf-input-color-bd-focus`) quando o design exigir.
- Valide ao criar ou revisar componentes: o elemento interativo usa `interactive` (ou a utility adequada) e não duplica lógica de focus/hover/active no CSS do componente.

---

## Componentes baseados em Control

Quando o componente tiver dependência do componente **Control**, ele deve:

- **Reutilizar as variantes do Control**: puxar os estilos já parametrizados em `Control.variants.ts` e trabalhar com essas variantes do Control (size, fullWidth, radius, etc.).
- **Control como base**: o Control funciona como base de alguns componentes; nele, além de label, podem ser inseridos outros elementos como ícones, badges, etc.
- **Control não possui borda**: o Control em si não define borda; a borda é responsabilidade do componente que o utiliza (quando aplicável).

### Variantes solid, outline e ghost (Figma)

Se no Figma existirem as variantes **solid**, **outline** e **ghost**:

- **Apenas outline tem borda.** As variantes solid e ghost **não** devem receber `border` transparente; evite borda nas demais.
- Para **outline**, a borda deve ter a **espessura especificada no Figma** (mapeada para o token ou utility correspondente).

### Borda com token jf/bd/width/0-5 (ou valor 1)

Se no Figma a borda consumir o token **`jf/bd/width/0-5`** ou o valor for igual a **1**, o correto é utilizar a classe **`.bd-0-5`** combinada com a classe **`.box-border`** (para que a espessura da borda seja considerada no box model).

---

## Integração com design tokens

### Tokens (variáveis CSS)

Os valores reais vêm dos temas em `@jellyfish/tokens` (CSS). Para referências em JS/TS use **`@jellyfish/tokens/vars`** (ou `@jellyfish/ui/tokens`):

| Categoria   | Uso em CSS (nos componentes)   | Referência JS (vars)     |
|------------|---------------------------------|--------------------------|
| Cores      | `var(--jf-color-bg-*)`, `--jf-color-fg-*` | `colors.bg`, `colors.fg` |
| Tamanhos   | `var(--jf-size-1)`, …           | `size[1]`, `size[24]`    |
| Raio       | `var(--jf-corner-radius-*)`     | `radius.default`, etc.   |
| Tipografia | Ver abaixo                      | `fontSize.md`, etc.      |
| Genérico   | —                               | `tokenVar('jf-size-24')` |

**Tokens tipográficos**: só são considerados tipográficos os tokens que referenciam exatamente uma destas propriedades CSS: **font-size**, **font-weight**, **letter-spacing**, **line-height**, **font-family**. Qualquer outro não segue o padrão e não é token tipográfico. Detalhes em `@jellyfish/tokens` → [README – Tokens tipográficos](../../tokens/README.md#tokens-tipográficos).

Arquivo de utilities: **`design-system/packages/tokens/build/css/utilities.css`** (classes `.p-1`, `.m-1`, `.gap-2`, `.size-24`, `.bg-*`, `.fg-*`, etc.).

### Regras

- Prefira **utility classes** para layout, spacing, tipografia e cores.
- Quando **width = height**, use **`.size-{N}`** (ver [UTILITY_CLASSES_GUIDE.md](./UTILITY_CLASSES_GUIDE.md)).
- Use CSS com tokens (`var(--jf-*)`) só onde não houver utility; nunca valores fixos (ex.: `16px`, `#000`).

---

## Responsividade

O JFV no ui usa breakpoints com prefixo `screen-*` (ex.: `screen-md:p-4`). Variantes podem receber valor responsivo conforme a API de `variants.ts` (ex.: objeto com `initial`, `sm`, `md`, `lg`, `xl`). Consulte `packages/ui/src/variants.ts` para a lista exata de breakpoints.

---

## Checklist de acessibilidade

- [ ] Navegação por teclado (Tab, Enter, Space, setas quando fizer sentido)
- [ ] `role` e `aria-*` adequados (`aria-label`, `aria-disabled`, etc.)
- [ ] Contraste WCAG AA quando aplicável
- [ ] Foco visível; suporte a `prefers-reduced-motion` quando houver animação

---

## Checklist final (antes de dar por completo)

- [ ] Extraiu todas as informações do Figma (ou specs).
- [ ] Se o componente tem width = height no Figma, usou `.size-{N}` correspondente em `utilities.css`.
- [ ] Mapeou variáveis Figma → tokens.
- [ ] Estrutura de pastas e arquivos obrigatórios criada.
- [ ] Tokens CSS (`var(--jf-*)`) ou utility classes; sem valores hardcoded.
- [ ] Variantes e estados (hover, focus, active, disabled) implementados.
- [ ] TypeScript com tipos completos; tipos exportados.
- [ ] Storybook (em `apps/js-docs`) com stories seguindo o template [STORYBOOK_STORY_MODEL.md](../docs/STORYBOOK_STORY_MODEL.md): descrição, exemplos e link para Figma (quando houver).
- [ ] Acessibilidade (ARIA, teclado, foco visível) verificada.
- [ ] Estados interativos (focus, hover, active) consumidos de `utilities.css` (classe `interactive`); sem estilos próprios para esses estados, salvo exceção documentada.

## Code review checklist

- **Estrutura**: nomenclatura `ComponentName.*`, tipos em `.types.ts`, variants em `.variants.ts`, `index.ts` exporta o necessário.
- **Performance**: `useMemo` para variantProps quando fizer sentido; evitar re-renders desnecessários.
- **Tokens**: apenas `var(--jf-*)` ou referências de `@jellyfish/tokens/vars`; sem hardcode.
- **Utilities**: preferir classes de `utilities.css`; se width = height, usar `.size-{N}`.
- **Estados interativos**: consumir a classe `interactive` de `utilities.css` para focus/hover/active; evitar estilos próprios para esses estados (ver seção "Estados interativos" acima).
- **TypeScript**: sem `any`/`as any` sem justificativa; tipos exportados.

---

## Referências no monorepo

| Recurso            | Caminho |
|--------------------|--------|
| **Storybook** | `design-system/apps/js-docs` |
| **Template de stories** | [STORYBOOK_STORY_MODEL.md](../docs/STORYBOOK_STORY_MODEL.md) |
| **Variants (JFV)** | `design-system/packages/ui/src/variants.ts` |
| **Tokens (vars)** | `design-system/packages/tokens/src/vars.js` + `vars.d.ts` |
| **Utilities CSS** | `design-system/packages/tokens/build/css/utilities.css` |
| **Guia de utilities** | [UTILITY_CLASSES_GUIDE.md](./UTILITY_CLASSES_GUIDE.md) |

Externas: [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/), [Radix UI Patterns](https://www.radix-ui.com/).

---

**Última atualização**: 2026-02-20
