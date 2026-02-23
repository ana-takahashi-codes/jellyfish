# Button

## Descrição

O **Button** é um componente interativo para acionar ações, enviar formulários ou iniciar fluxos. É construído sobre o Control e herda suas props (size, fullWidth, radius), acrescentando variantes visuais (solid, outline, ghost) e cores semânticas.

- **Base**: `interactive`, `cursor-pointer`, `justify-center`, `jf-button-font-label`
- **Layout**: controlVariants (altura, gap, padding, fullWidth, radius)
- **Visual**: buttonVariants (variant × color)
- **iconOnly**: largura = altura (altura do Control); exige `aria-label`
- **startIcon / endIcon**: ao usar Icon, o fill é definido automaticamente para a mesma cor da label (variant × color)
- **Estados**: focus-visible, hover e active vêm da classe `.interactive` (utilities.css); loading usa `[data-loading]` e spinner com `.motion-spin`

---

## Quando usar

- Ações primárias ou secundárias em formulários e telas
- Submissão de formulários (`type="submit"`) ou reset (`type="reset"`) quando explícito
- Botões apenas com ícone (`iconOnly`) com `aria-label` obrigatório

## Quando NÃO usar

- Links de navegação → use `<a>` ou componente Link
- Apenas texto clicável sem aparência de botão

---

## Tipos e variações

### Variantes visuais (variant)

| Variant   | Descrição |
|----------|-----------|
| `solid`  | Fundo preenchido com a cor semântica |
| `outline`| Borda com cor semântica, fundo transparente |
| `ghost`  | Sem borda, fundo suave (soft) com cor semântica |

### Cores semânticas (color)

| Color           | Uso típico |
|-----------------|------------|
| `neutral`       | Ações secundárias neutras |
| `brand-primary` | Ação primária da marca (default) |
| `accent`        | Destaque ou CTA |
| `critical`      | Ações destrutivas (ex.: excluir) |

### Tamanhos (size)

| Size | Altura (token) |
|------|----------------|
| `sm` | `--jf-control-height-sm` (36px) |
| `md` | `--jf-control-height-md` (44px) |
| `lg` | `--jf-control-height-lg` (48px) |

### Raio (radius)

| Radius    | Uso |
|-----------|-----|
| `none`    | Cantos retos |
| `default` | Raio padrão do Control |
| `pill`    | Completamente arredondado |

### Estados

- **Enabled / Disabled**: `disabled` aplica opacidade reduzida e `cursor-not-allowed`
- **Loading**: `aria-busy`, spinner no lugar do startIcon, label mantida (oculta visualmente) para manter largura

---

## API (props principais)

| Prop        | Tipo | Default | Descrição |
|-------------|------|---------|-----------|
| `type`      | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo nativo (default evita submit acidental) |
| `variant`   | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Estilo visual |
| `color`     | `'neutral' \| 'brand-primary' \| 'accent' \| 'critical'` | `'brand-primary'` | Cor semântica |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho (Control) |
| `fullWidth` | `boolean` | `false` | Ocupa 100% da largura |
| `radius`    | `'none' \| 'default' \| 'pill'` | `'default'` | Raio da borda |
| `iconOnly`  | `boolean` | `false` | Apenas ícone; exige `aria-label` |
| `loading`   | `boolean` | `false` | Estado de carregamento |
| `disabled`  | `boolean` | `false` | Desabilita o botão |
| `startIcon` | `string`  | — | Nome do ícone antes do label |
| `endIcon`   | `string`  | — | Nome do ícone depois do label |
| `aria-label`| `string`  | — | **Obrigatório** quando `iconOnly` |
| `aria-describedby` | `string` | — | ID do elemento que descreve o botão |
| `aria-controls`    | `string` | — | ID do elemento controlado (ex.: menu) |
| `aria-expanded`    | `boolean`| — | Estado expandido (dropdown/menu) |
| `aria-pressed`     | `boolean`| — | Estado pressed (toggle) |
| `aria-haspopup`    | `boolean \| 'menu' \| 'listbox' \| ...` | — | Tipo de popup |

---

## Acessibilidade

- **type="button"** é o default; use `type="submit"` ou `type="reset"` apenas quando intencional.
- **iconOnly** exige **aria-label** (recomendado validar em dev se ausente).
- **Loading**: `aria-busy` e label mantida no DOM para leitores de tela.
- **Teclado**: Tab, Enter e Space (comportamento nativo de `<button>`).
- **Focus**: classe `.interactive` fornece `focus-visible` e estados hover/active.
- Para menus/dropdowns: use `aria-expanded`, `aria-haspopup`, `aria-controls` conforme o padrão ARIA.

---

## Design tokens

| Token / classe | Uso |
|----------------|-----|
| `--jf-control-height-sm/md/lg` | Altura por size |
| `jf-button-font-label` | Tipografia do label |
| `--jf-control-corner-radius` | Raio (radius="default") |

---

## Figma

- **Variantes do Button**: [Figma – Basic Components – Button (node 2040-5016)](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2040-5016)

---

## Changelog

| Data | Alteração | Issue |
|------|-----------|--------|
| — | Documentação inicial do componente Button na wiki (Coda). | _Adicione o link da issue aqui quando disponível._ |

---

## Referências

- **Storybook**: Basic/Button (Playground, Variants, Sizes, States, WithStartIcon, WithEndIcon, IconOnly, FullWidth, Radius, Accessibility)
- **Código**: `@jellyfish/ui/button` — `Button.tsx`, `Button.types.ts`, `Button.variants.ts`
- **Control**: Button estende o Control; ver documentação do Control para size, fullWidth e radius.
