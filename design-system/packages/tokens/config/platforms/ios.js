/**
 * Style Dictionary platform: iOS Swift (class).
 * File list derived from build manifest; themes can add extra sets via options.extraSetKeys.
 * Output names are PascalCase (e.g. Light.swift, ScreenXs.swift).
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
export function getIosPlatform(theme, buildPath, outputOnly, manifest, options = {}) {
  const files = buildIosFiles(theme, outputOnly, manifest, options.extraSetKeys)
  return {
    transformGroup: 'ios-swift',
    transforms: ['value/duration', 'value/cubic-bezier'],
    buildPath,
    files: files.map(({ destination, filter }) => ({
      destination,
      format: 'ios-swift/class.swift',
      filter
    }))
  }
}

function toPascalCase(s) {
  return s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
}

function buildIosFiles(theme, outputOnly, manifest, extraSetKeys = []) {
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
    all.push({ destination: 'Primitives.swift', filter: createSetFilter(primitivesSetKeys) })
  }
  if (foundationsSetKeys.length > 0) {
    all.push({ destination: 'Foundations.swift', filter: createSetFilter(foundationsSetKeys) })
  }
  if (componentsSetKeys.length > 0) {
    all.push({ destination: 'Components.swift', filter: createSetFilter(componentsSetKeys) })
  }
  for (const key of colorModeKeys) {
    const name = colorModeOutputName(key)
    all.push({ destination: `${toPascalCase(name)}.swift`, filter: createSetFilter(key) })
  }
  for (const key of platformKeys) {
    const name = platformOutputName(key)
    all.push({ destination: `${toPascalCase(name)}.swift`, filter: createSetFilter(key) })
  }
  for (const key of extraSetKeys) {
    if (key.startsWith(COLOR_MODE_PREFIX)) {
      const name = manifest.colorModeOutputName(key)
      all.push({ destination: `${toPascalCase(name)}.swift`, filter: createSetFilter(key) })
    } else if (key.startsWith(PLATFORM_PREFIX)) {
      const name = manifest.platformOutputName(key)
      all.push({ destination: `${toPascalCase(name)}.swift`, filter: createSetFilter(key) })
    } else {
      const filename = setKeyToFilename(key).replace(/\s+/g, '')
      all.push({
        destination: `${toPascalCase(filename)}.swift`,
        filter: createSetFilter(key)
      })
    }
  }

  if (!outputOnly || outputOnly.length === 0) return all
  const norm = (s) => s.toLowerCase().replace(/-/g, '')
  const allowed = new Set(outputOnly.map(norm))
  return all.filter((f) => {
    const base = f.destination.replace(/\.[^.]+$/, '')
    return allowed.has(norm(base))
  })
}
