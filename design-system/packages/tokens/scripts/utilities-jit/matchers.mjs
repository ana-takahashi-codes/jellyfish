/**
 * JIT Matchers — auto-derivados do utilities-mapping-dynamic.json
 *
 * Abordagem lookup:
 *   Para cada categoria do mapping, enumera todas as classes possíveis
 *   usando a mesma lógica do gerador estático (applyClassPattern) e
 *   armazena o resultado em um Map global.
 *
 *   resolve() é um lookup O(1) — sem switch/case, sem regex por categoria.
 *   Adicionar uma nova entrada no JSON não requer nenhuma mudança aqui.
 *
 * Interface pública (compatível com postcss-plugin.mjs e run-jit-example.mjs):
 *   buildMatchers(dynamicMapping, tokens) → Map
 *   resolveClassName(className, matchers, tokens) → { token, properties, responsive } | null
 */

// ── helpers ───────────────────────────────────────────────────────────────────

/**
 * Substitui {placeholder}s pelo valor correspondente e normaliza hífens.
 * Espelha exatamente a função em dynamic-utilities-generator.mjs para
 * garantir paridade total entre build estático e JIT.
 *
 * Ex.: applyClassPattern('{prefix}{props}-{variant}', { prefix:'m', props:'x', variant:'4' })
 *      → 'mx-4'
 *
 * Ex.: applyClassPattern('{prefix}-{props}-{variant}', { prefix:'gap', props:'', variant:'2' })
 *      → 'gap-2'  (hífens duplicados normalizados)
 */
function applyClassPattern (pattern, values) {
  let result = pattern
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value ?? '')
  }
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '')
}

/** Garante array, nunca null/undefined. */
function toArray (v) {
  return Array.isArray(v) ? v : (v != null ? [v] : [])
}

/**
 * Descobre variantes nos tokens construídos: todos os nomes que começam
 * com `tokenPattern` e têm um sufixo não-vazio.
 *
 * Retorna { [sufixo]: tokenName }
 *
 * Ex.: tokenPattern='jf-color-bg-', tokens tem 'jf-color-bg-surface-default'
 *      → { 'surface-default': 'jf-color-bg-surface-default' }
 */
function discoverVariants (tokenPattern, tokens) {
  const patternStr = toArray(tokenPattern)[0]
  if (!patternStr || typeof patternStr !== 'string') return {}
  const prefix = patternStr.endsWith('-') ? patternStr : patternStr + '-'
  const out = {}
  for (const name of Object.keys(tokens)) {
    if (name.startsWith(prefix)) {
      const suffix = name.slice(prefix.length)
      if (suffix) out[suffix] = name
    }
  }
  return out
}

/**
 * Produto cartesiano das chaves de todas as dimensões.
 *
 * Ex.: { props: { '': v, 't': v }, variant: { '1': v, '2': v } }
 *      → [{ props:'', variant:'1' }, { props:'', variant:'2' },
 *          { props:'t', variant:'1' }, { props:'t', variant:'2' }]
 */
function cartesianKeys (dimensionMap) {
  let results = [{}]
  for (const [dim, values] of Object.entries(dimensionMap)) {
    const next = []
    for (const combo of results) {
      for (const key of Object.keys(values)) {
        next.push({ ...combo, [dim]: key })
      }
    }
    results = next
  }
  return results
}

/**
 * Extrai o token CSS de uma combinação percorrendo as dimensões em ordem
 * reversa, ignorando a dimensão 'props' (que define propriedades CSS,
 * não tokens).
 */
function resolveToken (combo, dimensionMap) {
  const dims = Object.keys(dimensionMap).slice().reverse()
  for (const dim of dims) {
    if (dim === 'props') continue
    const key = combo[dim]
    if (key == null) continue
    const val = dimensionMap[dim][key]
    if (typeof val === 'string') return val
    if (val && typeof val === 'object' && typeof val.enabled === 'string') return val.enabled
  }
  return null
}

/**
 * Retorna as propriedades CSS para uma combinação dado o índice do prefixo.
 *
 * Se há dimensão 'props': usa dimensionMap.props[combo.props][prefixIndex].
 * Caso contrário: usa configProperties diretamente.
 *
 * Exemplos:
 *   spacing props='t', prefixIndex=0 → ['padding-top']
 *   spacing props='t', prefixIndex=1 → ['margin-top']
 *   borderRadius (sem props) → ['border-radius']
 *   iconSize (sem props, properties=['width','height']) → ['width','height']
 */
function resolveProperties (combo, dimensionMap, configProperties, prefixIndex) {
  if (dimensionMap.props) {
    const propsKey = combo.props ?? ''
    const entry = dimensionMap.props[propsKey]
    if (!entry) return null
    const resolved = Array.isArray(entry[prefixIndex]) ? entry[prefixIndex] : entry[0]
    return resolved ?? null
  }

  // Sem dimensão props: configProperties é a fonte de verdade.
  // Se for um array de arrays (por prefixo), indexa por prefixIndex.
  // Se for um array simples ou string, aplica para todos os prefixos.
  const all = toArray(configProperties)
  const candidate = all[prefixIndex]
  return Array.isArray(candidate) ? candidate : all
}

// ── builder de lookup por categoria ───────────────────────────────────────────

/**
 * Para uma categoria do mapping, constrói um Map:
 *   className (sem ponto) → { token, properties, responsive }
 *
 * O fluxo espelha dynamic-utilities-generator.mjs:
 *   1. Se generateFromPattern=true, descobre variantes pelos tokens construídos.
 *   2. Mescla variantes descobertas com o dynamicMapping existente (se houver).
 *   3. Faz o produto cartesiano das dimensões finais.
 *   4. Para cada combinação × prefixo, gera o className via applyClassPattern.
 */
function buildCategoryLookup (config, tokens, isResponsive) {
  const lookup = new Map()
  const prefixes = toArray(config.prefix)
  const classPattern = config.classPattern ?? '{prefix}-{variant}'
  const patternDimName = config.patternDimensionName ?? 'variant'

  // Monta o dimensionMap final
  let dimMap = config.dynamicMapping ? { ...config.dynamicMapping } : null

  if (config.generateFromPattern && config.tokenPattern) {
    const discovered = discoverVariants(config.tokenPattern, tokens)
    dimMap = dimMap
      ? { ...dimMap, [patternDimName]: discovered }
      : { [patternDimName]: discovered }
  }

  if (!dimMap) return lookup

  const combos = cartesianKeys(dimMap)

  for (const combo of combos) {
    const token = resolveToken(combo, dimMap)
    if (!token || !tokens[token]) continue

    for (let pi = 0; pi < prefixes.length; pi++) {
      const properties = resolveProperties(combo, dimMap, config.properties, pi)
      if (!properties || properties.length === 0) continue

      const placeholders = { prefix: prefixes[pi], ...combo }
      const className = applyClassPattern(classPattern, placeholders)
      if (!className) continue

      lookup.set(className, { token, properties, responsive: isResponsive })
    }
  }

  return lookup
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * Constrói a estrutura de matchers a partir do mapping dinâmico e do set
 * de tokens construídos.
 *
 * Retorna um Map global: className → { token, properties, responsive }
 * O Map é construído uma única vez na inicialização do plugin (Once handler).
 *
 * @param {Object} dynamicMapping  Conteúdo de utilities-mapping-dynamic.json
 * @param {Object} tokens          Tokens extraídos dos CSS buildados ({ [nome]: valor })
 * @returns {Map<string, { token: string, properties: string[], responsive: boolean }>}
 */
export function buildMatchers (dynamicMapping, tokens) {
  const globalLookup = new Map()

  for (const [, config] of Object.entries(dynamicMapping)) {
    const isResponsive = !!config.responsive
    const categoryLookup = buildCategoryLookup(config, tokens, isResponsive)

    for (const [className, data] of categoryLookup.entries()) {
      // Primeira categoria que define uma classe vence (sem sobrescrita silenciosa)
      if (!globalLookup.has(className)) {
        globalLookup.set(className, data)
      }
    }
  }

  return globalLookup
}

/**
 * Resolve um nome de classe (sem prefixo responsivo) para
 * { token, properties, responsive } ou null se não reconhecida.
 *
 * O parâmetro `_tokens` é mantido por compatibilidade com a assinatura
 * anterior — a validação do token já ocorre em buildMatchers.
 *
 * @param {string} className
 * @param {Map}    matchers   Retorno de buildMatchers()
 * @param {Object} _tokens    Não utilizado (compatibilidade)
 * @returns {{ token: string, properties: string[], responsive: boolean } | null}
 */
export function resolveClassName (className, matchers, _tokens) {
  return matchers.get(className) ?? null
}
