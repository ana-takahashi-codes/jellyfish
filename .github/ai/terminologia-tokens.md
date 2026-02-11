# Terminologia e taxonomia de tokens — JellyFish

Documento de referência para nomenclatura e hierarquia de design tokens no sistema JellyFish.

---

## 1. Taxonomia

A hierarquia taxonômica segue a ordem abaixo. A criação de nomes **deve** respeitar esta linearidade.

```
system → subtheme → group → component → element → category → context → property → variant → behavior → intensity → state → scale
```

| Nível | Descrição |
|-------|-----------|
| **system** | Prefixo do sistema. Obrigatório em todos os tokens. No JellyFish: `jf`. |
| **subtheme** | Subtema (ex.: high-contrast). |
| **group** | Grupo funcional de componentes. |
| **component** | Indica token específico de um componente. |
| **element** | Indica um elemento que pertence a um componente. |
| **category** | Categoria do token para distinção entre propriedades. Não corresponde ao tipo do Design Token Community Group. |
| **context** | Contexto adicional da categoria do token. |
| **property** | Característica mensurável ou configurável. |
| **variant** | Alternativas de valores de uma propriedade. |
| **behavior** | Comportamentos específicos de elementos. |
| **intensity** | Grau de uma característica. |
| **state** | Condição transitória do elemento. |
| **scale** | Ordem progressiva de valores relacionados. |

---

## 2. Terminologias por nível

### 2.1 System

- `jf`

### 2.2 Subtheme

- `high-contrast`

### 2.3 Group

- `cards`
- `article`
- `control`
- `form`

### 2.4 Component

- `button`
- `card`
- `container`
- `grid`
- `input`
- `skeleton`
- `thumbnail`
- `section`
- `hero`
- `link`

### 2.5 Element

- `text`
- `icon`
- `label`
- `content`
- `placeholder`

### 2.6 Category

- `color`
- `border`
- `shadow`
- `motion`
- `angle`
- `font`
- `opacity`
- `blur`
- `ratio`
- `font-family`
- `line-height`
- `letter-spacing`
- `font-weight`
- `font-size`
- `scale`
- `layer`
- `grid`
- `gradient`
- `size`
- `fraction`
- `corner`

### 2.7 Context

- `fg`
- `title`
- `text`
- `caption`
- `label`
- `placeholder`
- `code`
- `surface`
- `page`
- `screen`
- `quote`
- `alpha`
- `max`
- `min`
- `cols`
- `image`
- `paragraph`
- `linear`
- `overlay`
- `overline`
- `subtitle`
- `meta`
- `easing`

### 2.8 Property

- `bg`
- `corner`
- `shadow`
- `width`
- `height`
- `gap`
- `padding`
- `margin`
- `border`
- `fill`
- `gutter`
- `radius`
- `min-width`
- `max-width`
- `duration`
- `delay`
- `transition`

### 2.9 Variant

- `brand-primary`
- `accent`
- `positive`
- `warning`
- `critical`
- `neutral`
- `black`
- `white`
- `default`
- `contrast`
- `full`
- `none`
- `dataviz1` … `dataviz4`
- `circle`
- `boxed`
- `on-brand-primary`
- `on-accent`
- `on-info`
- `on-positive`
- `on-warning`
- `on-critical`
- `on-neutral`
- `on-dataviz1` … `on-dataviz4`
- `16x9`, `4x3`, `1x1`, `3x2`, `9x16`, `21x9`
- `half`
- `base`
- `raised`
- `sticky`
- `overlay`
- `drawer`
- `modal`
- `popover`
- `tooltip`
- `toast`
- `sans`
- `mono`
- `serif`
- `icon`
- `decoration`
- `visited`
- `third`
- `quarter`
- `pill`
- `horizontal`
- `vertical`
- `desktop`
- `mobile`
- `tablet`
- `desktop-dense`

### 2.10 Behavior

- `accelerate`
- `decelerate`
- `balanced`
- `expand`
- `collapse`
- `linear`
- `hover`
- `focus`
- `disabled`
- `dragged`
- `pressed`
- `loading`
- `offset`
- `inset`
- `to-top`
- `to-bottom`
- `to-left`
- `to-right`
- `start`
- `end`
- `middle`
- `bottom`
- `top`
- `slide-in`
- `slide-out`
- `fade`
- `scale`
- `state-change`
- `active`

### 2.11 Intensity

- `soft`
- `strong`
- `muted`
- `instant`
- `brief`
- `short`
- `medium`
- `long`
- `longer`
- `extended`
- `compact`
- `wide`
- `regular`
- `moderated`
- `comfort`
- `narrow`
- `tight`
- `primary`
- `secondary`
- `tertiary`

### 2.12 State

*(Reservado para condições transitórias; termos a definir conforme necessidade.)*

### 2.13 Scale

**Tamanhos relativos**

- `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- `g`, `xg`, `2xg`, `3xg`, `4xg`

**Valores numéricos**

- `0`, `0-5`
- `1` … `36`
- `40`, `45`, `56`, `60`, `64`, `72`, `80`, `90`, `95`, `100`, `105`, `120`, `150`, `180`, `200`, `260`, `300`, `320`, `400`, `500`, `600`, `700`, `800`, `900`, `950`
