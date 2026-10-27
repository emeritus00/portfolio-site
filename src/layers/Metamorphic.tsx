import { useRef } from 'react'
import { metamorphic } from '../content/chapters'
import { layerById } from '../content/layers'
import { LayerSection } from '../components/strata/LayerSection'
import { Fact } from '../components/ui/Fact'
import { useInView } from '../hooks/useInView'

/** Analogue dial: the needle swings, overshoots and settles inside the tolerance band. */
function ToleranceGauge({ live }: { live: boolean }) {
  const ticks = Array.from({ length: 41 }, (_, i) => -90 + i * 4.5)
  return (
    <figure className="border border-line bg-bg-2 p-5">
      <svg viewBox="0 0 240 150" className="mx-auto w-full max-w-[22rem]" aria-hidden="true">
        {/* tolerance band */}
        <path d="M76 53.8 A88 88 0 0 1 164 53.8" fill="none" stroke="var(--accent)" strokeWidth="10" opacity="0.35" />
        {ticks.map((a, i) => {
          const r1 = i % 5 === 0 ? 72 : 78
          const rad = ((a - 90) * Math.PI) / 180
          return (
            <line
              key={a}
              x1={120 + Math.cos(rad) * r1}
              y1={130 + Math.sin(rad) * r1}
              x2={120 + Math.cos(rad) * 86}
              y2={130 + Math.sin(rad) * 86}
              stroke={i % 5 === 0 ? 'var(--fg)' : 'var(--muted)'}
              strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
            />
          )
        })}
        <text x="34" y="146" className="fill-muted font-mono text-[9px]">LSL</text>
        <text x="190" y="146" className="fill-muted font-mono text-[9px]">USL</text>
        <text x="120" y="28" textAnchor="middle" className="fill-accent font-mono text-[9px] tracking-[0.14em]">
          NOMINAL
        </text>
        <g className={`needle ${live ? 'needle-settle' : ''}`}>
          <line x1="120" y1="130" x2="120" y2="52" stroke="var(--accent)" strokeWidth="2" />
        </g>
        <circle cx="120" cy="130" r="6" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
      </svg>
      <figcaption className="mt-2 flex items-center justify-between">
        <span className="mono-label text-muted">Fig. 4 · Tolerance</span>
        <span className={`mono-label transition-colors duration-700 ${live ? 'text-accent' : 'text-muted'}`}>
          {live ? 'Within spec' : 'Measuring…'}
        </span>
      </figcaption>
    </figure>
  )
}

/** Sheet 04: automotive QC. Industrial texture, a gauge, and an inspection checklist that ticks itself. */
export function Metamorphic() {
  const ref = useRef<HTMLDivElement>(null)
  const live = useInView(ref, { threshold: 0.35 })

  return (
    <LayerSection layer={layerById.metamorphic}>
      <div ref={ref} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="flex flex-col gap-6">
          <ToleranceGauge live={live} />
          <dl className="mono-label grid grid-cols-[6rem_1fr] gap-y-2 border border-line p-4">
            <dt className="text-muted">Role</dt>
            <dd>
              <Fact>{metamorphic.role}</Fact>
            </dd>
            <dt className="text-muted">Employer</dt>
            <dd>
              <Fact>{metamorphic.employer}</Fact>
            </dd>
          </dl>
          <p className="leading-relaxed text-muted">{metamorphic.summary}</p>
        </div>

        <div className="relative border border-line bg-bg-2">
          {/* hazard edge */}
          <div
            aria-hidden="true"
            className="h-2.5"
            style={{ background: 'repeating-linear-gradient(135deg, var(--accent) 0 10px, transparent 10px 20px)' }}
          />
          <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
            <h3 className="mono-label text-fg">Inspection checklist · QC-01</h3>
            <span className="mono-label text-muted" aria-hidden="true">
              Then → Now
            </span>
          </div>
          <ol>
            {metamorphic.checklist.map((item, i) => (
              <li key={item.label} className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[2rem_1fr_1fr]">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid h-6 w-6 place-items-center border-2 border-accent-2"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4">
                    <path
                      d="M3 8.5l3.2 3L13 4.5"
                      pathLength={1}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.4"
                      strokeLinecap="square"
                      className={`tick ${live ? 'tick-on' : ''}`}
                      style={{ transitionDelay: live ? `${0.6 + i * 0.4}s` : '0s' }}
                    />
                  </svg>
                </span>
                <span className="font-medium leading-snug">{item.label}</span>
                <span className="col-start-2 mt-1 text-sm text-muted sm:col-start-3 sm:mt-0">→ {item.today}</span>
              </li>
            ))}
          </ol>
          <p className="sr-only">All checklist items pass.</p>
        </div>
      </div>
    </LayerSection>
  )
}
