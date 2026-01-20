---
name: figma-cars-json-gen
description: Fluxo de criação de JSON para Figma Variables
---

# Agente de IA para Criação de Design Tokens Figma

## Ativação
Este agente é ativado quando o usuário mencionar que deseja criar um arquivo JSON de variables/tokens para Figma (ou expressões similares).

## Princípio Fundamental de Interação

**REGRA CRÍTICA**: A IA deve fazer **APENAS UMA PERGUNTA POR VEZ** e aguardar a resposta do usuário antes de prosseguir.

**NÃO FAZER:**
❌ Fazer múltiplas perguntas em sequência
❌ Assumir respostas ou usar valores padrão sem confirmar
❌ Pular etapas do fluxo

**FAZER:**
✅ Fazer uma pergunta
✅ Aguardar resposta do usuário
✅ Processar a resposta
✅ Fazer a próxima pergunta

**Exemplo correto:**
```
🤖 Qual o nome da coleção que deseja criar?

[aguarda resposta]

👤 design-system

🤖 Qual o nome do mode para esta coleção?

[aguarda resposta]

👤 light

🤖 Cole a URL da tabela com os design tokens:

[aguarda resposta]
```

**Exemplo INCORRETO:**
```
❌ Qual o nome da coleção? E o nome do mode? E a URL da tabela?
```

## Estrutura de Pastas
Todos os arquivos devem ser criados seguindo esta estrutura:
```
packages/
  └── tokens/
      └── src/
          └── figma/
              └── {nome-da-colecao}/
                  └── {nome-do-mode}.json
```

Se a pasta `figma` não existir, ela deve ser criada automaticamente.

## Fluxo de Interação

### 1. Perguntar o Nome da Coleção
- Solicitar ao usuário o nome da coleção
- Este nome será usado como nome da pasta dentro de `src/figma/`
- Verificar se a pasta já existe; se não, criar

### 2. Perguntar o Nome do Mode
- Solicitar ao usuário o nome do mode
- Este nome será o nome do arquivo JSON (`{nome-do-mode}.json`)
- **VALIDAÇÃO IMPORTANTE**: Verificar se já existe um arquivo com esse nome na pasta da coleção
  - Se existir, apresentar opções:
    - ✅ **Mesclar com arquivo existente** (adicionar/atualizar tokens)
    - ✅ **Sobrescrever** o arquivo existente (apagar tudo e criar novo)
    - ✅ **Criar com outro nome** (sugerir ou solicitar novo nome)
    - ✅ **Cancelar** a operação
  - Aguardar escolha do usuário antes de prosseguir

### 3. Solicitar URL da Tabela
- Pedir a URL onde está a tabela de design tokens
- A tabela contém colunas: `Token name` e `Value`

#### IMPORTANTE: Leitura de Tabelas do Coda

**ATENÇÃO**: Se a URL fornecida for do Coda (coda.io), **NÃO tente fazer scraping** da página web, pois o Coda usa virtual scrolling e não renderiza todas as linhas visualmente.

**Solução obrigatória**: Usar o **MCP do Coda** para obter todos os dados.

**Fluxo para tabelas do Coda:**

1. **Identificar URL do Coda**: 
   - Formato típico: `https://coda.io/d/DOC_ID/TABLE_NAME`

2. **Usar MCP do Coda**:
   - O ambiente já possui MCP do Coda configurado
   - Não é necessário solicitar API Token
   - Usar as ferramentas disponíveis do MCP para acessar o documento

3. **Extrair informações da URL**:
   - Doc ID
   - Table/View ID (pode precisar solicitar ao usuário se não estiver claro na URL)

4. **Acessar dados via MCP**:
   - Utilizar as ferramentas do MCP do Coda para listar e ler as linhas da tabela
   - O MCP retorna todos os registros (sem limitação de virtual scrolling)
   - Iterar por todas as páginas se houver paginação
   - Extrair colunas `Token name` e `Value`

**Tratamento de paginação**:
Se houver muitos dados, processar em lotes e informar o progresso:
```
📊 Carregando tokens do Coda via MCP...
- Processando: 100 tokens
- Processando: 200 tokens
- Processando: 247 tokens
✅ Total: 247 tokens carregados
```

**Tratamento de erros**:
- Se o MCP não conseguir acessar o documento, informar o usuário
- Se a tabela não for encontrada, listar as tabelas disponíveis no documento
- Se as colunas esperadas (`Token name` e `Value`) não existirem, solicitar os nomes corretos das colunas

#### Outras Fontes de Dados

Para tabelas em outras plataformas (Google Sheets, Notion, Excel Online, etc.), verificar se existem MCPs ou APIs disponíveis e instruir o usuário adequadamente. Caso não haja integração disponível, solicitar que o usuário exporte os dados ou forneça acesso adequado.

### 4. Perguntar ColorSpace (para cores)
- Solicitar qual colorSpace será usado para conversão de cores
- Opções disponíveis em: https://www.designtokens.org/tr/2025.10/color
- Exemplos: `srgb`, `oklch`, `hsl`, etc.

### 5. Perguntar Base de Conversão (para números)
- Solicitar a base de conversão para rem/em → px
- Sugestão padrão: **16px**

### 6. Processar Tabela e Gerar JSON
- Ler a tabela da URL fornecida
- **Normalizar tokens alpha** (ex: `jf.color.alpha.white.100` → `jf.color.white.100`)
- **Detectar tokens com variantes** (verificar se existem tokens que começam com o nome base + ".")
- **Processar tokens base primeiro** (criar estrutura com `$root` se necessário)
- **Processar variantes depois** (adicionar ao objeto base existente)
- Analisar cada token e aplicar as regras de conversão
- Gerar o arquivo JSON no formato DTCG compatível com Figma

---

## Regras de Nomenclatura

### Convenções Suportadas
Os tokens podem usar duas convenções de nomenclatura:

1. **Dot notation**: `jf.color.white`
2. **Slash notation**: `jf/color/white`

Ambas resultam na mesma estrutura JSON aninhada.

### Normalização de Tokens Alpha

**IMPORTANTE**: Tokens com estrutura `alpha` devem ser normalizados antes do processamento:

- `jf.color.alpha.white.100` → `jf.color.white.100`
- `jf.color.alpha.black.200` → `jf.color.black.200`

**Regra de normalização**:
1. Identificar tokens que contêm `alpha.` no nome
2. Extrair o nome da cor (ex: `white`, `black`) que vem após `alpha.`
3. Extrair a variante numérica (ex: `100`, `200`) que vem no final
4. Reconstruir o nome como: `jf.color.{cor}.{variante}`

**Exemplo**:
```
Token original: jf.color.alpha.white.100
Token normalizado: jf.color.white.100
Base do token: jf.color.white
```

### Regra do `$root`

**Detecção de variantes**:
- Um token tem variantes se existem outros tokens que começam com o nome do token base seguido de `.` e um sufixo
- Exemplo: `jf.color.white` tem variantes se existir `jf.color.white.100`, `jf.color.white.200`, etc.

**Regras de aplicação**:
- **SEM variantes**: Se existir apenas `jf.color.white` (sem sufixos numéricos como 100, 200), o valor fica diretamente em `"white"`
- **COM variantes**: Se existir `jf.color.white` E `jf.color.white.100` (ou outras variantes), usar `"$root"` para o valor base

**Ordem de processamento crítica**:
1. **Primeiro**: Processar todos os tokens base (sem sufixos numéricos)
2. **Depois**: Processar todas as variantes (com sufixos numéricos)
3. Isso garante que o objeto base seja criado com `$root` antes de adicionar variantes

**Exemplo SEM variantes:**
```json
{
  "jf": {
    "color": {
      "white": {
        "$type": "color",
        "$value": {...}
      }
    }
  }
}
```

**Exemplo COM variantes:**
```json
{
  "jf": {
    "color": {
      "white": {
        "$root": {
          "$type": "color",
          "$value": {...}
        },
        "100": {
          "$type": "color",
          "$value": {...}
        }
      }
    }
  }
}
```

---

## Regras de Conversão por Tipo

### 1. CORES (`$type: "color"`)

**Identificação**: Tokens que contêm "color" no nome ou valores em formatos de cor (hex, rgb, hsl, oklch, etc.)

**Formato de Saída**:
```json
{
  "$type": "color",
  "$value": {
    "colorSpace": "oklch",
    "components": [1, 0, 0],
    "alpha": 1,
    "hex": "#ffffff"
  }
}
```

**Regras de Conversão**:
1. Converter qualquer formato de cor para o padrão DTCG usando o colorSpace informado pelo usuário
2. Sempre incluir o metadado `"hex"` com o valor em hexadecimal
3. Se a cor possuir opacidade:
   - Converter para escala 0-1
   - Inserir no metadado `"alpha"`
   - Exemplo: `10%` → `0.1`

**Exemplos**:

| Token name | Value |
|------------|-------|
| `jf.color.alpha.white.100` | `oklch(1 0 0 / 10%)` |
| `jf.color.white` | `#ffffff` |

**Nota**: O token `jf.color.alpha.white.100` é normalizado para `jf.color.white.100` antes do processamento.

ColorSpace: `oklch`

Resultado:
```json
{
  "jf": {
    "color": {
      "white": {
        "$root": {
          "$type": "color",
          "$value": {
            "colorSpace": "oklch",
            "components": [1, 0, 0],
            "alpha": 1,
            "hex": "#ffffff"
          }
        },
        "100": {
          "$type": "color",
          "$value": {
            "colorSpace": "oklch",
            "components": [1, 0, 0],
            "alpha": 0.1,
            "hex": "#ffffff"
          }
        }
      }
    }
  }
}
```

---

### 2. NÚMEROS (`$type: "number"`)

**Identificação**: Tokens que contêm no nome:
- `scale`
- `opacity`
- `border-width`
- `corner`
- `line-height`
- `letter-spacing`
- `font-size`
- `duration`
- `blur`
- `angle`
- `cols`
- `layer`
- `width`
- `height`
- `gap`
- `padding`
- `margin`

**Formato de Saída**:
```json
{
  "$type": "number",
  "$value": 16
}
```

**Regras de Conversão**:
1. Figma trabalha apenas com **px** (sem unidade no valor final)
2. Conversões necessárias:
   - `rem` → multiplicar pela base de conversão (ex: 16px)
   - `em` → multiplicar pela base de conversão (ex: 16px)
   - `px` → manter apenas o valor numérico
   - `%` → dividir por 100 (ex: `50%` = `0.5`)
   - `ms` (duration) → remover sufixo e manter número (ex: `300ms` = `300`)

**Exemplos**:

| Token name | Value |
|------------|-------|
| `jf.letter-spacing.compact` | `-0.05em` |

Base de conversão: 16px

Resultado:
```json
{
  "jf": {
    "letter-spacing": {
      "compact": {
        "$type": "number",
        "$value": -0.8
      }
    }
  }
}
```

| Token name | Value |
|------------|-------|
| `jf.scale.8` | `1rem` |

Resultado:
```json
{
  "jf": {
    "scale": {
      "8": {
        "$type": "number",
        "$value": 16
      }
    }
  }
}
```

---

### 3. STRINGS (`$type: "string"`)

**Identificação**: Tokens que contêm no nome:
- `font-family`
- `font-weight`
- `ratio`

**Formato de Saída**:
```json
{
  "$type": "string",
  "$value": "Thin"
}
```

**Regras de Conversão**:

#### font-weight
- Se o valor for **numérico**, converter para nome com **primeira letra maiúscula**:
  - `100` → `"Thin"`
  - `200` → `"Extra Light"`
  - `300` → `"Light"`
  - `400` → `"Regular"`
  - `500` → `"Medium"`
  - `600` → `"Semi Bold"`
  - `700` → `"Bold"`
  - `800` → `"Extra Bold"`
  - `900` → `"Black"`
- Se o valor for **texto**, manter exatamente como está (ex: `"bold"` fica `"bold"`)

#### font-family e ratio
- Manter o valor original da tabela

**Exemplo**:

| Token name | Value |
|------------|-------|
| `jf.font-weight.100` | `100` |

Resultado:
```json
{
  "jf": {
    "font-weight": {
      "100": {
        "$type": "string",
        "$value": "Thin"
      }
    }
  }
}
```

---

## Formato Final do JSON

O arquivo JSON deve seguir o padrão DTCG (Design Tokens Community Group) compatível com Figma:

```json
{
  "namespace": {
    "category": {
      "token-name": {
        "$type": "color|number|string",
        "$value": {...}
      }
    }
  },
  "$extensions": {
    "com.figma.modeName": "Mode 1"
  }
}
```

### Metadados Obrigatórios do Figma

**IMPORTANTE**: Todo arquivo JSON deve incluir a extensão `com.figma.modeName` antes de fechar a raiz do objeto.

O valor de `"com.figma.modeName"` deve ser **exatamente o nome do mode** fornecido pelo usuário no início do fluxo.

**Exemplo completo:**

Se o usuário informou que o mode se chama "light", o JSON final deve ser:

```json
{
  "jf": {
    "color": {
      "white": {
        "$type": "color",
        "$value": {
          "colorSpace": "srgb",
          "components": [1, 1, 1],
          "alpha": 1,
          "hex": "#ffffff"
        }
      },
      "black": {
        "$type": "color",
        "$value": {
          "colorSpace": "srgb",
          "components": [0, 0, 0],
          "alpha": 1,
          "hex": "#000000"
        }
      }
    },
    "spacing": {
      "small": {
        "$type": "number",
        "$value": 8
      }
    }
  },
  "$extensions": {
    "com.figma.modeName": "light"
  }
}
```

**Regras para `$extensions`:**
1. Deve ser sempre o **último elemento** do JSON (antes de fechar `}`)
2. O valor de `"com.figma.modeName"` é uma **string** com o nome do mode
3. Use exatamente o nome que o usuário forneceu (case-sensitive)
4. **Obrigatório em todos os arquivos** de design tokens

---

## Validações Importantes

1. **Verificar se a pasta `figma` existe**, se não, criar
2. **Verificar se a pasta da coleção existe**, se não, criar
3. **Verificar se o arquivo do mode já existe**, se sim, perguntar ação ao usuário
4. **Validar URL da tabela** antes de processar
5. **Normalizar tokens alpha** antes do processamento
6. **Detectar tokens com variantes** corretamente
7. **Processar tokens base antes das variantes** para garantir estrutura correta
8. **Detectar automaticamente o tipo de token** baseado no nome
9. **Aplicar conversões corretas** baseadas no tipo identificado

---

## Tratamento de Valores Dinâmicos (clamp, calc, var, etc.)

Quando a IA detectar valores dinâmicos que o Figma não suporta diretamente (como `clamp()`, `calc()`, `var()`, etc.), deve seguir este fluxo:

### 1. Detectar e Informar
```
🔍 Detectei valor dinâmico: clamp(1.1375rem, 1.1073rem + 0.3523vw, 1.5rem)

⚠️ O Figma não suporta valores dinâmicos como clamp(). 
Preciso criar valores fixos para diferentes breakpoints/plataformas.

Convertendo para px (base: 16px):
- Mínimo: 1.1375rem → 18.2px
- Máximo: 1.5rem → 24px
```

### 2. Perguntar sobre a Coleção
```
Deseja:
A) Criar uma NOVA coleção multi-plataforma
B) Usar uma coleção multi-plataforma EXISTENTE
C) Definir um valor fixo único (não recomendado)
D) Pular este token

Escolha: _
```

### 3A. Se Escolher "Nova Coleção"
```
📁 Nome da nova coleção multi-plataforma: _
(ex: responsive-tokens, breakpoints, etc.)
```

### 3B. Se Escolher "Coleção Existente"
```
📁 Coleções disponíveis em packages/tokens/src/figma/:
- design-system
- brand
- responsive-tokens

Qual coleção usar? _
```

### 4. Perguntar Quantidade de Modos
```
📱 Quantos modos/breakpoints deseja criar?
Sugestão: 2 (um para valor mínimo, outro para valor máximo)

Digite o número: _
```

### 5. Solicitar Nome de Cada Modo
```
Nome do modo 1: _ (sugestão: mobile)
Nome do modo 2: _ (sugestão: desktop)
Nome do modo 3: _ (se aplicável)
...
```

### 6. Solicitar Valores para Cada Modo
Para cada token com valor dinâmico, perguntar o valor em cada modo:

```
Valores para o token "jf.font-size.xl":

🔹 Modo "mobile":
- Valor: _ (sugestão: 18.2)

🔹 Modo "desktop":
- Valor: _ (sugestão: 24)
```

**IMPORTANTE**: 
- Todos os valores devem ser convertidos para px (se estiverem em rem/em)
- Tokens criados serão do tipo `number` (sem unidade)
- Aplicar todas as regras de conversão de números

### 7. Confirmar Antes de Criar
```
✅ Resumo:
Coleção: responsive-tokens
Modos: mobile.json, desktop.json

Tokens a serem criados:

mobile.json:
- jf.font-size.xl = 18.2 (number)
- jf.padding.large = 16 (number)

desktop.json:
- jf.font-size.xl = 24 (number)
- jf.padding.large = 24 (number)

Confirmar criação? (s/n)
```

### 8. Criar Arquivos
Criar um arquivo `.json` para cada modo dentro da coleção especificada:
```
packages/tokens/src/figma/
  └── responsive-tokens/
      ├── mobile.json
      └── desktop.json
```

### Exemplo de Saída

**mobile.json:**
```json
{
  "jf": {
    "font-size": {
      "xl": {
        "$type": "number",
        "$value": 18.2
      }
    }
  }
}
```

**desktop.json:**
```json
{
  "jf": {
    "font-size": {
      "xl": {
        "$type": "number",
        "$value": 24
      }
    }
  }
}
```

---

## Validação e Atualização de Arquivos Existentes

### Regra Crítica: NUNCA Resetar JSON Existente

Quando trabalhar com arquivos `.json` que já existem, a IA deve **SEMPRE**:

1. **Ler o conteúdo atual** do arquivo antes de qualquer modificação
2. **Preservar todos os tokens existentes** que não estão sendo alterados
3. **Validar cada token** antes de adicionar ou modificar

### Fluxo de Validação para Tokens

#### Ao Adicionar/Atualizar Tokens em Arquivo Existente:

**Passo 1**: Ler arquivo JSON atual e identificar tokens existentes

**Passo 2**: Para cada token na nova tabela, verificar:

```
🔍 Analisando token: jf.color.primary

Status: ✅ Novo token (não existe no arquivo)
Ação: Será adicionado ao JSON

---

🔍 Analisando token: jf.color.white

Status: ⚠️ Token já existe no arquivo
Valor atual: #ffffff
Novo valor: #f5f5f5

Deseja sobrescrever este token?
A) Sim, atualizar para o novo valor
B) Não, manter o valor atual
C) Cancelar operação

Escolha: _
```

**Passo 3**: Mostrar resumo antes de salvar

```
📋 Resumo das alterações em "light.json":

✅ TOKENS NOVOS (serão adicionados):
- jf.color.primary = #0066cc
- jf.spacing.large = 24

⚠️ TOKENS ATUALIZADOS (valores alterados):
- jf.color.white: #ffffff → #f5f5f5

🔒 TOKENS PRESERVADOS (sem alterações):
- jf.color.black = #000000
- jf.font-size.base = 16
... (+ 15 outros tokens)

Confirmar alterações? (s/n)
```

**Passo 4**: Aplicar mudanças apenas se confirmado

### Estrutura de Mesclagem

Ao mesclar tokens novos com arquivo existente:

**Antes (arquivo existente):**
```json
{
  "jf": {
    "color": {
      "black": {
        "$type": "color",
        "$value": {...}
      }
    }
  }
}
```

**Depois (com tokens novos mesclados):**
```json
{
  "jf": {
    "color": {
      "black": {
        "$type": "color",
        "$value": {...}
      },
      "white": {
        "$type": "color",
        "$value": {...}
      },
      "primary": {
        "$type": "color",
        "$value": {...}
      }
    }
  }
}
```

### Avisos Importantes ao Usuário

Sempre que tokens forem adicionados a um arquivo existente, exibir:

```
✅ Arquivo "light.json" atualizado com sucesso!

📊 Estatísticas:
- 2 tokens novos adicionados
- 1 token atualizado
- 15 tokens preservados
- Total: 18 tokens no arquivo

⚠️ IMPORTANTE: O arquivo foi mesclado, não sobrescrito.
Todos os tokens anteriores foram preservados.
```

### Casos Especiais

#### Caso 1: Conflito de Estrutura
Se um token existente tiver estrutura diferente (ex: era simples, agora tem variantes):

```
⚠️ CONFLITO DETECTADO

Token "jf.color.white" existe como:
{
  "white": {
    "$type": "color",
    "$value": {...}
  }
}

Mas você está tentando adicionar variantes:
{
  "white": {
    "$root": {...},
    "100": {...}
  }
}

Isso requer reestruturação. Deseja:
A) Converter para estrutura com variantes (recomendado)
B) Manter estrutura atual e ignorar variantes
C) Cancelar operação

Escolha: _
```

#### Caso 2: Remoção de Tokens
Se o usuário quiser remover tokens:

```
🗑️ Remoção de tokens

Esta operação é permanente. Confirme os tokens a remover:
- jf.color.deprecated
- jf.spacing.old

Confirmar remoção? (s/n)
```

---

## Tratamento de Erros

1. Se a URL da tabela não for acessível, informar ao usuário
2. Se houver valores que não podem ser convertidos, registrar e informar quais tokens falharam
3. Se a estrutura da tabela for inválida, solicitar formato correto
4. Se valores dinâmicos forem detectados, seguir o fluxo de coleção multi-plataforma
5. **Se arquivo existir, NUNCA sobrescrever sem permissão explícita**
6. **Se token existente for modificado, SEMPRE pedir confirmação**
7. **Se houver conflito de estrutura, SEMPRE alertar e pedir decisão**
8. Sempre criar o JSON mesmo com erros parciais, mas avisar sobre os tokens problemáticos

---

## Mensagens ao Usuário

Mantenha uma comunicação clara e profissional:
- Confirme cada etapa antes de prosseguir
- Informe sobre validações e conversões realizadas
- Mostre preview do JSON antes de salvar (opcional)
- Confirme sucesso na criação do arquivo com o caminho completo
