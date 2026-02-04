# Assistente de IA para Documentação de Design System

## Visão Geral
Este assistente automatiza a criação de documentação de componentes de Design System no Coda, extraindo informações do Figma.

## Arquitetura da Solução

### 1. Componentes Principais

```
Cursor (IDE) → Assistente IA → Figma API → Coda API (via MCP)
```

### 2. Fluxo de Trabalho

1. **Input do usuário** — o usuário fornece **três** links:
   - **Figma Component Doc**: URL do frame de documentação do componente (contém a tabela "API Table").
   - **Figma Component Variants**: URL do frame que mostra as variantes do componente (ex.: tamanhos, fills).
   - **Coda doc**: URL do documento Coda onde a página será criada ou atualizada.

2. **Extração de dados**: IA acessa o Figma e extrai:
   - **API Table**: do frame "Figma Component Doc", obter os dados **exatamente** da tabela "API Table" (colunas, linhas e valores idênticos).
   - **Design Tokens**: do frame "Figma Component Variants", **extrair os tokens** e montar uma tabela usando **sempre os nomes dos tokens** (ex.: `jf.size.10`, `jf.size.24`, não alias como xs, sm, md).

3. **Processamento**: IA estrutura as informações.

4. **Documentação**: IA cria/atualiza a página no Coda via MCP.

5. **Output**: Confirmação com link da documentação.

### 3. Regras da documentação

- **Não incluir** seção Preview.
- **Não incluir** seção Recursos relacionados.
- **Não incluir** seção Anatomia.
- **Tabela API**: Deve ser **exatamente** igual à tabela "API Table" no Figma (mesmas colunas, linhas e valores). Sem texto introdutório antes da tabela.
- **Design Tokens**: Seção "## Design Tokens" deve vir **depois** de API. Extrair os tokens do frame "Figma Component Variants" e montar uma tabela usando **sempre os nomes dos tokens** (ex.: `jf.size.10`, não alias como xs, sm). Sem texto introdutório (ex.: não usar "Tokens extraídos do frame...").

## Implementação

### Passo 1: Configurar MCP para Coda

No Cursor, você precisará configurar o MCP server do Coda. Crie ou edite o arquivo de configuração MCP:

**Para macOS**: `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

**Para Windows**: `%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "coda": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-coda"],
      "env": {
        "CODA_API_TOKEN": "seu_token_aqui"
      }
    }
  }
}
```

**Como obter o token do Coda**:
1. Acesse: https://coda.io/account
2. Vá em "API Settings"
3. Clique em "Generate API Token"
4. Copie o token e adicione na configuração acima

### Passo 2: Configurar Acesso ao Figma

Você precisará de um token de acesso pessoal do Figma:

1. Acesse: https://www.figma.com/settings
2. Vá em "Personal Access Tokens"
3. Clique em "Generate new token"
4. Copie o token

### Passo 3: Criar o Prompt System para o Assistente

Crie um arquivo `.cursorrules` ou `prompt.md` no seu projeto:

```markdown
# Assistente de Documentação de Design System

Você é um assistente especializado em criar documentações de componentes de Design System no Coda.

## Seu Workflow

1. **Receber os três links**:
   - **Figma Component Doc**: frame com a documentação do componente (API Table).
   - **Figma Component Variants**: frame com as variantes do componente (tokens a extrair).
   - **Coda doc**: documento Coda de destino.

2. **Extrair informações**:
   - Do frame **Figma Component Doc**: nome do componente e tabela "API Table" (exatamente como está).
   - Do frame **Figma Component Variants**: **extrair os tokens** e montar uma tabela usando **sempre os nomes dos tokens** (ex.: `jf.size.10`, `jf.size.24`).

3. **Criar documentação no Coda**:
   - Use MCP para acessar o Coda.
   - Crie ou atualize a página do componente.
   - Estruture conforme o template: Visão Geral → **API** (tabela, sem texto antes) → **Design Tokens** (tabela de tokens, sem texto antes) → Exemplos de Uso → Acessibilidade → Boas Práticas.

## Template de Documentação

### Estrutura da Página no Coda:

```
# [Nome do Componente]

## Visão Geral
[Descrição do componente e seu propósito]

## API
[Tabela copiada exatamente da "API Table" do Figma — sem texto introdutório antes da tabela]

## Design Tokens
[Tabela com os nomes dos tokens — ex.: Token | Propriedade | Descrição — sempre usar nomes de tokens como jf.size.10, não alias; sem texto introdutório antes da tabela]

## Exemplos de Uso
[Casos de uso comuns]

## Acessibilidade
[Considerações de acessibilidade]

## Boas Práticas
[Recomendações de uso]
```

**Regras obrigatórias:**
- Não incluir seção Preview, Recursos relacionados ou Anatomia.
- **API**: Tabela exatamente igual à "API Table" do Figma. Sem texto antes da tabela.
- **Design Tokens**: Seção depois de API. Tabela com **nomes dos tokens** (ex.: `jf.size.10`). Sem texto antes da tabela (não usar "Tokens extraídos do frame...").

## Comandos MCP do Coda Disponíveis

- `coda_listDocs`: Listar documentos
- `coda_getDoc`: Obter detalhes de um documento
- `coda_listPages`: Listar páginas de um documento
- `coda_getPage`: Obter detalhes de uma página
- `coda_createPage`: Criar nova página
- `coda_updatePage`: Atualizar página existente
- `coda_listTables`: Listar tabelas
- `coda_getTable`: Obter detalhes de uma tabela
- `coda_insertRows`: Inserir linhas em tabela
- `coda_updateRow`: Atualizar linha

## Exemplo de Uso

**Usuário fornece:**
- **Figma Component Doc:** [URL do frame com API Table]
- **Figma Component Variants:** [URL do frame com variantes/tokens]
- **Coda doc:** [URL do documento Coda]

**Você deve:**
1. Acessar os dois frames no Figma (screenshot MCP ou API) e extrair API Table + tokens das variantes.
2. Montar a tabela de variantes com os tokens extraídos.
3. Criar ou atualizar a página no Coda com o template (Visão Geral, Variantes, API, Exemplos, Acessibilidade, Boas Práticas).
4. Confirmar com link da página no Coda.

```
```

### Passo 4: Script Helper para Figma API

Crie um arquivo `figma-helper.js` para facilitar extração de dados:

```javascript
// figma-helper.js
const FIGMA_API_BASE = 'https://api.figma.com/v1';

async function getFigmaComponent(fileKey, nodeId, accessToken) {
  const url = `${FIGMA_API_BASE}/files/${fileKey}/nodes?ids=${nodeId}`;
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': accessToken
    }
  });
  
  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status}`);
  }
  
  return await response.json();
}

async function getComponentImage(fileKey, nodeId, accessToken) {
  const url = `${FIGMA_API_BASE}/images/${fileKey}?ids=${nodeId}&format=png&scale=2`;
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': accessToken
    }
  });
  
  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status}`);
  }
  
  return await response.json();
}

function parseFigmaUrl(url) {
  // Exemplo: https://www.figma.com/file/ABC123/Design-System?node-id=123-456
  const match = url.match(/file\/([^\/]+)\/.*node-id=([^&]+)/);
  
  if (!match) {
    throw new Error('URL do Figma inválida');
  }
  
  return {
    fileKey: match[1],
    nodeId: match[2].replace('-', ':')
  };
}

module.exports = {
  getFigmaComponent,
  getComponentImage,
  parseFigmaUrl
};
```

### Passo 5: Exemplo de Uso no Cursor

Quando você estiver no Cursor, forneça os **três** links:

```
Figma Component Doc: https://www.figma.com/design/[FILE_KEY]/Basic-Components?node-id=[NODE_API_TABLE]
Figma Component Variants: https://www.figma.com/design/[FILE_KEY]/Basic-Components?node-id=[NODE_VARIANTS]
Coda doc: https://coda.io/d/[DOC_ID]
```

O assistente deve:
1. Extrair do frame **Figma Component Doc** a tabela "API Table" (exatamente como está).
2. Extrair do frame **Figma Component Variants** os tokens e montar a tabela **Design Tokens** usando sempre os nomes dos tokens (ex.: `jf.size.10`).
3. Criar ou atualizar a página no Coda com Visão Geral, **API** (tabela, sem texto antes), **Design Tokens** (tabela de tokens, sem texto antes), Exemplos, Acessibilidade, Boas Práticas.
4. Confirmar com link da página no Coda.

## Exemplo de Prompt Completo para o Assistente

```markdown
Documente o componente [Nome] no Coda:

**Figma Component Doc:** [URL do frame com a documentação do componente e a API Table]
**Figma Component Variants:** [URL do frame com as variantes do componente]
**Coda doc:** [URL do documento Coda]

Por favor:
1. Extraia a tabela "API Table" do frame Figma Component Doc (exatamente como está). Sem texto antes da tabela API.
2. Extraia os tokens do frame Figma Component Variants e monte a tabela na seção **Design Tokens** (depois de API), usando sempre os nomes dos tokens (ex.: jf.size.10). Sem texto antes da tabela Design Tokens.
3. Crie ou atualize a página no Coda: Visão Geral → API → Design Tokens → Exemplos → Acessibilidade → Boas Práticas.
4. Retorne o link da página criada/atualizada.
```

## Melhorias Futuras

1. **Automação de Screenshots**: Capturar automaticamente imagens do Figma
2. **Validação de Props**: Verificar se todas as props estão documentadas
3. **Versionamento**: Manter histórico de mudanças
4. **Templates Customizáveis**: Permitir diferentes templates por tipo de componente
5. **Integração com Código**: Linkar documentação com código React/Vue
6. **Sincronização Bidirecional**: Atualizar Figma quando Coda mudar

## Checklist de Configuração

- [ ] Token do Figma obtido e configurado
- [ ] Token do Coda obtido e configurado
- [ ] MCP Server do Coda configurado no Cursor
- [ ] Arquivo .cursorrules criado
- [ ] Helper do Figma implementado (opcional)
- [ ] Template de documentação definido
- [ ] Primeiro teste realizado

## Recursos Úteis

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Coda API Documentation](https://coda.io/developers/apis/v1)
- [MCP Coda Server](https://github.com/modelcontextprotocol/servers/tree/main/src/coda)

## Troubleshooting

### Erro: "MCP server not found"
- Verifique se o arquivo de configuração está no local correto
- Reinicie o Cursor após alterar configurações

### Erro: "Invalid Figma token"
- Verifique se o token tem permissões de leitura
- Teste o token manualmente via cURL

### Erro: "Coda API rate limit"
- Aguarde alguns minutos entre requests
- Implemente rate limiting no código

### Props não sendo extraídas corretamente
- Verifique se o componente no Figma está usando Component Properties
- Certifique-se que a estrutura está padronizada
