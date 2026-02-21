# @jellyfish/tokens

Pacote de design tokens do Jellyfish Design System. Consome tokens exportados do Tokens Studio (Figma), processa com Style Dictionary e gera artefatos para CSS, Android e iOS.

---

## Arquitetura

```
Figma / Tokens Studio
        │
        │  export JSON  (um arquivo por tema)
        ▼
src/tokens-studio/<tema>.json
        │
        │  tokens.resolver.json  (declara estrutura, sets e temas)
        │  split-sets.mjs        (extrai sets do monolítico → arquivos individuais)
        ▼
src/tokens-studio/sets/<tema>/<set>.json   (gerado, gitignored)
        │
        │  Style Dictionary v5 + @tokens-studio/sd-transforms
        │  config/ (platforms, formats, transforms)
        ▼
build/
  css/themes/<tema>/   primitives | foundations | components
                       color-modes/ light | dark
  css/utilities.css    (utilities + tipografia + responsive incorporados)
  android/themes/<tema>/
  ios/themes/<tema>/
```

### Fluxo de build

1. **`tokens.resolver.json`** declara os temas disponíveis e mapeia cada set do Tokens Studio para um papel semântico (`primitives`, `foundations`, `theme-light`, etc.).
2. **`split-sets.mjs`** lê o resolver e extrai cada set do JSON monolítico para arquivos individuais em `src/tokens-studio/sets/`.
3. O **manifest de build** é derivado do resolver — sem regex sobre nomes de sets.
4. Para cada tema, os arquivos do core são usados como base e o tema adiciona overrides em cima (**overlay model**). O Style Dictionary recebe ambos e resolve colisões com "last source wins".
5. **`build-responsive-css.js`** compõe os breakpoints em `responsive.css` (temporário). **`utils-build.mjs`** gera `build/css/utilities.css` incorporando tipografia e responsive e remove os arquivos `typography.css` e `responsive.css` dos temas.

---

## Estrutura de pastas

| Pasta | Descrição |
|-------|-----------|
| `src/tokens-studio/` | JSON exportados do Tokens Studio: um arquivo `<tema>.json` por tema. |
| `src/tokens-studio/sets/` | **Gerado** pelo build — não editar e não versionar. |
| `src/vars.js` + `src/vars.d.ts` | Referências `var(--jf-*)` com tipos TypeScript. |
| `tokens.resolver.json` | Declaração de temas, sets e ordem de resolução (DTCG Resolver 2025.10). |
| `config/` | Style Dictionary: constantes, platforms, formats, transforms. |
| `scripts/build/` | `build.js`, `split-sets.mjs`, `build-responsive-css.js`, `clean.js`. |
| `scripts/utilities/` | Geração de `utilities.css` (classes estáticas e dinâmicas). |
| `scripts/utilities-jit/` | Plugin PostCSS para geração JIT das utility classes. |
| `scripts/tokens-generate-types.mjs` | Gera tipos TypeScript a partir dos tokens CSS construídos. |
| `build/` | **Saída do build** — css, android, ios; organizado por tema. |

---

## Adicionar ou atualizar um tema

1. Exporte o tema do Figma (Tokens Studio) para `src/tokens-studio/<tema>.json`.
2. Declare o tema em `tokens.resolver.json` dentro de `$extensions["jellyfish.build"].themes`, especificando:
   - `source`: caminho do JSON exportado.
   - `sets`: mapeamento de papel semântico → chave do set no JSON.
   - `modifiers`: mapeamento de contexto (theme-light, theme-dark) → chave do set.
3. Rode `pnpm run build`.

Para temas que sobrescrevem apenas parte do core (ex.: cores da marca), inclua somente os sets com overrides — o build mescla os arquivos do core como base.

---

## Scripts

| Script | Descrição |
|--------|-----------|
| `pnpm run build` | Build completo: split + Style Dictionary + responsive (temporário) + utilities.css (incorpora tipografia e responsive). |
| `pnpm run tokens:split` | Apenas extrai os sets do JSON monolítico (sem compilar). |
| `pnpm run tokens:build` | Apenas roda o Style Dictionary (assume sets já extraídos). |
| `pnpm run tokens:clean` | Remove a pasta `build/`. |
| `pnpm run tokens:utilities` | Gera `build/css/utilities.css`. |
| `pnpm run tokens:jit-example` | Executa o exemplo do pipeline JIT sem PostCSS. |

---

## Utilities e JIT (PostCSS)

O arquivo **`build/css/utilities.css`** (gerado por `tokens:utilities`) inclui:

- **Utility classes atômicas** (`p-2`, `bg-muted`, `fg-strong`, …) a partir dos mapeamentos em `scripts/utilities/` (ver `utilities-schema.md`).
- **Classes de tipografia** (ex.: `.jf-button-font-label`) geradas pelo Style Dictionary e incorporadas aqui (não existe `typography.css` separado).
- **Tokens responsivos** (redefinições de `:root` por breakpoint), incorporados aqui (não existe `responsive.css` separado).
- **Estados interativos** (`.jf-interactive`): origem em `src/css/interactive-states.css`, concatenado no build. Fornece hover, active, focus-visible, loading e dragging com tokens.

Para a maioria dos projetos basta importar `@jellyfish/tokens/build/css/utilities.css` (tokens de tema já devem ser carregados antes).

Em modo **JIT**, o plugin PostCSS em `scripts/utilities-jit/` gera apenas as **classes atômicas usadas** no código. As regras de `.jf-interactive` não são geradas pelo JIT (são estáticas); vêm de `utilities.css` ou do export `@jellyfish/tokens/interactive-states.css` se quiser só esse bloco.

Consulte `scripts/utilities-jit/README.md` para configuração e exemplos.

---

## Tokens tipográficos

**Só são considerados tokens tipográficos** os que fazem referência a uma destas propriedades CSS:

| Propriedade CSS    | Exemplo de token / variável     |
|--------------------|---------------------------------|
| `font-size`        | `--jf-font-size-*`              |
| `font-weight`      | `--jf-font-weight-*`            |
| `letter-spacing`   | `--jf-letter-spacing-*`         |
| `line-height`      | `--jf-line-height-*`            |
| `font-family`      | `--jf-font-family-*`            |

Tokens que não mapeiam para uma dessas cinco propriedades **não são tokens tipográficos** (ex.: nomes semânticos que agrupam várias propriedades devem ser tratados como presets ou componentes de tipografia, não como um único token tipográfico).

---

## Depreciação de tokens

Tokens podem ser marcados com `$deprecated: true` ou `{ since?, replacement?, reason? }` no JSON (padrão DTCG). O transform `attribute/deprecated` em `config/transforms/` injeta os atributos `isDeprecated`, `deprecatedSince`, `deprecatedReplacement`, `deprecatedReason` para uso nos formatters de cada plataforma.

---

## Exports do pacote

| Export | Uso |
|--------|-----|
| `@jellyfish/tokens/build/*` | Qualquer artefato compilado. Ex.: `@jellyfish/tokens/build/css/themes/core/foundations.css`, `build/css/utilities.css`. |
| `@jellyfish/tokens/interactive-states.css` | Apenas `.jf-interactive` (útil em setups JIT que não importam o `utilities.css` completo). |
| `@jellyfish/tokens/vars` | Referências `var(--jf-*)` tipadas: `import { colors, tokenVar } from '@jellyfish/tokens/vars'`. |
| `@jellyfish/tokens/jit` | Plugin PostCSS para JIT. Ver `scripts/utilities-jit/README.md`. |
| `@jellyfish/tokens/config` | Configuração Style Dictionary para reutilização: `getConfig`, `BUILD_DIR`, `SOURCE_DIR`, `createSetFilter`, helpers. |

---

## Desenvolvimento

```bash
# build completo
pnpm run build

# limpar artefatos
pnpm run tokens:clean

# build + utilities
pnpm run build && pnpm run tokens:utilities

# rodar após exportar novo JSON do Figma
pnpm run tokens:split   # inspecionar sets extraídos
pnpm run tokens:build   # compilar
```

O `prepublishOnly` roda `pnpm run build` automaticamente antes de `pnpm publish`.
