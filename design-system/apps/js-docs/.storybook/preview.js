// .storybook/preview.js
import './preview.css'

// Design tokens (required for Icon and other components that use --jf-* variables)
import '@jellyfish/tokens/build/css/themes/core/primitives.css'
import '@jellyfish/tokens/build/css/themes/core/foundations.css'
import '@jellyfish/tokens/build/css/themes/core/color-modes/light.css'
// Interactive states (hover opacity + focus outline) for Icon, Button, etc.
import '@jellyfish/ui/interactive-states.css'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: "todo"
    }
  },
};

export default preview;