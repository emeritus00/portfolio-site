/** Deterministic PRNG so boundaries look hand-drawn but never change between renders. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * An irregular unconformity line across `width`, as a list of points.
 * Two octaves of smoothed random walk: broad undulation + fine jitter.
 */
export function unconformity(seed: number, width: number, amplitude: number, segments = 48) {
  const rand = mulberry32(seed)
  const broad = Array.from({ length: 7 }, () => rand() * 2 - 1)
  const pts: [number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const f = t * (broad.length - 1)
    const k = Math.floor(f)
    const u = f - k
    const s = u * u * (3 - 2 * u)
    const b = broad[k] * (1 - s) + broad[Math.min(k + 1, broad.length - 1)] * s
    const jitter = (rand() * 2 - 1) * 0.18
    pts.push([t * width, (b * 0.8 + jitter) * amplitude])
  }
  return pts
}

export function toPath(pts: [number, number][], offsetY = 0) {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${(y + offsetY).toFixed(1)}`).join(' ')
}
