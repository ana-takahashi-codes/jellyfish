/**
 * Removes the build output directory.
 */

import { rmSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const buildDir = join(__dirname, '..', 'build')

try {
  rmSync(buildDir, { recursive: true, force: true })
  console.log('[tokens] Cleaned build/')
} catch (e) {
  if (e?.code !== 'ENOENT') throw e
}
