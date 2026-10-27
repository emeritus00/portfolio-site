import type { ReactNode } from 'react'
import { layers, type Layer } from '../../content/layers'
import { formatDepth } from '../../hooks/useDepth'
import { hatchStyle } from '../../lib/hatches'
import { Boundary } from './Boundary'

interface Props {
  layer: Layer
  children?: ReactNode
  /** Hide the survey title block (the hero draws its own). */
  bare?: boolean
  /** Extra decorative layer drawn behind the content (e.g. hero contours). */
  backdrop?: ReactNode
  className?: string
}

/**
 * One stratum of the core. Sets data-layer so every token inside re-skins,
 * draws the boundary from the layer above, the legend texture, and a survey
 * "title block" header.
 */
export function LayerSection({ layer, children, bare, backdrop, className = '' }: Props) {
  const index = layers.findIndex((l) => l.id === layer.id)
  const prev = index > 0 ? layers[index - 1] : undefined
  const headingId = `${layer.id}-title`

  return (
    <section
      id={layer.id}
      data-layer={layer.id}
      data-depth-start={layer.depthStart}
      data-depth-end={layer.depthEnd}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={`relative bg-bg text-fg outline-none ${className}`}
    >
      {prev && <Boundary from={prev} to={layer} seed={index * 7919} />}

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        >
          <div className="absolute inset-0" style={hatchStyle(layer.hatch)} />
        </div>
        {backdrop}

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-8 md:pl-12 md:pr-[calc(var(--gauge-w)+2rem)] lg:pb-32">
          {!bare && (
            <header className="mb-12 grid gap-6 border-t border-line pt-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="mono-label text-accent">
                  Sheet {String(index + 1).padStart(2, '0')} / {String(layers.length).padStart(2, '0')} · {layer.name}
                </p>
                <h2
                  id={headingId}
                  className="mt-3 text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
                >
                  {layer.chapter}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{layer.summary}</p>
              </div>
              <dl className="mono-label grid grid-cols-2 gap-x-6 gap-y-2 border border-line p-4 text-muted md:min-w-64">
                <dt>Depth</dt>
                <dd className="text-right text-fg">
                  {layer.depthStart === layer.depthEnd
                    ? formatDepth(layer.depthStart)
                    : `${formatDepth(layer.depthStart)} → ${formatDepth(layer.depthEnd)}`}
                </dd>
                <dt>Era</dt>
                <dd className="text-right text-fg">{layer.era}</dd>
                {layer.hatch !== 'none' && (
                  <>
                  <dt>Legend</dt>
                  <dd className="flex justify-end">
                    <span className="block h-4 w-12 border border-line">
                      <span className="block h-full w-full" style={hatchStyle(layer.hatch, 'var(--accent-2)')} />
                    </span>
                  </dd>
                  </>
                )}
              </dl>
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
