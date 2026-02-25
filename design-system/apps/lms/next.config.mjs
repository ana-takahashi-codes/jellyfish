import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Paths to workspace packages (source TypeScript — no build required in dev)
const uiSrc = path.resolve(__dirname, '../../packages/ui/src')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@jellyfish-ds/ui', '@jellyfish-ds/tokens'],

  webpack(config) {
    // Resolve @jellyfish-ds/ui sub-path exports to TypeScript source so the LMS
    // works without needing to build the UI package first.
    // Note: @jellyfish-ds/tokens is NOT aliased here — Next.js resolves its CSS
    // sub-paths correctly via pnpm symlinks + the package.json exports map.
    config.resolve.alias = {
      ...config.resolve.alias,
      '@jellyfish-ds/ui/button':   path.join(uiSrc, 'components/button/index.ts'),
      '@jellyfish-ds/ui/icon':     path.join(uiSrc, 'components/icon/index.ts'),
      '@jellyfish-ds/ui/theme':    path.join(uiSrc, 'theme/index.ts'),
      '@jellyfish-ds/ui/control':  path.join(uiSrc, 'components/utils/control/index.ts'),
      '@jellyfish-ds/ui/variants': path.join(uiSrc, 'variants.ts'),
      '@jellyfish-ds/ui/tokens':   path.join(uiSrc, 'tokens.ts'),
    }

    return config
  },
}

export default nextConfig
