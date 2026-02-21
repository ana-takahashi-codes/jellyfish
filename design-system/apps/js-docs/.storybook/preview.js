// .storybook/preview.js
import React, { useLayoutEffect } from 'react'
import { ThemeProvider } from '@jellyfish/ui/theme'
import './preview.css'

/** Syncs Storybook toolbar "Background" (light/dark) to document.documentElement data-theme so CSS variables apply. */
function ThemeSync ({ themeMode, children }) {
  useLayoutEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme', themeMode)
    }
  }, [themeMode])
  return children
}

// Carrega Google Fonts via <link> dinâmico (mais confiável que @import url() em <style> do Vite)
if (typeof document !== 'undefined' && document.head) {
  const preconnect1 = document.createElement('link')
  preconnect1.rel = 'preconnect'
  preconnect1.href = 'https://fonts.googleapis.com'
  document.head.appendChild(preconnect1)

  const preconnect2 = document.createElement('link')
  preconnect2.rel = 'preconnect'
  preconnect2.href = 'https://fonts.gstatic.com'
  preconnect2.crossOrigin = 'anonymous'
  document.head.appendChild(preconnect2)

  const fontsLink = document.createElement('link')
  fontsLink.rel = 'stylesheet'
  fontsLink.href = 'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Fira+Code:wght@300..700&family=Newsreader:ital,opsz,wght@0,6..12,200..800;1,6..12,200..800&display=swap'
  document.head.appendChild(fontsLink)
}

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  globalTypes: {
    background: {
      description: 'Theme (light/dark) for the canvas',
      toolbar: {
        title: 'Background',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeMode = context.globals?.background === 'dark' ? 'dark' : 'light'
      return React.createElement(
        ThemeSync,
        { themeMode },
        React.createElement(
          ThemeProvider,
          {
            key: `theme-${themeMode}`,
            defaultMode: themeMode,
            storageKey: '',
          },
          React.createElement(Story)
        )
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  initialGlobals: {
    background: 'light',
  },
}

export default preview