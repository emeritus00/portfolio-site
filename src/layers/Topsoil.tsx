import { layerById } from '../content/layers'
import { projects, statusLabel } from '../content/projects'
import { LayerSection } from '../components/strata/LayerSection'

/** Stage 1: project index from content. Stage 3 turns these into inspectable cards. */
export function Topsoil() {
  return (
    <LayerSection layer={layerById.topsoil}>
      <h3 className="mono-label mb-4 text-muted">Core samples · {projects.length} projects</h3>
      <ol className="divide-y divide-line border-y border-line">
        {projects.map((p, i) => (
          <li key={p.slug} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline">
            <span className="mono-label text-muted">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <p className="text-xl font-medium">{p.name}</p>
              <p className="text-muted">{p.tagline}</p>
            </div>
            <span className="mono-label w-fit border border-line px-2 py-1 text-accent">{statusLabel[p.status]}</span>
          </li>
        ))}
      </ol>
    </LayerSection>
  )
}
