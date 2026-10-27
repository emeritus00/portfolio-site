import { bedrock } from '../content/chapters'
import { layerById } from '../content/layers'
import { LayerSection } from '../components/strata/LayerSection'
import { Fact } from '../components/ui/Fact'

/** Sheet 05: the foundation. Deliberately calm: no motion, just solid blocks. */
export function Bedrock() {
  return (
    <LayerSection layer={layerById.bedrock}>
      <blockquote className="max-w-4xl border-l-4 border-accent pl-6 text-[clamp(1.5rem,3.6vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.02em]">
        {bedrock.principle}
      </blockquote>

      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="border border-line bg-bg-2 p-6">
          <p className="mono-label text-accent">Degree</p>
          <p className="mt-3 text-xl font-semibold leading-snug">{bedrock.degree}</p>
          <p className="mt-1 text-muted">{bedrock.school}</p>
          <p className="mt-6 leading-relaxed text-muted">{bedrock.summary}</p>
        </div>

        {/* Masonry courses: each foundation is a dressed stone block. */}
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {bedrock.foundations.map((f, i) => (
            <li
              key={f.name}
              className={`flex min-h-32 flex-col justify-between border border-line bg-bg-2 p-5 ${i % 4 === 1 || i % 4 === 2 ? 'sm:translate-x-3' : ''}`}
            >
              <span className="mono-label text-muted">Course {String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="block text-lg font-medium">{f.name}</span>
                <span className="mt-1 block text-sm text-muted">
                  <Fact>{f.note}</Fact>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </LayerSection>
  )
}
