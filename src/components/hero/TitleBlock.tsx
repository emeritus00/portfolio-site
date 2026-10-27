import { profile } from '../../content/profile'
import { useClock } from '../../hooks/useClock'

/** Engineering-drawing title block: who drew this sheet, checked by, and the local time. */
export function TitleBlock() {
  const clock = useClock(profile.timeZone)
  const rows: [string, string][] = [
    ['Drawn', 'A. Gbadamosi'],
    ['Checked', 'ISTQB CTFL'],
    ['Certified', 'AWS SAA · DVA'],
    ['Local time', clock ? `${clock.homeTime} ${clock.homeZone}` : '—'],
    ['Sheet', `01 / 06`],
    ['Scale', 'Career, 1 : 1'],
  ]
  return (
    <dl className="mono-label grid grid-cols-2 border border-line text-[0.625rem] sm:grid-cols-3">
      {rows.map(([k, v]) => (
        <div key={k} className="border-b border-r border-line px-3 py-2 [&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-last-child(-n+3)]:border-b-0">
          <dt className="text-muted">{k}</dt>
          <dd className="mt-0.5 truncate text-fg tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  )
}
