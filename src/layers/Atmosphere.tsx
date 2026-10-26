import { layerById } from '../content/layers'
import { profile } from '../content/profile'
import { LayerSection } from '../components/strata/LayerSection'
import { scrollToLayer } from '../motion/scroll'

/** Stage 1 placeholder hero. Stage 2 adds the survey-plate architecture graph and greeting. */
export function Atmosphere() {
  return (
    <LayerSection layer={layerById.atmosphere} bare className="min-h-svh">
      <div className="flex min-h-[calc(100svh-8rem)] flex-col justify-end pt-16">
        <p className="mono-label text-accent">Sheet 01 / 06 · {profile.role} · {profile.location}</p>
        <h1
          id="atmosphere-title"
          className="mt-4 text-[clamp(3rem,11vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.045em]"
        >
          Adewale
          <br />
          Gbadamosi
        </h1>
        <p className="mt-8 max-w-3xl text-[clamp(1.25rem,2.6vw,2rem)] leading-snug text-muted">
          {profile.thesis.map((line, i) => (
            <span key={line} className={i === profile.thesis.length - 1 ? 'text-fg' : undefined}>
              {line}{' '}
            </span>
          ))}
        </p>

        <button
          type="button"
          onClick={() => scrollToLayer('topsoil')}
          className="mono-label group mt-14 inline-flex w-fit items-center gap-3 text-muted hover:text-fg"
        >
          <svg width="14" height="18" viewBox="0 0 18 22" aria-hidden="true" className="text-accent motion-safe:animate-bounce">
            <path d="M2 0h14v8l-7 14-7-14z" fill="currentColor" />
          </svg>
          Drill down · ±0 m
        </button>
      </div>
    </LayerSection>
  )
}
