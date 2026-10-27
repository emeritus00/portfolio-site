import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/**
 * Smooth scroll (Lenis) driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. Skipped entirely for reduced-motion users.
 */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {}

  lenis = new Lenis({ lerp: 0.11, anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

/** Smooth-scroll to any element (offset in px), respecting reduced motion. */
export function scrollToElement(el: HTMLElement, offset = 0, onComplete?: () => void) {
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.6, onComplete })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    onComplete?.()
  }
}

/** Scroll to a layer by id, moving keyboard focus with it. */
export function scrollToLayer(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  scrollToElement(el, 0, () => el.focus({ preventScroll: true }))
  history.replaceState(null, '', `#${id}`)
}

export { gsap, ScrollTrigger }
