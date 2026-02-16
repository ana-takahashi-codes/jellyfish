/**
 * Global deprecation window and policy for design tokens.
 * - warning: apply warnings at "minor" (during minor version support)
 * - removal: plan removal at "major" (candidates for next major)
 */

/** @type {{ deprecationWindow: { warning: string, removal: string } }} */
export const deprecationConfig = {
  deprecationWindow: {
    warning: 'minor',
    removal: 'major'
  }
}

export default deprecationConfig
