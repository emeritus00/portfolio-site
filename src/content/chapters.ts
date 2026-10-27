/**
 * Content for the three deep layers. Anything marked [TODO] renders with a
 * visible TODO marker until you replace it with the real fact.
 */

export interface Station {
  id: string
  /** Station code shown on the map, e.g. "ST-01". */
  code: string
  method: string
  detail: string
  /** Where this method resurfaces in software. */
  becomes: string
  /** Position on the contour map, in percent. */
  x: number
  y: number
}

export const sediment = {
  degree: 'M.Sc., Environmental Science',
  school: 'Memorial University of Newfoundland',
  research: {
    title: '[TODO] Thesis / research project title',
    focus: '[TODO] One or two sentences on what you studied and why it mattered.',
  },
  stations: [
    {
      id: 'sampling',
      code: 'ST-01',
      method: 'Field sampling',
      detail: '[TODO] What you sampled, where, and how.',
      becomes: 'Data collection & pipelines',
      x: 22,
      y: 34,
    },
    {
      id: 'lab',
      code: 'ST-02',
      method: 'Lab analysis',
      detail: '[TODO] Analytical methods / instruments used.',
      becomes: 'Repeatable, controlled testing',
      x: 58,
      y: 22,
    },
    {
      id: 'stats',
      code: 'ST-03',
      method: 'Statistical analysis',
      detail: '[TODO] Tools and techniques (e.g. R, Python, SPSS).',
      becomes: 'Data-driven decisions',
      x: 74,
      y: 62,
    },
    {
      id: 'reporting',
      code: 'ST-04',
      method: 'Scientific reporting',
      detail: '[TODO] Thesis, papers or reports produced.',
      becomes: 'Clear technical documentation',
      x: 34,
      y: 72,
    },
  ] satisfies Station[],
}

export interface CheckItem {
  label: string
  /** Where the habit shows up in software today. */
  today: string
}

export const metamorphic = {
  role: '[TODO] Job title',
  employer: '[TODO] Company, city',
  summary:
    'Vehicle assembly, inspection and quality control: working to specification, finding defects before customers do, and documenting what was found.',
  checklist: [
    { label: 'Work to the specification, not to memory', today: 'Requirements & acceptance criteria' },
    { label: 'Inspect at every stage, not just the end', today: 'Shift-left testing in CI' },
    { label: 'Record every non-conformance', today: 'Bug reports with repro steps' },
    { label: 'Trace defects to a root cause', today: 'Debugging & post-mortems' },
    { label: 'Release only what passes inspection', today: 'Quality gates before deploy' },
  ] satisfies CheckItem[],
}

export const bedrock = {
  degree: 'B.Sc., Agricultural & Environmental Engineering',
  school: 'University of Ibadan',
  summary:
    'Engineering fundamentals: design under constraints, systems thinking, and solving physical problems from first principles.',
  foundations: [
    { name: 'Engineering design', note: '[TODO] confirm / describe' },
    { name: 'Soil & water engineering', note: '[TODO] confirm / describe' },
    { name: 'Farm power & machinery', note: '[TODO] confirm / describe' },
    { name: 'Environmental engineering', note: '[TODO] confirm / describe' },
  ],
  principle: 'Every system rests on something. I learned to check the foundation first.',
}
