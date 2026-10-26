/**
 * Who you are. Edit freely — components read everything from here.
 */
export const profile = {
  name: 'Adewale Gbadamosi',
  role: 'Software Developer',
  location: 'Newfoundland, Canada',
  /** IANA zone used for the "my local time" readout in the hero. */
  timeZone: 'America/St_Johns',
  thesis: ['Engineer by training.', 'Scientist by method.', 'Developer by craft.'],
  edge: 'I think like an engineer, inspect like a QA professional, measure like a scientist, and ship like a developer.',
  email: 'adewalegbadamosi@gmail.com',
  links: {
    github: 'https://github.com/emeritus00',
    linkedin: 'https://www.linkedin.com/in/adewale-gbadamosi-0a228580',
  },
  /** Place your CV at public/cv.pdf. */
  cvPath: '/cv.pdf',
  certifications: [
    { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: '[TODO]' },
    { name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', year: '[TODO]' },
    { name: 'ISTQB Certified Tester (Foundation Level)', issuer: 'ISTQB', year: '[TODO]' },
  ],
  education: [
    { award: 'Diploma, Software Development', school: 'Keyin College', year: '2025' },
    { award: 'M.Sc., Environmental Science', school: 'Memorial University of Newfoundland', year: '[TODO]' },
    { award: 'B.Sc., Agricultural & Environmental Engineering', school: 'University of Ibadan', year: '[TODO]' },
  ],
  stack: {
    languages: ['Python', 'Java', 'JavaScript', 'TypeScript'],
    backend: ['Spring Boot', 'Node.js'],
    frontend: ['React'],
    data: ['PostgreSQL', 'MongoDB'],
    cloud: ['AWS', 'Docker', 'Terraform'],
  },
} as const

export type Profile = typeof profile
