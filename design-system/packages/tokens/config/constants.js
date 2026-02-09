/**
 * @typedef {Object} BuildManifest
 * @property {string[]} setOrder
 * @property {string[]} baseKeys
 * @property {string[]} colorModeKeys
 * @property {string[]} platformKeys
 * @property {string[]} primitivesSetKeys
 * @property {string[]} foundationsSetKeys
 * @property {string[]} componentsSetKeys
 * @property {{ id: string, sourceKeys: string[], outputFiles: string[] }[]} buildGroups
 * @property {string | null} defaultColorModeKey
 * @property {(key: string) => string} colorModeOutputName
 * @property {(key: string) => string} platformOutputName
 */

/**
 * Conventions and helpers for Style Dictionary + Tokens Studio.
 * Themes, set order, and build groups are derived at build time from the theme JSON (see getBuildManifest).
 */

/** Base path for token source files (theme name + .json). */
export const SOURCE_DIR = 'src/tokens-studio'

/** Build output root directory. */
export const BUILD_DIR = 'build'

/**
 * Theme whose JSON defines the structure (set order, build groups, output files).
 * The manifest is always derived from this theme when present; other themes follow the same structure.
 */
export const STRUCTURE_THEME = 'core'

/**
 * Prefixes used to classify top-level keys of a theme JSON (Tokens Studio sets).
 * Keys starting with COLOR_MODE_PREFIX → color mode files (e.g. color-modes/light.css).
 * Keys starting with PLATFORM_PREFIX → responsive breakpoint files (screen-*.css), later merged into responsive.css.
 */
export const COLOR_MODE_PREFIX = 'Color Modes/'
export const PLATFORM_PREFIX = 'Platforms/'

/**
 * Patterns to map base set keys to output file names (primitives, foundations, components).
 * First match wins; order matters. Used when deriving manifest from set keys.
 */
export const BASE_SET_PATTERNS = [
  { pattern: /Primitives|^01[- ]/i, output: 'primitives' },
  { pattern: /Foundations|^02[- ]/i, output: 'foundations' },
  { pattern: /Components|^03[- ]/i, output: 'components' }
]

/**
 * Sanitize a set key for use in a filename (e.g. '02- Foundations/style' -> '02- Foundations-style').
 * @param {string} setKey
 * @returns {string}
 */
export function setKeyToFilename(setKey) {
  return setKey.replace(/\//g, '-')
}

/**
 * Build groups and output names for set keys that exist in a theme but not in the structure (core).
 * Uses this theme's base keys and first color mode so references (e.g. Color Modes/Light → jf.color.accent)
 * resolve correctly when the theme has different set names than the structure theme.
 * @param {BuildManifest} manifest
 * @param {string[]} themeSetKeys - Top-level keys from this theme's JSON
 * @returns {{ buildGroups: { id: string, sourceKeys: string[], outputFiles: string[] }[], extraSetKeys: string[] }}
 */
export function getExtraBuildGroups(manifest, themeSetKeys) {
  const structureSet = new Set(manifest.setOrder)
  const extraSetKeys = themeSetKeys.filter((k) => !structureSet.has(k))
  if (extraSetKeys.length === 0) {
    return { buildGroups: [], extraSetKeys: [] }
  }
  const { baseKeys: themeBaseKeys, colorModeKeys: themeColorModeKeys } = classifySetKeys(themeSetKeys)
  const themeDefaultColor = themeColorModeKeys[0] ?? null
  const buildGroups = extraSetKeys.map((key) => {
    let outputName
    if (key.startsWith(COLOR_MODE_PREFIX)) {
      outputName = manifest.colorModeOutputName(key)
    } else if (key.startsWith(PLATFORM_PREFIX)) {
      outputName = manifest.platformOutputName(key)
    } else {
      outputName = setKeyToFilename(key)
    }
    const sourceKeys = [...themeBaseKeys, themeDefaultColor, key].filter(Boolean)
    return {
      id: key,
      sourceKeys: [...new Set(sourceKeys)],
      outputFiles: [outputName]
    }
  })
  return { buildGroups, extraSetKeys }
}

/**
 * Creates a Style Dictionary filter that keeps only tokens from the given set(s).
 * Uses token.filePath when present (split-files build), otherwise token.path[0] (single-file).
 * @param {string | string[]} setKeyOrKeys - One set key or array of keys
 * @returns {(token: { path?: string[], filePath?: string }) => boolean}
 */
export function createSetFilter(setKeyOrKeys) {
  const keys = Array.isArray(setKeyOrKeys) ? setKeyOrKeys : [setKeyOrKeys]
  return (token) => {
    if (token.filePath) {
      const p = token.filePath.replace(/\\/g, '/')
      if (keys.some((k) => p.endsWith(setKeyToFilename(k) + '.json') || p.includes(`/${setKeyToFilename(k)}.json`)))
        return true
    }
    const top = token.path?.[0]
    return top != null && keys.includes(top)
  }
}

/**
 * Classify theme JSON top-level keys (sets) into base, color modes, and platforms.
 * @param {string[]} setKeys - Object.keys(themeJson).filter(k => !k.startsWith('$'))
 * @returns {{ baseKeys: string[], colorModeKeys: string[], platformKeys: string[], setOrder: string[] }}
 */
export function classifySetKeys(setKeys) {
  const baseKeys = setKeys.filter(
    (k) => !k.startsWith(COLOR_MODE_PREFIX) && !k.startsWith(PLATFORM_PREFIX)
  )
  const colorModeKeys = setKeys.filter((k) => k.startsWith(COLOR_MODE_PREFIX))
  const platformKeys = setKeys.filter((k) => k.startsWith(PLATFORM_PREFIX))
  const setOrder = [...baseKeys, ...colorModeKeys, ...platformKeys]
  return { baseKeys, colorModeKeys, platformKeys, setOrder }
}

/**
 * Map a base set key to an output name (primitives | foundations | components).
 * @param {string} setKey
 * @param {typeof BASE_SET_PATTERNS} [patterns]
 * @returns {string | null}
 */
export function getBaseOutputName(setKey, patterns = BASE_SET_PATTERNS) {
  for (const { pattern, output } of patterns) {
    if (pattern.test(setKey)) return output
  }
  return null
}

/**
 * Build the manifest used by the build script and platform configs.
 * Call once per build using the first available theme JSON.
 * @param {string[]} setKeys - Top-level keys of a theme JSON (excluding $*)
 * @returns {BuildManifest}
 */
export function getBuildManifest(setKeys) {
  const { baseKeys, colorModeKeys, platformKeys, setOrder } = classifySetKeys(setKeys)

  const primitivesSetKeys = baseKeys.filter((k) => getBaseOutputName(k) === 'primitives')
  const foundationsSetKeys = baseKeys.filter((k) => getBaseOutputName(k) === 'foundations')
  const componentsSetKeys = baseKeys.filter((k) => getBaseOutputName(k) === 'components')
  const otherBaseKeys = baseKeys.filter(
    (k) => !primitivesSetKeys.includes(k) && !foundationsSetKeys.includes(k) && !componentsSetKeys.includes(k)
  )
  // Attach "other" base keys to foundations if any (e.g. "02- Foundations/style")
  const foundationsSetKeysExpanded =
    foundationsSetKeys.length > 0 ? [...foundationsSetKeys, ...otherBaseKeys] : otherBaseKeys

  const defaultColorModeKey = colorModeKeys[0] ?? null

  const buildGroups = []
  const baseOutputFiles = []
  if (primitivesSetKeys.length > 0) baseOutputFiles.push('primitives')
  if (foundationsSetKeysExpanded.length > 0) baseOutputFiles.push('foundations')
  if (componentsSetKeys.length > 0) baseOutputFiles.push('components')
  baseOutputFiles.push('typography')

  buildGroups.push({
    id: 'base',
    sourceKeys: [...baseKeys, defaultColorModeKey].filter(Boolean),
    outputFiles: baseOutputFiles
  })

  for (const key of colorModeKeys) {
    const outputName = key.slice(COLOR_MODE_PREFIX.length) || key.replace(/\//g, '-')
    buildGroups.push({
      id: outputName,
      sourceKeys: [...baseKeys, defaultColorModeKey, key].filter(Boolean),
      outputFiles: [outputName]
    })
  }
  for (const key of platformKeys) {
    const outputName = key.slice(PLATFORM_PREFIX.length) || setKeyToFilename(key)
    buildGroups.push({
      id: outputName,
      sourceKeys: [...baseKeys, defaultColorModeKey, key].filter(Boolean),
      outputFiles: [outputName]
    })
  }

  return {
    setOrder,
    baseKeys,
    colorModeKeys,
    platformKeys,
    primitivesSetKeys,
    foundationsSetKeys: foundationsSetKeysExpanded,
    componentsSetKeys,
    buildGroups,
    defaultColorModeKey,
    colorModeOutputName: (key) => key.startsWith(COLOR_MODE_PREFIX) ? key.slice(COLOR_MODE_PREFIX.length) : key.replace(/\//g, '-'),
    platformOutputName: (key) => key.startsWith(PLATFORM_PREFIX) ? key.slice(PLATFORM_PREFIX.length) : setKeyToFilename(key)
  }
}
