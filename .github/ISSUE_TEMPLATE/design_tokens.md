---
name: Design Token
about: Template para criação ou modificação de design tokens
title: '[TOKEN-CATEGORY] - Insira o assunto '
labels: ['triage', 'token']
projects: ['JellyFish Tokens']
---

##  Tipo de solicitação

**Tipo:**
- [ ] Novo Token
- [ ] Modificação
- [ ] Depreciação
- [ ] Remoção

> Marque apenas **uma opção**.

**Categoria:**
- [ ] Color (Cores)
- [ ] Typography (Tipografia)
- [ ] Spacing (paddings, margin, gaps)
- [ ] Size (Tamanho, width, height)
- [ ] Border (Bordas)
- [ ] Shadow (Sombras)
- [ ] Border Radius (Raios)
- [ ] Breakpoint (Responsividade)
- [ ] Animation (Animações)
- [ ] Z-index (Layer)
- [ ] Opacity (Opacidade,alpha)
- [ ] Outro: ___________

## Contexto

Descreva o propósito deste token e quando deve ser utilizado.

## Especificação do Token

**Nome(s) proposto(s):** 
- `____________`

### Valores

**nome-do-token**
```json
{
  "$value": "",
  "$type": "",
  "$description": ""
}
```

**Valores por Modo de Cor ou plataforma (se aplicável):**

**LIGHT**
**nome-do-token:**
```json
{
  "$value": "",
}
```
**DARK**
**nome-do-token:**
```json
{
  "$value": "",
}
```

**SCREEN-SM**
**nome-do-token:**
```json
{
  "$value": "",
}
```

**SCREEN-MD**
**nome-do-token:**
```json
{
  "$value": "",
}
```

**SCREEN-LG**
**nome-do-token:**
```json
{
  "$value": "",
}
```

## 📱 Formatos

- [x] Web (CSS/SCSS/CSS-in-JS)
- [ ] iOS (Swift)
- [ ] Android (XML/Compose)
- [ ] React Native
- [ ] Flutter
- [ ] Outras: ___________


### Transformações Necessárias
- [ ] px para rem
- [ ] Hex para RGB/RGBA
- [ ] Conversão de unidades
- [ ] Outras: ___________

## Acessibilidade

**Contraste (para cores):**
- [ ] WCAG AA (4.5:1 para texto normal)
- [ ] WCAG AAA (7:1 para texto normal)
- [ ] Não aplicável


**Documentação Figma:**
- Link: ___________
- Status: [ ] Sincronizado | [ ] Pendente


## Checklist de Implementação

- [ ] Token definido no arquivo de tokens base
- [ ] Variações de tema implementadas (se aplicável)
- [ ] Exportação para todas as plataformas
- [ ] Documentação atualizada (Storybook/Docs)
- [ ] Sincronizado com Figma
- [ ] Exemplos de uso criados
- [ ] Testes visuais de regressão executados
- [ ] Comunicação ao time
- [ ] Code review aprovado

## Documentação

**Onde documentar:**
- [ ] Storybook
- [ ] Wiki/Coda
- [ ] README do repositório
- [ ] Comentários no código

**Exemplos de uso:**
```jsx
// Exemplo prático de como usar este token
```

## Referências

- Figma: [link]
- Issues relacionadas: #
- PRs relacionados: #
- Discussões: [link]
- Especificação W3C/Material/Human Interface: [link]

## Governança

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
