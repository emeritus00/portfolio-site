import type { CSSProperties } from 'react'
import type { Hatch } from '../content/layers'

/**
 * Geological legend patterns, drawn as black-on-transparent SVG tiles.
 * They are used as CSS masks, so the visible colour always comes from the
 * layer's tokens (background-color: var(--line) etc.).
 */
const tiles: Record<Exclude<Hatch, 'none'>, { w: number; h: number; body: string }> = {
  grid: {
    w: 48,
    h: 48,
    body: `<path d="M48 0H0V48" fill="none" stroke="#000" stroke-width="1"/><circle cx="0" cy="0" r="1.6"/>`,
  },
  soil: {
    w: 56,
    h: 56,
    body: `<circle cx="6" cy="9" r="1.4"/><circle cx="31" cy="4" r="1"/><circle cx="47" cy="21" r="1.6"/><circle cx="19" cy="33" r="1.1"/><circle cx="40" cy="45" r="1.3"/><circle cx="9" cy="50" r="0.9"/><path d="M22 16l6 -2M3 28l5 1M35 31l6 2M26 50l5 -1" stroke="#000" stroke-width="1.2" stroke-linecap="round"/>`,
  },
  stipple: {
    w: 24,
    h: 24,
    body: `<circle cx="3" cy="4" r="1"/><circle cx="15" cy="2" r="0.8"/><circle cx="9" cy="12" r="1.1"/><circle cx="21" cy="14" r="0.9"/><circle cx="4" cy="20" r="0.8"/><circle cx="16" cy="22" r="1"/>`,
  },
  foliation: {
    w: 64,
    h: 16,
    body: `<path d="M0 8 C 8 2, 16 2, 24 8 S 40 14, 48 8 S 60 3, 64 8" fill="none" stroke="#000" stroke-width="1.2"/>`,
  },
  block: {
    w: 48,
    h: 24,
    body: `<path d="M0 0.5H48M0 12.5H48M0.5 0V12M24.5 12V24" fill="none" stroke="#000" stroke-width="1"/>`,
  },
}

export function hatchMask(hatch: Hatch): string | undefined {
  if (hatch === 'none') return undefined
  const t = tiles[hatch]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${t.w}" height="${t.h}">${t.body}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** Inline style for an element that should show a hatch in the given colour. */
export function hatchStyle(hatch: Hatch, color = 'var(--line)'): CSSProperties {
  const mask = hatchMask(hatch)
  if (!mask) return {}
  return {
    backgroundColor: color,
    maskImage: mask,
    WebkitMaskImage: mask,
    maskRepeat: 'repeat',
    WebkitMaskRepeat: 'repeat',
  }
}
