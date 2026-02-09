---
name: Design Token
about: Template para criação ou modificação de design tokens
title: '[TOKEN] '
labels: design-system, tokens, design
assignees: ''
---

## 🎨 Categoria do Token

**Tipo:** [ ] Novo | [ ] Modificação | [ ] Depreciação | [ ] Remoção

**Categoria:**
- [ ] Color (Cores)
- [ ] Typography (Tipografia)
- [ ] Spacing (Espaçamento)
- [ ] Border (Bordas)
- [ ] Shadow (Sombras)
- [ ] Border Radius (Raios)
- [ ] Breakpoint (Responsividade)
- [ ] Animation (Animações)
- [ ] Z-index (Camadas)
- [ ] Opacity (Opacidade)
- [ ] Outro: ___________

## 📋 Descrição

Descreva o propósito deste token e quando deve ser utilizado.

## 🎯 Motivação

Por que este token é necessário? Qual problema de design ele resolve?

## 📊 Especificação do Token

### Nomenclatura
```
token-category-variant-state
Exemplo: color-primary-500, spacing-md, shadow-elevated
```

**Nome proposto:** `____________`

### Valores

**Valor base:**
```json
{
  "value": "",
  "type": "",
  "description": ""
}
```

**Valores por tema (se aplicável):**

**Light Theme:**
```json
{
  "value": "",
  "type": ""
}
```

**Dark Theme:**
```json
{
  "value": "",
  "type": ""
}
```

### Tokens Relacionados

**Referencia:** `____________` (se for um alias)
**Compõe:** Tokens que utilizam este valor
**Substitui:** Token antigo sendo depreciado (se aplicável)

## 🎨 Aplicação Visual

**Contextos de uso:**
- Componente A
- Componente B
- Padrão X

**Exemplos visuais:**
[Insira screenshots, links do Figma, ou exemplos visuais]

## 📱 Plataformas

- [ ] Web (CSS/SCSS/CSS-in-JS)
- [ ] iOS (Swift)
- [ ] Android (XML/Compose)
- [ ] React Native
- [ ] Flutter
- [ ] Outras: ___________

## 🔧 Implementação Técnica

### Formato de Saída

**CSS:**
```css
--token-name: value;
```

**SCSS:**
```scss
$token-name: value;
```

**JavaScript/TypeScript:**
```typescript
export const tokenName = 'value';
```

**Tailwind:**
```javascript
theme: {
  extend: {
    category: {
      'token-name': 'value'
    }
  }
}
```

### Transformações Necessárias
- [ ] px para rem
- [ ] Hex para RGB/RGBA
- [ ] Conversão de unidades
- [ ] Outras: ___________

## ♿ Acessibilidade

**Contraste (para cores):**
- [ ] WCAG AA (4.5:1 para texto normal)
- [ ] WCAG AAA (7:1 para texto normal)
- [ ] Não aplicável

**Considerações:**
- Legibilidade
- Diferenciação de estados
- Modo de alto contraste

## 📐 Sistema de Design

**Escala/Sistema:**
- Segue a escala estabelecida? [ ] Sim | [ ] Não
- Mantém consistência com tokens existentes? [ ] Sim | [ ] Não

**Documentação Figma:**
- Link: ___________
- Status: [ ] Sincronizado | [ ] Pendente

## 🔄 Impacto e Migração

**Componentes afetados:**
- Componente 1
- Componente 2

**Breaking changes:**
- [ ] Sim - Requer migração
- [ ] Não - Adição não-destrutiva

**Plano de migração (se aplicável):**
1. Passo 1
2. Passo 2
3. Passo 3

**Token depreciado:**
- Nome: ___________
- Prazo de remoção: ___________

## ✅ Checklist de Implementação

- [ ] Token definido no arquivo de tokens base
- [ ] Variações de tema implementadas (se aplicável)
- [ ] Exportação para todas as plataformas
- [ ] Documentação atualizada (Storybook/Docs)
- [ ] Sincronizado com Figma
- [ ] Exemplos de uso criados
- [ ] Testes visuais de regressão executados
- [ ] Comunicação ao time (changelog)
- [ ] Code review aprovado

## 📚 Documentação

**Onde documentar:**
- [ ] Storybook
- [ ] Wiki/Confluence
- [ ] README do repositório
- [ ] Site de documentação
- [ ] Comentários no código

**Exemplos de uso:**
```jsx
// Exemplo prático de como usar este token
```

## 🔗 Referências

- Figma: [link]
- Issues relacionadas: #
- PRs relacionados: #
- Discussões: [link]
- Especificação W3C/Material/Human Interface: [link]

## 📊 Governança

**Aprovação necessária:**
- [ ] Design Lead
- [ ] Tech Lead
- [ ] Product Owner
- [ ] Equipe de Acessibilidade

**Revisores sugeridos:**
- @designer
- @developer
- @a11y-specialist

## 💬 Observações Adicionais

Informações extras, decisões de design, considerações especiais, edge cases, etc.
