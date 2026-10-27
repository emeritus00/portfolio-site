import { layers, type Hatch, type LayerId } from '../../content/layers'

export interface Segment {
  id: LayerId
  name: string
  hatch: Hatch
  /** Share of the sample's total height, 0–1. */
  share: number
}

const drilled = layers.filter((l) => l.id !== 'core')
const MIN = 0.07
const raw = drilled.map((l) => Math.max(MIN * 1400, l.depthEnd - l.depthStart))
const total = raw.reduce((a, b) => a + b, 0)

/** The extracted sample, top to bottom, with heights proportional to each layer's depth range. */
export const segments: Segment[] = drilled.map((l, i) => ({
  id: l.id,
  name: l.name,
  hatch: l.hatch,
  share: raw[i] / total,
}))

/** Resolved colours for a layer, read from its live CSS tokens (so light/dark both work). */
export function layerColors(id: LayerId) {
  const el = document.getElementById(id)
  const css = el ? getComputedStyle(el) : null
  const get = (v: string, fallback: string) => css?.getPropertyValue(v).trim() || fallback
  return { bg: get('--bg-2', '#222'), accent: get('--accent', '#fff'), accent2: get('--accent-2', '#aaa') }
}
