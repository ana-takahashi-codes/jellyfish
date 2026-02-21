# Guia de Utility Classes - Jellyfish Design System

> Como usar corretamente as utility classes do pacote `@jellyfish/tokens` nos componentes do pacote `@jellyfish/ui`.

**Localização das utilities no monorepo**: `design-system/packages/tokens/build/css/utilities.css`

Toda a documentação referente à construção de componentes fica em **`packages/ui/guides/`**.

---

## Regra: Dimensões quadradas (width = height)

**Quando o componente no Figma tiver altura e largura iguais**, use a classe de utility **`.size-{N}`** em vez de definir `width` e `height` separadamente.

- As classes `.size-*` estão em `@jellyfish/tokens` → `build/css/utilities.css`.
- Cada `.size-{N}` aplica `width` e `height` ao mesmo token: `var(--jf-size-{N})`.
- **Exemplo**: token `jf-size-24` → usar a classe **`size-24`** (não `w-24` + `h-24` nem valores inline).

```typescript
// ✅ CORRETO: elemento quadrado com token jf-size-24
class: 'size-24'

// ❌ EVITAR: repetir o mesmo token em width e height
class: 'w-24 h-24'
// ou
style: { width: 'var(--jf-size-24)', height: 'var(--jf-size-24)' }
```

**Checklist**: Ao implementar um componente, se no Figma **width = height**, verifique em `utilities.css` se existe `.size-{N}` correspondente ao token e use essa classe.

---

## Filosofia: Utility-First

**Regra de Ouro**: **SEMPRE prefira utility classes sobre CSS-in-JS inline.**

### Ordem de Preferência

```typescript
// 1️⃣ MELHOR: Utility classes
class: 'd-flex items-center gap-2'

// 2️⃣ BOM: CSS-in-JS com tokens (quando não há utility)
style: { height: 'var(--jf-size-10)' }

// 3️⃣ EVITAR: CSS-in-JS inline (apenas se absolutamente necessário)
style: { transform: 'translateX(calc(100% + 8px))' }

// 4️⃣ NUNCA: Valores hardcoded
style: { padding: '16px' } // ❌ ERRADO
```

---

## Utility Classes Disponíveis

O arquivo completo está em **`design-system/packages/tokens/build/css/utilities.css`**. As classes são geradas a partir dos tokens; abaixo está um resumo por categoria.

### Layout & Display

```css
.d-block           /* display: block */
.d-inline-block    /* display: inline-block */
.d-flex            /* display: flex */
.d-inline-flex     /* display: inline-flex */
.d-grid            /* display: grid */
.d-hidden          /* display: none */

.flex-row          /* flex-direction: row */
.flex-col          /* flex-direction: column */
.flex-row-reverse
.flex-col-reverse

.flex-wrap         /* flex-wrap: wrap */
.flex-nowrap       /* flex-wrap: nowrap */

.justify-start     /* justify-content: flex-start */
.justify-end
.justify-center
.justify-between
.justify-around
.justify-evenly

.items-start       /* align-items: flex-start */
.items-end
.items-center
.items-baseline
.items-stretch

.self-auto
.self-start
.self-end
.self-center
.self-stretch
```

### Spacing (padding e margin)

Escala numérica baseada em `jf-size-*` (ex.: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24, …).

```css
/* Padding */
.p-1               /* padding: var(--jf-size-1) */
.p-2, .p-3, .p-4 …
.p-t-1             /* padding-top */
.p-r-1, .p-b-1, .p-l-1
.p-x-1             /* padding-left + padding-right */
.p-y-1             /* padding-top + padding-bottom */

/* Margin (mesma lógica) */
.m-1, .m-2 …
.m-t-1, .m-r-1, .m-b-1, .m-l-1
.m-x-1, .m-y-1
```

### Gap

```css
.gap-1             /* gap: var(--jf-size-1) */
.gap-2, .gap-3 …
.gap-x-1           /* column-gap */
.gap-y-1           /* row-gap */
```

### Size (width + height iguais)

**Use quando o elemento for quadrado (mesma largura e altura).**

```css
.size-1            /* width + height: var(--jf-size-1) */
.size-2, .size-3, .size-4 …
.size-8, .size-10, .size-12, .size-16, .size-24, .size-32 …
```

Variantes responsivas existem (ex.: `.screen-md\:size-24`). Consulte `utilities.css` para a lista exata.

### Sizing (width / height separados)

Quando **não** for quadrado, use as classes de largura e altura separadas:

```css
.w-1, .h-1         /* width / height: var(--jf-size-1) */
.w-min-1, .h-min-1 /* min-width / min-height */
.w-max-1, .h-max-1 /* max-width / max-height */
```

### Position

```css
.pos-static
.pos-relative
.pos-absolute
.pos-fixed
.pos-sticky

.top-0, .right-0, .bottom-0, .left-0
```

### Cores (semânticas)

```css
/* Background */
.bg-*              /* tokens jf-color-bg-* */

/* Foreground (texto) */
.fg-*              /* tokens jf-color-fg-* */
```

Os sufixos dependem dos tokens definidos no tema (ex.: `bg-surface`, `fg-muted`). Verifique em `utilities.css` ou nos tokens.

### Bordas

```css
.bd-1              /* border-width: var(--jf-bd-width-1) */
.bd-t-1, .bd-r-1, .bd-b-1, .bd-l-1
.bd-x-1, .bd-y-1

.corner-0, .corner-2, .corner-4 …  /* border-radius */
```

### Tipografia

Presets de tipografia (ex.: `.font-title-sm`, `.font-text-md`, `.font-label-lg`) quando existirem. Consulte a seção **TYPOGRAPHY UTILITIES** em `utilities.css`.

**Definição de token tipográfico**: só são tokens tipográficos os que referenciam uma destas propriedades CSS — **font-size**, **font-weight**, **letter-spacing**, **line-height**, **font-family**. Qualquer outro não segue o padrão. Ver `packages/tokens/README.md` → “Tokens tipográficos”.

### Estados interativos

A classe **`.interactive`** (em `utilities.css`, seção "INTERACTIVE STATES") aplica estados padronizados a elementos clicáveis:

- **Hover**: opacidade (`--jf-opacity-hover`)
- **Active**: overlay com `--jf-color-bg-active`
- **Focus visível**: outline com `--jf-control-color-bd-focus`
- **Loading/Dragging**: via `[data-loading]` e `[data-dragging]`

Componentes interativos (botões, links, etc.) devem consumir `.interactive`; não crie estilos próprios para focus/hover/active salvo exceção documentada (ver [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md#estados-interativos-focus-hover-active-disabled)).

### Outros

```css
.cursor-pointer
.cursor-not-allowed
.select-none
.overflow-hidden
.overflow-auto
.visible
.invisible
```

---

## Exemplos de Uso Correto

### Elemento quadrado (ícone, avatar, botão de ícone)

```typescript
// ✅ CORRETO: usar .size-* quando width = height no Figma
base: {
  class: 'd-inline-flex items-center justify-center size-24',
}

// ❌ EVITAR
base: {
  class: 'd-inline-flex items-center justify-center w-24 h-24',
}
```

### Button com variantes de tamanho

```typescript
// ✅ CORRETO: utilities + tokens onde não há utility
export const buttonVariants = jfv({
  base: [
    'd-inline-flex',
    'items-center',
    'justify-center',
    'border',
    'rounded-[var(--jf-corner-radius-2)]',
    'cursor-pointer',
  ],
  variants: {
    size: {
      sm: ['gap-1', 'h-8', 'px-3'],        // altura/largura diferentes → w-* / h-*
      md: ['gap-2', 'h-10', 'px-4'],
      icon: ['size-10'],                    // quadrado → .size-*
    },
  },
})
```

### Card com layout e spacing

```typescript
// ✅ CORRETO
base: [
  'd-flex',
  'flex-col',
  'gap-4',
  'p-4',
  'rounded-[var(--jf-corner-radius-4)]',
  'bg-[var(--jf-color-bg-surface)]',
],
```

---

## Quando NÃO usar utilities

Use CSS com tokens (ou estilo inline com tokens) quando:

1. **Não existir utility** para a propriedade (ex.: `border-radius` com valor que não tem `.corner-*`).
2. **Valores dinâmicos ou calculados** (ex.: `calc(100% - var(--jf-size-16))`).
3. **Propriedades avançadas** (ex.: `clip-path`, gradientes complexos).
4. **Animações/transitions** com curvas ou duração específicas.

Mesmo nesses casos, **use sempre tokens** (`var(--jf-*)`), nunca valores fixos (ex.: `16px`, `#000`).

---

## Checklist ao criar/revisar componentes

- [ ] Layout usa utilities (`.d-flex`, `.items-center`, `.justify-*`).
- [ ] Espaçamento usa utilities (`.gap-*`, `.p-*`, `.m-*`).
- [ ] **Se width = height no Figma**: usa `.size-{N}` correspondente ao token em `utilities.css`.
- [ ] Cores e tipografia usam tokens ou utilities semânticas quando existirem.
- [ ] CSS-in-JS apenas para propriedades sem utility.
- [ ] Nenhum valor hardcoded (`16px`, `#ff0000`).
- [ ] Classes ordenadas de forma lógica (display → layout → spacing → size → colors).

---

## Ordem sugerida das classes

```text
display → flex/grid → alignment → spacing (gap, p, m) → size (size-* ou w-*/h-*) → typography → colors → states
```

Exemplo:

```typescript
class: 'd-flex items-center justify-center gap-2 size-24 font-label-md bg-accent fg-on-accent cursor-pointer'
```

---

## Referências no monorepo

| Recurso | Caminho |
|--------|--------|
| **Utilities CSS** | `design-system/packages/tokens/build/css/utilities.css` |
| **Tokens (CSS/JS)** | `design-system/packages/tokens/` (build + src) |
| **Config dos utilities** | `design-system/packages/tokens/scripts/utilities/utilities-mapping-dynamic.json` |
| **Regras de criação de componentes** | `packages/ui/guides/` (e regras em `.cursor/rules` conforme configurado) |

---

**Última atualização**: 2026-02-19
