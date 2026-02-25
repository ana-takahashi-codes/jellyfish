# Release: Button component e documentação

## Commit message (sugestão)

Use ao fazer o commit do **bump de versão** ou ao **squash** dos commits de feature em um único commit de release:

```
release(design-system): Button component, docs e prompt templates

- feat(ui): componente Button (variant/color/size, iconOnly, loading)
- docs(ui): COMPONENT_GUIDELINES, STORYBOOK_STORY_MODEL, UTILITY_CLASSES_GUIDE
- docs(ui): prompt-templates e coda-button-doc para wiki Coda
- chore: atualiza ISSUE_TEMPLATE components, tokens utilities, Control/Icon
- remove: PROMPT_MODEL.md e regras ds-docs-assistant antigas
```

**Alternativa mais curta:**

```
release(design-system): Button component e documentação

Button com variantes (solid/outline/ghost), cores semânticas, ícones e loading.
Docs: guidelines, Storybook model, Coda wiki, prompt templates. Ajustes em tokens e Control.
```

---

## PR description

```markdown
## Release: Design System — Button component e documentação

### Objetivo

Release do componente **Button** do JellyFish Design System, com documentação alinhada (Coda, Storybook, guidelines) e ajustes em tokens e templates.

### O que muda

#### Componente Button (`@jellyfish/ui/button`)
- **Variantes**: `solid` | `outline` | `ghost` × `neutral` | `brand-primary` | `accent` | `critical`
- **Tamanhos**: `sm` | `md` | `lg` (Control)
- **Props**: `startIcon` / `endIcon`, `iconOnly`, `loading`, `fullWidth`, `radius`
- **Acessibilidade**: `aria-label` em iconOnly, `aria-busy` em loading, teclado e focus via `.interactive`
- Alinhado ao Figma (node 2040-5016)

#### Documentação
- **Coda**: página Button na wiki com descrição, quando usar/não usar, tipos, API, acessibilidade, Figma, changelog
- **Storybook**: stories Button (Playground, Variants, Sizes, States, IconOnly, etc.) e docs no painel
- **Docs no repo**: `COMPONENT_GUIDELINES.md`, `STORYBOOK_STORY_MODEL.md`, `UTILITY_CLASSES_GUIDE.md` atualizados
- **Prompt templates**: `prompt-component-creation.mdx` e `coda-button-doc.md` (fonte da doc Coda)

#### Outros
- **Tokens**: `utilities.css` e `utility-classes-manifest.json` atualizados
- **Control / Icon**: variantes e tipos ajustados para uso pelo Button
- **Issue template**: `.github/ISSUE_TEMPLATE/components.md` atualizado
- Remoção: `PROMPT_MODEL.md`, regras antigas em `.cursor/rules/ds-docs-assistant/`

### Como testar

1. No monoreto: `pnpm build` e `pnpm preview-storybook` (ou `pnpm dev` no js-docs)
2. Abrir Storybook → Basic/Button e validar variantes, tamanhos, estados, iconOnly e acessibilidade
3. Conferir doc no Coda: [Button](https://coda.io/d/JellyFish-DS_dh_EnKx_yEV/Button_suwHul4V)

### Versionamento

- Usar **changeset** para o pacote `@jellyfish/ui` (e outros afetados, se necessário) antes do merge.
- Após merge: `pnpm version-packages` e `pnpm release` conforme fluxo do repo.

### Checklist

- [ ] Storybook sobe e stories do Button funcionam
- [ ] Build do design-system passa
- [ ] Changeset adicionado para os pacotes que serão publicados
- [ ] Doc do Button no Coda revisada (e link da issue no Changelog, se houver)
```

---

## Changeset (opcional)

Se for usar changesets, crie um arquivo em `.changeset/` com conteúdo no formato:

```markdown
---
"@jellyfish/ui": minor
---

Release Button component and documentation (Coda wiki, Storybook, guidelines, prompt templates).
```

Depois: `pnpm changeset` para criar interativamente, ou criar o arquivo manualmente com o nome sugerido (ex.: `button-release.md`).
