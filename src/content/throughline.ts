import type { LayerId } from './layers'

/**
 * Skills that run through the whole core. Each one starts in a deep layer and
 * resurfaces higher up. The through-line thread on the left edge links them;
 * hovering a skill tag lights up where it first appeared.
 */
export interface ThroughLine {
  id: string
  skill: string
  origin: { layer: LayerId; as: string }
  resurfaces: { layer: LayerId; as: string }[]
}

export const throughLines: ThroughLine[] = [
  {
    id: 'inspection',
    skill: 'Inspection',
    origin: { layer: 'metamorphic', as: 'Vehicle inspection & QC' },
    resurfaces: [{ layer: 'topsoil', as: 'Software testing (ISTQB)' }],
  },
  {
    id: 'verification',
    skill: 'Verification',
    origin: { layer: 'metamorphic', as: 'Release only what passes inspection' },
    resurfaces: [{ layer: 'topsoil', as: 'Reviewing AI-generated code' }],
  },
  {
    id: 'measurement',
    skill: 'Measurement',
    origin: { layer: 'sediment', as: 'Field sampling' },
    resurfaces: [{ layer: 'topsoil', as: 'Data pipelines' }],
  },
  {
    id: 'systems',
    skill: 'Systems design',
    origin: { layer: 'bedrock', as: 'Engineering design' },
    resurfaces: [{ layer: 'topsoil', as: 'Cloud architecture (AWS)' }],
  },
]
