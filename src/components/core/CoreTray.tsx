import { useMemo, useRef } from 'react'
import { layers } from '../../content/layers'
import { formatDepth } from '../../hooks/useDepth'
import { useInView } from '../../hooks/useInView'
import { hatchStyle } from '../../lib/hatches'
import { mulberry32 } from '../../lib/random'
import { scrollToLayer } from '../../motion/scroll'

const drilled = layers.filter((l) => l.depthEnd > l.depthStart)

/** Split a row of core into 2–3 pieces with a little loss at each fracture, like real drill core. */
function pieces(seed: number) {
  const rand = mulberry32(seed)
  const n = 2 + Math.floor(rand() * 2)
  const raw = Array.from({ length: n }, () => 0.6 + rand())
  const total = raw.reduce((a, b) => a + b, 0)
  const usable = 100 - (n - 1) * 1.6
  return raw.map((r) => (r / total) * usable)
}

/**
 * The extracted sample, laid out the way geologists store it: a core box with
 * one row per layer, top of hole at the top left. Each row is a link back to
 * its layer. Rows slide into the box as it scrolls into view.
 */
export function CoreTray() {
  const box = useRef<HTMLDivElement>(null)
  const laid = useInView(box, { threshold: 0.2 })
  const rows = useMemo(() => drilled.map((l, i) => ({ layer: l, pieces: pieces(i * 31 + 7) })), [])

  return (
    <figure ref={box} className={`border-2 border-line bg-bg-2/60 ${laid ? 'is-laid' : ''}`}>
      <figcaption className="mono-label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b-2 border-line px-4 py-3">
        <span className="text-accent">Hole AG-01 · Box 1 of 1</span>
        <span className="text-muted">
          {formatDepth(drilled[0].depthStart)} → {formatDepth(drilled[drilled.length - 1].depthEnd)}
        </span>
        <span className="text-muted" aria-hidden="true">
          ↑ Top of hole
        </span>
      </figcaption>

      <ol className="divide-y-2 divide-line">
        {rows.map(({ layer, pieces: parts }, r) => {
          let x = 0
          return (
            <li key={layer.id} data-layer={layer.id}>
              <button
                type="button"
                onClick={() => scrollToLayer(layer.id)}
                className="group block w-full px-4 pb-4 pt-3 text-left transition-colors hover:bg-bg-2 focus-visible:bg-bg-2 sm:px-5"
              >
                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span>
                    <span className="mono-label mr-3 text-accent">
                      {String(r + 1).padStart(2, '0')} · {layer.name}
                    </span>
                    <span className="font-medium group-hover:text-accent">{layer.chapter}</span>
                  </span>
                  <span className="mono-label text-muted tabular-nums">
                    {formatDepth(layer.depthStart)} → {formatDepth(layer.depthEnd)}
                  </span>
                </span>

                {/* Compartment */}
                <span
                  aria-hidden="true"
                  className="relative mt-3 block h-9 overflow-hidden rounded-[3px] bg-bg shadow-[inset_0_2px_6px_rgb(0_0_0/0.45)] sm:h-11"
                >
                  {parts.map((w, p) => {
                    const left = x
                    x += w + 1.6
                    const first = p === 0
                    const last = p === parts.length - 1
                    // Fracture faces are slanted; only the true ends of the core are rounded.
                    const clip = `polygon(${first ? '0 0' : '6px 0'}, ${last ? '100% 0' : '100% 0'}, ${last ? '100% 100%' : 'calc(100% - 6px) 100%'}, 0 100%)`
                    return (
                      <span
                        key={p}
                        className="core-piece absolute inset-y-1 overflow-hidden bg-accent/25 transition-[filter] duration-300 group-hover:brightness-125 group-focus-visible:brightness-125"
                        style={{
                          left: `${left}%`,
                          width: `${w}%`,
                          clipPath: clip,
                          borderRadius: `${first ? '999px' : '0'} ${last ? '999px' : '0'} ${last ? '999px' : '0'} ${first ? '999px' : '0'}`,
                          transitionDelay: `${r * 0.12 + p * 0.07}s`,
                        }}
                      >
                        <span className="absolute inset-0" style={hatchStyle(layer.hatch, 'var(--accent-2)')} />
                        {/* cylindrical shading across the core */}
                        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.18),transparent_35%,transparent_60%,rgb(0_0_0/0.45))]" />
                      </span>
                    )
                  })}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </figure>
  )
}
