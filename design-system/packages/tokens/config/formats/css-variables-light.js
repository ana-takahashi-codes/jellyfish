/**
 * CSS variables for light color mode.
 * Emits :root (default) and [data-theme="light"] so that when the app sets
 * data-theme="light" (e.g. via ThemeProvider), light overrides system dark.
 */

/**
 * @param {import('style-dictionary').FormatFnArguments} args
 * @returns {Promise<string>}
 */
export default {
  name: 'css/variables-light',
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
    const rootBlock = `:root {\n${inner}\n}\n\n`
    const dataThemeBlock = `[data-theme="light"] {\n${inner}\n}\n`
    return `${header}${rootBlock}${dataThemeBlock}`
  }
}
