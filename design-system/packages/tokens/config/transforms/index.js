/**
 * Custom Style Dictionary transforms.
 * Entry-point: compose and register all project-specific transforms.
 */

import { registerDurationTransform } from './value-duration.js'
import { registerCubicBezierTransform } from './value-cubic-bezier.js'
import { registerTransitionTransform } from './value-transition-shorthand.js'

export function registerCustomTransforms(StyleDictionary) {
  registerDurationTransform(StyleDictionary)
  registerCubicBezierTransform(StyleDictionary)
  registerTransitionTransform(StyleDictionary)
}
