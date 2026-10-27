import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { profile } from '../../content/profile'
import { complete, runCommand } from './commands'

interface Line {
  id: number
  node: ReactNode
  input?: boolean
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

let nextId = 0
const line = (node: ReactNode, input = false): Line => ({ id: nextId++, node, input })

const banner = (): Line[] => [
  line(<span className="text-accent">STRATA shell · {profile.name}</span>),
  line(<span className="text-muted">Type help to see what this terminal can do.</span>),
]

/**
 * Command palette as a terminal. Opens with "/" or Ctrl/⌘+K, traps focus
 * while open, and hands focus back to wherever it came from on close.
 */
export function Terminal({ onMantle }: { onMantle: () => void }) {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(banner)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => returnFocus.current?.focus?.({ preventScroll: true }))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) hide()
        else show()
      } else if (e.key === '/' && !open && !isTyping(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, show, hide])

  useEffect(() => {
    if (open) input.current?.focus()
  }, [open])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [lines])

  const submit = () => {
    const cmd = value.trim()
    setValue('')
    setCursor(-1)
    if (!cmd) return
    setHistory((h) => [cmd, ...h].slice(0, 50))
    const result = runCommand(cmd, { openMantle: onMantle })
    setLines((ls) => (result.clear ? [] : [...ls, line(cmd, true), ...result.out.map((n) => line(n))]))
    if (result.after?.()) setTimeout(hide, 350)
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    else if (e.key === 'Escape') hide()
    else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      setValue((v) => complete(v))
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(-1, Math.min(history.length - 1, cursor + (e.key === 'ArrowUp' ? 1 : -1)))
      setCursor(next)
      setValue(next === -1 ? '' : history[next])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        data-layer="atmosphere"
        className="mono-label fixed left-3 top-3 z-50 flex items-center gap-2 max-md:absolute border border-line bg-bg/80 px-2.5 py-2 text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-fg md:left-4 md:top-4"
      >
        <span aria-hidden="true" className="text-accent">&gt;_</span>
        <span>Terminal</span>
        <kbd className="hidden border border-line px-1 font-mono text-[0.6rem] md:inline">/</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-layer="atmosphere"
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/55 p-3 pt-[12vh] backdrop-blur-[2px] sm:p-6 sm:pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => e.target === e.currentTarget && hide()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Terminal"
              className="flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-bg font-mono text-[0.8rem] text-fg shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8),0_0_0_1px_rgb(62_230_255/0.08)]"
              initial={{ y: 12, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onKeyDown={(e) => {
                // Focus trap: the dialog only has two stops.
                if (e.key === 'Tab' && e.shiftKey && document.activeElement === input.current) {
                  e.preventDefault()
                  closeBtn.current?.focus()
                } else if (e.key === 'Tab' && document.activeElement === closeBtn.current) {
                  e.preventDefault()
                  input.current?.focus()
                } else if (e.key === 'Escape') hide()
              }}
            >
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="mono-label text-muted">adewale@strata: ~</span>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={hide}
                  className="mono-label border border-line px-2 py-1 text-muted hover:text-fg"
                >
                  Esc
                </button>
              </div>

              <div
                ref={scroller}
                className="min-h-48 flex-1 space-y-1 overflow-y-auto px-4 py-3 leading-relaxed [overscroll-behavior:contain]"
                data-lenis-prevent
                role="log"
                aria-live="polite"
                onClick={() => input.current?.focus()}
              >
                {lines.map((l) => (
                  <div key={l.id} className="whitespace-pre-wrap break-words">
                    {l.input ? (
                      <>
                        <span className="text-accent">❯ </span>
                        {l.node}
                      </>
                    ) : (
                      l.node
                    )}
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 border-t border-line px-4 py-3 focus-within:bg-bg-2">
                <span aria-hidden="true" className="text-accent">❯</span>
                <span className="sr-only">Command</span>
                <input
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-fg caret-[var(--accent)] outline-none placeholder:text-muted/60"
                  placeholder="help"
                />
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
