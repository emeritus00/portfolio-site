import { lazy, Suspense, useEffect, useState } from 'react'
import { DepthGauge } from './components/depth-gauge/DepthGauge'
import { Toolbar } from './components/Toolbar'
import { loadAssistant } from './components/assistant/load'
import { loadTerminal, useTerminal } from './components/terminal/useTerminal'
import { ThroughLine } from './components/throughline/ThroughLine'
import { Atmosphere } from './layers/Atmosphere'
import { CoreReadout } from './layers/CoreReadout'
import { Bedrock } from './layers/Bedrock'
import { Metamorphic } from './layers/Metamorphic'
import { Sediment } from './layers/Sediment'
import { Topsoil } from './layers/Topsoil'
import { useOverlay } from './hooks/useOverlay'
import { ASK_EVENT } from './lib/assistant/bus'
import { ScrollTrigger, startSmoothScroll } from './motion/scroll'

// Overlays (and the animation library they use) load on first use.
const TerminalPanel = lazy(loadTerminal)
const Mantle = lazy(() => import('./components/terminal/Mantle'))
const AssistantPanel = lazy(loadAssistant)

export default function App() {
  const [mantle, setMantle] = useState(false)
  const terminal = useTerminal()
  const assistant = useOverlay()
  const [firstQuestion, setFirstQuestion] = useState<string>()

  // Anything on the page can open the assistant (optionally with a question) via askAssistant().
  // Once open, the panel listens for further questions itself.
  const { open: assistantOpen, show: showAssistant } = assistant
  useEffect(() => {
    if (assistantOpen) return
    const onAsk = (e: Event) => {
      setFirstQuestion((e as CustomEvent<string | undefined>).detail)
      showAssistant()
    }
    window.addEventListener(ASK_EVENT, onAsk)
    return () => window.removeEventListener(ASK_EVENT, onAsk)
  }, [assistantOpen, showAssistant])

  useEffect(() => {
    const stop = startSmoothScroll()
    // Fonts change line heights; re-measure triggers once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return stop
  }, [])

  return (
    <>
      <a
        href="#topsoil"
        className="mono-label fixed left-4 top-4 z-[70] -translate-y-20 bg-[#3ee6ff] px-3 py-2 text-[#070d1f] focus:translate-y-0"
      >
        Skip to projects
      </a>
      <div className="grain" aria-hidden="true" />
      <DepthGauge />
      <Toolbar onTerminal={terminal.show} />
      <Suspense fallback={null}>
        {terminal.open && <TerminalPanel onClose={terminal.hide} onMantle={() => setMantle(true)} />}
        {mantle && <Mantle onClose={() => setMantle(false)} />}
        {assistant.open && <AssistantPanel initial={firstQuestion} onClose={assistant.hide} />}
      </Suspense>
      <main className="relative max-md:pb-[var(--bar-h)]" data-layer="core">
        <ThroughLine />
        <Atmosphere />
        <Topsoil />
        <Sediment />
        <Metamorphic />
        <Bedrock />
        <CoreReadout />
      </main>
    </>
  )
}
