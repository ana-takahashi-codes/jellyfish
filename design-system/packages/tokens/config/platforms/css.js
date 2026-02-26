/**
 * Style Dictionary platform: CSS variables.
 * File list is derived from build manifest; themes can add extra sets (collections a mais) via options.extraSetKeys.
 */

import {
  createSetFilter,
  setKeyToFilename,
  COLOR_MODE_PREFIX,
  PLATFORM_PREFIX
} from '../constants.js'

/**
 * @param {string} theme
 * @param {string} buildPath
 * @param {string[]} [outputOnly]
 * @param {import('../constants.js').BuildManifest} manifest
 * @param {{ extraSetKeys?: string[] }} [options]
 * @returns {import('style-dictionary').PlatformConfig}
 */
export function getCssPlatform(theme, buildPath, outputOnly, manifest, options = {}) {
  const files = buildCssFiles(theme, outputOnly, manifest, options.extraSetKeys)
  return {
    transformGroup: 'tokens-studio',
    transforms: ['name/kebab', 'value/duration', 'value/cubic-bezier', 'value/transition-shorthand'],
    buildPath,
    options: {
      // Por padrão, mantemos referências entre tokens (outputReferences) para
      // CSS variables (ex.: --jf-input-bg-default → --jf-color-bg-surface-secondary).
      // Porém, para primitives.css queremos resolver referências para obter
      // valores "flat" (sem var(--...)).
      outputReferences: true
    },
    files: files.map(({ destination, format = 'css/variables', filter }) => ({
      destination,
      format,
      // Para primitives.css, desabilitamos outputReferences para resolver
      // referências diretamente nos valores primitivos.
      options: destination === 'primitives.css' ? { outputReferences: false } : undefined,
      // Filtro adicional: exceto em typography.css (css/typography-classes),
      // não emitir CSS variables para tokens de tipo "typography".
      filter: (token) => {
        const baseOk = typeof filter === 'function' ? filter(token) : true
        if (!baseOk) return false

        if (format === 'css/typography-classes') return true

        const type = token.type ?? token.$type
        return type !== 'typography'
      }
    }))
  }
}

/**
 * @param {string} theme
 * @param {string[]} [outputOnly]
 * @param {import('../constants.js').BuildManifest} manifest
 * @param {string[]} [extraSetKeys] - Set keys present in this theme but not in structure (core); each gets its own file.
 */
function buildCssFiles(theme, outputOnly, manifest, extraSetKeys = []) {
  const all = []
  const {
    primitivesSetKeys,
    foundationsSetKeys,
    componentsSetKeys,
    baseKeys,
    colorModeKeys,
    platformKeys,
    colorModeOutputName,
    platformOutputName
  } = manifest

  if (primitivesSetKeys.length > 0) {
    all.push({
      destination: 'primitives.css',
      filter: createSetFilter(primitivesSetKeys)
    })
  }

  const baseSetFilter = createSetFilter([...primitivesSetKeys, ...foundationsSetKeys, ...componentsSetKeys])
  if (foundationsSetKeys.length > 0) {
    all.push({
      destination: 'foundations.css',
      filter: createSetFilter(foundationsSetKeys)
    })
  }
  if (componentsSetKeys.length > 0) {
    all.push({
      destination: 'components.css',
      filter: createSetFilter(componentsSetKeys)
    })
  }

  all.push({
    destination: 'typography.css',
    format: 'css/typography-classes',
    filter: (token) => {
      const path = token.path ?? []
      const fromBase = baseSetFilter(token) || (path.length >= 2 && path[1] === 'font')
      if (!fromBase) return false
      return token.type === 'typography' || token.$type === 'typography'
    }
  })

  for (const key of colorModeKeys) {
    const name = colorModeOutputName(key)
    const isDark = name.toLowerCase().includes('dark')
    all.push({
      destination: `color-modes/${name}.css`,
      format: isDark ? 'css/variables-dark' : 'css/variables-light',
      filter: createSetFilter(key)
    })
  }

  for (const key of platformKeys) {
    const name = platformOutputName(key)
    all.push({
      destination: `${name}.css`,
      filter: createSetFilter(key)
    })
  }

  for (const key of extraSetKeys) {
    if (key.startsWith(COLOR_MODE_PREFIX)) {
      const name = manifest.colorModeOutputName(key)
      const isDark = name.toLowerCase().includes('dark')
      all.push({
        destination: `color-modes/${name}.css`,
        format: isDark ? 'css/variables-dark' : 'css/variables-light',
        filter: createSetFilter(key)
      })
    } else if (key.startsWith(PLATFORM_PREFIX)) {
      const name = manifest.platformOutputName(key)
      all.push({
        destination: `${name}.css`,
        filter: createSetFilter(key)
      })
    } else {
      all.push({
        destination: `${setKeyToFilename(key)}.css`,
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
