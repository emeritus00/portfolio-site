import { useMemo, useState } from 'react'
import type { ArchNode, ArchNodeKind, Project } from '../../content/projects'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Fact } from '../ui/Fact'
import { Packet } from './Packet'

/** Left-to-right request order: clients on the left, storage and cloud on the right. */
const rankOf: Record<ArchNodeKind, number> = { client: 0, edge: 1, api: 2, service: 3, external: 3, data: 4, cloud: 4 }

const NODE_W = 144
const NODE_H = 50
const PAD = 18
// Gap between ranks along the flow axis, and between siblings across it.
const FLOW_GAP = { horizontal: 84, vertical: 54 }
const CROSS_GAP = 22

interface Placed extends ArchNode {
  x: number
  y: number
  rank: number
}

/**
 * Lay nodes out by rank. Wide screens flow left → right; narrow screens
 * flow top → bottom so labels stay readable instead of shrinking.
 */
function layout(nodes: ArchNode[], vertical: boolean) {
  const ranks = [...new Set(nodes.map((n) => rankOf[n.kind]))].sort((a, b) => a - b)
  const groups = ranks.map((r) => nodes.filter((n) => rankOf[n.kind] === r))
  const most = Math.max(...groups.map((g) => g.length))
  const flowStep = vertical ? NODE_H + FLOW_GAP.vertical : NODE_W + FLOW_GAP.horizontal
  const crossStep = (vertical ? NODE_W : NODE_H) + CROSS_GAP

  const placed: Placed[] = groups.flatMap((group, gi) =>
    group.map((n, i) => {
      const flow = PAD + gi * flowStep
      // centre each rank across the cross axis
      const cross = PAD + (most - group.length) * (crossStep / 2) + i * crossStep
      return { ...n, rank: gi, x: vertical ? cross : flow, y: vertical ? flow : cross }
    }),
  )
  const flowLen = PAD * 2 + (groups.length - 1) * flowStep + (vertical ? NODE_H : NODE_W)
  const crossLen = PAD * 2 + most * crossStep - CROSS_GAP
  return vertical
    ? { placed, width: crossLen, height: flowLen }
    : { placed, width: flowLen, height: crossLen }
}

function edgePath(a: Placed, b: Placed, vertical: boolean) {
  if (vertical) {
    const down = a.y <= b.y
    const sx = a.x + NODE_W / 2
    const tx = b.x + NODE_W / 2
    const sy = down ? a.y + NODE_H : a.y
    const ty = down ? b.y : b.y + NODE_H
    const my = (sy + ty) / 2
    return { d: `M${sx} ${sy} V${my} H${tx} V${ty}`, lx: Math.max(sx, tx) + 6, ly: my - 4, anchor: 'start' as const }
  }
  const forward = a.x <= b.x
  const sx = forward ? a.x + NODE_W : a.x
  const tx = forward ? b.x : b.x + NODE_W
  const sy = a.y + NODE_H / 2
  const ty = b.y + NODE_H / 2
  const mx = (sx + tx) / 2
  return { d: `M${sx} ${sy} H${mx} V${ty} H${tx}`, lx: mx, ly: Math.min(sy, ty) - 6, anchor: 'middle' as const }
}

/**
 * Live architecture diagram for a project. Packets flow client → API → data;
 * selecting a component explains the decision behind it.
 */
export function ArchDiagram({ project }: { project: Project }) {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<string | null>(null)
  const vertical = useMediaQuery('(max-width: 639px)')
  const { placed, width, height } = useMemo(() => layout(project.architecture.nodes, vertical), [project, vertical])
  const byId = Object.fromEntries(placed.map((n) => [n.id, n]))
  const current = placed.find((n) => n.id === selected)
  const pid = (i: number) => `${project.slug}-edge-${i}`
  const captionId = `${project.slug}-arch-caption`

  return (
    <figure className="flex h-full flex-col border border-line bg-bg/80">
      <figcaption className="mono-label flex items-center justify-between gap-4 border-b border-line px-4 py-3 text-muted">
        <span>Architecture · {project.name}</span>
        <span aria-hidden="true" className="text-accent">
          {reduced ? 'static' : 'live'}
        </span>
      </figcaption>

      <div className="flex flex-1 items-center px-2 py-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto h-auto w-full max-w-[46rem] max-sm:max-w-[26rem]"
          role="group"
          aria-label={`Architecture diagram of ${project.name}`}
          aria-describedby={captionId}
        >
          {project.architecture.edges.map((e, i) => {
            const a = byId[e.from]
            const b = byId[e.to]
            if (!a || !b) return null
            const { d, lx, ly, anchor } = edgePath(a, b, vertical)
            const lit = selected && (e.from === selected || e.to === selected)
            return (
              <g key={pid(i)} opacity={selected && !lit ? 0.35 : 1} className="transition-opacity duration-300">
                <path
                  id={pid(i)}
                  d={d}
                  fill="none"
                  stroke={lit ? 'var(--accent)' : 'var(--muted)'}
                  strokeOpacity={lit ? 1 : 0.6}
                  strokeWidth={lit ? 1.6 : 1}
                />
                {e.label && (
                  <text x={lx} y={ly} textAnchor={anchor} className="fill-muted font-mono text-[10px] uppercase tracking-[0.08em]">
                    {e.label}
                  </text>
                )}
                {!reduced && (
                  <Packet path={pid(i)} begin={0.4 + a.rank * 0.9} travel={0.9} cycle={3.6} reverse={vertical ? a.y > b.y : a.x > b.x} />
                )}
              </g>
            )
          })}

          {placed.map((n) => {
            const on = n.id === selected
            const select = () => setSelected((s) => (s === n.id ? null : n.id))
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${n.label} (${n.kind})`}
                onClick={select}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    select()
                  }
                }}
                className="group cursor-pointer outline-none"
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="3"
                  fill={on ? 'var(--accent)' : 'var(--bg-2)'}
                  stroke={on ? 'var(--accent)' : 'var(--line)'}
                  strokeWidth="1.2"
                  className="transition-colors duration-200 group-hover:stroke-[var(--accent)] group-focus-visible:stroke-[var(--accent)] group-focus-visible:[stroke-width:2.5]"
                />
                <text
                  x={n.x + 10}
                  y={n.y + 17}
                  className={`font-mono text-[9px] uppercase tracking-[0.14em] ${on ? 'fill-bg' : 'fill-muted'}`}
                >
                  {n.kind}
                </text>
                <text x={n.x + 10} y={n.y + 36} className={`font-display text-[13px] font-medium ${on ? 'fill-bg' : 'fill-fg'}`}>
                  {n.label.length > 19 ? `${n.label.slice(0, 18)}…` : n.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div id={captionId} className="min-h-[5.5rem] border-t border-line px-4 py-3 text-sm leading-relaxed" aria-live="polite">
        {current ? (
          <>
            <p className="mono-label text-accent">Decision · {current.label}</p>
            <p className="mt-1 text-fg">
              <Fact>{current.decision}</Fact>
            </p>
          </>
        ) : (
          <>
            <p className="mono-label text-muted">Decision log</p>
            <p className="mt-1 text-muted">Select a component to see why it’s there.</p>
          </>
        )}
      </div>
    </figure>
  )
}
