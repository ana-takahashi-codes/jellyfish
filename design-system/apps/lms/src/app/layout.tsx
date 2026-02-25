import type { Metadata } from 'next'

// Design System tokens — loaded as global CSS
import '@jellyfish-ds/tokens/build/css/themes/core/primitives.css'
import '@jellyfish-ds/tokens/build/css/themes/core/foundations.css'
import '@jellyfish-ds/tokens/build/css/themes/core/components.css'
import '@jellyfish-ds/tokens/build/css/utilities.css'
import '@jellyfish-ds/tokens/interactive-states.css'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'JellyFish LMS',
    template: '%s | JellyFish LMS',
  },
  description: 'Plataforma de ensino JellyFish — cursos online de alta qualidade.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
