import { useState } from 'react'
import { siteEdges, siteNodes, type SiteEdge } from '../../content/site'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Midpoint of the longest straight run of an orthogonal path, for its label. */
function labelPoint(d: string): [number, number, boolean] {
  const pts: [number, number][] = []
  let x = 0
  let y = 0
  for (const [, cmd, a, b] of d.matchAll(/([MHV])\s*(-?[\d.]+)(?:\s+(-?[\d.]+))?/g)) {
    if (cmd === 'M') [x, y] = [Number(a), Number(b)]
    if (cmd === 'H') x = Number(a)
    if (cmd === 'V') y = Number(a)
    pts.push([x, y])
  }
  let best: [number, number, boolean] = [pts[0][0], pts[0][1], true]
  let len = -1
  for (let i = 1; i < pts.length; i++) {
    const [[x1, y1], [x2, y2]] = [pts[i - 1], pts[i]]
    const l = Math.abs(x2 - x1) + Math.abs(y2 - y1)
    if (l > len) {
      len = l
      best = [(x1 + x2) / 2, (y1 + y2) / 2, y1 === y2]
    }
  }
  return best
}

const pathId = (e: SiteEdge) => `fig1-${e.id}`

/** A packet that runs along an edge once per `cycle` seconds, then hides. */
function Packet({ edge, begin, travel, cycle, reverse, color = 'var(--accent)' }: {
  edge: string
  begin: number
  travel: number
  cycle: number
  reverse?: boolean
  color?: string
}) {
  const f = (travel / cycle).toFixed(3)
  return (
    <circle r="3.2" fill={color} opacity="0">
      <animateMotion
        dur={`${cycle}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        keyPoints={reverse ? '1;0;0' : '0;1;1'}
        keyTimes={`0;${f};1`}
        calcMode="linear"
      >
        <mpath href={`#fig1-${edge}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        dur={`${cycle}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        values="1;1;0;0"
        keyTimes={`0;${f};${Math.min(0.999, Number(f) + 0.001)};1`}
      />
    </circle>
  )
}

/**
 * Fig. 1: this site's own AWS architecture, drawn like a survey plate.
 * Lines ink themselves in, packets show request/response and deploy traffic,
 * and every node can be hovered, focused or tapped to read what it does.
 */
export function ArchitecturePlate() {
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const active = hover ?? pinned
  const activeNode = siteNodes.find((n) => n.id === active)

  return (
    <figure className="relative">
      <svg viewBox="0 0 560 440" className="h-auto w-full overflow-visible" role="group" aria-labelledby="fig1-caption">
        <defs>
          <pattern id="fig1-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Plate frame */}
        <rect x="-12" y="8" width="584" height="424" fill="var(--bg)" opacity="0.88" />
        <rect x="-12" y="8" width="584" height="424" fill="url(#fig1-grid)" opacity="0.6" />
        <rect x="-12" y="8" width="584" height="424" fill="none" stroke="var(--line)" />
        {[[-12, 8], [572, 8], [-12, 432], [572, 432]].map(([x, y]) => (
          <path key={`${x}${y}`} d={`M${x - 6} ${y}h12M${x} ${y - 6}v12`} stroke="var(--accent)" strokeWidth="1" />
        ))}

        {/* Edges */}
        {siteEdges.map((e, i) => {
          const lit = active && (e.from === active || e.to === active)
          const [lx, ly, horizontal] = labelPoint(e.d)
          return (
            <g key={e.id} className="transition-opacity duration-300" opacity={active && !lit ? 0.3 : 1}>
              <path
                id={pathId(e)}
                d={e.d}
                pathLength={1}
                fill="none"
                stroke={lit ? 'var(--accent)' : e.control ? 'var(--muted)' : 'var(--accent-2)'}
                strokeWidth={lit ? 1.6 : 1}
                strokeDasharray={e.control ? '0.012 0.012' : '1'}
                className={e.control ? 'plate-fade' : 'plate-draw'}
                style={{ animationDelay: `${0.25 + i * 0.12}s` }}
              />
              {e.label && (
                <text
                  x={horizontal ? lx : lx + 6}
                  y={horizontal ? ly - 6 : ly}
                  textAnchor={horizontal ? 'middle' : 'start'}
                  className="plate-fade fill-muted font-mono text-[10px] uppercase tracking-[0.1em]"
                  style={{ animationDelay: `${0.9 + i * 0.12}s` }}
                >
                  {e.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Traffic */}
        {!reduced && (
          <g aria-hidden="true">
            <Packet edge="e-req" begin={2} travel={1.1} cycle={3.6} />
            <Packet edge="e-origin" begin={3.1} travel={1} cycle={3.6} />
            <Packet edge="e-origin" begin={4.2} travel={1} cycle={3.6} reverse color="var(--fg)" />
            <Packet edge="e-req" begin={5.2} travel={1.1} cycle={3.6} reverse color="var(--fg)" />
            <Packet edge="e-deploy" begin={3.5} travel={1.4} cycle={9} color="var(--accent-2)" />
            <Packet edge="e-inval" begin={5} travel={1.6} cycle={9} color="var(--accent-2)" />
          </g>
        )}

        {/* Nodes */}
        {siteNodes.map((n, i) => {
          const on = n.id === active
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-label={`${n.label}. ${n.role}`}
              aria-pressed={pinned === n.id}
              onPointerEnter={() => setHover(n.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              onClick={() => setPinned((p) => (p === n.id ? null : n.id))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setPinned((p) => (p === n.id ? null : n.id))
                }
              }}
              className="plate-fade cursor-pointer outline-none [&:focus-visible>circle:first-of-type]:stroke-[3]"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <circle cx={n.x} cy={n.y} r="22" fill="transparent" />
              <circle
                cx={n.x}
                cy={n.y}
                r={on ? 9 : 7}
                fill={on ? 'var(--accent)' : 'var(--bg)'}
                stroke="var(--accent)"
                strokeWidth="1.4"
                className="transition-all duration-300"
              />
              <path d={`M${n.x - 13} ${n.y}h6m12 0h6M${n.x} ${n.y - 13}v6m0 12v6`} stroke="var(--accent)" strokeWidth="1" />
              <text x={n.x} y={n.y - 19} textAnchor="middle" className="fill-muted font-mono text-[10px] tracking-[0.12em]">
                {n.tag}
              </text>
              <text x={n.x} y={n.y + 30} textAnchor="middle" className="fill-fg font-display text-[15px] font-medium">
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>

      <figcaption id="fig1-caption" className="mt-3 min-h-[3.5rem] border-l-2 border-accent pl-3 text-sm leading-snug">
        <span className="mono-label block text-accent">
          Fig. 1 · {activeNode ? `${activeNode.tag} ${activeNode.label}` : 'This page, as deployed'}
        </span>
        <span className="mt-1 block text-muted" aria-live="polite">
          {activeNode ? activeNode.role : 'S3 + CloudFront + ACM, provisioned with Terraform. Select a marker to inspect it.'}
        </span>
      </figcaption>
    </figure>
  )
}
