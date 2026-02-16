/**
 * Platform configs for Style Dictionary.
 * Each export is a function (theme, buildPath) => PlatformConfig.
 * JS e SCSS foram removidos: utilities em scripts/utilities geram CSS a partir dos tokens (estilo Tailwind).
 */

export { getCssPlatform } from './css.js'
export { getAndroidPlatform } from './android.js'
export { getIosPlatform } from './ios.js'
