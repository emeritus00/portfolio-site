import { layerById, type LayerId } from '../../content/layers'
import { throughLines } from '../../content/throughline'
import { setActiveSkill, useActiveSkill } from '../../lib/skillStore'
import { scrollToElement } from '../../motion/scroll'

const anchorId = (skill: string, layer: LayerId) => `thread-${skill}-${layer}`

/**
 * The through-line tags for one layer: skills that originate here, and skills
 * that resurfaced here from deeper down. Hover or focus lights the thread;
 * click jumps to the other end of it.
 */
export function SkillTags({ layer }: { layer: LayerId }) {
  const active = useActiveSkill()
  const tags = throughLines.flatMap((t) => [
    ...(t.origin.layer === layer
      ? [{ t, kind: 'origin' as const, as: t.origin.as, jumpTo: t.resurfaces[0]?.layer }]
      : []),
    ...t.resurfaces
      .filter((r) => r.layer === layer)
      .map((r) => ({ t, kind: 'resurface' as const, as: r.as, jumpTo: t.origin.layer })),
  ])
  if (!tags.length) return null

  return (
    <div className="mb-12 flex flex-wrap items-center gap-2">
      <span className="mono-label mr-2 text-muted">Through-line</span>
      {tags.map(({ t, kind, as, jumpTo }) => {
        const on = active === t.id
        const target = jumpTo ? layerById[jumpTo] : undefined
        return (
          <button
            key={`${t.id}-${kind}`}
            id={anchorId(t.id, layer)}
            type="button"
            data-skill={t.id}
            data-skill-kind={kind}
            onPointerEnter={() => setActiveSkill(t.id)}
            onPointerLeave={() => setActiveSkill(null)}
            onFocus={() => setActiveSkill(t.id)}
            onBlur={() => setActiveSkill(null)}
            onClick={() => {
              const el = jumpTo && document.getElementById(anchorId(t.id, jumpTo))
              if (el) scrollToElement(el, -window.innerHeight * 0.4, () => el.focus({ preventScroll: true }))
            }}
            aria-label={
              kind === 'origin'
                ? `${t.skill}: first appeared here as ${as}. Jump to where it resurfaces in ${target?.chapter}.`
                : `${as}: resurfaced from ${target?.chapter}. Jump to where it first appeared.`
            }
            className={`group relative inline-flex items-center gap-2 border px-2.5 py-1.5 text-sm transition-all duration-300 ${
              on ? 'border-accent bg-accent text-bg shadow-[0_0_24px_-4px_var(--accent)]' : 'border-line text-fg hover:border-accent'
            }`}
          >
            <span aria-hidden="true" className={`h-2 w-2 rotate-45 ${kind === 'origin' ? 'bg-current' : 'border border-current'}`} />
            <span>{as}</span>
            <span aria-hidden="true" className={`mono-label ${on ? 'text-bg/70' : 'text-muted'}`}>
              {kind === 'origin' ? `↑ ${target?.name}` : `↓ ${target?.name}`}
            </span>
            {kind === 'resurface' && target && (
              <span
                aria-hidden="true"
                className={`mono-label pointer-events-none absolute left-0 top-full z-20 mt-2 w-max max-w-[min(24rem,75vw)] border border-line bg-bg-2 px-2 py-1.5 text-fg transition-opacity ${
                  on ? 'opacity-100' : 'opacity-0'
                }`}
              >
                First appeared · {t.origin.as} · {target.chapter} · −{target.depthStart} m
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
