import { useEffect, useState } from 'react'
import { readClock } from '../lib/time'

/** Re-reads the clock every 20 s so the minute display never lags far. */
export function useClock(homeZone: string) {
  const [reading, setReading] = useState(() => readClock(homeZone))
  useEffect(() => {
    const id = window.setInterval(() => setReading(readClock(homeZone)), 20_000)
    return () => window.clearInterval(id)
  }, [homeZone])
  return reading
}
