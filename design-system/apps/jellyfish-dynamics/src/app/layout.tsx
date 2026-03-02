import type { Metadata } from 'next'

// Design system tokens (pacote @jellyfish-ds/tokens)
import '@jellyfish-ds/tokens/build/css/themes/core/primitives.css'
import '@jellyfish-ds/tokens/build/css/themes/core/foundations.css'
import '@jellyfish-ds/tokens/build/css/themes/core/components.css'
import '@jellyfish-ds/tokens/build/css/themes/core/color-modes/light.css'
import '@jellyfish-ds/tokens/build/css/themes/core/color-modes/dark.css'
import '@jellyfish-ds/tokens/build/css/utilities.css'
import '@jellyfish-ds/tokens/interactive-states.css'

import './globals.css'

export const metadata: Metadata = {
  title: 'JellyFish Dynamics',
  description: 'Interface para explorar marcas, cor da marca e tema claro/escuro.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
