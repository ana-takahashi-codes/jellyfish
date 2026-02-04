/**
 * Style Dictionary platform: Android resources (XML).
 * File list derived from build manifest; themes can add extra sets via options.extraSetKeys.
 */

import { createSetFilter, setKeyToFilename, COLOR_MODE_PREFIX, PLATFORM_PREFIX } from '../constants.js'

/**
 * @param {string} theme
 * @param {string} buildPath
 * @param {string[]} [outputOnly]
 * @param {import('../constants.js').BuildManifest} manifest
 * @param {{ extraSetKeys?: string[] }} [options]
 * @returns {import('style-dictionary').PlatformConfig}
 */
export function getAndroidPlatform(theme, buildPath, outputOnly, manifest, options = {}) {
  const files = buildAndroidFiles(theme, outputOnly, manifest, options.extraSetKeys)
  return {
    transformGroup: 'android',
    buildPath,
    files: files.map(({ destination, filter }) => ({
      destination,
      format: 'android/resources',
      filter
    }))
  }
}

function buildAndroidFiles(theme, outputOnly, manifest, extraSetKeys = []) {
  const all = []
  const {
    primitivesSetKeys,
    foundationsSetKeys,
    componentsSetKeys,
    colorModeKeys,
    platformKeys,
    colorModeOutputName,
    platformOutputName
  } = manifest

  if (primitivesSetKeys.length > 0) {
    all.push({ destination: 'primitives.xml', filter: createSetFilter(primitivesSetKeys) })
  }
  if (foundationsSetKeys.length > 0) {
    all.push({ destination: 'foundations.xml', filter: createSetFilter(foundationsSetKeys) })
  }
  if (componentsSetKeys.length > 0) {
    all.push({ destination: 'components.xml', filter: createSetFilter(componentsSetKeys) })
  }
  for (const key of colorModeKeys) {
    const name = colorModeOutputName(key)
    all.push({ destination: `${name}.xml`, filter: createSetFilter(key) })
  }
  for (const key of platformKeys) {
    const name = platformOutputName(key)
    all.push({ destination: `${name}.xml`, filter: createSetFilter(key) })
  }
  for (const key of extraSetKeys) {
    if (key.startsWith(COLOR_MODE_PREFIX)) {
      const name = manifest.colorModeOutputName(key)
      all.push({ destination: `${name}.xml`, filter: createSetFilter(key) })
    } else if (key.startsWith(PLATFORM_PREFIX)) {
      const name = manifest.platformOutputName(key)
      all.push({ destination: `${name}.xml`, filter: createSetFilter(key) })
    } else {
      all.push({ destination: `${setKeyToFilename(key)}.xml`, filter: createSetFilter(key) })
    }
  }

  if (!outputOnly || outputOnly.length === 0) return all
  const allowed = new Set(outputOnly)
  return all.filter((f) => {
    const base = f.destination.replace(/\.[^.]+$/, '')
    return allowed.has(base)
  })
}
