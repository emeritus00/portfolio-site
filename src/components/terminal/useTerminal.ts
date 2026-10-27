import { useEffect } from 'react'
import { useOverlay } from '../../hooks/useOverlay'

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

/** Loads the terminal panel chunk; call early (hover/focus) so opening feels instant. */
export const loadTerminal = () => import('./TerminalPanel')

/**
 * Open state + hotkeys for the terminal: "/" or Ctrl/⌘+K. Focus goes back to
 * whatever had it before the terminal opened.
 */
export function useTerminal() {
  const { open, show, hide } = useOverlay()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) hide()
        else show()
      } else if (e.key === '/' && !open && !isTyping(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        show()
      } else if (e.key === 'Escape' && open) {
        hide()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, show, hide])

  return { open, show, hide }
}
