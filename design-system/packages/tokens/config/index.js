/**
 * Style Dictionary v5 + Tokens Studio main configuration.
 * Registers sd-transforms and exposes a factory that builds theme-specific configs.
 * All set keys and build groups come from the build manifest (derived from theme JSON).
 */

import StyleDictionary from 'style-dictionary'
import { register } from '@tokens-studio/sd-transforms'
import { BUILD_DIR, SOURCE_DIR } from './constants.js'
import {
  getCssPlatform,
  getScssPlatform,
  getJsPlatform,
  getAndroidPlatform,
  getIosPlatform
} from './platforms/index.js'
import formatCssVariablesDark from './formats/css-variables-dark.js'
import formatCssResponsive from './formats/css-responsive.js'
import formatCssTypographyClasses from './formats/css-typography-classes.js'
import formatScssTypographyClasses from './formats/scss-typography-classes.js'
import { registerDurationTransform } from './transforms/index.js'

register(StyleDictionary)
registerDurationTransform(StyleDictionary)
StyleDictionary.registerFormat(formatCssVariablesDark)
StyleDictionary.registerFormat(formatCssResponsive)
StyleDictionary.registerFormat(formatCssTypographyClasses)
StyleDictionary.registerFormat(formatScssTypographyClasses)

/**
 * @param {string[]} [outputOnly]
 * @param {import('./constants.js').BuildManifest} manifest
 */
function isBaseGroup(outputOnly, manifest) {
  const base = manifest.buildGroups[0]
  if (!outputOnly || outputOnly.length !== base.outputFiles.length) return false
  return base.outputFiles.every((f) => outputOnly.includes(f))
}

/**
 * @param {{ extraSetKeys?: string[] }} [options] - When a theme has sets not in the structure (core), pass them so platforms emit extra files.
 */
export function getConfig(theme, sourcePaths = [], outputOnly, manifest, options = {}) {
  if (!manifest) {
    throw new Error('getConfig requires a build manifest (from getBuildManifest(setKeys))')
  }
  const source = sourcePaths.length > 0 ? sourcePaths : [`${SOURCE_DIR}/${theme}.json`]
  const buildPathBase = BUILD_DIR
  const { extraSetKeys } = options

  const platforms = {
    css: getCssPlatform(theme, `${buildPathBase}/css/themes/${theme}/`, outputOnly, manifest, { extraSetKeys }),
    scss: getScssPlatform(theme, `${buildPathBase}/scss/themes/${theme}/`, outputOnly, manifest, { extraSetKeys }),
    android: getAndroidPlatform(theme, `${buildPathBase}/android/themes/${theme}/`, outputOnly, manifest, { extraSetKeys }),
    ios: getIosPlatform(theme, `${buildPathBase}/ios/themes/${theme}/`, outputOnly, manifest, { extraSetKeys })
  }
  if (isBaseGroup(outputOnly, manifest)) {
    platforms.js = getJsPlatform(theme, `${buildPathBase}/js/themes/${theme}/`)
  }

  return {
    source,
    preprocessors: ['tokens-studio'],
    platforms
  }
}

export { BUILD_DIR, SOURCE_DIR }
export { getBuildManifest, classifySetKeys } from './constants.js'
