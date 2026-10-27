import { layerById } from '../content/layers'
import { profile } from '../content/profile'
import { ArchitecturePlate } from '../components/hero/ArchitecturePlate'
import { Contours } from '../components/hero/Contours'
import { TitleBlock } from '../components/hero/TitleBlock'
import { LayerSection } from '../components/strata/LayerSection'
import { useClock } from '../hooks/useClock'
import { askAssistant } from '../lib/assistant/bus'
import { scrollToLayer } from '../motion/scroll'

/**
 * Sheet 01: the cloud layer. A survey plate of this site's own AWS
 * architecture, your greeting in your own time, and Adewale's in Newfoundland.
 */
export function Atmosphere() {
  const clock = useClock(profile.timeZone)

  return (
    <LayerSection layer={layerById.atmosphere} bare className="min-h-svh overflow-hidden" backdrop={<Contours />}>
      <div className="grid min-h-[calc(100svh-4rem)] items-center gap-12 pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
        <div className="flex flex-col justify-center">
          <p className="mono-label text-accent">
            <span className="text-fg">{clock.greeting}.</span> It’s {clock.homeTime} in Newfoundland · {clock.relation}
          </p>

          <h1
            id="atmosphere-title"
            className="mt-5 text-[clamp(3.25rem,10.5vw,8.75rem)] font-semibold leading-[0.86] tracking-[-0.045em] lg:text-[clamp(3.25rem,7.4vw,8.75rem)]"
          >
            Adewale
            <br />
            Gbadamosi
          </h1>

          <p className="mt-8 max-w-xl text-[clamp(1.25rem,2.4vw,1.85rem)] leading-[1.2] tracking-[-0.01em]">
            {profile.thesis.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span
                  className={`rise block ${i === profile.thesis.length - 1 ? 'text-accent' : 'text-muted'}`}
                  style={{ animationDelay: `${0.35 + i * 0.14}s` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </p>

          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-muted">
            {profile.role} in {profile.location}. {profile.edge}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToLayer('topsoil')}
              className="mono-label group inline-flex w-fit items-center gap-3 border border-line py-3 pl-3 pr-4 text-fg transition-colors hover:border-accent"
            >
              <svg width="12" height="16" viewBox="0 0 18 22" aria-hidden="true" className="text-accent motion-safe:animate-bounce">
                <path d="M2 0h14v8l-7 14-7-14z" fill="currentColor" />
              </svg>
              Drill into the work
            </button>
            <button
              type="button"
              onClick={() => askAssistant()}
              className="mono-label inline-flex w-fit items-center gap-2 border border-line py-3 pl-3 pr-4 text-muted transition-colors hover:border-accent hover:text-fg"
            >
              <span aria-hidden="true" className="text-accent">✦</span>
              Ask about my work
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-8 lg:pb-0">
          <ArchitecturePlate />
          <TitleBlock />
        </div>
      </div>
    </LayerSection>
  )
}
