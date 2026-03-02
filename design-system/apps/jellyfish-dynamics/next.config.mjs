import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uiSrc = path.resolve(__dirname, '../../packages/ui/src')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@jellyfish-ds/ui', '@jellyfish-ds/tokens'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@jellyfish-ds/ui/button': path.join(uiSrc, 'components/button/index.ts'),
      '@jellyfish-ds/ui/icon': path.join(uiSrc, 'components/icon/index.ts'),
      '@jellyfish-ds/ui/theme': path.join(uiSrc, 'theme/index.ts'),
      '@jellyfish-ds/ui/control': path.join(uiSrc, 'components/utils/control/index.ts'),
      '@jellyfish-ds/ui/logo': path.join(uiSrc, 'components/logo/index.ts'),
      '@jellyfish-ds/ui/mode-switch': path.join(uiSrc, 'components/mode-switch/index.ts'),
      '@jellyfish-ds/ui/variants': path.join(uiSrc, 'variants.ts'),
      '@jellyfish-ds/ui/tokens': path.join(uiSrc, 'tokens.ts'),
    }
    return config
  },
}

export default nextConfig
