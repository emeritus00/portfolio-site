/** True when any of the given content still contains a "[TODO]" placeholder. */
export const hasTodo = (...values: (string | readonly string[])[]) =>
  values.flat().some((s) => s.includes('[TODO]'))
