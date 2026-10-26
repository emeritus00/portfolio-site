import { layerById } from '../content/layers'
import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { ArchDiagram } from '../components/diagram/ArchDiagram'
import { ProjectCard } from '../components/project/ProjectCard'
import { LayerSection } from '../components/strata/LayerSection'
import { Fact } from '../components/ui/Fact'

const stackGroups: [string, readonly string[]][] = [
  ['Languages', profile.stack.languages],
  ['Backend', profile.stack.backend],
  ['Frontend', profile.stack.frontend],
  ['Data', profile.stack.data],
  ['Cloud & infra', profile.stack.cloud],
]

/** Sheet 02: the living layer. Stack, credentials, then every project as an inspectable core sample. */
export function Topsoil() {
  return (
    <LayerSection layer={layerById.topsoil}>
      <div className="grid gap-px border border-line bg-line md:grid-cols-[1.4fr_1fr]">
        <div className="bg-bg p-5 sm:p-6">
          <h3 className="mono-label text-accent">$ cat stack</h3>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[8rem_1fr]">
            {stackGroups.map(([group, items]) => (
              <div key={group} className="contents">
                <dt className="mono-label pt-1 text-muted">{group}</dt>
                <dd className="flex flex-wrap gap-1.5 max-sm:mb-2">
                  {items.map((s) => (
                    <span key={s} className="border border-line bg-bg-2 px-2 py-0.5 text-sm">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="bg-bg p-5 sm:p-6">
          <h3 className="mono-label text-accent">$ certs</h3>
          <ul className="mt-4 space-y-3">
            {profile.certifications.map((c) => (
              <li key={c.name} className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-accent" />
                <span>
                  <span className="block leading-snug">{c.name}</span>
                  <span className="mono-label text-muted">
                    {c.issuer} · <Fact>{c.year}</Fact>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mono-label mb-6 mt-20 flex items-center gap-4 text-muted">
        Core samples · {projects.length} projects
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </h3>

      <div className="space-y-16 lg:space-y-20">
        {projects.map((p, i) => (
          <article
            key={p.slug}
            aria-labelledby={`${p.slug}-title`}
            className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
          >
            <ProjectCard project={p} index={i} />
            <ArchDiagram project={p} />
          </article>
        ))}
      </div>
    </LayerSection>
  )
}
