# Design System Component: Button

## 📋 Contexto
Você é um especialista em design systems desenvolvendo componentes para a biblioteca UI. Execute o pipeline abaixo **na ordem exata**. Não escreva nenhum código antes de concluir os STEPs 1, 2 e 3.

---

## 🔄 Pipeline

### STEP 1 — Leitura da Documentação do Projeto
1. Acesse **todos** os arquivos dentro de `docs/` no pacote `ui`
2. Internalize diretrizes, convenções de nomenclatura, padrões de variantes e utilitários disponíveis
3. Confirme a leitura antes de avançar

---

### STEP 2 — Extração do Figma via MCP

Acesse os dois nós abaixo e extraia as informações indicadas:

| Finalidade | Link |
|---|---|
| Estrutura principal | https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2036-683&t=vxsxN5FmKFW1Osqq-11 |
| Variantes | https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2040-5016&t=vxsxN5FmKFW1Osqq-11 |

**Documente obrigatoriamente:**
- Nome exato do componente no Figma
- Todas as propriedades e seus valores possíveis
- Estados (default, hover, focus, disabled, loading, etc.)
- Slots e áreas de conteúdo (startIcon, label, endIcon, etc.)
- Tokens de design utilizados (cor, espaçamento, tipografia, raio, etc.)

---

### STEP 3 — Análise de Sub-componentes e Filtragem de Props

Para cada sub-componente identificado no Figma:

1. Verifique em `docs/` se há restrições de exposição de props
2. Preencha a tabela abaixo com base no que foi encontrado (substitua os exemplos pelos dados reais):

| Sub-componente | Prop | Expor? | Motivo |
|---|---|---|---|
| _(preencher após análise)_ | | | |

> **Regra geral para o componente Icon acoplado:**
> - `name` → ✅ expor (configurável pelo consumidor)
> - `size` → ❌ não expor (controlado internamente pelo tamanho do botão)
> - `fill/color` → ❌ não expor (assumir a cor da variante do botão via `getIconFgClass`)

---

### STEP 4 — Implementação

#### 4.1 Arquitetura do Componente

O Button é composto por **um único elemento `<button>`** que recebe duas camadas de variantes aplicadas diretamente, sem wrapper:

```
<button>
  ├── controlVariants({ size, fullWidth, radius })   → fornece: d-inline-flex, items-center, height, gap, paddingInline
  └── buttonVariants({ variant, color })             → fornece: cores, borda e background
```

`resolvedStyle` = merge de `controlStyle` + `buttonVariantStyle`.

---

#### 4.2 Arquivo `Button.variants.ts`

**Regras do `base`** — inclua **apenas** as classes exclusivas do Button:
```
interactive  cursor-pointer  justify-center  jf-button-font-label
```
❌ Não inclua `d-inline-flex`, `items-center`, `w-full`, `h-full` — já vêm de `controlVariants`.

---

**Regras por `variant`:**

| Variant | Implementação |
|---|---|
| `solid` | `{ border: 'none' } as CSSProperties` |
| `ghost` | `{ border: 'none' } as CSSProperties` |
| `outline` | `'bd-0-5 box-border'` + compound variant `{ variant: 'outline', style: { borderStyle: 'solid' } as CSSProperties }` |

> ⚠️ Nunca use `border-0` — essa classe não existe em `utilities.css`. O reset de borda é feito via `CSSProperties` inline.
>
> ⚠️ O JFV aceita `string | CSSProperties` em variant values — não suporta objeto misto `{ class, ...style }`. Use compound variant separado para o `borderStyle` do outline.

---

**Compound variants por `color`:**

| Variant | Classe de cor |
|---|---|
| `solid` | `bg-{color}` + `fg-on-{color}` |
| `outline` | `bd-{color}` + `bg-transparent` + `fg-{color}` _(neutral → `fg-strong`)_ |
| `ghost` | `bg-{color}-soft` + `fg-{color}` _(neutral → `fg-strong`)_ |

---

#### 4.3 Comportamento por Prop

**`iconOnly`**
- `width` = `minWidth` = `height` = `controlHeightBySize[size]`
- ❌ Não use tokens `--jf-control-min-width-*` — não existem no build
- Se `iconOnly: false` → `min-width: w-min-40`

**`loading`**
- Adicionar `data-loading={loading || undefined}` + `aria-busy={loading || undefined}` no `<button>`
- O `.interactive[data-loading]` de `utilities.css` aplica opacidade e `pointer-events: none` automaticamente
- O `startIcon` recebe `name="loader-2"` + `className="motion-spin"` e fica centralizado
- `label` e `endIcon` ficam ocultos
- O botão **mantém a mesma largura** — nenhuma dimensão muda

**`focus`**
- Implementar via `.interactive:focus-visible` de `utilities.css`
- O estado "focus" do Figma (Control) deve ser transposto para esta classe

**`getIconFgClass(variant, color)`**
- `solid` → `fg-on-{color}`
- `outline` / `ghost` → `fg-strong` (quando neutral) ou `fg-{color}`

---

#### 4.4 Storybook

- Expor `startIcon` e `endIcon` como props de `name` (ícone padrão: `"cheese"`)
- Garantir renderização de fontes para todos os componentes
- Cobrir os estados: default, hover, focus, disabled, loading, iconOnly

---

### STEP 5 — Divergências de Implementação vs. Figma

As seguintes decisões foram tomadas intencionalmente e **não devem ser revertidas**:

| # | Figma | Implementação |
|---|---|---|
| 1 | Control possui estado `focus` | Implementar via `.interactive:focus-visible` em `utilities.css` |
| 2 | Control possui `min-width` próprio | `min-width` do Control só se aplica quando `iconOnly: true`. Se `iconOnly: false`, usar `w-min-40` |

---

## ✅ Checklist Final

Antes de entregar, confirme cada item:

- [ ] Arquivos em `docs/` lidos e internalizados
- [ ] Figma acessado via MCP (estrutura principal + variantes)
- [ ] Sub-componentes identificados e tabela de props preenchida com dados reais
- [ ] `Button.variants.ts` criado com JFV
- [ ] Todas as variantes e estados do Figma estão mapeados
- [ ] `defaultVariants` reflete o estado padrão do Figma
- [ ] Divergências da tabela do STEP 5 respeitadas
- [ ] `displayName` definido no componente
- [ ] Tipos exportados corretamente
- [ ] Storybook cobre todos os estados com fontes renderizando corretamente