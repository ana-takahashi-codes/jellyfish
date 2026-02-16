/**
 * Utilitários mínimos para o build de utilities (scripts/utilities).
 * Usado por utils-build.mjs e dynamic-utilities-generator.mjs.
 */

import fs from 'fs'
import path from 'path'

const cache = new Map()

export const logger = {
  info: (msg) => console.log(`[info] ${msg}`),
  warn: (msg) => console.warn(`[warn] ${msg}`),
  error: (msg) => console.error(`[error] ${msg}`),
  success: (msg) => console.log(`[ok] ${msg}`),
  step: (msg) => console.log(`\n→ ${msg}`),
  debug: (msg) => {}
}

export function measureTime (label, fn) {
  if (typeof fn === 'function' && fn.constructor.name === 'AsyncFunction') {
    return fn().then((result) => {
      logger.info(`${label} done`)
      return result
    })
  }
  const result = typeof fn === 'function' ? fn() : fn
  logger.info(`${label} done`)
  return result
}

export function readFileCached (filePath, encoding = 'utf-8') {
  if (cache.has(filePath)) return cache.get(filePath)
  const content = fs.readFileSync(filePath, encoding)
  cache.set(filePath, content)
  return content
}

export function writeFileSafe (filePath, content) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  } catch (_) {}
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    return true
  } catch (err) {
    logger.error(err.message)
    return false
  }
}

export function extractTokensFromCSS (cssContent) {
  if (!cssContent || typeof cssContent !== 'string') return {}
  const tokens = {}
  const re = /--([a-zA-Z0-9-]+):\s*([^;]+);/g
  let m
  while ((m = re.exec(cssContent)) !== null) {
    tokens[m[1]] = m[2].trim()
  }
  return tokens
}

export function mapPropertyKey (key) {
  if (typeof key !== 'string') return key
  return key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

export function handleError (err, context) {
  logger.error(`${context}: ${err?.message || err}`)
  if (err?.stack) logger.debug(err.stack)
}

export class TokenProcessingError extends Error {
  constructor (message, opts = {}) {
    super(message)
    this.name = 'TokenProcessingError'
    Object.assign(this, opts)
  }
}
