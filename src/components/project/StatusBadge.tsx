import { statusLabel, type ProjectStatus } from '../../content/projects'

const styles: Record<ProjectStatus, string> = {
  live: 'border-accent text-accent',
  ready: 'border-accent-2 text-accent-2',
  'in-development': 'border-line text-fg',
  'r-and-d': 'border-dashed border-muted text-muted',
}

const dot: Record<ProjectStatus, string> = {
  live: 'bg-accent motion-safe:animate-pulse',
  ready: 'bg-accent-2',
  'in-development': 'bg-fg',
  'r-and-d': 'border border-muted',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`mono-label inline-flex w-fit items-center gap-2 border px-2 py-1 ${styles[status]}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {statusLabel[status]}
    </span>
  )
}
