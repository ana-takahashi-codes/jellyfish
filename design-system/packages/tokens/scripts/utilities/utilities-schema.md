# Utilities Mapping Schema

Sistema dinâmico e escalável para geração de utility classes CSS a partir de design tokens.

## Estrutura do Schema

```typescript
{
  "[categoryName]": {
    // Prefixo(s) para as classes CSS
    "prefix": string | string[],

    // Propriedades CSS base que receberão os valores
    "properties": string | string[],

    // Pattern de busca de tokens CSS (opcional)
    "tokenPattern": string | string[],

    // Padrão de nomenclatura das classes (opcional)
    "classPattern": string,

    // Geração responsiva (opcional, default: false)
    "responsive": boolean,

    // Mapeamento dinâmico de variantes (opcional)
    "dynamicMapping": {
      "[dimensionName]": {
        "[variantKey]": string | string[] | object
      }
    },

    // Mapeamento de estados (opcional)
    "states": {
      "[stateName]": {
        "selector": string, // Seletor CSS do estado
        "[property]": string // Token para a propriedade no estado
      }
    },

    // Configuração de breakpoints (quando responsive: true)
    "breakpoints": string[]
  }
}
```

## Propriedades Detalhadas

### `prefix`
- **Tipo**: `string | string[]`
- **Obrigatório**: Sim
- **Descrição**: Prefixo da classe CSS. Se for array, gera classes para cada prefixo.
- **Exemplo**:
  - `"prefix": "p"` → `.p-*`
  - `"prefix": ["p", "m"]` → `.p-*` e `.m-*`

### `properties`
- **Tipo**: `string | string[]`
- **Obrigatório**: Sim
- **Descrição**: Propriedades CSS que receberão os valores dos tokens.
- **Exemplo**:
  - `"properties": "padding"`
  - `"properties": ["padding", "margin"]`

### `tokenPattern`
- **Tipo**: `string | string[]`
- **Obrigatório**: Não
- **Descrição**: Padrão de busca dos tokens CSS. Usado para validar e filtrar tokens.
- **Exemplo**: `"tokenPattern": "jf-size-"`

### `classPattern`
- **Tipo**: `string`
- **Obrigatório**: Não
- **Descrição**: Template para nomenclatura das classes. Usa placeholders entre chaves.
- **Placeholders disponíveis**: `{prefix}`, `{orientation}`, `{variant}`, `{color}`, etc.
- **Default**: `"{prefix}-{variant}"`
- **Exemplo**: `"classPattern": "{prefix}{props}-{variant}"` → `.p-2`, `.p-t-3`

### `responsive`
- **Tipo**: `boolean`
- **Obrigatório**: Não
- **Default**: `false`
- **Descrição**: Se `true`, gera variantes responsivas com media queries.
- **Exemplo**: `.screen-md:p-xs`, `.screen-lg:p-xs`

### `dynamicMapping`
- **Tipo**: `object`
- **Obrigatório**: Não
- **Descrição**: Mapeamento dinâmico de dimensões e variantes. Permite criar múltiplas combinações.

#### Estrutura do dynamicMapping:

```json
{
  "dynamicMapping": {
    // Dimensão 1: Orientação espacial
    "orientation": {
      "t": ["padding-top", "margin-top"],
      "r": ["padding-right", "margin-right"],
      "x": [
        ["padding-left", "padding-right"],
        ["margin-left", "margin-right"]
      ]
    },

    // Dimensão 2: Variantes de tamanho (escala jf-size-*)
    "variant": {
      "1": "jf-size-1",
      "2": "jf-size-2",
      "3": "jf-size-3"
    }
  }
}
```

**Comportamento**:
- Cada chave em `dynamicMapping` representa uma dimensão
- O sistema gera combinações entre todas as dimensões
- Valores podem ser:
  - `string`: token CSS único
  - `string[]`: múltiplas propriedades CSS
  - `string[][]`: array de arrays de propriedades (para múltiplos prefixos)

### `states`
- **Tipo**: `object`
- **Obrigatório**: Não
- **Descrição**: Define estados interativos (hover, focus, etc.) e suas propriedades.

#### Estrutura de states:

**Opção 1: Estado simples**
```json
{
  "states": {
    "hover": {
      "background-color": "jf-bg-neutral-hover"
    },
    "focus": {
      "outline": "jf-outline-focus",
      "outline-offset": "jf-outline-offset-focus"
    }
  }
}
```

**Opção 2: Estado com seletor personalizado**
```json
{
  "states": {
    "selected": {
      "selector": ":active",
      "background-color": "jf-bg-neutral-selected"
    }
  }
}
```

**Geração**:
- `.hover\:bg-neutral:hover { background-color: var(--jf-bg-neutral-hover); }`
- `.focus\:bg-neutral:focus { outline: var(--jf-outline-focus); }`

### `breakpoints`
- **Tipo**: `string[]`
- **Obrigatório**: Não
- **Default**: `["sm", "md", "lg", "xl", "2xl"]`
- **Descrição**: Lista de breakpoints para variantes responsivas.

## Grid templates

Os tokens `jf-fraction-*` (1fr, 2fr, …) fazem sentido em **grid**: use utilities estáticas `grid-cols-1` … `grid-cols-4` e `grid-rows-1` … `grid-rows-4`, que geram `grid-template-columns/rows: repeat(n, var(--jf-fraction-1))`.

Para templates mais complexos (ex.: `1fr 2fr 1fr`, colunas com frações diferentes), pode ser necessário um **script dedicado** que leia um mapeamento ou configuração e gere as classes dinamicamente (ex.: `scripts/utilities/build-grid-templates.mjs`).

## Exemplos Completos

### Exemplo 1: Spacing (Orientações + Variantes)

```json
{
  "spacing": {
    "prefix": ["p", "m"],
    "responsive": true,
    "properties": ["padding", "margin"],
    "tokenPattern": "jf-size-",
    "classPattern": "{prefix}{props}-{variant}",
    "dynamicMapping": {
      "props": {
        "": [["padding"], ["margin"]],
        "t": [["padding-top"], ["margin-top"]],
        "r": [["padding-right"], ["margin-right"]],
        "b": [["padding-bottom"], ["margin-bottom"]],
        "l": [["padding-left"], ["margin-left"]],
        "x": [
          ["padding-left", "padding-right"],
          ["margin-left", "margin-right"]
        ],
        "y": [
          ["padding-top", "padding-bottom"],
          ["margin-top", "margin-bottom"]
        ]
      },
      "variant": {
        "1": "jf-size-1",
        "2": "jf-size-2",
        "3": "jf-size-3"
      }
    }
  }
}
```

**Saída**:
```css
.p-2 { padding: var(--jf-size-2); }
.p-t-3 { padding-top: var(--jf-size-3); }
.p-x-2 {
  padding-left: var(--jf-size-2);
  padding-right: var(--jf-size-2);
}
.m-3 { margin: var(--jf-size-3); }

@media (min-width: var(--jf-breakpoint-md)) {
  .screen-md\:p-2 { padding: var(--jf-size-2); }
}
```

### Exemplo 2: Background com Estados

```json
{
  "background": {
    "prefix": "bg",
    "properties": "background-color",
    "tokenPattern": "jf-bg-",
    "classPattern": "{prefix}-{color}",
    "dynamicMapping": {
      "color": {
        "surface": {
          "default": "jf-bg-surface"
        },
        "neutral": {
          "default": "jf-bg-neutral",
          "states": {
            "hover": {
              "background-color": "jf-bg-neutral-hover"
            },
            "selected": {
              "selector": ":active",
              "background-color": "jf-bg-neutral-selected"
            },
            "focus": {
              "outline": "jf-outline-focus",
              "outline-offset": "jf-outline-offset-focus"
            }
          }
        },
        "accent": {
          "default": "jf-bg-accent",
          "states": {
            "hover": {
              "background-color": "jf-bg-accent-hover"
            }
          }
        }
      }
    }
  }
}
```

**Saída**:
```css
.bg-surface {
  background-color: var(--jf-bg-surface);
}

.bg-neutral {
  background-color: var(--jf-bg-neutral);
}

.hover\:bg-neutral:hover {
  background-color: var(--jf-bg-neutral-hover);
}

.selected\:bg-neutral:active {
  background-color: var(--jf-bg-neutral-selected);
}

.focus\:bg-neutral:focus {
  outline: var(--jf-outline-focus);
  outline-offset: var(--jf-outline-offset-focus);
}
```

## Chaves Especiais

### Chave vazia (`""`)
Quando uma dimensão tem uma chave vazia, ela representa a classe "base" sem sufixo.

```json
{
  "orientation": {
    "": [[], []],  // Classe base: .p-xs (sem orientação)
    "t": [["padding-top"], ["margin-top"]]  // .p-t-xs
  }
}
```

### Valor `default`
Em objetos aninhados, a chave `default` indica o valor padrão antes de aplicar estados.

```json
{
  "neutral": {
    "default": "jf-bg-neutral",
    "states": { ... }
  }
}
```

## Regras de Processamento

1. **Ordem de Processamento**:
   - Classes base (sem estados)
   - Classes com estados
   - Variantes responsivas (se `responsive: true`)

2. **Combinação de Prefixos**:
   - Se `prefix` for array, cada prefixo é processado separadamente
   - As propriedades devem corresponder à ordem dos prefixos

3. **Escape de Caracteres**:
   - Estados usam escape de dois pontos: `hover\:bg-neutral`
   - Breakpoints responsivos também: `screen-md\:p-xs`

4. **Tokens Inexistentes**:
   - Se um token não for encontrado no CSS gerado, a classe não é criada
   - Logs de warning são emitidos para tokens ausentes
