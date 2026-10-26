import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

const W = 1440
const H = 900
const LINES = 16
const STEPS = 36

/** Height of isobar `i` at x for phase t: a few slow sine terms, never noise soup. */
function isobar(i: number, t: number) {
  const base = (i + 0.5) * (H / LINES)
  const pts: string[] = []
  for (let s = 0; s <= STEPS; s++) {
    const x = (s / STEPS) * W
    const y =
      base +
      Math.sin(x * 0.0021 + i * 0.55 + t * 0.6) * 22 +
      Math.sin(x * 0.0047 - i * 0.31 + t * 0.35) * 11 +
      Math.sin(x * 0.0009 + t * 0.2) * 34
    pts.push(`${s ? 'L' : 'M'}${x.toFixed(0)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

/**
 * Survey contour lines drifting like weather isobars. Every fourth line is an
 * "index contour" (heavier, accent-tinted). Animation runs only while visible, on
 * pointer-capable wide screens, and never with reduced motion.
 */
export function Contours() {
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = svg.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(min-width: 768px)').matches) return

    const paths = Array.from(el.querySelectorAll<SVGPathElement>('path[data-i]'))
    let frame = 0
    let visible = true
    const start = performance.now()

    const draw = (now: number) => {
      const t = (now - start) / 1000
      paths.forEach((p) => p.setAttribute('d', isobar(Number(p.dataset.i), t)))
      frame = visible ? requestAnimationFrame(draw) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(draw)
    })
    io.observe(el)
    frame = requestAnimationFrame(draw)

    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <svg
      ref={svg}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_70%_40%,black_30%,transparent_80%)]"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: LINES }, (_, i) => {
        const index = i % 4 === 1
        return (
          <path
            key={i}
            data-i={i}
            d={isobar(i, 0)}
            fill="none"
            stroke={index ? 'var(--accent)' : 'var(--line)'}
            strokeOpacity={index ? 0.32 : 1}
            strokeWidth={index ? 1.1 : 0.7}
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
    </svg>
  )
}
