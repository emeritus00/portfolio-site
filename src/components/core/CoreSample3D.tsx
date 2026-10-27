import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import type { Hatch, LayerId } from '../../content/layers'
import { layerColors, segments } from './segments'

const HEIGHT = 3.7
const RADIUS = 0.82
const GAP = 0.035
const BLACK = new THREE.Color(0)

/** Paints a layer's legend pattern onto a canvas so the cylinder carries the same textures as the page. */
function hatchTexture(hatch: Hatch, bg: string, ink: string) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = bg
  g.fillRect(0, 0, c.width, c.height)
  g.strokeStyle = ink
  g.fillStyle = ink
  g.globalAlpha = 0.55
  g.lineWidth = 2

  let seed = 7
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

  if (hatch === 'grid') {
    for (let x = 0; x <= 512; x += 32) g.strokeRect(x, -1, 32, 258)
    for (let y = 0; y <= 256; y += 32) g.strokeRect(-1, y, 514, 32)
  } else if (hatch === 'soil' || hatch === 'stipple') {
    const n = hatch === 'soil' ? 260 : 700
    for (let i = 0; i < n; i++) {
      g.beginPath()
      g.arc(rand() * 512, rand() * 256, hatch === 'soil' ? 1 + rand() * 2.6 : 0.8 + rand() * 1.4, 0, Math.PI * 2)
      g.fill()
    }
  } else if (hatch === 'foliation') {
    for (let y = 8; y < 256; y += 14) {
      g.beginPath()
      for (let x = 0; x <= 512; x += 8) g.lineTo(x, y + Math.sin(x / 24 + y) * 4)
      g.stroke()
    }
  } else if (hatch === 'block') {
    for (let y = 0, row = 0; y < 256; y += 28, row++) {
      g.strokeRect(-1, y, 514, 28)
      for (let x = row % 2 ? 28 : 0; x < 512; x += 56) g.strokeRect(x, y, 56, 28)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.anisotropy = 4
  return tex
}

export interface DragState {
  velocity: number
}

function Sample({ highlight, drag }: { highlight: LayerId | null; drag: RefObject<DragState> }) {
  const group = useRef<THREE.Group>(null)
  const materials = useMemo(
    () =>
      segments.map((s) => {
        const { bg, accent, accent2 } = layerColors(s.id)
        // Tint each stratum toward its accent so the bands read clearly.
        const base = new THREE.Color(bg).lerp(new THREE.Color(accent), 0.3)
        return {
          id: s.id,
          accent: new THREE.Color(accent),
          material: new THREE.MeshStandardMaterial({
            map: hatchTexture(s.hatch, `#${base.getHexString()}`, s.id === 'atmosphere' ? accent : accent2),
            roughness: 0.82,
            emissiveIntensity: 0.35,
            metalness: 0.05,
          }),
        }
      }),
    [],
  )

  // Stack segments top → bottom around the origin.
  const placed = useMemo(
    () =>
      segments.map((s, i) => {
        const above = segments.slice(0, i).reduce((sum, p) => sum + p.share * HEIGHT, 0)
        const h = s.share * HEIGHT - GAP
        return { ...s, h, y: HEIGHT / 2 - above - h / 2, mat: materials[i] }
      }),
    [materials],
  )

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    // Extraction: rise out of the ground, then turn slowly; drag adds spin that decays.
    g.position.y += (0 - g.position.y) * Math.min(1, dt * 2.2)
    g.rotation.y += (0.22 + drag.current.velocity) * dt
    // Per-frame physics lives in a ref by design; R3F mutates outside React's render.
    // oxlint-disable-next-line react/immutability
    drag.current.velocity *= Math.pow(0.04, dt)
    for (const p of placed) {
      const on = p.id === highlight
      p.mat.material.emissive.lerp(on ? p.mat.accent : BLACK, Math.min(1, dt * 8))
    }
  })

  return (
    <group ref={group} position={[0, -6, 0]} rotation={[0.12, 0, 0.06]}>
      {placed.map((p) => (
        <mesh key={p.id} position={[0, p.y, 0]} material={p.mat.material}>
          <cylinderGeometry args={[RADIUS, RADIUS, p.h, 72, 1]} />
        </mesh>
      ))}
    </group>
  )
}

/** The extracted core sample, rendered with Three.js. Loaded lazily, desktop only. */
export default function CoreSample3D({
  highlight,
  live,
  drag,
}: {
  highlight: LayerId | null
  live: boolean
  drag: RefObject<DragState>
}) {
  return (
    <Canvas
      frameloop={live ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 7.6], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={1.7} />
      <directionalLight position={[-4, 1, -3]} intensity={0.6} color="#9ec9ff" />
      <Sample highlight={highlight} drag={drag} />
    </Canvas>
  )
}
