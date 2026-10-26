/** Offset of a time zone from UTC in minutes, at the given instant. */
export function zoneOffsetMinutes(timeZone: string, at = new Date()) {
  const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(at)
    .find((p) => p.type === 'timeZoneName')?.value
  const m = part?.match(/GMT([+-])(\d{2}):?(\d{2})?/)
  if (!m) return 0
  const sign = m[1] === '-' ? -1 : 1
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0))
}

export function greetingFor(hour: number) {
  if (hour < 5) return 'Up late'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function hoursText(mins: number) {
  const h = Math.floor(mins / 60)
  const half = mins % 60 === 30
  if (h === 0 && half) return 'half an hour'
  const n = `${h}${half ? '½' : ''}`
  return `${n} hour${h === 1 && !half ? '' : 's'}`
}

export interface ClockReading {
  greeting: string
  /** e.g. "9:14 p.m." in the home time zone. */
  homeTime: string
  /** e.g. "NDT". */
  homeZone: string
  /** Relation of home time to the visitor, e.g. "2½ hours ahead of you". */
  relation: string
}

export function readClock(homeZone: string, now = new Date()): ClockReading {
  const homeTime = new Intl.DateTimeFormat('en-CA', { timeZone: homeZone, hour: 'numeric', minute: '2-digit' }).format(now)
  const zoneName =
    new Intl.DateTimeFormat('en-CA', { timeZone: homeZone, timeZoneName: 'short' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value ?? ''

  const diff = zoneOffsetMinutes(homeZone, now) + now.getTimezoneOffset()
  const relation =
    diff === 0
      ? 'same time zone as you'
      : `${hoursText(Math.abs(diff))} ${diff > 0 ? 'ahead of' : 'behind'} you`

  return { greeting: greetingFor(now.getHours()), homeTime, homeZone: zoneName, relation }
}
