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

/** Scroll to a layer by id, moving keyboard focus with it. */
export function scrollToLayer(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const focusTarget = () => el.focus({ preventScroll: true })
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6, onComplete: focusTarget })
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    focusTarget()
  }
  history.replaceState(null, '', `#${id}`)
}

export { gsap, ScrollTrigger }
