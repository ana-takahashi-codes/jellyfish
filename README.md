# Jellyfish Design System

Repositório do Design System Jellyfish, um monorepo construído com Turborepo para gerenciar componentes, tokens de design e documentação.

## 📦 Instalação

Este projeto utiliza [pnpm](https://pnpm.io) como gerenciador de pacotes. Certifique-se de ter o pnpm instalado antes de prosseguir.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm (versão 8.15.6 ou superior)

### Instalando o pnpm

Se você ainda não tem o pnpm instalado, você pode instalá-lo usando npm:

```bash
npm install -g pnpm@8.15.6
```

### Instalando as dependências

Navegue até a pasta `design-system` e instale as dependências:

```bash
cd design-system
pnpm install
```

## 🚀 Comandos Disponíveis

Após instalar as dependências, você pode usar os seguintes comandos:

- `pnpm dev` - Inicia o Storybook em modo de desenvolvimento com hot reload
- `pnpm build` - Compila todos os pacotes e o site do Storybook
- `pnpm lint` - Executa o linter em todos os pacotes
- `pnpm format` - Formata o código usando Prettier
- `pnpm clean` - Remove todos os `node_modules` e pastas `dist`
- `pnpm changeset` - Gera um changeset para versionamento
- `pnpm preview-storybook` - Visualiza o Storybook compilado localmente

## 📚 Estrutura do Projeto

Este monorepo contém:

- `apps/docs` - Documentação dos componentes com Storybook
- `packages/ui` - Componentes React principais
- `packages/tokens` - Tokens de design (cores, espaçamentos, tipografia, etc.)
- `packages/typescript-config` - Configurações TypeScript compartilhadas
- `packages/eslint-config` - Configurações ESLint compartilhadas

## 🔧 MCP do Coda AI

Este projeto está configurado para usar o MCP (Model Context Protocol) do Coda AI. Veja [CODA_MCP_SETUP.md](./CODA_MCP_SETUP.md) para instruções de configuração.

## 📖 Documentação Adicional

Para mais detalhes sobre a estrutura e uso do design system, consulte o [README do design-system](./design-system/README.md).