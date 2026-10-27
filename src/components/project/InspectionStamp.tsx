/**
 * Rubber stamp at the foot of an inspection report. Shows "INSPECTED ✓" only
 * when the report is complete; while facts are still TODO it honestly reads
 * "DRAFT · PENDING DATA" instead.
 */
export function InspectionStamp({ show, complete }: { show: boolean; complete: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`${show ? 'stamp-in' : 'opacity-0'} pointer-events-none select-none border-[3px] px-3 py-1.5 text-center font-mono font-bold uppercase leading-none tracking-[0.12em] [mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 2.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")] ${
        complete ? 'border-accent text-accent' : 'border-accent-2 text-accent-2'
      }`}
    >
      <span className="block text-lg">{complete ? 'Inspected ✓' : 'Draft'}</span>
      <span className="mt-1 block text-[0.55rem] tracking-[0.2em]">{complete ? 'ISTQB · CTFL' : 'Pending data'}</span>
    </div>
  )
}
