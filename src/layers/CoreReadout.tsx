import { lazy, Suspense, useRef, useState, type PointerEvent } from 'react'
import { layerById, layers, type LayerId } from '../content/layers'
import { profile } from '../content/profile'
import { CoreSampleFlat } from '../components/core/CoreSampleFlat'
import type { DragState } from '../components/core/CoreSample3D'
import { LayerSection } from '../components/strata/LayerSection'
import { Fact } from '../components/ui/Fact'
import { formatDepth } from '../hooks/useDepth'
import { useInView } from '../hooks/useInView'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollToLayer } from '../motion/scroll'

const CoreSample3D = lazy(() => import('../components/core/CoreSample3D'))

const hasWebGL = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          window.location.href = `mailto:${profile.email}`
        }
      }}
      className="mono-label border border-line px-3 py-2 text-muted hover:border-accent hover:text-fg"
    >
      <span aria-live="polite">{copied ? 'Copied ✓' : 'Copy'}</span>
    </button>
  )
}

/** Sheet 06: the sample is extracted. Every layer in one cylinder, then the ways to reach me. */
export function CoreReadout() {
  const stage = useRef<HTMLDivElement>(null)
  const near = useInView(stage, { rootMargin: '600px', threshold: 0 })
  const visible = useInView(stage, { once: false, threshold: 0.05 })
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 768px)')
  const [highlight, setHighlight] = useState<LayerId | null>(null)
  const drag = useRef<DragState>({ velocity: 0 })
  const lastX = useRef<number | null>(null)
  const use3D = wide && !reduced && near && hasWebGL()

  const onPointerMove = (e: PointerEvent) => {
    if (lastX.current === null) return
    drag.current.velocity += (e.clientX - lastX.current) * 0.06
    lastX.current = e.clientX
  }

  const drilled = layers.filter((l) => l.id !== 'core')
  const cvReady = !profile.cvPath.includes('[TODO]')

  return (
    <LayerSection layer={layerById.core} className="min-h-svh">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center">
        {/* ---------- The sample ---------- */}
        <div
          ref={stage}
          className={`relative h-[22rem] touch-pan-y select-none md:h-[34rem] ${use3D ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onPointerDown={(e) => (lastX.current = e.clientX)}
          onPointerMove={onPointerMove}
          onPointerUp={() => (lastX.current = null)}
          onPointerLeave={() => (lastX.current = null)}
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-line" aria-hidden="true" />
          {use3D ? (
            <Suspense fallback={<CoreSampleFlat highlight={highlight} />}>
              <CoreSample3D highlight={highlight} live={visible} drag={drag} />
            </Suspense>
          ) : (
            <CoreSampleFlat highlight={highlight} />
          )}
          <p className="mono-label absolute bottom-3 left-0 text-muted">
            Sample AG-01 · {formatDepth(1400)} {use3D && '· drag to rotate'}
          </p>
        </div>

        {/* ---------- Readout ---------- */}
        <div>
          <h3 className="mono-label text-accent">Core log</h3>
          <ol className="mt-4 border-t border-line">
            {drilled.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => scrollToLayer(l.id)}
                  onPointerEnter={() => setHighlight(l.id)}
                  onPointerLeave={() => setHighlight(null)}
                  onFocus={() => setHighlight(l.id)}
                  onBlur={() => setHighlight(null)}
                  className="group grid w-full grid-cols-[0.75rem_1fr_auto] items-center gap-4 border-b border-line py-3 text-left"
                >
                  <span data-layer={l.id} aria-hidden="true" className="h-full min-h-8 w-full bg-accent" />
                  <span>
                    <span className="block font-medium group-hover:text-accent">{l.chapter}</span>
                    <span className="mono-label text-muted">{l.name}</span>
                  </span>
                  <span className="mono-label text-right text-muted tabular-nums">
                    {l.depthEnd ? `${formatDepth(l.depthStart)} → ${formatDepth(l.depthEnd)}` : 'Above ground'}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <h3 className="mt-14 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Sample extracted.
            <br />
            <span className="text-muted">Let’s build on it.</span>
          </h3>

          <div className="mt-8 flex flex-wrap items-center gap-3 border border-line p-4">
            <a href={`mailto:${profile.email}`} className="mr-auto break-all text-lg underline decoration-line underline-offset-4 hover:decoration-accent">
              {profile.email}
            </a>
            <CopyEmail />
          </div>

          <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-3">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="bg-bg p-4 hover:bg-bg-2">
              <span className="mono-label block text-muted">GitHub</span>
              emeritus00 ↗
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="bg-bg p-4 hover:bg-bg-2">
              <span className="mono-label block text-muted">LinkedIn</span>
              Adewale Gbadamosi ↗
            </a>
            {cvReady ? (
              <a href={profile.cvPath} download className="bg-accent p-4 text-bg hover:opacity-90">
                <span className="mono-label block opacity-80">Résumé</span>
                Download CV ↓
              </a>
            ) : (
              <span className="bg-bg p-4">
                <span className="mono-label block text-muted">Résumé</span>
                <Fact>{profile.cvPath}</Fact>
              </span>
            )}
          </div>
        </div>
      </div>
    </LayerSection>
  )
}
