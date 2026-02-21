/**
 * split-sets.mjs
 *
 * Lê o tokens.resolver.json, extrai cada set do JSON monolítico exportado pelo
 * Tokens Studio e grava os arquivos separados que o resolver referencia.
 *
 * Por que existe:
 *   O Tokens Studio exporta um único arquivo com todos os sets como top-level keys.
 *   O resolver DTCG referencia arquivos individuais por contexto (set / modifier).
 *   Este script faz a ponte: extrai e grava, substituindo o getBuildManifest()
 *   baseado em regex de config/constants.js.
 *
 * Output:
 *   {splitDir}/{theme}/primitives.json
 *   {splitDir}/{theme}/foundations.json
 *   {splitDir}/{theme}/components.json
 *   {splitDir}/{theme}/theme-light.json
 *   {splitDir}/{theme}/theme-dark.json
 *   {splitDir}/{theme}/platform-screen-xs.json
 *   ... (nomes derivados do resolver: {modifierName}-{contextKey}.json)
 *
 * Uso como CLI:
 *   node scripts/build/split-sets.mjs
 *   node scripts/build/split-sets.mjs --resolver path/to/tokens.resolver.json
 *
 * Uso como módulo:
 *   import { splitSets, loadResolver } from './split-sets.mjs'
 *   const results = splitSets()            // usa tokens.resolver.json na raiz
 *   const results = splitSets('./custom.resolver.json')
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const PACKAGE_ROOT = path.resolve(__dirname, '..', '..')

// ── helpers ───────────────────────────────────────────────────────────────────

function abs (p) {
  return path.isAbsolute(p) ? p : path.join(PACKAGE_ROOT, p)
}

function readJSON (filePath) {
  const raw = fs.readFileSync(abs(filePath), 'utf-8')
  try {
    return JSON.parse(raw)
  } catch (e) {
    throw new Error(`JSON inválido em "${filePath}": ${e.message}`)
  }
}

function writeJSON (filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

/**
 * Converte tokens do formato legado Tokens Studio (value/type) para DTCG ($value/$type).
 * Necessário para que a resolução de colisões do Style Dictionary funcione corretamente
 * quando arquivos de tema fazem overlay sobre tokens do core já em formato DTCG.
 *
 * SD v5 usa $value quando presente; sem essa conversão, um token legado {value: '#fb65b7'}
 * não sobrescreve um token DTCG {$value: 'oklch(...)'} pois são chaves diferentes no merge.
 */
function legacyToDtcg (obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(legacyToDtcg)

  const result = {}
  const hasLegacyValue = 'value' in obj && !('$value' in obj)

  for (const [k, v] of Object.entries(obj)) {
    if (k === 'value' && hasLegacyValue) {
      result['$value'] = legacyToDtcg(v)
    } else if (k === 'type' && hasLegacyValue) {
      result['$type'] = v
    } else {
      result[k] = legacyToDtcg(v)
    }
  }
  return result
}

/**
 * Deriva o nome do arquivo de output para um set de modifier.
 * "{modifierName}-{contextKey}.json" — espelha o $ref no resolver.
 */
function modifierFilename (modifierName, contextKey) {
  return `${modifierName}-${contextKey}.json`
}

// ── extração ──────────────────────────────────────────────────────────────────

/**
 * Processa um único tema: lê o JSON fonte e extrai cada set mapeado.
 *
 * @param {string} themeName    Ex.: "core", "ana-takahashi"
 * @param {object} themeConfig  Entrada de $extensions.jellyfish.build.themes[themeName]
 * @param {string} splitDir     Diretório base de output (relativo ao package root)
 * @returns {Map<string, string>}  roleKey → caminho absoluto do arquivo gerado
 *   roleKey para sets:       "primitives", "foundations", "components"
 *   roleKey para modifiers:  "theme.light", "platform.screen-xs", etc.
 */
function extractTheme (themeName, themeConfig, splitDir) {
  const sourceAbs = abs(themeConfig.source)

  if (!fs.existsSync(sourceAbs)) {
    console.warn(`[split-sets] AVISO: fonte não encontrada para "${themeName}": ${themeConfig.source}`)
    return new Map()
  }

  const json = readJSON(themeConfig.source)
  const themeOutDir = path.join(PACKAGE_ROOT, splitDir, themeName)
  const splitFiles = new Map()
  let extracted = 0

  // ── sets ───────────────────────────────────────────────────────────────────
  for (const [roleKey, setKey] of Object.entries(themeConfig.sets ?? {})) {
    const content = json[setKey]
    if (!content) {
      console.warn(`[split-sets] AVISO: set key "${setKey}" não encontrado em ${themeConfig.source}`)
      continue
    }

    const outPath = path.join(themeOutDir, `${roleKey}.json`)
    writeJSON(outPath, legacyToDtcg(content))
    splitFiles.set(roleKey, outPath)
    console.log(`  ✓ ${themeName}/${roleKey}.json  ←  "${setKey}"`)
    extracted++
  }

  // ── modifiers ──────────────────────────────────────────────────────────────
  for (const [modifierName, contexts] of Object.entries(themeConfig.modifiers ?? {})) {
    for (const [contextKey, setKey] of Object.entries(contexts)) {
      const content = json[setKey]
      if (!content) {
        console.warn(`[split-sets] AVISO: set key "${setKey}" não encontrado em ${themeConfig.source} (${modifierName}.${contextKey})`)
        continue
      }

      const filename = modifierFilename(modifierName, contextKey)
      const outPath = path.join(themeOutDir, filename)
      writeJSON(outPath, legacyToDtcg(content))

      // Chave semântica com hífen: "theme-light", "platform-screen-xs"
      // setKeyToFilename("theme-light") === "theme-light" → createSetFilter funciona sem mudanças
      const fileKey = `${modifierName}-${contextKey}`
      splitFiles.set(fileKey, outPath)
      console.log(`  ✓ ${themeName}/${filename}  ←  "${setKey}"`)
      extracted++
    }
  }

  if (extracted === 0) {
    console.warn(`[split-sets] AVISO: nenhum set extraído para "${themeName}"`)
  }

  return splitFiles
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * Carrega e valida o tokens.resolver.json.
 *
 * @param {string} [resolverPath]  Caminho para o resolver (relativo ao package root)
 * @returns {object} Objeto do resolver parseado
 * @throws se o arquivo não existir, JSON inválido, ou $extensions ausente
 */
export function loadResolver (resolverPath = 'tokens.resolver.json') {
  const resolver = readJSON(resolverPath)

  if (!resolver.version) {
    throw new Error(`[split-sets] tokens.resolver.json deve ter "version"`)
  }

  const buildExt = resolver.$extensions?.['jellyfish.build']
  if (!buildExt?.themes) {
    throw new Error(
      '[split-sets] tokens.resolver.json deve ter $extensions["jellyfish.build"].themes'
    )
  }

  return resolver
}

/**
 * Função principal: lê o resolver, processa todos os temas declarados e grava
 * os arquivos split em {splitDir}/{theme}/.
 *
 * @param {string} [resolverPath]  Caminho para o tokens.resolver.json
 * @returns {{ themeName: string, splitFiles: Map<string, string> }[]}
 */
export function splitSets (resolverPath = 'tokens.resolver.json') {
  const resolver = loadResolver(resolverPath)
  const buildExt = resolver.$extensions['jellyfish.build']
  const splitDir = buildExt.splitDir ?? 'src/tokens-studio/sets'

  console.log('[split-sets] Iniciando extração de sets...')
  console.log(`[split-sets] splitDir: ${splitDir}\n`)

  const results = []

  for (const [themeName, themeConfig] of Object.entries(buildExt.themes)) {
    console.log(`[split-sets] → Tema: ${themeName}`)
    const splitFiles = extractTheme(themeName, themeConfig, splitDir)
    results.push({ themeName, splitFiles })
  }

  const total = results.reduce((acc, r) => acc + r.splitFiles.size, 0)
  console.log(`\n[split-sets] Concluído — ${total} arquivo(s) gravado(s) em "${splitDir}/"`)

  return results
}

/**
 * Dado o output de splitSets(), retorna o manifesto de build equivalente ao
 * que getBuildManifest() produzia — mas derivado do resolver, sem regex.
 *
 * Chaves semânticas usadas no manifesto:
 *   sets base    → "primitives", "foundations", "components"
 *   color modes  → "theme-light", "theme-dark"
 *   platforms    → "platform-screen-xs", "platform-screen-md", "platform-screen-lg"
 *
 * Compatibilidade com createSetFilter:
 *   setKeyToFilename("theme-light") === "theme-light" → p.endsWith("theme-light.json") ✓
 *   Não requer nenhuma mudança em constants.js ou getCssPlatform.
 *
 * @param {object} resolver                                Retorno de loadResolver()
 * @param {{ themeName: string, splitFiles: Map }[]} splitResults  Retorno de splitSets()
 * @returns {object}  Manifesto compatível com getConfig() / getCssPlatform()
 */
export function buildManifestFromResolver (resolver, splitResults) {
  const buildExt = resolver.$extensions['jellyfish.build']
  const coreResult = splitResults.find((r) => r.themeName === 'core')
  if (!coreResult) throw new Error('[split-sets] Tema "core" não encontrado nos resultados do split')

  const { splitFiles } = coreResult

  // ── Derivar conjuntos a partir das chaves que foram efetivamente extraídas ──
  const primitivesSetKeys  = splitFiles.has('primitives')  ? ['primitives']  : []
  const foundationsSetKeys = splitFiles.has('foundations') ? ['foundations'] : []
  const componentsSetKeys  = splitFiles.has('components')  ? ['components']  : []
  const baseKeys           = [...primitivesSetKeys, ...foundationsSetKeys, ...componentsSetKeys]

  // Color modes: chaves que começam com "theme-"
  // Platforms:   chaves que começam com "platform-"
  // Preserva a ordem de inserção no Map (ordem de declaração no resolver)
  const colorModeKeys = []
  const platformKeys  = []
  for (const key of splitFiles.keys()) {
    if (key.startsWith('theme-'))    colorModeKeys.push(key)
    else if (key.startsWith('platform-')) platformKeys.push(key)
  }

  const setOrder         = [...baseKeys, ...colorModeKeys, ...platformKeys]
  const defaultColorMode = colorModeKeys[0] ?? null

  // ── Build groups ───────────────────────────────────────────────────────────
  const buildGroups = []

  const baseOutputFiles = []
  if (primitivesSetKeys.length  > 0) baseOutputFiles.push('primitives')
  if (foundationsSetKeys.length > 0) baseOutputFiles.push('foundations')
  if (componentsSetKeys.length  > 0) baseOutputFiles.push('components')
  baseOutputFiles.push('typography')

  // Grupo base: todos os sets + modo de cor padrão (para resolução de referências)
  buildGroups.push({
    id: 'base',
    sourceKeys: [...new Set([...baseKeys, defaultColorMode])].filter(Boolean),
    outputFiles: baseOutputFiles
  })

  // Um grupo por modo de cor
  for (const key of colorModeKeys) {
    // "theme-light" → "light" | "theme-dark" → "dark"
    const outputName = key.replace(/^theme-/, '')
    buildGroups.push({
      id: outputName,
      sourceKeys: [...new Set([...baseKeys, defaultColorMode, key])].filter(Boolean),
      outputFiles: [outputName]
    })
  }

  // Um grupo por plataforma
  for (const key of platformKeys) {
    // "platform-screen-xs" → "screen-xs"
    const outputName = key.replace(/^platform-/, '')
    buildGroups.push({
      id: outputName,
      sourceKeys: [...new Set([...baseKeys, defaultColorMode, key])].filter(Boolean),
      outputFiles: [outputName]
    })
  }

  return {
    setOrder,
    baseKeys,
    colorModeKeys,
    platformKeys,
    primitivesSetKeys,
    foundationsSetKeys,
    componentsSetKeys,
    buildGroups,
    defaultColorModeKey: defaultColorMode,
    // "theme-light" → "light"  (nome do arquivo de output: color-modes/light.css)
    colorModeOutputName: (key) => key.replace(/^theme-/, ''),
    // "platform-screen-xs" → "screen-xs"  (nome do arquivo: screen-xs.css)
    platformOutputName:  (key) => key.replace(/^platform-/, '')
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const resolverFlagIdx = process.argv.indexOf('--resolver')
  const resolverPath = resolverFlagIdx !== -1
    ? process.argv[resolverFlagIdx + 1]
    : 'tokens.resolver.json'

  try {
    splitSets(resolverPath)
  } catch (e) {
    console.error(`\n[split-sets] ERRO: ${e.message}`)
    process.exit(1)
  }
}
