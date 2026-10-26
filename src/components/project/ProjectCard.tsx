import { useRef, useState, type ReactNode } from 'react'
import type { Project } from '../../content/projects'
import { hasTodo } from '../../lib/todo'
import { Fact } from '../ui/Fact'
import { InspectionStamp } from './InspectionStamp'
import { StatusBadge } from './StatusBadge'

type FlipSource = 'hover' | 'pin' | null

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
      <dt className="mono-label pt-0.5 text-muted">{label}</dt>
      <dd className="text-[0.95rem] leading-relaxed">{children}</dd>
    </div>
  )
}

function ProjectLinks({ links }: { links: Project['links'] }) {
  const items = [
    links.live && { label: 'Live site', href: links.live },
    links.repo && { label: 'Repository', href: links.repo },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((l) =>
        l.href.includes('[TODO]') ? (
          <span key={l.label} className="mono-label text-muted">
            {l.label} <Fact>{l.href}</Fact>
          </span>
        ) : (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="mono-label text-accent underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            {l.label} ↗
          </a>
        ),
      )}
      {links.note && <span className="mono-label text-muted">{links.note}</span>}
    </div>
  )
}

/**
 * A project "core sample". The front is the sample record; the back is an
 * ISTQB-style inspection report. Hovering (or tapping) the Inspect tab flips
 * it; a hover flip falls back when the pointer leaves, a click pins it.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [flip, setFlip] = useState<FlipSource>(null)
  const inspectBtn = useRef<HTMLButtonElement>(null)
  const backBtn = useRef<HTMLButtonElement>(null)
  const flipped = flip !== null
  const r = project.inspection
  const complete = !hasTodo(r.scope, r.approach, r.coverage, r.knownLimitations)
  const titleId = `${project.slug}-title`

  const pin = () => {
    setFlip('pin')
    requestAnimationFrame(() => backBtn.current?.focus({ preventScroll: true }))
  }
  const unpin = () => {
    setFlip(null)
    requestAnimationFrame(() => inspectBtn.current?.focus({ preventScroll: true }))
  }

  return (
    <div
      className="h-full [perspective:1600px]"
      onPointerLeave={() => flip === 'hover' && setFlip(null)}
      onKeyDown={(e) => e.key === 'Escape' && flipped && unpin()}
    >
      <div
        className={`grid h-full transition-transform duration-700 ease-[cubic-bezier(0.6,0,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ---------- Front: sample record ---------- */}
        <div
          inert={flipped}
          className="col-start-1 row-start-1 flex flex-col border border-line bg-bg-2 p-5 [backface-visibility:hidden] sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="mono-label text-muted">Core {String(index + 1).padStart(2, '0')}</span>
            <StatusBadge status={project.status} />
          </div>

          <h3 id={titleId} className="mt-5 text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {project.name}
          </h3>
          <p className="mt-2 text-muted">{project.tagline}</p>

          <dl className="mt-6">
            <Row label="Problem">
              <Fact>{project.problem}</Fact>
            </Row>
            <Row label="My role">
              <Fact>{project.role}</Fact>
            </Row>
            <Row label="Stack">
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="mono-label border border-line px-2 py-1 text-fg">
                    <Fact>{s}</Fact>
                  </li>
                ))}
              </ul>
            </Row>
          </dl>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
            <ProjectLinks links={project.links} />
            <button
              ref={inspectBtn}
              type="button"
              aria-expanded={flipped}
              aria-controls={`${project.slug}-report`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && !flipped && setFlip('hover')}
              onClick={pin}
              className="mono-label inline-flex items-center gap-2 border border-accent px-3 py-2 text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <circle cx="5" cy="5" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 8l3 3" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              Inspect
            </button>
          </div>
        </div>

        {/* ---------- Back: inspection report ---------- */}
        <section
          id={`${project.slug}-report`}
          aria-label={`Inspection report: ${project.name}`}
          inert={!flipped}
          className="relative col-start-1 row-start-1 flex flex-col overflow-hidden border border-accent bg-bg-2 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mono-label text-accent">Inspection report · Core {String(index + 1).padStart(2, '0')}</p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.01em]">{project.name}</p>
            </div>
            <button
              ref={backBtn}
              type="button"
              onClick={unpin}
              className="mono-label shrink-0 border border-line px-2.5 py-1.5 text-muted hover:border-accent hover:text-fg"
            >
              ← Sample
            </button>
          </div>

          <dl className="mt-5 text-sm">
            <Row label="Test scope">
              <ul className="list-['–_'] pl-4">
                {r.scope.map((s) => (
                  <li key={s}>
                    <Fact>{s}</Fact>
                  </li>
                ))}
              </ul>
            </Row>
            <Row label="Approach">
              <ul className="list-['–_'] pl-4">
                {r.approach.map((s) => (
                  <li key={s}>
                    <Fact>{s}</Fact>
                  </li>
                ))}
              </ul>
            </Row>
            <Row label="Coverage">
              <Fact>{r.coverage}</Fact>
            </Row>
            <Row label="Known limits">
              <ul className="list-['–_'] pl-4">
                {r.knownLimitations.map((s) => (
                  <li key={s}>
                    <Fact>{s}</Fact>
                  </li>
                ))}
              </ul>
            </Row>
          </dl>

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <p className="mono-label max-w-[14rem] text-muted">
              {complete ? 'Report complete.' : 'Report incomplete: TODO fields awaiting data.'}
            </p>
            <InspectionStamp show={flipped} complete={complete} />
          </div>
        </section>
      </div>
    </div>
  )
}
