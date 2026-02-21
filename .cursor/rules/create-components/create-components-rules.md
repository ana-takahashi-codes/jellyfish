# JELLYFISH DESIGN SYSTEM – Regra para criação de componentes

## Regra obrigatória

**Sempre que for criar um novo componente**, você **DEVE** ler todos os arquivos da pasta **`docs`** do pacote **ui** antes de implementar:

- Caminho no monorepo: **`design-system/packages/ui/docs/`**
- Arquivos a ler: **README.md**, **COMPONENT_GUIDELINES.md**, **UTILITY_CLASSES_GUIDE.md** (e qualquer outro guia que existir nessa pasta)

Esses guias são a **fonte única de verdade** para:

- Estrutura do monorepo e onde ficam variants, tokens e utilities
- Processo obrigatório (análise Figma, mapeamento tokens, fluxo de trabalho)
- Estrutura de arquivos do componente (ComponentName.tsx, .variants.ts, .types.ts, stories, index)
- Uso de JFV (Jellyfish Variants), tokens e utility classes (incluindo a regra `.size-*` para width = height)
- Templates, checklists (final e code review) e regras críticas (NUNCA/SEMPRE)

Não use apenas esta regra como referência: **leia os guias** em cada criação de componente.
