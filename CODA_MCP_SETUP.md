# Configuração do MCP do Coda AI

Este projeto está configurado para usar o MCP (Model Context Protocol) do Coda AI, que permite interagir com documentos, páginas, tabelas e outros elementos do Coda diretamente através do Cursor.

## Pré-requisitos

1. Uma conta no Coda (https://coda.io)
2. Uma API Key do Coda (gerada em https://coda.io/account)

## Como Obter sua API Key

1. Acesse https://coda.io/account
2. Navegue até a seção de API Keys
3. Gere uma nova API Key
4. Copie a chave (você só poderá vê-la uma vez)

## Configuração no Cursor

### Passo 1: Localizar o arquivo de configuração do Cursor

O arquivo de configuração do MCP no Cursor geralmente está em:

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

Ou você pode acessar através do Cursor:
1. Abra as configurações do Cursor (Ctrl+,)
2. Procure por "MCP" ou "Model Context Protocol"
3. Adicione a configuração do servidor

### Passo 2: Adicionar a configuração do Coda MCP

Adicione a seguinte configuração ao arquivo de configuração do MCP:

```json
{
  "mcpServers": {
    "coda": {
      "command": "npx",
      "args": ["-y", "coda-mcp@latest"],
      "env": {
        "API_KEY": "SUA_CHAVE_API_AQUI"
      }
    }
  }
}
```

**Importante:** Substitua `SUA_CHAVE_API_AQUI` pela sua API Key do Coda.

### Alternativa: Usando Docker

Se preferir usar Docker:

```json
{
  "mcpServers": {
    "coda": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "API_KEY", "dustingood/coda-mcp:latest"],
      "env": {
        "API_KEY": "SUA_CHAVE_API_AQUI"
      }
    }
  }
}
```

## Verificação da Instalação

Após configurar, reinicie o Cursor. O MCP do Coda deve estar disponível e você poderá usar comandos como:

- "Liste todos os documentos do Coda"
- "Crie uma nova página no documento X"
- "Busque páginas que contenham 'design system'"

## Funcionalidades Disponíveis

O MCP do Coda fornece **34 ferramentas** para interagir com o Coda:

### 📄 Operações de Documentos
- `coda_list_documents` - Listar ou buscar documentos
- `coda_get_document` - Obter informações detalhadas de um documento
- `coda_create_document` - Criar novo documento (opcionalmente de um template)
- `coda_update_document` - Atualizar propriedades do documento
- `coda_get_document_stats` - Obter estatísticas e insights do documento

### 📝 Operações de Páginas
- `coda_list_pages` - Listar páginas em um documento
- `coda_create_page` - Criar nova página
- `coda_delete_page` - Deletar uma página
- `coda_get_page_content` - Obter conteúdo da página como markdown
- `coda_peek_page` - Visualizar início da página
- `coda_replace_page_content` - Substituir conteúdo completo da página
- `coda_append_page_content` - Adicionar conteúdo ao final da página
- `coda_duplicate_page` - Duplicar uma página
- `coda_rename_page` - Renomear uma página
- `coda_search_pages` - Buscar páginas por nome ou conteúdo

### 📊 Operações de Tabelas
- `coda_list_tables` - Listar todas as tabelas e views
- `coda_get_table` - Obter informações detalhadas de uma tabela
- `coda_get_table_summary` - Obter resumo completo (linhas, colunas, dados de exemplo)
- `coda_search_tables` - Buscar tabelas por nome

### 📋 Operações de Colunas
- `coda_list_columns` - Listar todas as colunas de uma tabela
- `coda_get_column` - Obter informações detalhadas de uma coluna

### 📑 Operações de Linhas
- `coda_list_rows` - Listar linhas com filtros, paginação e ordenação
- `coda_get_row` - Obter informações detalhadas de uma linha
- `coda_create_rows` - Criar ou atualizar múltiplas linhas (upsert)
- `coda_update_row` - Atualizar uma linha específica
- `coda_delete_row` - Deletar uma linha específica
- `coda_delete_rows` - Deletar múltiplas linhas
- `coda_bulk_update_rows` - Atualizar múltiplas linhas em lote

### 🔢 Operações de Fórmulas
- `coda_list_formulas` - Listar todas as fórmulas nomeadas
- `coda_get_formula` - Obter informações detalhadas de uma fórmula

### 🎛️ Operações de Controles
- `coda_list_controls` - Listar todos os controles (botões, sliders, etc.)
- `coda_get_control` - Obter informações detalhadas de um controle
- `coda_push_button` - Acionar um botão em uma linha de tabela

### 👤 Operações de Usuário
- `coda_whoami` - Obter informações do usuário autenticado atual

## Exemplos de Uso

### Listar documentos
```
"Liste todos os meus documentos do Coda"
```

### Criar uma página
```
"Crie uma nova página chamada 'Design Tokens' no documento [ID_DO_DOCUMENTO]"
```

### Buscar conteúdo
```
"Busque páginas que contenham a palavra 'button' no documento [ID_DO_DOCUMENTO]"
```

### Trabalhar com tabelas
```
"Liste todas as tabelas do documento [ID_DO_DOCUMENTO]"
"Mostre as primeiras 10 linhas da tabela [ID_DA_TABELA]"
```

## Limitações

⚠️ **Importante:** Este MCP server fornece operações CRUD completas para elementos existentes do Coda, mas **não pode criar novas tabelas** ou outros elementos de canvas devido às limitações da API do Coda.

## Solução de Problemas

### O MCP não está funcionando
1. Verifique se a API Key está correta
2. Reinicie o Cursor após adicionar a configuração
3. Verifique se o Node.js está instalado (para uso com npx)
4. Verifique os logs do Cursor para erros

### Erro de autenticação
- Verifique se sua API Key está válida em https://coda.io/account
- Certifique-se de que a API Key não expirou

## Referências

- [Repositório do Coda MCP](https://github.com/dustinrgood/coda-mcp)
- [Documentação da API do Coda](https://coda.io/developers/apis/v1)
- [Documentação do MCP](https://modelcontextprotocol.io/)
