/**
 * Deprecation utilities for design tokens (DTCG $deprecated).
 * Normalizes $deprecated: true | { since?, replacement?, reason? } and provides safe accessors.
 */

/**
 * @typedef {Object} DeprecatedMeta
 * @property {string} [since] - Version since deprecated (e.g. "2.3.0")
 * @property {string} [replacement] - Token path or name to use instead (e.g. "color.brand.primary.default")
 * @property {string} [reason] - Human-readable reason (e.g. "Normalização semântica")
 */

/**
 * Normalizes raw $deprecated from token JSON to a canonical object.
 * - $deprecated: true → { since: undefined, replacement: undefined, reason: undefined }
 * - $deprecated: { since, replacement, reason } → same with fallbacks for missing fields
 *
 * @param {boolean | DeprecatedMeta | null | undefined} raw - Raw $deprecated value from token
 * @returns {DeprecatedMeta | null} Normalized object or null if not deprecated
 */
export function normalizeDeprecated(raw) {
  if (raw === undefined || raw === null) return null
  if (raw === true) {
    return { since: undefined, replacement: undefined, reason: undefined }
  }
  if (typeof raw !== 'object') return null
  return {
    since: typeof raw.since === 'string' ? raw.since : undefined,
    replacement: typeof raw.replacement === 'string' ? raw.replacement : undefined,
    reason: typeof raw.reason === 'string' ? raw.reason : undefined
  }
}

/**
 * Returns whether a token is deprecated (has $deprecated truthy or object).
 *
 * @param {{ $deprecated?: boolean | DeprecatedMeta }} token - Token with optional $deprecated
 * @returns {boolean}
 */
export function isDeprecated(token) {
  const raw = token?.$deprecated
  if (raw === undefined || raw === null) return false
  if (raw === true) return true
  return typeof raw === 'object'
}

/**
 * Gets deprecated metadata from a token (raw or from attributes).
 * Prefers token.attributes (set by our transform) then token.$deprecated / token.original?.$deprecated.
 *
 * @param {{ $deprecated?: boolean | DeprecatedMeta, original?: { $deprecated?: boolean | DeprecatedMeta }, attributes?: { isDeprecated?: boolean, deprecatedSince?: string, deprecatedReplacement?: string, deprecatedReason?: string } }} token
 * @returns {DeprecatedMeta | null}
 */
export function getDeprecatedMeta(token) {
  if (!token) return null
  const att = token.attributes
  if (att?.isDeprecated) {
    return {
      since: att.deprecatedSince,
      replacement: att.deprecatedReplacement,
      reason: att.deprecatedReason
    }
  }
  const raw = token.$deprecated ?? token.original?.$deprecated
  return normalizeDeprecated(raw)
}
