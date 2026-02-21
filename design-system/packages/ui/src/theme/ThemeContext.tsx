/**
 * Context for theme (light / dark / system).
 * The provider sets data-theme on document.documentElement so CSS variables
 * from @jellyfish/tokens color-modes apply. Import light.css and dark.css
 * so that [data-theme="light"] and [data-theme="dark"] take effect.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  /** Resolved theme for the current moment: 'light' or 'dark' (when mode is 'system', follows prefers-color-scheme). */
  resolved: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_ATTR = 'data-theme'

function getSystemTheme (): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme (mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (mode === 'system') {
    root.removeAttribute(THEME_ATTR)
  } else {
    root.setAttribute(THEME_ATTR, mode)
  }
}

export interface ThemeProviderProps {
  children: React.ReactNode
  /** Initial mode; default 'light'. */
  defaultMode?: ThemeMode
  /** localStorage key to persist theme; set to empty to disable persistence. */
  storageKey?: string
}

export function ThemeProvider ({
  children,
  defaultMode = 'light',
  storageKey = 'jf-theme'
}: ThemeProviderProps): JSX.Element {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultMode
    try {
      const stored = window.localStorage.getItem(storageKey) as ThemeMode | null
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
    } catch (_) {}
    return defaultMode
  })

  const [resolved, setResolved] = useState<'light' | 'dark'>(() => {
    if (mode === 'system') return getSystemTheme()
    return mode
  })

  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  useEffect(() => {
    if (mode !== 'system') {
      setResolved(mode)
      return
    }
    setResolved(getSystemTheme())
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => setResolved(getSystemTheme())
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, next)
    } catch (_) {}
  }, [storageKey])

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, resolved }),
    [mode, setMode, resolved]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme (): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}

export function useThemeOptional (): ThemeContextValue | null {
  return useContext(ThemeContext)
}
