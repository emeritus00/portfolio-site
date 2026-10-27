import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { layers } from '../../content/layers'
import { useActiveSkill } from '../../lib/skillStore'

const X = 22

interface Anchor {
  skill: string
  kind: 'origin' | 'resurface'
  y: number
  left: number
}

interface Geometry {
  height: number
  anchors: Anchor[]
  stops: { offset: number; color: string }[]
}

/**
 * A thin glowing thread down the full depth of the page (desktop only). It
 * fills as you drill, shows a node at every skill tag, and, when a skill is
 * hovered, lights the stretch from where it resurfaced down to where it first appeared.
 */
export function ThroughLine() {
  // Measures against its parent (<main>); a parent ref isn't attached yet when child effects run.
  const root = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geometry>({ height: 0, anchors: [], stops: [] })
  const fill = useRef<SVGGElement>(null)
  const active = useActiveSkill()

  useLayoutEffect(() => {
    const main = root.current?.parentElement
    if (!main) return
    const measure = () => {
      const box = main.getBoundingClientRect()
      const anchors = Array.from(main.querySelectorAll<HTMLElement>('[data-skill]')).map((el) => {
        const r = el.getBoundingClientRect()
        // Leaders stop at the start of the tag row so they never strike through text.
        const row = (el.parentElement ?? el).getBoundingClientRect()
        return {
          skill: el.dataset.skill!,
          kind: el.dataset.skillKind as Anchor['kind'],
          y: r.top - box.top + r.height / 2,
          left: row.left - box.left,
        }
      })
      const stops = layers.flatMap((l) => {
        const sec = document.getElementById(l.id)
        if (!sec) return []
        const top = (sec.getBoundingClientRect().top - box.top) / box.height
        const color = getComputedStyle(sec).getPropertyValue('--accent').trim()
        return [{ offset: Math.max(0, top), color }]
      })
      setGeo({ height: box.height, anchors, stops })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(main)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  // Fill the thread down to the drill line without re-rendering React.
  useEffect(() => {
    const main = root.current?.parentElement
    const group = fill.current
    if (!main || !group || !geo.height) return
    let frame = 0
    const update = () => {
      frame = 0
      const probe = window.innerHeight * 0.5 - main.getBoundingClientRect().top
      group.style.setProperty('--fill', String(geo.height - Math.max(0, Math.min(geo.height, probe))))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [geo.height])

  const { height, anchors, stops } = geo

  const origin = anchors.find((a) => a.skill === active && a.kind === 'origin')
  const resurfaced = anchors.filter((a) => a.skill === active && a.kind === 'resurface')

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden md:block">
      {height > 0 && (
        <svg className="absolute inset-x-0 top-0 w-full" style={{ height }}>
          <defs>
            <linearGradient id="thread-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={height}>
              {stops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
            <filter id="thread-glow" x="-200%" y="-1%" width="500%" height="102%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Unfilled thread */}
          <line x1={X} y1="0" x2={X} y2={height} stroke="url(#thread-grad)" strokeOpacity="0.18" strokeWidth="1" />
          {/* Filled thread + glow; --fill is set on scroll */}
          <g ref={fill} style={{ strokeDasharray: height, strokeDashoffset: 'var(--fill)' }}>
            <path d={`M${X} 0V${height}`} stroke="url(#thread-grad)" strokeWidth="4" opacity="0.5" filter="url(#thread-glow)" />
            <path d={`M${X} 0V${height}`} stroke="url(#thread-grad)" strokeWidth="1.5" />
          </g>

          {/* Skill nodes with faint leaders to their tags */}
          {anchors.map((a, i) => {
            const on = a.skill === active
            return (
              <g key={i} className="transition-opacity duration-300" opacity={active && !on ? 0.25 : 1}>
                <line
                  x1={X}
                  y1={a.y}
                  x2={a.left - 6}
                  y2={a.y}
                  stroke="url(#thread-grad)"
                  strokeOpacity={on ? 0.9 : 0.25}
                  strokeDasharray="2 4"
                />
                <rect
                  x={X - 4}
                  y={a.y - 4}
                  width="8"
                  height="8"
                  transform={`rotate(45 ${X} ${a.y})`}
                  fill={a.kind === 'origin' ? 'url(#thread-grad)' : '#000'}
                  stroke="url(#thread-grad)"
                  strokeWidth="1.5"
                />
              </g>
            )
          })}

          {/* Active skill: the thread lights up from each resurfacing down to its origin */}
          {origin &&
            resurfaced.map((r, i) => (
              <g key={i} stroke="var(--thread-hot, #fff)">
                <path d={`M${X} ${r.y}V${origin.y}`} strokeWidth="6" opacity="0.6" filter="url(#thread-glow)" pathLength={1} className="thread-arc" />
                <path d={`M${X} ${r.y}V${origin.y}`} strokeWidth="2" pathLength={1} className="thread-arc" />
              </g>
            ))}
        </svg>
      )}
    </div>
  )
}
