import { useSyncExternalStore } from 'react'

/** Which through-line skill is currently hovered/focused, shared by tags and the thread. */
let active: string | null = null
const listeners = new Set<() => void>()

export function setActiveSkill(id: string | null) {
  if (id === active) return
  active = id
  listeners.forEach((l) => l())
}

export function useActiveSkill() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => active,
    () => null,
  )
}
