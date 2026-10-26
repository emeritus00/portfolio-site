import type { LayerId } from './layers'

/**
 * Skills that run through the whole core. Each one starts in a deep layer and
 * resurfaces higher up. The through-line thread (Stage 5) draws these links.
 */
export interface ThroughLine {
  skill: string
  origin: { layer: LayerId; as: string }
  resurfaces: { layer: LayerId; as: string }[]
}

export const throughLines: ThroughLine[] = [
  {
    skill: 'Inspection',
    origin: { layer: 'metamorphic', as: 'Vehicle inspection & quality control' },
    resurfaces: [{ layer: 'topsoil', as: 'Software testing (ISTQB)' }],
  },
  {
    skill: 'Measurement',
    origin: { layer: 'sediment', as: 'Field sampling' },
    resurfaces: [{ layer: 'topsoil', as: 'Data pipelines' }],
  },
  {
    skill: 'Systems design',
    origin: { layer: 'bedrock', as: 'Engineering design' },
    resurfaces: [{ layer: 'topsoil', as: 'Cloud architecture (AWS)' }],
  },
]
