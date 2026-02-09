/**
 * CSS variables format wrapped in @media (prefers-color-scheme: dark).
 * Use for dark.css so the theme is applied when the user prefers dark mode.
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
    return `${header}\n@media (prefers-color-scheme: dark) {\n${indentation}:root {\n${inner}\n${indentation}}\n}\n`
  }
}
