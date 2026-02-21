/**
 * CSS variables for dark color mode.
 * Emits:
 * - @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }
 *   so that when the app sets data-theme="light", browser dark preference does not override.
 * - [data-theme="dark"] { ... } for manual switch (ThemeProvider).
 */

/**
 * @param {import('style-dictionary').FormatFnArguments} args
 * @returns {Promise<string>}
 */
export default {
  name: 'css/variables-dark',
  format: async ({ dictionary, file, options }) => {
    const header =
      typeof file.options?.fileHeader === 'function'
        ? await file.options.fileHeader({ file, options })
        : `/**
 * Do not edit directly, this file was auto-generated.
 */
`
    const indentation = options?.formatting?.indentation ?? '  '
    let tokens = dictionary.allTokens ?? []
    if (typeof file.filter === 'function') {
      tokens = tokens.filter(file.filter)
    }
    const innerIndent = indentation + indentation
    const lines = tokens.map((token) => {
      const value = token.value ?? token.$value ?? token.original?.$value ?? ''
      return `${innerIndent}--${token.name}: ${value};`
    })
    const inner = lines.join('\n')
    const mediaBlock = `@media (prefers-color-scheme: dark) {\n${indentation}:root:not([data-theme="light"]) {\n${inner}\n${indentation}}\n}\n\n`
    const dataThemeBlock = `[data-theme="dark"] {\n${inner}\n}\n`
    return `${header}${mediaBlock}${dataThemeBlock}`
  }
}
