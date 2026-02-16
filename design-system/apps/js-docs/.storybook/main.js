

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
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  async viteFinal(config) {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '$tokens-core-json': tokensCoreJson,
    }
    return config
  },
}
export default config