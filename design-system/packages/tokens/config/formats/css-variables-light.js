/**
 * CSS variables for light color mode.
 * Emits :root (default) and [data-theme="light"] so that when the app sets
 * data-theme="light" (e.g. via ThemeProvider), light overrides system dark.
 */

import { formattedVariables } from 'style-dictionary/utils'

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

    const rootBlock = `:root {\n${inner}\n}\n\n`
    const dataThemeBlock = `[data-theme="light"] {\n${inner}\n}\n`
    return `${header}${rootBlock}${dataThemeBlock}`
  }
}
