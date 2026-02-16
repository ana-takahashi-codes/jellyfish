/**
 * Style Dictionary platform: JavaScript + TypeScript declarations.
 * Output: build/js/themes/{theme}/tokens.js and tokens.d.ts
 * Single file per theme (all sets combined); no split by collection/mode for JS.
 */

/**
 * @param {string} _theme - Theme name (unused for JS single-file output)
 * @param {string} buildPath - Base build path (e.g. 'build/js/themes/core/')
 * @returns {import('style-dictionary').PlatformConfig}
 */
export function getJsPlatform(_theme, buildPath) {
  return {
    transformGroup: 'tokens-studio',
    transforms: ['attribute/deprecated', 'name/camel', 'value/duration', 'value/cubic-bezier'], // attribute/deprecated first so .d.ts format sees isDeprecated
    buildPath,
    files: [
      {
        destination: 'tokens.js',
        format: 'javascript/es6'
      },
      {
        destination: 'tokens.d.ts',
        format: 'typescript/es6-declarations-deprecation'
      }
    ]
  }
}
