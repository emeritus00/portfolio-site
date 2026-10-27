import { useSyncExternalStore } from 'react'
import { readClock, type ClockReading } from '../lib/time'

/**
 * One shared clock per time zone, re-read every 20 s. Returns null in the
 * pre-rendered HTML (the build machine's time would be wrong) and during
 * hydration; the real reading arrives right after.
 */
const cache = new Map<string, ClockReading>()
const listeners = new Set<() => void>()
let timer: number | undefined

function subscribe(cb: () => void) {
  listeners.add(cb)
  timer ??= window.setInterval(() => {
    for (const zone of cache.keys()) cache.set(zone, readClock(zone))
    listeners.forEach((l) => l())
  }, 20_000)
  return () => {
    listeners.delete(cb)
    if (!listeners.size) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

export function useClock(homeZone: string): ClockReading | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (!cache.has(homeZone)) cache.set(homeZone, readClock(homeZone))
      return cache.get(homeZone)!
    },
    () => null,
  )
}
