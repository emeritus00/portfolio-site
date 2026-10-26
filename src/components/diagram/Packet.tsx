/** A packet that runs along a path once per `cycle` seconds, then hides. */
export function Packet({ path, begin, travel, cycle, reverse, color = 'var(--accent)' }: {
  /** id of the <path> to follow. */
  path: string
  begin: number
  travel: number
  cycle: number
  reverse?: boolean
  color?: string
}) {
  const f = (travel / cycle).toFixed(3)
  return (
    <circle r="3.2" fill={color} opacity="0">
      <animateMotion
        dur={`${cycle}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        keyPoints={reverse ? '1;0;0' : '0;1;1'}
        keyTimes={`0;${f};1`}
        calcMode="linear"
      >
        <mpath href={`#${path}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        dur={`${cycle}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        values="1;1;0;0"
        keyTimes={`0;${f};${Math.min(0.999, Number(f) + 0.001)};1`}
      />
    </circle>
  )
}
