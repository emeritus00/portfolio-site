import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { profile } from '../../content/profile'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { ASK_EVENT } from '../../lib/assistant/bus'
import type { Doc } from '../../lib/assistant/knowledge'
import { answer, suggestions } from '../../lib/assistant/retrieve'
import { scrollToElement, scrollToLayer } from '../../motion/scroll'
import { Fact } from '../ui/Fact'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  doc?: Doc | null
  related?: Doc[]
}

let nextId = 0

/** Reveals an answer word by word, so it reads like it's being written. */
function Typed({ text, onDone }: { text: string; onDone?: () => void }) {
  const words = text.split(' ')
  const [n, setN] = useState(() => (prefersReducedMotion() ? words.length : 0))
  useEffect(() => {
    if (n >= words.length) {
      onDone?.()
      return
    }
    const t = setTimeout(() => setN((x) => x + 2), 28)
    return () => clearTimeout(t)
  }, [n, words.length, onDone])
  return <Fact>{words.slice(0, n).join(' ')}</Fact>
}

function goTo(source: NonNullable<Doc['source']>) {
  if (source.project) {
    const el = document.getElementById(`${source.project}-title`)?.closest('article')
    if (el instanceof HTMLElement) scrollToElement(el, -24)
  } else if (source.layer) {
    scrollToLayer(source.layer)
  }
}

/**
 * "Ask the core": a retrieval assistant that answers only from this site's
 * content, entirely in the browser. Lazy-loaded on first open.
 */
function reply(text: string): Message[] {
  const { doc, related } = answer(text)
  return [
    { id: nextId++, role: 'user', text },
    {
      id: nextId++,
      role: 'assistant',
      text: doc ? doc.answer : 'I can only answer from what’s on this site, and I couldn’t find that here. Try one of these, or email him directly.',
      doc,
      related,
    },
  ]
}

export default function AssistantPanel({ initial, onClose }: { initial?: string; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => (initial ? reply(initial) : []))
  const [value, setValue] = useState('')
  const [typing, setTyping] = useState(!!initial)
  const typingRef = useRef(typing)
  useEffect(() => {
    typingRef.current = typing
  }, [typing])
  const input = useRef<HTMLInputElement>(null)
  const log = useRef<HTMLDivElement>(null)

  const ask = useCallback((q: string) => {
    const text = q.trim()
    if (!text || typingRef.current) return
    setTyping(true)
    setMessages((m) => [...m, ...reply(text)])
  }, [])

  // Questions asked elsewhere on the page while the panel is already open.
  useEffect(() => {
    const onAsk = (e: Event) => {
      const text = (e as CustomEvent<string | undefined>).detail
      if (text) ask(text)
    }
    window.addEventListener(ASK_EVENT, onAsk)
    return () => window.removeEventListener(ASK_EVENT, onAsk)
  }, [ask])

  useEffect(() => {
    input.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(value)
    setValue('')
  }

  const last = messages[messages.length - 1]

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="assistant-title"
      data-layer="atmosphere"
      className="fixed inset-x-2 bottom-[calc(var(--bar-h)+0.5rem)] top-16 z-[75] flex flex-col overflow-hidden border border-line bg-bg text-fg shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] md:inset-auto md:bottom-4 md:left-4 md:h-[min(36rem,80vh)] md:w-[min(27rem,calc(100vw-8rem))]"
    >
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <h2 id="assistant-title" className="font-medium">
            <span aria-hidden="true" className="text-accent">✦ </span>Ask the core
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            Answers come only from this site’s content, matched in your browser. No AI model is called and nothing you type leaves this page.
          </p>
        </div>
        <button type="button" onClick={onClose} className="mono-label shrink-0 border border-line px-2 py-1 text-muted hover:text-fg">
          Esc
        </button>
      </header>

      <div ref={log} role="log" aria-live="polite" data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-4 py-4 [overscroll-behavior:contain]">
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-muted">Ask about {profile.name.split(' ')[0]}’s projects, skills, certifications, background, or how to reach him.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => ask(s)} className="border border-line px-2.5 py-1.5 text-left text-sm hover:border-accent">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m) =>
          m.role === 'user' ? (
            <p key={m.id} className="ml-auto w-fit max-w-[85%] bg-accent px-3 py-2 text-sm text-bg">
              {m.text}
            </p>
          ) : (
            <div key={m.id} className="max-w-[95%] text-sm leading-relaxed">
              <p className="mono-label mb-1 text-accent">{m.doc ? m.doc.title : 'Not on the site'}</p>
              <p>
                {m === last && typing ? <Typed text={m.text} onDone={() => setTyping(false)} /> : <Fact>{m.text}</Fact>}
              </p>
              {!(m === last && typing) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.doc?.source && (
                    <button
                      type="button"
                      onClick={() => goTo(m.doc!.source!)}
                      className="mono-label border border-line px-2 py-1 text-muted hover:border-accent hover:text-fg"
                    >
                      ↳ Source: {m.doc.source.label}
                    </button>
                  )}
                  {(m.doc ? (m.related ?? []) : []).map((r) => (
                    <button key={r.id} type="button" onClick={() => ask(r.title)} className="mono-label border border-dashed border-line px-2 py-1 text-muted hover:text-fg">
                      Also: {r.title}
                    </button>
                  ))}
                  {!m.doc && (
                    <>
                      {suggestions.slice(0, 3).map((s) => (
                        <button key={s} type="button" onClick={() => ask(s)} className="border border-line px-2 py-1 text-xs hover:border-accent">
                          {s}
                        </button>
                      ))}
                      <a href={`mailto:${profile.email}`} className="mono-label border border-accent px-2 py-1 text-accent">
                        Email him
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          ),
        )}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-line px-3 py-3 focus-within:bg-bg-2">
        <label htmlFor="assistant-input" className="sr-only">
          Your question
        </label>
        <input
          id="assistant-input"
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          placeholder="Ask a question…"
          className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted"
        />
        <button type="submit" disabled={!value.trim() || typing} className="mono-label border border-accent px-3 py-1.5 text-accent disabled:opacity-40">
          Ask
        </button>
      </form>
    </section>
  )
}
