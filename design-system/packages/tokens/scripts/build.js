/**
 * Build script: runs Style Dictionary per build group to avoid token collisions.
 * Discovers themes from source dir and derives set order / build groups from the theme JSON.
 */

import { readdir, access, readFile, writeFile, mkdir } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import StyleDictionary from 'style-dictionary'
import { getConfig, BUILD_DIR } from '../config/index.js'
import {
  SOURCE_DIR,
  STRUCTURE_THEME,
  PLATFORM_PREFIX,
  setKeyToFilename,
  getBuildManifest,
  getExtraBuildGroups
} from '../config/constants.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..')

async function exists(path) {
  try {
    await access(path)
    return true
  } catch (e) {
    if (e?.code === 'ENOENT') return false
    throw e
  }
}

/**
 * Discover theme names from SOURCE_DIR (*.json, strip .json).
 * @returns {Promise<string[]>}
 */
async function discoverThemes() {
  const dir = join(packageRoot, SOURCE_DIR)
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile() && e.name.endsWith('.json') && !e.name.startsWith('.'))
      .map((e) => e.name.replace(/\.json$/, ''))
      .sort()
  } catch (e) {
    if (e?.code === 'ENOENT') return []
    throw e
  }
}

/**
 * Split theme JSON into one file per set; return keyToPath map.
 * @param {string} theme
 * @param {Record<string, unknown>} json
 * @param {string[]} setOrder
 * @returns {Promise<Map<string, string>>}
 */
async function splitThemeJson(theme, json, setOrder) {
  const setKeys = Object.keys(json).filter((k) => !k.startsWith('$'))
  if (setKeys.length === 0) return new Map()

  const orderSet = new Set(setOrder)
  const ordered = [
    ...setOrder.filter((k) => setKeys.includes(k)),
    ...setKeys.filter((k) => !orderSet.has(k))
  ].filter((k) => setKeys.includes(k))

  const tempDir = join(packageRoot, BUILD_DIR, '.temp', theme)
  await mkdir(tempDir, { recursive: true })

  const keyToPath = new Map()
  for (const key of ordered) {
    const filename = setKeyToFilename(key) + '.json'
    const filePath = join(tempDir, filename)
    await writeFile(filePath, JSON.stringify(json[key], null, 2), 'utf-8')
    keyToPath.set(key, filePath)
  }
  return keyToPath
}

async function run() {
  const discovered = await discoverThemes()
  if (discovered.length === 0) {
    console.error(`[tokens] No theme JSONs found in ${SOURCE_DIR}. Add at least one <name>.json.`)
    process.exit(1)
  }

  // Structure (manifest) is always derived from STRUCTURE_THEME when present; others follow the same layout
  const themes = discovered.includes(STRUCTURE_THEME)
    ? [STRUCTURE_THEME, ...discovered.filter((t) => t !== STRUCTURE_THEME)]
    : discovered

  let manifest = null
  const themeConfigs = []

  for (const theme of themes) {
    const sourcePath = join(packageRoot, SOURCE_DIR, `${theme}.json`)
    const hasSource = await exists(sourcePath)
    if (!hasSource) {
      console.warn(`[tokens] Skipping theme "${theme}": ${sourcePath} not found`)
      continue
    }

    const raw = await readFile(sourcePath, 'utf-8')
    let json
    try {
      json = JSON.parse(raw)
    } catch (e) {
      console.error(`[tokens] Invalid JSON in ${sourcePath}:`, e.message)
      process.exit(1)
    }

    const setKeys = Object.keys(json).filter((k) => !k.startsWith('$'))
    if (manifest === null) {
      manifest = getBuildManifest(setKeys)
    }
    const keyToPath = await splitThemeJson(theme, json, manifest.setOrder)
    themeConfigs.push({ theme, keyToPath, setKeys })
  }

  if (themeConfigs.length === 0) {
    console.error('[tokens] No theme sources could be loaded.')
    process.exit(1)
  }
  if (!manifest) {
    process.exit(1)
  }

  const { rmSync, unlinkSync } = await import('fs')
  const buildPathBase = join(packageRoot, BUILD_DIR)

  for (const { theme, keyToPath, setKeys } of themeConfigs) {
    for (const sub of ['css', 'scss', 'android', 'ios', 'js']) {
      try {
        rmSync(join(buildPathBase, sub, 'themes', theme), { recursive: true, force: true })
      } catch (_) {}
    }

    const { buildGroups: extraGroups, extraSetKeys } = getExtraBuildGroups(manifest, setKeys)
    const effectiveBuildGroups = [...manifest.buildGroups, ...extraGroups]

    for (const group of effectiveBuildGroups) {
      const sourcePaths = group.sourceKeys.map((k) => keyToPath.get(k)).filter(Boolean)
      if (sourcePaths.length === 0) continue

      const config = getConfig(theme, sourcePaths, group.outputFiles, manifest, {
        extraSetKeys: extraSetKeys.length > 0 ? extraSetKeys : undefined
      })
      const sdGroup = new StyleDictionary(config)
      await sdGroup.buildAllPlatforms()
    }

    console.log(`[tokens] Built theme: ${theme}`)
  }

  const { buildResponsiveCss } = await import('./build-responsive-css.js')
  await buildResponsiveCss().catch((err) => {
    console.warn('[tokens] responsive.css composition skipped:', err.message)
  })

  const allPlatformOutputNames = new Set(
    manifest.platformKeys.map((k) => manifest.platformOutputName(k))
  )
  for (const { setKeys } of themeConfigs) {
    const { extraSetKeys } = getExtraBuildGroups(manifest, setKeys)
    for (const k of extraSetKeys) {
      if (k.startsWith(PLATFORM_PREFIX)) allPlatformOutputNames.add(manifest.platformOutputName(k))
    }
  }
  for (const { theme } of themeConfigs) {
    for (const name of allPlatformOutputNames) {
      for (const ext of ['css', 'scss']) {
        try {
          unlinkSync(join(buildPathBase, ext, 'themes', theme, `${name}.${ext}`))
        } catch (_) {}
      }
      try {
        unlinkSync(join(buildPathBase, 'android', 'themes', theme, `${name}.xml`))
      } catch (_) {}
    }
    for (const name of allPlatformOutputNames) {
      const swiftName = name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
      try {
        unlinkSync(join(buildPathBase, 'ios', 'themes', theme, `${swiftName}.swift`))
      } catch (_) {}
    }
  }

  try {
    rmSync(join(buildPathBase, '.temp'), { recursive: true, force: true })
  } catch (_) {}

  console.log('[tokens] Build finished.')
}

run().catch((err) => {
  console.error('[tokens] Build failed:', err)
  process.exit(1)
})
