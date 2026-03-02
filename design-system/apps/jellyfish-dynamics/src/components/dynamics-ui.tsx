'use client'

import { useEffect, useRef, useState } from 'react'
import { ThemeProvider, useTheme } from '@jellyfish-ds/ui/theme'
import { Logo } from '@jellyfish-ds/ui/logo'
import { Button } from '@jellyfish-ds/ui/button'
import { ModeSwitch } from '@jellyfish-ds/ui/mode-switch'
import { buildBrandPrimaryScale, buildBrandPrimaryOverrideCss } from '@/lib/brandScaleUtils'

const OVERRIDE_STYLE_ID = 'jellyfish-dynamics-brand-override'
const DEFAULT_BRAND_COLOR = '#6034c9'

function DynamicsContent () {
  const { resolved } = useTheme()
  const [brand, setBrand] = useState<'jellyfish' | 'decoded'>('jellyfish')
  const [brandColor, setBrandColor] = useState(DEFAULT_BRAND_COLOR)
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    let styleEl = document.getElementById(OVERRIDE_STYLE_ID) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = OVERRIDE_STYLE_ID
      document.head.appendChild(styleEl)
    }
    styleRef.current = styleEl

    const scale = buildBrandPrimaryScale(brandColor)
    if (scale) {
      styleEl.textContent = buildBrandPrimaryOverrideCss(scale)
    }

    return () => {
      if (styleRef.current) styleRef.current.textContent = ''
    }
  }, [brandColor])

  const colorScheme = resolved === 'dark' ? 'dark' : 'light'
  const isDark = resolved === 'dark'

  return (
    <div className="d-flex flex-col gap-24 p-24 bg-page h-min-24" style={{ minHeight: '100vh' }}>
      <header className="d-flex items-center justify-between flex-wrap gap-8">
        {brand === 'jellyfish' ? (
          <Logo brand="jellyfish" variant="default" size="lg" colorScheme={colorScheme} />
        ) : (
          <Logo brand="decoded" size="lg" colorScheme={colorScheme} />
        )}
        <ModeSwitch aria-label="Alternar tema claro ou escuro" size="md" />
      </header>

      <section className="d-flex flex-col gap-12" aria-label="Configuração da interface">
        <h2 className="fg-strong jf-font-title-md" style={{ margin: 0 }}>
          Configuração
        </h2>

        <div className="d-flex flex-col gap-8">
          <span className="fg-muted jf-font-label-sm">
            Marca
          </span>
          <div className="d-flex gap-8" role="group" aria-label="Escolher marca">
            <Button
              variant={brand === 'jellyfish' ? 'solid' : 'outline'}
              color="brand-primary"
              size="md"
              onClick={() => setBrand('jellyfish')}
              aria-pressed={brand === 'jellyfish'}
            >
              Jellyfish
            </Button>
            <Button
              variant={brand === 'decoded' ? 'solid' : 'outline'}
              color="brand-primary"
              size="md"
              onClick={() => setBrand('decoded')}
              aria-pressed={brand === 'decoded'}
            >
              Decoded
            </Button>
          </div>
        </div>

        <div className="d-flex flex-col gap-8">
          <label htmlFor="dynamics-brand-color" className="fg-muted jf-font-label-sm">
            Cor da marca (brand)
          </label>
          <div className="d-flex items-center gap-12">
            <input
              id="dynamics-brand-color"
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              aria-label="Selecionar cor da marca"
              className="corner-2 bd-0-5 box-border bd-moderated cursor-pointer"
              style={{
                width: 48,
                height: 48,
                padding: 0,
                borderStyle: 'solid',
                backgroundColor: brandColor,
              }}
            />
            <span className="fg-moderated jf-font-code-sm">
              {brandColor}
            </span>
          </div>
        </div>
      </section>

      <section className="d-flex flex-col gap-16" aria-label="Preview dos componentes">
        <h2 className="fg-strong jf-font-title-md" style={{ margin: 0 }}>
          Preview
        </h2>

        <div className="d-flex flex-wrap gap-12 items-center">
          <Button variant="solid" color="brand-primary" size="md">
            Primário
          </Button>
          <Button variant="outline" color="brand-primary" size="md">
            Outline
          </Button>
          <Button variant="ghost" color="brand-primary" size="md">
            Ghost
          </Button>
        </div>

        <div className="d-flex gap-8 flex-wrap">
          {([100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map((step) => (
            <div
              key={step}
              className="corner-2 size-56"
              style={{
                backgroundColor: `var(--jf-color-brand-primary-${step})`,
                ...(isDark && step >= 400 ? { border: '1px solid var(--jf-color-bd-muted)' } : {}),
              }}
              title={`brand-primary-${step}`}
            />
          ))}
        </div>
        <p className="fg-muted jf-font-label-sm" style={{ margin: 0 }}>
          Escala brand-primary 100–900 (tempo real)
        </p>
      </section>
    </div>
  )
}

export function DynamicsUI () {
  return (
    <ThemeProvider defaultMode="light" storageKey="jellyfish-dynamics-theme">
      <DynamicsContent />
    </ThemeProvider>
  )
}
