import { animate, MotionConfig, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { profile } from '../../content/profile'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

const MANTLE_DEPTH = 2900

/**
 * Easter egg (`drill mantle` in the terminal): the bit goes through bedrock
 * into the mantle. A glowing full-screen overlay with a racing depth counter.
 */
export default function Mantle({ onClose }: { onClose: () => void }) {
  const depth = useMotionValue(1400)
  const label = useTransform(depth, (d) => `−${Math.round(d).toLocaleString('en-CA')} m`)
  const surface = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    surface.current?.focus()
    const controls = animate(depth, MANTLE_DEPTH, {
      duration: prefersReducedMotion() ? 0 : 2.4,
      ease: [0.3, 0, 0.1, 1],
    })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      controls.stop()
      window.removeEventListener('keydown', onKey)
    }
  }, [depth, onClose])

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mantle-title"
        className="mantle fixed inset-0 z-[90] grid place-items-center overflow-hidden p-6 text-[#fff4e8]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault()
            surface.current?.focus()
          }
        }}
      >
        <div className="relative max-w-xl text-center">
          <p className="mono-label text-[#ffd2a8]">Layer 07 · Mantle · past the bedrock</p>
          <motion.p className="mt-4 font-mono text-[clamp(3rem,12vw,7rem)] font-bold leading-none tabular-nums tracking-[-0.04em]">
            {label}
          </motion.p>
          <h2 id="mantle-title" className="mt-6 text-[clamp(1.4rem,3.4vw,2.2rem)] font-semibold leading-tight">
            You drilled further than the brief asked.
          </h2>
          <p className="mt-3 text-[#ffe3c9]">Curious people make good engineers. I’d like to hear what you’re building.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${profile.email}?subject=Found%20the%20mantle`}
              className="mono-label border-2 border-[#fff4e8] bg-[#fff4e8] px-4 py-3 text-[#3a0d00] hover:bg-transparent hover:text-[#fff4e8]"
            >
              Email me
            </a>
            <button
              ref={surface}
              type="button"
              onClick={onClose}
              className="mono-label border-2 border-[#fff4e8]/60 px-4 py-3 hover:border-[#fff4e8] focus-visible:outline-[#fff4e8]"
            >
              Return to surface · Esc
            </button>
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  )
}
