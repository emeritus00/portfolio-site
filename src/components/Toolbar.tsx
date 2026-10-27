import { setTheme, useTheme } from '../lib/theme'
import { askAssistant } from '../lib/assistant/bus'
import { loadAssistant } from './assistant/load'
import { loadTerminal } from './terminal/useTerminal'

const chip =
  'mono-label flex items-center gap-2 border border-line bg-bg/80 px-2.5 py-2 text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-fg'

/** Top-left controls: terminal, site assistant, light/dark. Scrolls away on phones. */
export function Toolbar({ onTerminal }: { onTerminal: () => void }) {
  const theme = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <div data-layer="atmosphere" className="fixed left-3 top-3 z-50 flex gap-2 max-md:absolute md:left-4 md:top-4">
      <button
        type="button"
        onClick={onTerminal}
        onPointerEnter={loadTerminal}
        onFocus={loadTerminal}
        aria-haspopup="dialog"
        className={chip}
      >
        <span aria-hidden="true" className="text-accent">&gt;_</span>
        <span>Terminal</span>
        <kbd className="hidden border border-line px-1 font-mono text-[0.6rem] md:inline">/</kbd>
      </button>
      <button
        type="button"
        onClick={() => askAssistant()}
        onPointerEnter={loadAssistant}
        onFocus={loadAssistant}
        aria-haspopup="dialog"
        className={chip}
      >
        <span aria-hidden="true" className="text-accent">✦</span>
        <span>Ask</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`Switch to ${next} mode`}
        className={chip}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="text-accent">
          {theme === 'dark' ? (
            <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5z" fill="currentColor" />
          ) : (
            <g stroke="currentColor" strokeWidth="1.5" fill="none">
              <circle cx="8" cy="8" r="3" fill="currentColor" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" />
            </g>
          )}
        </svg>
        <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
      </button>
    </div>
  )
}
