import { useEffect, useState } from 'react'
import { layers, type LayerId } from '../content/layers'

export interface DepthState {
  active: LayerId
  index: number
  /** 0–1 progress through the active layer. */
  progress: number
  /** Narrative depth in metres (positive = below surface). */
  depth: number
}

const initial: DepthState = { active: layers[0].id, index: 0, progress: 0, depth: 0 }

/**
 * Tracks which layer sits under the "drill line" (40% down the viewport)
 * and how far through it we are. rAF-throttled; only the gauge subscribes.
 */
export function useDepth(): DepthState {
  const [state, setState] = useState(initial)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const probe = window.scrollY + window.innerHeight * 0.4
      let index = 0
      let progress = 0
      for (let i = 0; i < layers.length; i++) {
        const el = document.getElementById(layers[i].id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (probe >= top) {
          index = i
          progress = Math.min(1, Math.max(0, (probe - top) / el.offsetHeight))
        }
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        index = layers.length - 1
        progress = 1
      }
      const l = layers[index]
      const depth = Math.round(l.depthStart + (l.depthEnd - l.depthStart) * progress)
      setState((s) =>
        s.index === index && s.depth === depth && Math.abs(s.progress - progress) < 0.005
          ? s
          : { active: l.id, index, progress, depth },
      )
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return state
}

export function formatDepth(depth: number) {
  return depth === 0 ? '±0 m' : `−${depth.toLocaleString('en-CA')} m`
}
