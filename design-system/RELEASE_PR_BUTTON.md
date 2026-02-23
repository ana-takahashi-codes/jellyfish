# Commit & PR description — Release Button + Vitest fix

## Commits sugeridos

Use dois commits (ou um único commit com as duas partes, conforme preferir):

### 1. Componente Button

```
feat(ui): add Button component

- Variants: solid, outline, ghost × neutral, brand-primary, accent, critical
- Sizes: sm, md, lg (Control); fullWidth, radius (Control)
- type default 'button'; suporte a submit e reset
- startIcon/endIcon com cor alinhada à label (getButtonLabelFgClass + Icon fill)
- iconOnly (width = height); loading (aria-busy, motion-spin)
- Base: interactive, cursor-pointer, justify-center, jf-button-font-label
- Border: 0 em solid/ghost; outline com bd-0-5 + borderStyle solid
- Export: getButtonLabelFgClass para uso externo

Closes #60
```

### 2. Correção Vitest (js-docs)

```
fix(js-docs): fix Vitest config for Storybook addon-vitest

- optimizeDeps.include para react, addon-a11y, react-vite (evita reload)
- exclude addon-vitest setup-file.js para evitar "Vitest failed to find the runner"
- storybookScript: pnpm storybook --no-open
- Scripts: test (vitest run --project=storybook), test:watch
```

---

## PR Description (copiar no GitHub)

```markdown
## Summary

- **feat(ui):** Novo componente `Button` no pacote `@jellyfish/ui`, baseado em Control (issue #60).
- **fix(js-docs):** Ajuste da configuração Vitest para o addon Storybook; testes das stories passando.

## Button — Descrição

Componente interativo para acionar ações, enviar formulários ou iniciar fluxos. Estende o layout do Control (size, fullWidth, radius); usa `type="button"` por padrão para evitar submit acidental. Suporta variantes visuais (solid, outline, ghost × cores), ícones (startIcon/endIcon com mesma cor da label), iconOnly e estado de loading.

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo nativo do botão |
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Estilo visual |
| `color` | `'neutral' \| 'brand-primary' \| 'accent' \| 'critical'` | `'brand-primary'` | Cor semântica |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Altura/padding (Control) |
| `fullWidth` | `boolean` | `false` | Largura 100% (Control) |
| `radius` | `'none' \| 'default' \| 'pill'` | `'default'` | Raio da borda (Control) |
| `iconOnly` | `boolean` | `false` | Apenas ícone; exige `aria-label`; width = height |
| `loading` | `boolean` | `false` | Estado de carregamento (aria-busy, motion-spin) |
| `disabled` | `boolean` | `false` | Desabilita o botão |
| `startIcon` | `ReactNode` | — | Ícone/elemento antes do label |
| `endIcon` | `ReactNode` | — | Ícone/elemento depois do label |
| `children` | `ReactNode` | — | Label do botão |
| `className` | `string` | — | Classes CSS adicionais |
| `aria-label` | `string` | — | Obrigatório quando `iconOnly` |
| (demais) | | | Atributos nativos de `<button>` e ARIA |

## Acessibilidade

- `type="button"` é o default; use `type="submit"` ou `type="reset"` apenas quando intencional.
- `iconOnly` exige `aria-label` (warning em dev se ausente).
- Loading: `aria-busy` e label mantido visível.
- Navegação por teclado: Tab, Enter, Space (comportamento nativo de `<button>`).
- Classe `.interactive` fornece focus-visible e estados hover/active (utilities.css).
- Função `getButtonLabelFgClass(variant, color)` exportada para alinhar cor de ícones customizados à label.

## Vitest (js-docs)

- Config ajustada para o addon `@storybook/addon-vitest`: `optimizeDeps.include` e `exclude` do setup-file do addon evitam o erro "Vitest failed to find the runner".
- Scripts: `pnpm test` (run) e `pnpm run test:watch` (watch) no app js-docs.

## Links

- **Issue:** Closes #60
- **Figma (variantes):** [Basic Components – Button](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2040-5016)

## Breaking changes

Nenhum (componente novo).
```
