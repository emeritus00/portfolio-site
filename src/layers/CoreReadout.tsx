import { useState } from 'react'
import { layerById } from '../content/layers'
import { profile } from '../content/profile'
import { CoreTray } from '../components/core/CoreTray'
import { LayerSection } from '../components/strata/LayerSection'
import { Fact } from '../components/ui/Fact'

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

/** Sheet 06: the sample is extracted and boxed, layer by layer, then the ways to reach me. */
export function CoreReadout() {
  const cvReady = !profile.cvPath.includes('[TODO]')

  return (
    <LayerSection layer={layerById.core} className="min-h-svh">
      <CoreTray />

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end">
        <h3 className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
          Sample extracted.
          <br />
          <span className="text-muted">Let’s build on it.</span>
        </h3>

        <div>
          <div className="flex flex-wrap items-center gap-3 border border-line p-4">
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
