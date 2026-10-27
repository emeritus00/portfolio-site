import { useMemo, useRef, useState } from 'react'
import { sediment } from '../content/chapters'
import { layerById } from '../content/layers'
import { LayerSection } from '../components/strata/LayerSection'
import { Fact } from '../components/ui/Fact'
import { useInView } from '../hooks/useInView'
import { mulberry32 } from '../lib/random'

const W = 400
const H = 300

/** Closed, irregular contour rings around a few summits: a generic survey map, not real terrain data. */
function contourRings(seed: number) {
  const rand = mulberry32(seed)
  const peaks = [
    // Spaced so no two rings ever cross: contours of real terrain never do.
    { x: 112, y: 104, levels: 6, step: 12 },
    { x: 300, y: 196, levels: 6, step: 11.5 },
  ]
  return peaks.flatMap((p) => {
    const a = rand() * 6
    const b = rand() * 6
    return Array.from({ length: p.levels }, (_, k) => {
      const r = (k + 1) * p.step
      const pts = Array.from({ length: 64 }, (_, i) => {
        const t = (i / 64) * Math.PI * 2
        const wobble = 1 + 0.16 * Math.sin(3 * t + a + k * 0.35) + 0.07 * Math.sin(5 * t + b - k * 0.2)
        return `${(p.x + Math.cos(t) * r * wobble * 1.25).toFixed(1)},${(p.y + Math.sin(t) * r * wobble).toFixed(1)}`
      })
      return { d: `M${pts.join('L')}Z`, index: k % 2 === 1 }
    })
  })
}

/** Sheet 03: environmental science. A contour map whose sampling stations are the methods I still use. */
export function Sediment() {
  const mapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(mapRef)
  const rings = useMemo(() => contourRings(41), [])
  const [selected, setSelected] = useState(sediment.stations[0].id)
  const station = sediment.stations.find((s) => s.id === selected)!

  return (
    <LayerSection layer={layerById.sediment}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* ---------- Map ---------- */}
        <figure className="border border-line bg-bg-2/70">
          <figcaption className="mono-label flex justify-between border-b border-line px-4 py-3 text-muted">
            <span>Fig. 3 · Sampling map</span>
            <span className="text-accent-2">Schematic</span>
          </figcaption>
          <div ref={mapRef} className={`relative aspect-[4/3] ${inView ? 'is-drawn' : ''}`}>
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
              {rings.map((r, i) => (
                <path
                  key={i}
                  d={r.d}
                  pathLength={1}
                  fill="none"
                  stroke="var(--accent-2)"
                  strokeOpacity={r.index ? 0.75 : 0.35}
                  strokeWidth={r.index ? 1.2 : 0.7}
                  className="contour-draw"
                  style={{ transitionDelay: `${(i % 7) * 90}ms` }}
                />
              ))}
              {/* Traverse linking the stations in sampling order */}
              <path
                d={`M${sediment.stations.map((s) => `${(s.x / 100) * W},${(s.y / 100) * H}`).join('L')}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="3 5"
                opacity="0.7"
              />
            </svg>

            {sediment.stations.map((s) => {
              const on = s.id === selected
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelected(s.id)}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <span
                    className={`block h-3.5 w-3.5 rotate-45 border-2 border-accent transition-all ${
                      on ? 'scale-125 bg-accent' : 'bg-bg group-hover:bg-accent/50'
                    }`}
                  />
                  <span className="mono-label absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap pl-1 text-fg">
                    {s.code}
                  </span>
                </button>
              )
            })}
          </div>
        </figure>

        {/* ---------- Readings ---------- */}
        <div className="flex flex-col gap-6">
          <div className="border border-line bg-bg p-5" aria-live="polite">
            <p className="mono-label text-accent">
              Reading · {station.code}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.01em]">{station.method}</p>
            <p className="mt-3 leading-relaxed text-muted">
              <Fact>{station.detail}</Fact>
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span className="mono-label text-muted">Resurfaces as</span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
              <span className="text-right font-medium text-accent">{station.becomes}</span>
            </div>
          </div>

          <ol className="grid grid-cols-2 gap-px border border-line bg-line">
            {sediment.stations.map((s) => (
              <li key={s.id} className="bg-bg">
                <button
                  type="button"
                  onClick={() => setSelected(s.id)}
                  aria-pressed={s.id === selected}
                  className={`w-full px-4 py-3 text-left transition-colors ${s.id === selected ? 'bg-bg-2' : 'hover:bg-bg-2'}`}
                >
                  <span className="mono-label block text-muted">{s.code}</span>
                  <span className="block">{s.method}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="border-l-2 border-accent-2 pl-4">
            <p className="mono-label text-accent-2">Research · {sediment.school}</p>
            <p className="mt-2 text-lg font-medium">
              <Fact>{sediment.research.title}</Fact>
            </p>
            <p className="mt-2 text-muted">
              <Fact>{sediment.research.focus}</Fact>
            </p>
          </div>
        </div>
      </div>
    </LayerSection>
  )
}
