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
 * The build manifest is derived at build time from tokens.resolver.json via
 * buildManifestFromResolver() in scripts/build/split-sets.mjs.
 */

/** Base path for token source files. */
export const SOURCE_DIR = 'src/tokens-studio'

/** Build output root directory. */
export const BUILD_DIR = 'build'

/**
 * Theme whose JSON defines the canonical structure (set order, build groups).
 * Declared in tokens.resolver.json under $extensions["jellyfish.build"].themes.
 */
export const STRUCTURE_THEME = 'core'

/**
 * Prefixes used to identify color mode and responsive platform sets in Tokens Studio exports.
 * Keys starting with COLOR_MODE_PREFIX → color mode files (e.g. color-modes/light.css).
 * Keys starting with PLATFORM_PREFIX → responsive breakpoints (screen-*.css → responsive.css).
 */
export const COLOR_MODE_PREFIX = 'Color Modes/'
export const PLATFORM_PREFIX = 'Platforms/'

/**
 * Sanitize a set key for use in a filename (e.g. 'Color Modes/Light' → 'color-modes-light').
 * @param {string} setKey
 * @returns {string}
 */
export function setKeyToFilename(setKey) {
  return setKey.replace(/\//g, '-').toLowerCase()
}

/**
 * Creates a Style Dictionary filter that keeps only tokens from the given set file(s).
 * Matches against token.filePath (split-files build).
 * @param {string | string[]} setKeyOrKeys - One semantic key or array of keys (e.g. 'foundations', 'theme-light')
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
 * Classify Tokens Studio set keys into base sets, color modes, and platforms.
 * Useful for consumers that inspect raw theme JSON structure.
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
