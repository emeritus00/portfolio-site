import type { LayerId } from '../content/layers'
import { layerById } from '../content/layers'
import { LayerSection } from '../components/strata/LayerSection'

/** Stage 1 stand-in for layers that get their own treatment in Stage 4. */
export function PlaceholderLayer({ id, note }: { id: LayerId; note: string }) {
  return (
    <LayerSection layer={layerById[id]}>
      <div className="grid min-h-[40vh] place-items-center border border-dashed border-line p-8 text-center">
        <p className="mono-label text-muted">{note}</p>
      </div>
    </LayerSection>
  )
}
