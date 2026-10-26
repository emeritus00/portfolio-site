import { layerById } from '../content/layers'
import { profile } from '../content/profile'
import { LayerSection } from '../components/strata/LayerSection'

/** Stage 1: plain contact. Stage 4 adds the extracted 3D core cylinder. */
export function CoreReadout() {
  const links = [
    { label: 'Email', href: `mailto:${profile.email}`, text: profile.email },
    { label: 'GitHub', href: profile.links.github, text: 'github.com/emeritus00' },
    { label: 'LinkedIn', href: profile.links.linkedin, text: 'in/adewale-gbadamosi' },
  ]
  return (
    <LayerSection layer={layerById.core} className="min-h-svh">
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {links.map((l) => (
          <li key={l.label} className="bg-bg">
            <a
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="block p-6 transition-colors hover:bg-bg-2"
            >
              <span className="mono-label text-muted">{l.label}</span>
              <span className="mt-2 block break-all text-lg">{l.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </LayerSection>
  )
}
