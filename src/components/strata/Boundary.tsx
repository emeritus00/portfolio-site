import { useLayoutEffect, useMemo, useRef } from 'react'
import type { Layer } from '../../content/layers'
import { hatchStyle } from '../../lib/hatches'
import { toPath, unconformity } from '../../lib/random'
import { formatDepth } from '../../hooks/useDepth'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../motion/scroll'

interface Props {
  from: Layer
  to: Layer
  seed: number
}

// Geometry in percent of the boundary box (x: 0–100, y: 0–100).
const BASE = 46
const AMP = 22
const BAND = 20

/**
 * An unconformity: the irregular surface where one layer ends and the next
 * begins. As it scrolls through the viewport the ink line draws itself and the
 * next layer's legend hatch is wiped in behind it.
 */
export function Boundary({ from, to, seed }: Props) {
  const root = useRef<HTMLDivElement>(null)

  const { line, below, band } = useMemo(() => {
    const pts = unconformity(seed, 100, AMP)
    const poly = (p: [number, number][]) => p.map(([x, y]) => `${x}% ${y}%`).join(', ')
    const top = pts.map(([x, y]) => [x, y + BASE] as [number, number])
    const lower = [...pts]
      .reverse()
      .map(([x, y]) => [x, y * 0.6 + BASE + BAND] as [number, number])
    return {
      line: toPath(pts, BASE),
      below: `polygon(${poly(top)}, 100% 100%, 0% 100%)`,
      band: `polygon(${poly(top)}, ${poly(lower)})`,
    }
  }, [seed])

  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 40%', scrub: 0.6 },
      })
      tl.fromTo('[data-ink]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none' }, 0)
        .fromTo('[data-wipe]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none' }, 0.1)
        .fromTo('[data-readout]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, 0.35)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-layer={from.id}
      className="relative h-[clamp(140px,20vw,260px)] overflow-hidden bg-bg"
    >
      <div data-layer={to.id} className="absolute inset-0 bg-bg" style={{ clipPath: below }} />

      <div data-layer={to.id} data-wipe className="absolute inset-0">
        <div className="absolute inset-0" style={{ clipPath: band }}>
          <div className="absolute inset-0 opacity-70" style={hatchStyle(to.hatch, 'var(--accent-2)')} />
        </div>
      </div>

      <svg
        data-layer={to.id}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          data-ink
          d={line}
          pathLength={1}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
          strokeDasharray="1 1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        data-readout
        className="mono-label absolute bottom-3 left-4 right-4 flex justify-between gap-4 text-fg/80 md:left-12 md:right-[calc(var(--gauge-w)+1rem)]"
        data-layer={to.id}
      >
        <span>Unconformity · {formatDepth(to.depthStart)}</span>
        <span className="hidden sm:inline">
          {from.name} / {to.name}
        </span>
      </div>
    </div>
  )
}
