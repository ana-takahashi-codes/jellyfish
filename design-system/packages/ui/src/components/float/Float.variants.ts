import type { CSSProperties } from 'react'
import type { FloatPlacement } from './Float.types'

/**
 * Position origin per placement (before centering transform).
 * Uses CSS logical properties (insetInlineStart/End) for RTL support.
 */
export const floatOriginStyles: Record<FloatPlacement, CSSProperties> = {
  'bottom-end':    { bottom: 0, insetInlineEnd: 0 },
  'bottom-start':  { bottom: 0, insetInlineStart: 0 },
  'top-end':       { top: 0,    insetInlineEnd: 0 },
  'top-start':     { top: 0,    insetInlineStart: 0 },
  'bottom-center': { bottom: 0, insetInlineStart: '50%' },
  'top-center':    { top: 0,    insetInlineStart: '50%' },
  'middle-center': { top: '50%', insetInlineStart: '50%' },
  'middle-end':    { top: '50%', insetInlineEnd: 0 },
  'middle-start':  { top: '50%', insetInlineStart: 0 },
}

/**
 * Base CSS transform that centers the Float element on its anchor point.
 * Additional offset transforms are appended after this value.
 */
export const floatBaseTransform: Record<FloatPlacement, string> = {
  'bottom-end':    'translate(50%, 50%)',
  'bottom-start':  'translate(-50%, 50%)',
  'top-end':       'translate(50%, -50%)',
  'top-start':     'translate(-50%, -50%)',
  'bottom-center': 'translate(-50%, 50%)',
  'top-center':    'translate(-50%, -50%)',
  'middle-center': 'translate(-50%, -50%)',
  'middle-end':    'translate(50%, -50%)',
  'middle-start':  'translate(-50%, -50%)',
}
