/**
 * Style Dictionary attribute transform: reads $deprecated from tokens and sets
 * token.attributes (isDeprecated, deprecatedSince, deprecatedReplacement, deprecatedReason).
 * Does not alter token.value or break aliases.
 */

import { normalizeDeprecated, isDeprecated } from '../utils/deprecation.js'

/**
 * @param {import('style-dictionary').StyleDictionary} StyleDictionary
 */
export function registerDeprecatedAttributeTransform(StyleDictionary) {
  StyleDictionary.registerTransform({
    name: 'attribute/deprecated',
    type: 'attribute',
    filter: (token) => {
      const raw = token?.$deprecated ?? token?.original?.$deprecated
      return raw !== undefined && raw !== null
    },
    transform: (token) => {
      const raw = token.$deprecated ?? token.original?.$deprecated
      const meta = normalizeDeprecated(raw)
      const deprecated = isDeprecated({ $deprecated: raw })
      return {
        isDeprecated: deprecated,
        deprecatedSince: meta?.since,
        deprecatedReplacement: meta?.replacement,
        deprecatedReason: meta?.reason
      }
    }
  })
}
