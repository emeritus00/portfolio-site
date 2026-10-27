import { layers } from '../../content/layers'
import { throughLines } from '../../content/throughline'
import { formatDepth, useDepth } from '../../hooks/useDepth'
import { useActiveSkill } from '../../lib/skillStore'
import { scrollToLayer } from '../../motion/scroll'

const last = layers.length - 1

/**
 * Main navigation. Desktop: a survey depth rail on the right edge.
 * Mobile: a bottom bar with one segment per layer.
 * It adopts the active layer's tokens, so it re-skins as you drill.
 */
export function DepthGauge() {
  const { active, index, progress, depth } = useDepth()
  const position = Math.min(1, (index + (index === last ? 0 : progress)) / last)
  const current = layers[index]
  // While a through-line skill is hovered, the layer it came from pulses on the rail.
  const activeSkill = useActiveSkill()
  const originLayer = throughLines.find((t) => t.id === activeSkill)?.origin.layer

  return (
    <nav
      aria-label="Depth gauge: jump between career layers"
      data-layer={active}
      className="fixed z-50 text-fg transition-colors duration-500 max-md:inset-x-0 max-md:bottom-0 md:inset-y-0 md:right-0 md:w-[var(--gauge-w)]"
    >
      {/* Live readout, announced politely when the layer changes. */}
      <p className="sr-only" aria-live="polite">
        Current layer: {current.name}
      </p>

      {/* ---------- Desktop rail ---------- */}
      <div className="hidden h-full flex-col items-center py-6 md:flex">
        <div className="mono-label w-full text-center" aria-hidden="true">
          <span className="block text-[0.95rem] tracking-normal text-accent tabular-nums">{formatDepth(depth)}</span>
          <span className="mt-1 block text-[0.6rem] text-muted">{current.name}</span>
        </div>

        <div className="relative mt-6 w-full flex-1">
          {/* Rail + fine ticks */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 border-x border-line"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 12px)',
            }}
          />
          {/* Progress fill */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-accent"
            style={{ height: `${position * 100}%` }}
          />
          {/* Drill head */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 h-0 w-0 -translate-x-1/2"
            style={{ top: `${position * 100}%` }}
          >
            <svg width="18" height="22" viewBox="0 0 18 22" className="-translate-x-1/2 -translate-y-full text-accent">
              <path d="M2 0h14v8l-7 14-7-14z" fill="currentColor" />
              <path d="M5 4h8M6 9h6" stroke="var(--bg)" strokeWidth="1.5" />
            </svg>
          </div>

          <ol className="absolute inset-0">
            {layers.map((l, i) => (
              <li key={l.id} className="absolute left-0 right-0 -translate-y-1/2" style={{ top: `${(i / last) * 100}%` }}>
                <button
                  type="button"
                  onClick={() => scrollToLayer(l.id)}
                  aria-current={l.id === active ? 'location' : undefined}
                  aria-label={`${l.name}: ${l.chapter}`}
                  className="group relative flex h-8 w-full cursor-pointer items-center justify-center"
                >
                  {originLayer === l.id && (
                    <span data-layer={l.id} aria-hidden="true" className="absolute h-5 w-5 rotate-45 border border-accent motion-safe:animate-ping" />
                  )}
                  <span
                    data-layer={l.id}
                    className={`block h-2.5 w-2.5 rotate-45 border border-accent transition-transform duration-300 group-hover:scale-125 ${
                      i <= index ? 'bg-accent' : 'bg-bg'
                    }`}
                  />
                  <span
                    className={`mono-label pointer-events-none absolute right-full mr-1 whitespace-nowrap rounded-sm bg-bg-2 px-2 py-1 text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100`}
                  >
                    {l.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- Mobile bottom bar ---------- */}
      <div className="flex h-[var(--bar-h)] items-center gap-3 border-t border-line bg-bg/90 px-4 backdrop-blur-md md:hidden">
        <div className="mono-label min-w-0 flex-1 truncate" aria-hidden="true">
          <span className="text-accent tabular-nums">{formatDepth(depth)}</span>
          <span className="text-muted"> · {current.name}</span>
        </div>
        <ol className="flex h-full items-stretch">
          {layers.map((l) => (
            <li key={l.id} className="flex">
              <button
                type="button"
                onClick={() => scrollToLayer(l.id)}
                aria-current={l.id === active ? 'location' : undefined}
                aria-label={`${l.name}: ${l.chapter}`}
                className="flex h-full w-7 items-center justify-center"
              >
                <span
                  data-layer={l.id}
                  className={`block h-6 rounded-[1px] bg-accent transition-all duration-300 ${
                    l.id === active ? 'w-3 opacity-100' : 'w-1.5 opacity-45'
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
