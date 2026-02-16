// .storybook/preview.js
import './preview.css'

// Google Sans Flex: carrega no head do preview (previewHead pode não aplicar no docs)
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
  const fontLink = document.createElement('link')
  fontLink.rel = 'stylesheet'
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;700&display=swap'
  document.head.appendChild(fontLink)
}

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