/**
 * TypeScript ES6 declarations with JSDoc @deprecated only for deprecated tokens.
 * Non-deprecated tokens get a plain "export const name: string;" with no comment.
 * Compatible with VSCode and TypeScript Server.
 */

/**
 * Builds JSDoc block for a deprecated token (only in .d.ts).
 * @param {{ since?: string, replacement?: string, reason?: string }} meta
 * @returns {string}
 */
function buildDeprecationJSDoc(meta) {
  const lines = []
  if (meta.since) lines.push(` * @deprecated since ${meta.since}`)
  else lines.push(' * @deprecated')
  if (meta.replacement) lines.push(` * Use ${meta.replacement}`)
  if (meta.reason) lines.push(` * ${meta.reason}`)
  return '/**\n' + lines.join('\n') + '\n */'
}

/**
 * @param {import('style-dictionary').FormatFnArguments} args
 * @returns {Promise<string>}
 */
export default {
  name: 'typescript/es6-declarations-deprecation',
  format: async ({ dictionary, file, options }) => {
    const header =
      typeof file.options?.fileHeader === 'function'
        ? await file.options.fileHeader({ file, options })
        : `/**
 * Do not edit directly, this file was auto-generated.
 */
`
    let tokens = dictionary.allTokens ?? []
    if (typeof file.filter === 'function') {
      tokens = tokens.filter(file.filter)
    }
    const usesDtcg = options?.usesDtcg ?? true
    const valueKey = usesDtcg ? '$value' : 'value'

    const lines = tokens.map((token) => {
      const value = usesDtcg ? token.$value : token.value
      const tsType = inferTypeScriptType(value)
      const decl = `export const ${token.name}: ${tsType};`
      const att = token.attributes
      if (att?.isDeprecated) {
        const meta = {
          since: att.deprecatedSince,
          replacement: att.deprecatedReplacement,
          reason: att.deprecatedReason
        }
        return buildDeprecationJSDoc(meta) + '\n' + decl
      }
      return decl
    })

    return header + '\n' + lines.join('\n') + '\n'
  }
}

/**
 * Infer TypeScript type for token value (mirrors SD behavior for primitives).
 * @param {unknown} value
 * @returns {string}
 */
function inferTypeScriptType(value) {
  if (value === null) return 'null'
  const t = typeof value
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  if (Array.isArray(value)) return 'string[]'
  if (t === 'object' && value !== null) {
    if ('value' in value && 'unit' in value) return 'string'
    if ('fontFamily' in value || 'fontSize' in value) return 'string'
  }
  return 'string'
}
