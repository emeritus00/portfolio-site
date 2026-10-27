import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { DepthGauge } from './components/depth-gauge/DepthGauge'
import { Atmosphere } from './layers/Atmosphere'
import { CoreReadout } from './layers/CoreReadout'
import { Bedrock } from './layers/Bedrock'
import { Metamorphic } from './layers/Metamorphic'
import { Sediment } from './layers/Sediment'
import { Topsoil } from './layers/Topsoil'
import { ScrollTrigger, startSmoothScroll } from './motion/scroll'

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll()
    // Fonts change line heights; re-measure triggers once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return stop
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#topsoil"
        className="mono-label fixed left-4 top-4 z-[70] -translate-y-20 bg-[#3ee6ff] px-3 py-2 text-[#070d1f] focus:translate-y-0"
      >
        Skip to projects
      </a>
      <div className="grain" aria-hidden="true" />
      <DepthGauge />
      <main className="max-md:pb-[var(--bar-h)]" data-layer="core">
        <Atmosphere />
        <Topsoil />
        <Sediment />
        <Metamorphic />
        <Bedrock />
        <CoreReadout />
      </main>
    </MotionConfig>
  )
}
