

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

/**
 * Resolve the absolute path of a package.
 * Needed for Yarn PnP and monorepos.
 */
function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const tokensCoreJson = join(__dirname, '../../../packages/tokens/src/tokens-studio/core.json')

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  previewHead: (head) => `
    ${head}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Fira+Code:wght@300..700&family=Newsreader:ital,opsz,wght@0,6..12,200..800;1,6..12,200..800&display=swap">
  `,
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  async viteFinal(config) {
    // From apps/js-docs/.storybook, go up to design-system root: ../ = js-docs, ../../ = apps, ../../../ = design-system
    const root = join(__dirname, '../../..')
    const tokensPath = join(root, 'packages/tokens')
    const uiPath = join(root, 'packages/ui/src')

    // Storybook may already have resolve.alias as an array ({find, replacement}[]).
    // Spreading an array into an object produces numeric keys and breaks aliases.
    // Always normalize to array so both existing and new aliases are preserved.
    const existing = config.resolve?.alias ?? []
    const existingArr = Array.isArray(existing)
      ? existing
      : Object.entries(existing).map(([find, replacement]) => ({ find, replacement }))

    // Project aliases first so they take precedence over any defaults.
    // Specific sub-path aliases must come before the directory alias (@jellyfish/tokens).
    const projectAliases = [
      { find: '$tokens-core-json',                       replacement: tokensCoreJson },
      { find: '@jellyfish/tokens/vars',                  replacement: join(tokensPath, 'src/vars.js') },
      { find: '@jellyfish/tokens/fonts.css',             replacement: join(tokensPath, 'src/css/fonts.css') },
      { find: '@jellyfish/tokens/interactive-states.css',replacement: join(tokensPath, 'src/css/interactive-states.css') },
      { find: '@jellyfish/tokens',                       replacement: tokensPath },
      { find: '@jellyfish/ui/icon',    replacement: join(uiPath, 'components/icon/index.ts') },
      { find: '@jellyfish/ui/button',  replacement: join(uiPath, 'components/button/index.ts') },
      { find: '@jellyfish/ui/control', replacement: join(uiPath, 'components/utils/control/index.ts') },
      { find: '@jellyfish/ui/variants',replacement: join(uiPath, 'variants.ts') },
      { find: '@jellyfish/ui/tokens',  replacement: join(uiPath, 'tokens.ts') },
      { find: '@jellyfish/ui/theme',   replacement: join(uiPath, 'theme/index.ts') },
    ]

    config.resolve = config.resolve || {}
    config.resolve.alias = [...projectAliases, ...existingArr]
    return config
  },
}
export default config