/**
 * The core sample, top to bottom. Order here is scroll order.
 * Depths are narrative metres — they drive the depth gauge readout.
 */
export type LayerId = 'atmosphere' | 'topsoil' | 'sediment' | 'metamorphic' | 'bedrock' | 'core'

export type Hatch = 'none' | 'soil' | 'stipple' | 'foliation' | 'block' | 'grid'

export interface Layer {
  id: LayerId
  /** Geological name shown in the gauge. */
  name: string
  /** Career chapter this layer represents. */
  chapter: string
  /** Short era label, e.g. "2023 — now". */
  era: string
  depthStart: number
  depthEnd: number
  /** Survey legend pattern used for textures and boundaries. */
  hatch: Hatch
  /** One-paragraph lede for the layer. */
  summary: string
}

export const layers: Layer[] = [
  {
    id: 'atmosphere',
    name: 'Atmosphere',
    chapter: 'Cloud',
    era: 'Above ground',
    depthStart: 0,
    depthEnd: 0,
    hatch: 'grid',
    summary: 'I build on the cloud.',
  },
  {
    id: 'topsoil',
    name: 'Topsoil',
    chapter: 'Software Development',
    era: '2023 — now',
    depthStart: 0,
    depthEnd: 120,
    hatch: 'soil',
    summary:
      'The living layer. Full-stack products across Java, Python and JavaScript, shipped on AWS with infrastructure as code and tested like they matter.',
  },
  {
    id: 'sediment',
    name: 'Sediment',
    chapter: 'Environmental Science',
    era: '[TODO] — [TODO]',
    depthStart: 120,
    depthEnd: 480,
    hatch: 'stipple',
    summary:
      'M.Sc. at Memorial University. Field sampling, measurement and data analysis — where I learned to trust evidence over assumptions.',
  },
  {
    id: 'metamorphic',
    name: 'Metamorphic',
    chapter: 'Automotive Quality Control',
    era: '[TODO] — [TODO]',
    depthStart: 480,
    depthEnd: 900,
    hatch: 'foliation',
    summary:
      'Assembly, inspection and quality control in the Nigerian automotive industry. Pressure and heat that turned an engineer into an inspector.',
  },
  {
    id: 'bedrock',
    name: 'Bedrock',
    chapter: 'Agricultural & Environmental Engineering',
    era: '[TODO] — [TODO]',
    depthStart: 900,
    depthEnd: 1400,
    hatch: 'block',
    summary:
      'B.Sc. at the University of Ibadan. Systems thinking, design under constraints and first principles — the foundation everything else stands on.',
  },
  {
    id: 'core',
    name: 'Core sample',
    chapter: 'Readout & Contact',
    era: 'Extracted',
    depthStart: 1400,
    depthEnd: 1400,
    hatch: 'none',
    summary: 'The full sample, extracted. Every layer, one engineer.',
  },
]

export const layerById = Object.fromEntries(layers.map((l) => [l.id, l])) as Record<LayerId, Layer>
