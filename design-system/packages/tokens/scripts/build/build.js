/**
 * Build script: runs Style Dictionary per build group.
 *
 * A estrutura de sets/temas é lida de tokens.resolver.json (declarativo) em vez de
 * ser inferida via regex de nomes de set (getBuildManifest em config/constants.js).
 *
 * Fluxo:
 *   1. Carrega tokens.resolver.json
 *   2. split-sets.mjs extrai cada set do JSON monolítico → src/tokens-studio/sets/
 *   3. buildManifestFromResolver() deriva os buildGroups sem regex
 *   4. Para cada tema declarado no resolver:
 *        - Mescla arquivos do core com overrides do tema (ex: ana-takahashi)
 *        - Roda Style Dictionary por buildGroup
 *   5. Compõe responsive.css
 *   6. Limpa arquivos de plataforma intermediários
 */

import { rmSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import StyleDictionary from 'style-dictionary'
import { getConfig, BUILD_DIR } from '../../config/index.js'
import {
  loadResolver,
  splitSets,
  buildManifestFromResolver,
  PACKAGE_ROOT
} from './split-sets.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function run () {
  // ── 1. Carregar resolver ─────────────────────────────────────────────────────
  const resolver = loadResolver()
  const buildExt = resolver.$extensions['jellyfish.build']

  // ── 2. Extrair sets ─────────────────────────────────────────────────────────
  const splitResults = splitSets()

  const coreResult = splitResults.find((r) => r.themeName === 'core')
  if (!coreResult) {
    console.error('[tokens] Tema "core" não encontrado no resolver.')
    process.exit(1)
  }

  // ── 3. Derivar manifesto ─────────────────────────────────────────────────────
  const manifest = buildManifestFromResolver(resolver, splitResults)

  // ── 4. Build por tema ────────────────────────────────────────────────────────
  const buildPathBase = join(PACKAGE_ROOT, BUILD_DIR)

  for (const [themeName] of Object.entries(buildExt.themes)) {
    const themeResult = splitResults.find((r) => r.themeName === themeName)
    if (!themeResult) {
      console.warn(`[tokens] Resultado de split não encontrado para "${themeName}", pulando.`)
      continue
    }

    // Arquivos do core como base; tema adiciona overrides em cima (overlay model).
    // Ex.: ana-takahashi/foundations.json contém apenas as cores da marca — os demais
    // tokens de foundations (jf.color.bd.*, jf.font.*, etc.) vêm do core.
    // Style Dictionary recebe ambos os arquivos; "collisions" = override esperado.
    const mergedFiles = new Map()
    for (const [key, p] of coreResult.splitFiles) mergedFiles.set(key, [p])
    if (themeResult !== coreResult) {
      for (const [key, p] of themeResult.splitFiles) {
        if (mergedFiles.has(key)) mergedFiles.get(key).push(p)  // overlay
        else mergedFiles.set(key, [p])
      }
    }

    // Limpar outputs anteriores
    for (const sub of ['css', 'scss', 'android', 'ios', 'js']) {
      try { rmSync(join(buildPathBase, sub, 'themes', themeName), { recursive: true, force: true }) } catch (_) {}
    }

    // Rodar Style Dictionary para cada grupo de build
    for (const group of manifest.buildGroups) {
      const sourcePaths = group.sourceKeys
        .flatMap((k) => mergedFiles.get(k) ?? [])
        .filter(Boolean)

      if (sourcePaths.length === 0) continue

      const config = getConfig(themeName, sourcePaths, group.outputFiles, manifest)
      const sd = new StyleDictionary(config)
      await sd.buildAllPlatforms()
    }

    console.log(`[tokens] Built theme: ${themeName}`)
  }

  // ── 5. Compor responsive.css ─────────────────────────────────────────────────
  const { buildResponsiveCss } = await import('./build-responsive-css.js')
  await buildResponsiveCss().catch((err) => {
    console.warn('[tokens] responsive.css composition skipped:', err.message)
  })

  // ── 6. Remover arquivos de plataforma intermediários ─────────────────────────
  // Os arquivos screen-xs.css / screen-md.css / screen-lg.css são mesclados em
  // responsive.css; os individuais não devem ficar no output final.
  for (const [themeName] of Object.entries(buildExt.themes)) {
    for (const platformKey of manifest.platformKeys) {
      const name = manifest.platformOutputName(platformKey)  // "screen-xs"

      for (const ext of ['css', 'scss']) {
        try { unlinkSync(join(buildPathBase, ext, 'themes', themeName, `${name}.${ext}`)) } catch (_) {}
      }
      try { unlinkSync(join(buildPathBase, 'android', 'themes', themeName, `${name}.xml`)) } catch (_) {}

      const swiftName = name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
      try { unlinkSync(join(buildPathBase, 'ios', 'themes', themeName, `${swiftName}.swift`)) } catch (_) {}
    }
  }

  console.log('[tokens] Build finished.')
}

run().catch((err) => {
  console.error('[tokens] Build failed:', err)
  process.exit(1)
})
