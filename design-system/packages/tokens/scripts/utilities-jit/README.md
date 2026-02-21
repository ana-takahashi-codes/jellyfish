# Jellyfish Utilities JIT (PostCSS)

Geração **Just-in-Time** das utility classes: apenas as classes **usadas** no seu código são geradas, usando os mesmos tokens e o mesmo `utilities-mapping-dynamic.json` do build estático.

## Como funciona

1. **Conteúdo**: o plugin escaneia os arquivos em `content` (ex.: `src/**/*.tsx`) e extrai todos os nomes de classe.
2. **Resolução**: cada classe é testada contra os matchers (derivados do mapping dinâmico). Se bater (ex.: `p-2`, `bg-muted`, `pt-4`), resolve para `token` + `properties`.
3. **Geração**: só são emitidas regras CSS para as classes que existem nos tokens (ex.: `jf-size-2`, `jf-color-bg-muted`).

Assim, o CSS final contém apenas as utilities que você usa, em vez do arquivo estático completo.

## Uso com PostCSS

Instale PostCSS no seu projeto (se ainda não tiver):

```bash
pnpm add -D postcss
```

No `postcss.config.js` (ou equivalente):

```js
export default {
  plugins: {
    '@jellyfish/tokens/jit': {
      content: [
        './src/**/*.tsx',
        './src/**/*.jsx',
        './index.html'
      ],
      tokensPath: [
        './node_modules/@jellyfish/tokens/build/css/themes/core/primitives.css',
        './node_modules/@jellyfish/tokens/build/css/themes/core/foundations.css',
        './node_modules/@jellyfish/tokens/build/css/themes/core/color-modes/light.css'
      ],
      mappingPath: './node_modules/@jellyfish/tokens/scripts/utilities/utilities-mapping-dynamic.json'
    }
  }
}
```

Ou usando o plugin pelo caminho do pacote (após build):

```js
import postcssJellyfishUtilitiesJIT from '@jellyfish/tokens/scripts/utilities-jit/postcss-plugin.mjs'

export default {
  plugins: [
    postcssJellyfishUtilitiesJIT({
      content: ['./src/**/*.tsx'],
      cwd: process.cwd(),
      tokensPath: [
        'node_modules/@jellyfish/tokens/build/css/themes/core/primitives.css',
        'node_modules/@jellyfish/tokens/build/css/themes/core/foundations.css',
        'node_modules/@jellyfish/tokens/build/css/themes/core/color-modes/light.css'
      ],
      mappingPath: 'node_modules/@jellyfish/tokens/scripts/utilities/utilities-mapping-dynamic.json'
    })
  ]
}
```

**Nota**: `content` deve ser uma **lista de caminhos de arquivos** (não globs). Use `fast-glob` ou `glob` no seu config para expandir globs:

```js
import { sync } from 'fast-glob'
import postcssJellyfishUtilitiesJIT from '@jellyfish/tokens/scripts/utilities-jit/postcss-plugin.mjs'

const contentFiles = sync('./src/**/*.{tsx,jsx,vue}', { absolute: true })

export default {
  plugins: [
    postcssJellyfishUtilitiesJIT({
      content: contentFiles,
      tokensPath: [/* ... */],
      mappingPath: 'node_modules/@jellyfish/tokens/scripts/utilities/utilities-mapping-dynamic.json'
    })
  ]
}
```

## Opções

| Opção | Tipo | Descrição |
|-------|------|-----------|
| `content` | `string[]` | Lista de caminhos de arquivos a escanear para extrair classes. |
| `cwd` | `string` | Diretório base para caminhos relativos (default: `process.cwd()`). |
| `tokensPath` / `tokensPaths` | `string \| string[]` | Caminhos para CSS de tokens; variáveis `--nome` são extraídas. |
| `tokens` | `Record<string, string>` | Tokens já carregados (chave = nome sem `--`, valor = valor CSS). |
| `mappingPath` | `string` | Caminho para `utilities-mapping-dynamic.json`. |
| `dynamicMapping` | `object` | Mapping já carregado (em vez de `mappingPath`). |
| `breakpoints` | `Array<{ name, token }>` | Breakpoints para variantes responsivas (ex.: `screen-md:p-2`). |
| `includeFromCSS` | `boolean` | Incluir classes encontradas em selectors do próprio CSS (default: true). |

## Variantes responsivas

Classes com prefixo de breakpoint são geradas dentro do `@media` correspondente:

- `screen-xs:...`, `screen-sm:...`, `screen-md:...`, `screen-lg:...`, `screen-xl:...`

Exemplo: `screen-md:p-4` vira uma regra dentro de `@media (min-width: var(--jf-screen-md)) { ... }`.

## Paridade com o build estático

- Os **matchers** são derivados do mesmo `utilities-mapping-dynamic.json` usado por `utils-build.mjs`.
- **Tokens** devem ser os mesmos (primitives + foundations + color-modes) para os valores `var(--...)` baterem.
- Utilities **estáticas** (do `utilities-mapping-static.json`) não são geradas pelo JIT; use o CSS estático em conjunto ou inclua as estáticas no seu bundle de outra forma.

## Desenvolvimento no pacote tokens

Para testar o JIT localmente:

```bash
pnpm exec node scripts/utilities-jit/run-jit-example.mjs
```

Isso gera um CSS de exemplo a partir de uma lista fixa de classes.
