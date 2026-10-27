import type { LayerId } from '../../content/layers'
import { hatchStyle } from '../../lib/hatches'
import { segments } from './segments'

/**
 * The core sample without WebGL: a stacked CSS cylinder. Used on phones, with
 * reduced motion, and while the 3D version loads.
 */
export function CoreSampleFlat({ highlight }: { highlight: LayerId | null }) {
  return (
    <div aria-hidden="true" className="mx-auto flex h-full max-h-[30rem] w-36 flex-col py-6 sm:w-44">
      <div data-layer="atmosphere" className="relative z-10 h-6 shrink-0 rounded-[50%] border border-line bg-bg-2" />
      {segments.map((s, i) => (
        <div
          key={s.id}
          data-layer={s.id}
          className={`relative -mt-3 overflow-hidden border-x border-line bg-bg-2 transition-[filter] duration-300 ${
            i === segments.length - 1 ? 'rounded-b-[50%_1.5rem]' : ''
          } ${highlight === s.id ? 'brightness-150' : ''}`}
          style={{ flexGrow: s.share, flexBasis: 0, minHeight: '2.25rem' }}
        >
          <div className="absolute inset-0" style={hatchStyle(s.hatch, s.id === 'atmosphere' ? 'var(--accent)' : 'var(--accent-2)')} />
          {/* cylindrical shading */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.55),transparent_35%,rgb(255_255_255/0.08)_55%,rgb(0_0_0/0.6))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-accent opacity-60" />
        </div>
      ))}
    </div>
  )
}
