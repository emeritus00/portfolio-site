import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'strata-theme'
const listeners = new Set<() => void>()

/** The theme index.html applied before first paint (saved choice, else the OS setting). */
export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#eef4fb' : '#070d1f')
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Storage can be blocked (private mode); the toggle still works for this visit.
  }
  listeners.forEach((l) => l())
}

export function useTheme() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    getTheme,
    () => 'dark' as Theme,
  )
}
