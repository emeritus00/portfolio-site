/**
 * Renders content text, turning every "[TODO]" into a visible marker so
 * unconfirmed facts are impossible to miss (and never look like real claims).
 */
export function Fact({ children }: { children: string }) {
  const parts = children.split('[TODO]')
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && (
            <mark className="mono-label mx-0.5 rounded-sm border border-dashed border-accent bg-transparent px-1 py-px align-middle text-[0.6rem] text-accent">
              TODO
            </mark>
          )}
          {part}
        </span>
      ))}
    </>
  )
}
