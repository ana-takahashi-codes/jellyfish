# GitHub Issue Template — Jellyfish Design System

> **Como usar:** Copie o template da seção correspondente ao tipo de componente.
> Seções marcadas com `<!-- obrigatório -->` não devem ser omitidas.
> Seções com `<!-- se aplicável -->` podem ser removidas se não forem relevantes.

---

## Índice de Templates

1. [Componente Interativo](#-template-componente-interativo)
2. [Componente de Layout](#-template-componente-de-layout)
3. [Componente de Feedback](#-template-componente-de-feedback)
4. [Componente de Dados](#-template-componente-de-dados)

---

---

# 🎛️ Template: Componente Interativo

> Exemplos: Button, Input, Select, Checkbox, Radio, Toggle, Slider, DatePicker

---

## 📦 Descrição do Componente <!-- obrigatório -->

**Nome do componente:**
**Pacote:** `@jellyfish/ui`
**Tipo:** [ ] Novo | [ ] Refatoração | [ ] Correção
**Categoria:** Interativo

<!-- Descreva em 2–3 linhas o que o componente faz e qual problema resolve. -->

---

## 🎯 Objetivo <!-- obrigatório -->

<!-- Por que esse componente está sendo criado/alterado? Qual valor entrega para o design system e seus consumidores? -->

---

## 📋 Requisitos Funcionais <!-- obrigatório -->

<!-- Liste o que o componente deve fazer. -->

- [ ] ...
- [ ] ...

### Subtipos / Variações de comportamento <!-- se aplicável -->

<!--
Se o componente tiver tipos com comportamentos distintos (ex: type="submit" | "reset" | "button"),
documente cada um aqui com uma tabela.
-->

| Tipo/Variação | Comportamento | Observações |
|---------------|--------------|-------------|
| | | |

> ⚠️ Documente valores padrão e os motivos da escolha (ex: `type="button"` como default para evitar submissões acidentais).

---

## 🎨 Design/UI <!-- obrigatório -->

**Figma:** [Link]

### Variantes e Props visuais

| Prop | Valores | Default |
|------|---------|---------|
| `variant` | | |
| `color` | | |
| `size` | `sm` \| `md` \| `lg` | `md` |

### Estados visuais

- [ ] `default`
- [ ] `hover`
- [ ] `focus-visible`
- [ ] `pressed` / `active`
- [ ] `loading`
- [ ] `disabled`
- [ ] `error` <!-- se aplicável -->
- [ ] `success` <!-- se aplicável -->

---

## 🔧 Especificações Técnicas <!-- obrigatório -->

### Estrutura

<!-- Descreva a composição do componente: qual elemento HTML raiz, se há wrapper, slots, etc. -->

### Props

```ts
interface NomeDoComponenteProps {
  // Props visuais
  variant?: '...';
  size?: 'sm' | 'md' | 'lg';

  // Props comportamentais
  disabled?: boolean;
  loading?: boolean; // se aplicável

  // Props de acessibilidade
  'aria-label'?: string;
  'aria-describedby'?: string;
  // adicione conforme o padrão ARIA do componente
}
```

### Herança / Composição

<!-- Descreva se extende Control ou outro componente base. O que é herdado e o que é exclusivo. -->

### Tokens utilizados

<!-- Liste quais tokens de cor, espaçamento, tipografia e borda o componente consome. -->

| Token | Uso |
|-------|-----|
| | |

### Notas de implementação <!-- se aplicável -->

<!-- Decisões técnicas relevantes, trade-offs, limitações conhecidas. -->

### Dependências

- [ ] `@jellyfish/tokens`
- [ ] `Control`
- [ ] `Icon`
- [ ] Outro: ___

---

## ♿ Acessibilidade <!-- obrigatório -->

### Requisitos gerais

- [ ] Navegação por teclado (`Tab`, `Enter`, `Space`, setas — conforme padrão APG)
- [ ] `focus-visible` visível com contraste mínimo 3:1 sobre o fundo (WCAG 1.4.11)
- [ ] Contraste de texto mínimo 4.5:1 (WCAG 1.4.3)
- [ ] Área clicável mínima 44×44px (WCAG 2.5.5)
- [ ] Funciona sem depender de cor como único meio de informação (WCAG 1.4.1)
- [ ] Compatível com zoom até 200% sem perda de funcionalidade (WCAG 1.4.4)

### Papel semântico (role)

<!-- Qual o role do elemento? É nativo (button, input) ou precisa de role explícito? -->

```
role: [nativo/explícito]
elemento raiz: <[elemento]>
```

### Estados ARIA necessários

| Prop ARIA | Quando usar | Valores |
|-----------|------------|---------|
| `aria-label` | Quando não há texto visível | string descritivo |
| `aria-disabled` | Quando desabilitado | `true` / `false` |
| `aria-busy` | Durante loading | `true` / `false` |
| `aria-expanded` | Controla abertura de popup | `true` / `false` |
| `aria-haspopup` | Abre menu/dialog/listbox | `"menu"` \| `"dialog"` \| `"listbox"` \| `"tree"` \| `"grid"` |
| `aria-controls` | Aponta para elemento controlado | `id` do elemento |
| `aria-pressed` | Estado de toggle | `true` \| `false` \| `"mixed"` |
| `aria-invalid` | Campo com erro | `true` \| `"grammar"` \| `"spelling"` |
| `aria-describedby` | Texto de suporte/erro vinculado | `id` do elemento descritivo |

> Remova as linhas que não se aplicam ao componente.

### Requisitos por estado

| Estado | Requisito de acessibilidade |
|--------|----------------------------|
| `disabled` | Usar atributo nativo `disabled`. Se precisar manter foco (ex: tooltip), usar `aria-disabled="true"` + bloqueio manual de `onClick` |
| `loading` | `aria-busy="true"` + label visível mantido. Não substituir texto por spinner apenas |
| `error` | `aria-invalid="true"` + `aria-describedby` apontando para mensagem de erro |
| `iconOnly` | **Obrigatório** `aria-label`. Ícone deve ter `aria-hidden="true"` |

### Padrões de uso acessível

```tsx
// Exemplo 1: caso de uso comum
<NomeDoComponente aria-label="...">
  Label visível
</NomeDoComponente>

// Exemplo 2: com estado dinâmico (se aplicável)
<NomeDoComponente
  aria-expanded={isOpen}
  aria-controls="elemento-id"
>
  ...
</NomeDoComponente>
```

### Referências WCAG / APG

- [APG Pattern — Nome do padrão](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [WCAG 1.4.3 — Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WCAG 2.5.5 — Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

---

## ✅ Critérios de Aceitação <!-- obrigatório -->

### Funcional
- [ ] Componente renderiza corretamente em todas as variantes e estados
- [ ] Todas as props funcionam conforme especificado
- [ ] Valor padrão das props está correto

### Acessibilidade
- [ ] Navegação por teclado funciona conforme padrão APG
- [ ] `aria-label` obrigatório para variantes sem texto visível (warning em dev se ausente)
- [ ] Estados ARIA corretos em cada estado do componente
- [ ] Contraste validado em todos os estados e variantes
- [ ] Sem violações no axe / jest-axe

### Qualidade
- [ ] Testes unitários implementados (cobertura mínima: ___ %)
- [ ] Testes de acessibilidade automatizados (jest-axe)
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Storybook atualizado com todas as variantes e estados
- [ ] Code review aprovado

---

## 🧪 Testes <!-- obrigatório -->

### Unitários
- [ ] Renderiza com props padrão
- [ ] Cada variante visual renderiza corretamente
- [ ] Estados (`disabled`, `loading`, `error`) aplicam atributos corretos
- [ ] `onClick` não dispara quando `disabled` ou `loading`

### Acessibilidade (jest-axe)
- [ ] Sem violações em todas as variantes
- [ ] `iconOnly` sem `aria-label` gera warning em dev
- [ ] Contraste suficiente em todos os estados

### Visuais (Storybook / Chromatic)
- [ ] Snapshot de cada variante × color × size
- [ ] Snapshot de todos os estados visuais

---

## 📚 Documentação <!-- obrigatório -->

- [ ] JSDoc em todas as props, incluindo exemplos de uso de ARIA
- [ ] Story de acessibilidade no Storybook (casos com `aria-label`, `aria-expanded`, etc.)
- [ ] Seção "Acessibilidade" na documentação do Storybook
- [ ] Exemplos de uso no README do pacote

---

## 🔗 Referências

- Issues relacionadas: #
- PRs relacionados: #
- Documentação externa:

---

## 💬 Observações Adicionais

<!-- Decisões de design, trade-offs, dívidas técnicas conhecidas. -->

---
---

# 📐 Template: Componente de Layout

> Exemplos: Grid, Stack, Flex, Divider, Container, Spacer

---

## 📦 Descrição do Componente <!-- obrigatório -->

**Nome do componente:**
**Pacote:** `@jellyfish/ui`
**Tipo:** [ ] Novo | [ ] Refatoração | [ ] Correção
**Categoria:** Layout

<!-- Descreva o que o componente faz estruturalmente. -->

---

## 🎯 Objetivo <!-- obrigatório -->

---

## 📋 Requisitos Funcionais <!-- obrigatório -->

- [ ] ...

---

## 🎨 Design/UI <!-- obrigatório -->

**Figma:** [Link]

### Props de layout

| Prop | Valores | Default | Descrição |
|------|---------|---------|-----------|
| `gap` | tokens de spacing | | Espaçamento entre filhos |
| `direction` | `row` \| `column` | | |
| `align` | `start` \| `center` \| `end` \| `stretch` | | |
| `justify` | `start` \| `center` \| `end` \| `between` | | |

---

## 🔧 Especificações Técnicas <!-- obrigatório -->

### Elemento HTML raiz

<!-- Componentes de layout geralmente devem permitir customizar o elemento raiz via `as` prop. -->

```ts
interface LayoutProps {
  as?: keyof JSX.IntrinsicElements; // default: 'div'
  gap?: SpacingToken;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  children?: ReactNode;
}
```

### Tokens utilizados

| Token | Uso |
|-------|-----|
| `spacing.*` | gap, padding |

---

## ♿ Acessibilidade <!-- obrigatório -->

Componentes de layout são majoritariamente neutros em termos de ARIA, mas há pontos de atenção:

### Requisitos

- [ ] O elemento raiz não deve introduzir roles semânticos indesejados (ex: evitar `<section>` sem `aria-label`)
- [ ] A prop `as` deve ser usada conscientemente — trocar `div` por `nav`, `main`, `aside` exige label acessível
- [ ] A ordem visual do layout deve corresponder à ordem do DOM (WCAG 1.3.2)
- [ ] Não usar apenas espaçamento/posição para comunicar hierarquia de informação (WCAG 1.3.3)

### Prop `as` — responsabilidade do consumidor

| Elemento | Requisito quando usado |
|----------|----------------------|
| `<nav>` | Requer `aria-label` para distinguir de outras navs na página |
| `<main>` | Apenas um por página |
| `<aside>` | Requer `aria-label` se houver mais de um |
| `<section>` | Requer `aria-labelledby` ou `aria-label` para ser anunciado |
| `<header>` / `<footer>` | Landmarks nativos — sem requisitos adicionais |

> Documente isso no Storybook e JSDoc da prop `as`.

---

## ✅ Critérios de Aceitação <!-- obrigatório -->

- [ ] Renderiza corretamente com todas as combinações de props
- [ ] Prop `as` funciona e aceita elementos semânticos
- [ ] Ordem do DOM corresponde à ordem visual
- [ ] Sem violações no axe
- [ ] Testes unitários e visuais implementados
- [ ] Storybook atualizado
- [ ] Code review aprovado

---

## 🧪 Testes

- [ ] Cada combinação de `direction` × `align` × `justify` renderiza corretamente
- [ ] Prop `as` altera o elemento raiz no DOM
- [ ] Gap usa os tokens corretos

---

## 📚 Documentação

- [ ] JSDoc com nota sobre uso semântico da prop `as`
- [ ] Exemplos no Storybook com elementos semânticos (`nav`, `section`, etc.)

---

## 🔗 Referências

- Issues relacionadas: #
- PRs relacionados: #

---

## 💬 Observações Adicionais

---
---

# 💬 Template: Componente de Feedback

> Exemplos: Toast, Alert, Modal/Dialog, Tooltip, Popover, ProgressBar, Skeleton

---

## 📦 Descrição do Componente <!-- obrigatório -->

**Nome do componente:**
**Pacote:** `@jellyfish/ui`
**Tipo:** [ ] Novo | [ ] Refatoração | [ ] Correção
**Categoria:** Feedback

<!-- Descreva o que o componente comunica ao usuário e em que contexto. -->

---

## 🎯 Objetivo <!-- obrigatório -->

---

## 📋 Requisitos Funcionais <!-- obrigatório -->

- [ ] ...

### Comportamento de exibição

| Aspecto | Decisão |
|---------|---------|
| Trigger | [automático / ação do usuário / programático] |
| Duração | [persistente / temporário — X ms] |
| Dismissível | [sim / não / opcional] |
| Empilhável | [sim / não] — para Toasts |

---

## 🎨 Design/UI <!-- obrigatório -->

**Figma:** [Link]

### Variantes

| Prop | Valores | Default |
|------|---------|---------|
| `severity` | `info` \| `success` \| `warning` \| `error` | `info` |
| `variant` | | |

### Estados visuais

- [ ] Entrando (animação)
- [ ] Visível
- [ ] Saindo (animação)
- [ ] Loading / skeleton (se aplicável)

---

## 🔧 Especificações Técnicas <!-- obrigatório -->

### Props

```ts
interface FeedbackComponentProps {
  severity?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  duration?: number; // ms, para auto-dismiss
  'aria-live'?: 'polite' | 'assertive';
  'aria-label'?: string;
}
```

### Renderização no DOM

<!-- Componentes de feedback frequentemente usam Portal. Documente aqui. -->

- [ ] Renderiza inline
- [ ] Renderiza via Portal (ex: `document.body`)
- [ ] Gerenciado por contexto/provider global

---

## ♿ Acessibilidade <!-- obrigatório -->

Componentes de feedback têm os requisitos de acessibilidade mais críticos do design system, pois comunicam informações importantes que podem não ser visualmente perceptíveis por todos os usuários.

### Live Regions

| Tipo de feedback | `aria-live` correto | Motivo |
|-----------------|--------------------|----|
| Toast informativo | `polite` | Não interrompe o leitor de tela |
| Toast de erro crítico | `assertive` | Interromção justificada para erros bloqueantes |
| Alert inline de erro | `polite` ou implícito via `role="alert"` | |
| ProgressBar | `polite` + `aria-valuenow` | |
| Skeleton | `aria-busy="true"` no container | |

> ⚠️ `aria-live="assertive"` interrompe imediatamente a leitura em curso. Use **apenas** para erros críticos ou situações de segurança.

### Roles semânticos

| Componente | Role recomendado |
|------------|----------------|
| Alert inline | `role="alert"` (implica `aria-live="assertive"`) ou `role="status"` (implica `aria-live="polite"`) |
| Toast | `role="status"` + `aria-live="polite"` |
| Modal/Dialog | `role="dialog"` + `aria-modal="true"` |
| Tooltip | `role="tooltip"` |
| Popover informativo | `role="tooltip"` ou `role="dialog"` dependendo da interatividade |
| ProgressBar | `role="progressbar"` + `aria-valuenow` + `aria-valuemin` + `aria-valuemax` |
| Skeleton | sem role especial; container com `aria-busy="true"` + `aria-label="Carregando..."` |

### Gerenciamento de foco (componentes modais)

- [ ] Ao abrir: foco deve ir para o primeiro elemento focável dentro do componente, ou para o próprio container com `tabIndex={-1}`
- [ ] Trap de foco ativo enquanto aberto (foco não pode sair do componente)
- [ ] Ao fechar: foco deve retornar ao elemento que disparou a abertura
- [ ] `Escape` fecha o componente

### Requisitos por componente

| Componente | Requisito específico |
|------------|---------------------|
| Modal/Dialog | `aria-labelledby` apontando para o título + `aria-describedby` para o conteúdo |
| Tooltip | Acionado por `focus` e `hover`. Nunca conter informação essencial não disponível de outra forma |
| Toast auto-dismiss | Tempo mínimo de exibição suficiente para leitura (WCAG 2.2.1). Oferecer forma de pausar |
| Alert de erro | Vinculado ao campo via `aria-describedby` no campo correspondente |
| ProgressBar indeterminado | `aria-valuenow` ausente; usar `aria-label` descritivo |

### Cores e ícones de severidade

- [ ] A severidade **não pode ser comunicada apenas por cor** — sempre acompanhar de ícone + label/texto (WCAG 1.4.1)
- [ ] Ícones de severidade devem ter `aria-hidden="true"` (a informação já está no texto)

### Exemplos

```tsx
// Toast de sucesso
<Toast
  severity="success"
  role="status"
  aria-live="polite"
>
  Alterações salvas com sucesso.
</Toast>

// Dialog
<Dialog
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
  aria-modal="true"
>
  <h2 id="dialog-title">Confirmar exclusão</h2>
  <p id="dialog-desc">Esta ação não pode ser desfeita.</p>
</Dialog>

// ProgressBar
<ProgressBar
  role="progressbar"
  aria-valuenow={60}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Enviando arquivo..."
/>
```

### Referências WCAG / APG

- [APG — Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [APG — Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [APG — Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [WCAG 1.4.1 — Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
- [WCAG 2.2.1 — Timing Adjustable](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html)
- [WCAG 2.4.3 — Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)

---

## ✅ Critérios de Aceitação <!-- obrigatório -->

### Funcional
- [ ] Renderiza e fecha corretamente
- [ ] Auto-dismiss funciona com o tempo configurado
- [ ] Animações de entrada e saída funcionam

### Acessibilidade
- [ ] `aria-live` correto para o tipo de feedback
- [ ] Cores de severidade acompanhadas de ícone e texto
- [ ] Foco gerenciado corretamente (para modais)
- [ ] `Escape` fecha o componente (para modais/popovers)
- [ ] Sem violações no jest-axe

### Qualidade
- [ ] Testes unitários implementados
- [ ] Testes de acessibilidade com jest-axe
- [ ] Storybook atualizado
- [ ] Code review aprovado

---

## 🧪 Testes

- [ ] Renderiza com cada `severity`
- [ ] Auto-dismiss dispara `onDismiss` no tempo correto
- [ ] `Escape` fecha componentes interativos
- [ ] Foco retorna ao trigger após fechar modal
- [ ] `aria-live` está correto no DOM
- [ ] Sem violações de acessibilidade (jest-axe)

---

## 📚 Documentação

- [ ] JSDoc documentando `aria-live` e quando usar cada valor
- [ ] Story de acessibilidade demonstrando anúncio em leitor de tela
- [ ] Seção "Acessibilidade" no Storybook com guia de uso

---

## 🔗 Referências

- Issues relacionadas: #
- PRs relacionados: #

---

## 💬 Observações Adicionais

---
---

# 📊 Template: Componente de Dados

> Exemplos: Table, List, Card, Badge, Avatar, Tag, DataGrid

---

## 📦 Descrição do Componente <!-- obrigatório -->

**Nome do componente:**
**Pacote:** `@jellyfish/ui`
**Tipo:** [ ] Novo | [ ] Refatoração | [ ] Correção
**Categoria:** Dados

<!-- Descreva que tipo de dado o componente apresenta e em que contexto. -->

---

## 🎯 Objetivo <!-- obrigatório -->

---

## 📋 Requisitos Funcionais <!-- obrigatório -->

- [ ] ...

### Capacidades de interação <!-- se aplicável -->

- [ ] Ordenação de colunas
- [ ] Filtragem
- [ ] Seleção de linhas
- [ ] Expansão de linhas
- [ ] Paginação
- [ ] Ações por linha

---

## 🎨 Design/UI <!-- obrigatório -->

**Figma:** [Link]

### Variantes

| Prop | Valores | Default |
|------|---------|---------|
| `variant` | | |
| `size` | `sm` \| `md` \| `lg` | `md` |
| `interactive` | `boolean` | `false` |

### Estados visuais

- [ ] Vazio (empty state)
- [ ] Loading / skeleton
- [ ] Erro ao carregar
- [ ] Hover em linhas/cards (se interativo)
- [ ] Selecionado
- [ ] Expandido

---

## 🔧 Especificações Técnicas <!-- obrigatório -->

### Props

```ts
interface DataComponentProps {
  data: T[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  // props de acessibilidade
  'aria-label'?: string;
  'aria-labelledby'?: string;
  caption?: string; // para tabelas
}
```

### Tokens utilizados

| Token | Uso |
|-------|-----|
| | |

---

## ♿ Acessibilidade <!-- obrigatório -->

### Estrutura semântica

| Componente | Elemento/Role correto |
|------------|----------------------|
| Table | `<table>` com `<caption>` ou `aria-label`. `<th>` com `scope="col"` ou `scope="row"` |
| DataGrid interativo | `role="grid"` com navegação por setas |
| List | `<ul>/<ol>` com `<li>`. Evitar `<div>` para listas de conteúdo |
| Card interativo | `<article>` ou `<button>` dependendo da ação. Nunca `<div>` com `onClick` sem role |
| Badge / Tag | `<span>` com texto legível. Não comunicar status apenas por cor |
| Avatar | `<img>` com `alt` descritivo, ou `aria-label` se for elemento decorativo com `aria-hidden` |

### Tabelas

- [ ] Toda tabela deve ter `<caption>` ou `aria-label` descritivo
- [ ] Cabeçalhos de coluna usam `<th scope="col">`
- [ ] Cabeçalhos de linha usam `<th scope="row">`
- [ ] Tabelas complexas (com colspan/rowspan) usam `id` + `headers`
- [ ] Tabelas de dados **não** devem ser usadas para layout

### Ordenação de colunas

```tsx
<th
  scope="col"
  aria-sort="ascending" // "descending" | "none" | "other"
>
  Nome
</th>
```

### Seleção de linhas

```tsx
// Linha selecionável
<tr aria-selected={isSelected}>...</tr>

// Checkbox de seleção na linha
<td>
  <Checkbox
    aria-label={`Selecionar ${item.name}`}
    checked={isSelected}
  />
</td>
```

### Navegação por teclado (DataGrid)

| Tecla | Ação |
|-------|------|
| `Tab` | Mover entre células interativas |
| `↑ ↓ ← →` | Navegar entre células |
| `Enter` / `Space` | Ativar ação da célula |
| `Home` / `End` | Primeira / última célula da linha |

### Estados especiais

| Estado | Requisito |
|--------|-----------|
| Loading | Container com `aria-busy="true"` + skeleton com `aria-hidden="true"` |
| Vazio | Mensagem de estado vazio acessível; não deixar tabela com `<tbody>` vazio |
| Erro | Mensagem de erro com `role="alert"` |
| Expansão de linha | `aria-expanded` no botão de expansão + `aria-controls` apontando para o conteúdo expandido |

### Badge / Status visual

- [ ] Nunca comunicar status apenas por cor (WCAG 1.4.1)
- [ ] Sempre acompanhar de texto ou `aria-label`

```tsx
// Errado
<Badge color="green" />

// Correto
<Badge color="green" aria-label="Ativo">Ativo</Badge>
```

### Referências WCAG / APG

- [APG — Table Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
- [APG — Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [WCAG 1.3.1 — Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- [WCAG 1.4.1 — Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)

---

## ✅ Critérios de Aceitação <!-- obrigatório -->

### Funcional
- [ ] Renderiza dados corretamente
- [ ] Estados de loading, vazio e erro funcionam
- [ ] Interações (ordenação, seleção, expansão) funcionam conforme especificado

### Acessibilidade
- [ ] Estrutura semântica correta (`<table>`, `<th scope>`, etc.)
- [ ] Navegação por teclado funciona conforme padrão APG
- [ ] Status e badges não dependem apenas de cor
- [ ] Estados dinâmicos (ordenação, seleção) refletidos em ARIA
- [ ] Sem violações no jest-axe

### Qualidade
- [ ] Testes unitários implementados
- [ ] Testes de acessibilidade com jest-axe
- [ ] Storybook com stories de todos os estados
- [ ] Code review aprovado

---

## 🧪 Testes

- [ ] Renderiza dados passados via prop
- [ ] Estado vazio exibe mensagem configurada
- [ ] Estado loading exibe skeleton e `aria-busy`
- [ ] Ordenação aplica `aria-sort` correto
- [ ] Seleção aplica `aria-selected` correto
- [ ] Sem violações de acessibilidade (jest-axe)

---

## 📚 Documentação

- [ ] JSDoc com exemplos de uso de `caption`, `aria-label`, `aria-sort`
- [ ] Story de acessibilidade no Storybook
- [ ] Guia de uso com tabelas semânticas vs. layout

---

## 🔗 Referências

- Issues relacionadas: #
- PRs relacionados: #

---

## 💬 Observações Adicionais