import { profile } from '../content/profile'
import { infraFacts, lighthouse, pipeline } from '../content/site'
import { scrollToLayer } from '../motion/scroll'

const YEAR = new Date().getFullYear()

/** "How this site is built": the delivery pipeline and infrastructure, as a final engineering note. */
export function SiteFooter() {
  return (
    <footer data-layer="core" className="relative border-t border-line bg-bg text-fg max-md:pb-[var(--bar-h)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 md:pl-12 md:pr-[calc(var(--gauge-w)+2rem)]">
        <h2 className="mono-label text-accent">How this site is built</h2>
        <p className="mt-3 max-w-2xl text-lg leading-snug">
          The site is part of the portfolio: static React on AWS, provisioned with Terraform and shipped by a CI pipeline that has to pass its own inspection first.
        </p>

        <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map((p, i) => (
            <li key={p.step} className="relative bg-bg p-4 sm:last:col-span-2 lg:last:col-span-1">
              <span className="mono-label text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-2 block font-medium">{p.step}</span>
              <span className="mt-1 block text-sm leading-snug text-muted">{p.detail}</span>
              {i < pipeline.length - 1 && (
                <span aria-hidden="true" className="absolute right-3 top-4 hidden text-accent lg:block">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ul className="space-y-2 text-sm text-muted">
            {infraFacts.map((f) => (
              <li key={f} className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                {f}
              </li>
            ))}
          </ul>

          <div>
            <p className="mono-label text-muted">Lighthouse · {lighthouse.measured}</p>
            <dl className="mt-3 grid grid-cols-4 gap-px border border-line bg-line text-center">
              {lighthouse.scores.map((s) => (
                <div key={s.label} className="flex flex-col-reverse bg-bg px-2 py-3">
                  <dt className="mt-1 text-[0.65rem] leading-tight text-muted">{s.label}</dt>
                  <dd className="font-mono text-lg text-accent tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mono-label mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-muted">
          <span>
            © {YEAR} {profile.name}
          </span>
          <span>React · TypeScript · Tailwind · GSAP · Press / for the terminal</span>
          <button type="button" onClick={() => scrollToLayer('atmosphere')} className="hover:text-fg">
            ↑ Return to surface
          </button>
        </div>
      </div>
    </footer>
  )
}
