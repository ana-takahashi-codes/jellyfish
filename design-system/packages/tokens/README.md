# @jellyfish/tokens

Pacote de design tokens do Jellyfish Design System. Consome tokens exportados do Tokens Studio (Figma), processa com Style Dictionary e gera artefatos para CSS, SCSS, Android, iOS e JavaScript/TypeScript.

---

## Arquitetura de tokens

### Visão geral

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────────────────────┐
│  Figma          │     │  src/            │     │  build/                              │
│  Tokens Studio  │ ──► │  tokens-studio/   │ ──► │  css | scss | android | ios | js     │
│  (export JSON)  │     │  <tema>.json      │     │  (por tema e por “set”)              │
└─────────────────┘     └──────────────────┘     └─────────────────────────────────────┘
                               │
                               │  Style Dictionary v5
                               │  + @tokens-studio/sd-transforms
                               │  + config (platforms, formats, transforms)
                               ▼
                        scripts/build.js
```

1. **Origem**: Os tokens são criados no Figma (Variables / Tokens Studio) e exportados em JSON no padrão DTCG (Design Tokens Community Group).
2. **Entrada**: Os arquivos JSON de cada tema ficam em **`src/tokens-studio/`** (um arquivo por tema, ex.: `core.json`, `ana-takahashi.json`).
3. **Processamento**: O script de build usa **Style Dictionary** com as configurações em **`config/`** (platforms, formats, transforms) e o preprocessador **@tokens-studio/sd-transforms**.
4. **Saída**: A pasta **`build/`** recebe os artefatos gerados, organizados por plataforma e por tema.

### Estrutura de pastas

| Pasta | Descrição |
|-------|-----------|
| **`src/tokens-studio/`** | **Entrada de tokens**: coloque aqui os JSON exportados do Tokens Studio (Figma). Um arquivo `<nome-do-tema>.json` por tema. O tema `core` define a estrutura (sets, ordem, grupos de build); os demais temas seguem a mesma estrutura. |
| **`src/figma/`** | Tokens gerados por outras fontes (ex.: agente a partir de tabelas Coda), no formato Figma/DTCG. Podem ser consolidados ou referenciados conforme o fluxo do time. |
| **`config/`** | Configuração do Style Dictionary: constantes, platforms (css, scss, js, android, ios), formats customizados, transforms. Exposta para os times reutilizarem ou estenderem. |
| **`scripts/`** | `build.js` (build principal), `clean.js` (limpa `build/`), `build-responsive-css.js` (composição de CSS responsivo). |
| **`build/`** | **Saída do build**: artefatos por plataforma (css, scss, android, ios, js), organizados por tema e, quando aplicável, por “set” (primitives, foundations, components, color-modes, etc.). |

### Conceitos do build (manifest e sets)

- O **manifest** (ordem dos sets, grupos de build, nomes de arquivos) é derivado do tema **`core`** quando ele existe; os outros temas seguem o mesmo layout.
- Cada tema JSON tem **top-level keys** (sets), por exemplo:
  - **Base**: `01- Primitives`, `02- Foundations`, `03- Components`, etc. → geram `primitives`, `foundations`, `components`, `typography`.
  - **Color Modes**: `Color Modes/Light`, `Color Modes/Dark` → geram arquivos em `color-modes/` (ex.: `light.css`, `dark.css`).
  - **Platforms**: `Platforms/screen-xs`, `Platforms/screen-md`, etc. → usados para tokens responsivos e depois compostos em `responsive.css`.
- O build roda o Style Dictionary **por grupo** (base, cada color mode, cada platform) para evitar colisões e manter referências entre sets (ex.: color mode referenciando primitives/foundations).

---

## Pasta que recebe os tokens do Tokens Studio

A pasta de entrada para os exports do **Tokens Studio (Figma)** é:

```text
src/tokens-studio/
```

- Coloque aqui um arquivo **`<tema>.json`** por tema (ex.: `core.json`, `ana-takahashi.json`).
- Formato esperado: JSON no padrão DTCG, com top-level keys como sets (Primitives, Foundations, Color Modes, etc.), como exportado pelo plugin Tokens Studio.
- O tema **`core`** é usado como referência de estrutura (sets e ordem); os outros temas devem seguir a mesma estrutura de sets para o build funcionar de forma consistente.

---

## Como o Style Dictionary funciona neste pacote

1. **Descoberta de temas**: O script `scripts/build.js` lista os arquivos `*.json` em `src/tokens-studio/` e considera cada um como um tema (ex.: `core`, `ana-takahashi`).

2. **Manifest**: A partir do tema `core`, o código em `config/constants.js` monta o **build manifest**: ordem dos sets, classificação (base, color modes, platforms), grupos de build e nomes dos arquivos de saída.

3. **Split por set**: Para cada tema, o JSON é dividido em arquivos temporários (um por set), para que o Style Dictionary processe cada grupo com as fontes corretas (ex.: base + color mode) e evite colisões.

4. **Configuração por grupo**: Para cada grupo de build (base, cada color mode, cada platform), é montada uma config Style Dictionary via **`config/index.js`** (`getConfig`), que:
   - Define **source**: os paths dos JSON daquele grupo.
   - Usa o preprocessador **`tokens-studio`** (sd-transforms).
   - Registra **platforms** (css, scss, android, ios, js quando for o grupo base), **formats** e **transforms** customizados.

5. **Platforms** (em `config/platforms/`): Cada plataforma define onde gravar os arquivos em `build/<plataforma>/themes/<tema>/` e quais formatos usar (variáveis CSS, SCSS, XML Android, Swift, JS/TS).

6. **Formats e transforms** (em `config/formats/` e `config/transforms/`): Formatos extras (ex.: CSS variables para dark, responsivo, typography classes) e transforms (ex.: duration, cubic-bezier, transition shorthand) são registrados no Style Dictionary em `config/index.js`.

7. **Build e pós-processamento**: Para cada tema e cada grupo, é instanciado um Style Dictionary com essa config e executado `buildAllPlatforms()`. Em seguida, `build-responsive-css.js` compõe os arquivos de breakpoints em um único `responsive.css` por tema quando aplicável.

8. **Limpeza**: Arquivos temporários e artefatos intermediários (ex.: arquivos por platform set) são removidos; permanecem apenas os arquivos finais em `build/`.

Para **estender ou reutilizar** a configuração em outros repositórios, use o que é exportado em **`config/`** (veja seção “Uso da configuração pelos times” no README e exports no `package.json`).

---

## Scripts

| Script | Descrição |
|--------|-----------|
| `pnpm run build` | Gera todos os artefatos em `build/` a partir de `src/tokens-studio/`. |
| `pnpm run tokens:build` | Alias de `build`. |
| `pnpm run tokens:clean` | Remove a pasta `build/`. |
| `pnpm run version:patch` | Incrementa versão patch (x.y.**z**). |
| `pnpm run version:minor` | Incrementa versão minor (x.**y**.z). |
| `pnpm run version:major` | Incrementa versão major (**x**.y.z). |

---

## Exports do pacote (consumo)

O `package.json` define os seguintes exports:

| Export | Uso |
|--------|-----|
| **`@jellyfish/tokens`** (entrypoint principal) | Tokens JS/TS do tema `core`: `import tokens from '@jellyfish/tokens'`. Tipos em `tokens.d.ts`. |
| **`@jellyfish/tokens/config`** | Configuração do Style Dictionary para os times reutilizarem ou estenderem: `import { getConfig, getBuildManifest, BUILD_DIR, SOURCE_DIR } from '@jellyfish/tokens/config'`. Inclui platforms, constantes e helpers. |
| **`@jellyfish/tokens/build/*`** | Qualquer artefato em `build/`: CSS, SCSS, Android, iOS, JS por tema. Ex.: `@jellyfish/tokens/build/css/themes/core/foundations.css`, `@jellyfish/tokens/build/js/themes/ana-takahashi/tokens.js`. |

- **Artefatos em `build/`**: CSS, SCSS, Android, iOS e JS são publicados e podem ser referenciados pelos consumidores (paths acima ou via bundler/import).
- **Configuração Style Dictionary**: Para reutilizar ou estender a config (platforms, formats, transforms, constantes), use **`@jellyfish/tokens/config`**. Os módulos em `config/` (platforms, formats, transforms) estão disponíveis no pacote; importe a partir de `config/index.js` ou paths relativos a ele conforme necessidade.

---

## Desenvolvimento

1. Exportar tokens do Figma (Tokens Studio) para um `<tema>.json` e colocar em `src/tokens-studio/`.
2. Rodar `pnpm run build`.
3. Verificar a saída em `build/` (css, scss, android, ios, js) por tema.

Para apenas limpar a saída: `pnpm run tokens:clean`. As publicações do pacote são feitas com **pnpm** (ex.: `pnpm publish`; antes disso, `prepublishOnly` roda o build).
