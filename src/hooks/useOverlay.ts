import { useCallback, useRef, useState } from 'react'

/** Open/close state for an overlay that hands focus back to whatever opened it. */
export function useOverlay() {
  const [open, setOpen] = useState(false)
  const returnFocus = useRef<HTMLElement | null>(null)

  const show = useCallback(() => {
    if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    const el = returnFocus.current
    returnFocus.current = null
    requestAnimationFrame(() => el?.focus?.({ preventScroll: true }))
  }, [])

  return { open, show, hide }
}
