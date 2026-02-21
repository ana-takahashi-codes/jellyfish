# Utilities e vars — relação e uso

Documento de referência para **evitar que IA ou código usem utility classes que não existem** em `utilities.css`. Relaciona a lista canônica de classes com as variáveis CSS (vars) do design system.

---

## Fonte única: manifest

A lista **canônica** de utility classes está em:

**`design-system/packages/tokens/build/utility-classes-manifest.json`**

- Gerado automaticamente no mesmo build que gera `utilities.css` (`pnpm run tokens:utilities` ou `pnpm run build`).
- Contém o array `classes` com todos os nomes de classes (ex.: `d-flex`, `p-4`, `bg-surface-default`, `hover:bg-accent`).
- **Regra**: ao sugerir ou escrever utility classes, use **apenas** as classes presentes nesse array. Não invente nomes.

---

## Relação utilities ↔ vars

Muitas utility classes aplicam **uma única variável CSS** (`var(--jf-*)`). A correspondência é:

| Tipo de utility | Exemplo de classe | Var aplicada |
|-----------------|-------------------|--------------|
| Background      | `bg-surface-default` | `var(--jf-color-bg-surface-default)` |
| Foreground (texto) | `fg-strong`       | `var(--jf-color-fg-strong)` |
| Spacing         | `p-4`, `m-2`, `gap-2` | `var(--jf-size-4)`, `var(--jf-size-2)` |
| Size (quadrado) | `size-24`         | `var(--jf-size-24)` em width e height |
| Border color    | `bd-muted`        | `var(--jf-color-bd-muted)` |
| Border radius   | `corner-default`  | `var(--jf-corner-radius-default)` |
| Tipografia      | presets `.jf-*-font-*` | várias `--jf-font-*` |

Quando **não existir** uma utility para o valor desejado, use o token diretamente:

```css
/* em vez de inventar uma classe, use a var */
style={{ borderRadius: 'var(--jf-corner-radius-sm)' }}
```

Referência das vars em JS/TS: **`@jellyfish/tokens/vars`** (`colors`, `size`, `radius`, `fontSize`, `tokenVar(name)`).

---

## Onde consultar

| Recurso | Caminho |
|--------|--------|
| **Lista de classes válidas** | `design-system/packages/tokens/build/utility-classes-manifest.json` |
| **CSS das utilities** | `design-system/packages/tokens/build/css/utilities.css` |
| **Vars (JS/TS)** | `design-system/packages/tokens/src/vars.js` e `src/vars.d.ts` |
| **Mapeamento estático** | `design-system/packages/tokens/scripts/utilities/utilities-mapping-static.json` |
| **Mapeamento dinâmico** | `design-system/packages/tokens/scripts/utilities/utilities-mapping-dynamic.json` |

---

## Para IA / Cursor

Ao sugerir classes CSS para componentes do Jellyfish:

1. **Use apenas** classes listadas em `build/utility-classes-manifest.json`.
2. **Não invente** nomes de classes (ex.: `mt-4` se não existir no manifest).
3. Se não houver utility para a propriedade, sugira estilo com **token**: `var(--jf-*)` ou `import { colors, size, radius } from '@jellyfish/tokens/vars'`.

A regra em `.cursor/rules` que referencia este fluxo é **tokens-utility-classes**.
