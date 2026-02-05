/**
 * Style Dictionary platform: SCSS variables.
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
export function getScssPlatform(theme, buildPath, outputOnly, manifest, options = {}) {
  const files = buildScssFiles(theme, outputOnly, manifest, options.extraSetKeys)
  return {
    transformGroup: 'tokens-studio',
    transforms: ['name/kebab', 'value/duration', 'value/cubic-bezier', 'value/transition-shorthand'],
    buildPath,
    files: files.map(({ destination, format = 'scss/variables', filter }) => ({
      destination,
      format,
      filter
    }))
  }
}

function buildScssFiles(theme, outputOnly, manifest, extraSetKeys = []) {
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
    all.push({
      destination: 'primitives.scss',
      filter: createSetFilter(primitivesSetKeys)
    })
  }

  const baseSetFilter = createSetFilter([...primitivesSetKeys, ...foundationsSetKeys, ...componentsSetKeys])
  if (foundationsSetKeys.length > 0) {
    all.push({
      destination: 'foundations.scss',
      filter: createSetFilter(foundationsSetKeys)
    })
  }
  if (componentsSetKeys.length > 0) {
    all.push({
      destination: 'components.scss',
      filter: createSetFilter(componentsSetKeys)
    })
  }

  all.push({
    destination: 'typography.scss',
    format: 'scss/typography-classes',
    filter: (token) => {
      const path = token.path ?? []
      const fromBase = baseSetFilter(token) || (path.length >= 2 && path[1] === 'font')
      if (!fromBase) return false
      return token.type === 'typography' || token.$type === 'typography'
    }
  })

  for (const key of colorModeKeys) {
    const name = colorModeOutputName(key)
    all.push({
      destination: `color-modes/${name}.scss`,
      filter: createSetFilter(key)
    })
  }

  for (const key of platformKeys) {
    const name = platformOutputName(key)
    all.push({
      destination: `${name}.scss`,
      filter: createSetFilter(key)
    })
  }

  for (const key of extraSetKeys) {
    if (key.startsWith(COLOR_MODE_PREFIX)) {
      const name = manifest.colorModeOutputName(key)
      all.push({
        destination: `color-modes/${name}.scss`,
        filter: createSetFilter(key)
      })
    } else if (key.startsWith(PLATFORM_PREFIX)) {
      const name = manifest.platformOutputName(key)
      all.push({ destination: `${name}.scss`, filter: createSetFilter(key) })
    } else {
      all.push({
        destination: `${setKeyToFilename(key)}.scss`,
        filter: createSetFilter(key)
      })
    }
  }

  if (!outputOnly || outputOnly.length === 0) return all
  const allowed = new Set(outputOnly)
  return all.filter((f) => {
    const base = f.destination.replace(/\.[^.]+$/, '').split('/').pop()
    return allowed.has(base) || allowed.has(f.destination.replace(/\.[^.]+$/, ''))
  })
}
