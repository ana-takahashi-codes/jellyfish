/**
 * CSS variables for dark color mode.
 * Emits:
 * - @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }
 *   so that when the app sets data-theme="light", browser dark preference does not override.
 * - [data-theme="dark"] { ... } for manual switch (ThemeProvider).
 */

import { formattedVariables } from 'style-dictionary/utils'

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
    const innerIndent = indentation + indentation

    const originalAllTokens = dictionary.allTokens
    if (typeof file.filter === 'function' && Array.isArray(dictionary.allTokens)) {
      dictionary.allTokens = dictionary.allTokens.filter(file.filter)
    }

    const variables = formattedVariables({
      format: 'css',
      dictionary,
      outputReferences: options?.outputReferences
    })

    // Restaura o estado original do dicionário para não afetar outros arquivos
    dictionary.allTokens = originalAllTokens

    const inner = variables
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => `${innerIndent}${line}`)
      .join('\n')

    const mediaBlock = `@media (prefers-color-scheme: dark) {\n${indentation}:root:not([data-theme=\"light\"]) {\n${inner}\n${indentation}}\n}\n\n`
    const dataThemeBlock = `[data-theme=\"dark\"] {\n${inner}\n}\n`
    return `${header}${mediaBlock}${dataThemeBlock}`
  }
}
