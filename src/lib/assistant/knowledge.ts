import { bedrock, metamorphic, sediment } from '../../content/chapters'
import { layers, type LayerId } from '../../content/layers'
import { profile } from '../../content/profile'
import { projects, statusLabel } from '../../content/projects'
import { siteNodes } from '../../content/site'

/**
 * Everything the assistant knows, generated from the content files, so it can
 * never say anything the site itself doesn't. Edit content, not this file.
 */
export interface Doc {
  id: string
  title: string
  /** Extra search terms that should lead here. */
  keywords: string
  /** The answer shown to the visitor ("[TODO]" renders as a marker). */
  answer: string
  /** Where on the page the answer comes from. */
  source?: { label: string; layer?: LayerId; project?: string }
}

const list = (xs: readonly string[]) =>
  xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`

const layer = (id: LayerId) => layers.find((l) => l.id === id)!
/** Lower-case the first letter only, so acronyms like CI and AWS survive mid-sentence. */
const lc = (s: string) => s[0].toLowerCase() + s.slice(1)

export const docs: Doc[] = [
  {
    id: 'about',
    title: 'Who is Adewale?',
    keywords: 'who about yourself introduce summary background overview profile name',
    answer: `${profile.name} is a ${profile.role.toLowerCase()} based in ${profile.location}. ${profile.thesis.join(' ')} ${profile.edge}`,
    source: { label: 'Sheet 01 · Cloud', layer: 'atmosphere' },
  },
  {
    id: 'path',
    title: 'Career path',
    keywords: 'career path journey history experience background transition switch change why software unusual',
    answer:
      'His path runs bottom-up like this site: a B.Sc. in Agricultural & Environmental Engineering (University of Ibadan), then assembly, inspection and quality control in the Nigerian automotive industry, then an M.Sc. in Environmental Science (Memorial University), and now software development (Keyin College diploma, 2025). Each layer left a habit he still uses: systems thinking, inspection, and measurement.',
    source: { label: 'Core log', layer: 'core' },
  },
  {
    id: 'stack',
    title: 'Tech stack',
    keywords: 'stack technologies languages tools frameworks python java spring boot javascript typescript node react docker terraform postgres postgresql mongodb skills',
    answer: Object.entries(profile.stack)
      .map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${list(v)}.`)
      .join(' '),
    source: { label: 'Topsoil · $ cat stack', layer: 'topsoil' },
  },
  {
    id: 'certs',
    title: 'Certifications',
    keywords: 'certifications certified certificate credentials aws solutions architect developer associate istqb exam',
    answer: `${list(profile.certifications.map((c) => c.name))}.`,
    source: { label: 'Topsoil · $ certs', layer: 'topsoil' },
  },
  {
    id: 'cloud',
    title: 'AWS and cloud',
    keywords: 'aws amazon cloud lambda s3 cloudfront terraform infrastructure devops deploy deployment iac',
    answer:
      'He holds both the AWS Solutions Architect – Associate and AWS Developer – Associate certifications and works with Docker and Terraform. This site is itself the demo: S3 + CloudFront + ACM, provisioned with Terraform and deployed by GitHub Actions.',
    source: { label: 'Fig. 1 · this page, as deployed', layer: 'atmosphere' },
  },
  {
    id: 'testing',
    title: 'Testing and QA',
    keywords: 'testing test qa quality assurance istqb tester inspection bugs coverage approach automation unit integration',
    answer: `He is an ISTQB Certified Tester, and quality is the thread through his whole career: he inspected vehicles before he tested software. Every project on this site carries an inspection report (scope, approach, coverage, known limits). ${metamorphic.checklist
      .slice(0, 3)
      .map((c) => `"${c.label}" became ${lc(c.today)}`)
      .join('; ')}.`,
    source: { label: 'Metamorphic · inspection checklist', layer: 'metamorphic' },
  },
  {
    id: 'ai',
    title: 'AI',
    keywords: 'ai artificial intelligence llm llms gpt claude openai copilot machine learning ml genai prompt generative',
    answer: `His AI work: ${list(profile.ai.practices.map((p) => p.name))}. ${profile.ai.principle} ${profile.ai.practices
      .map((p) => `${p.name}: ${p.detail}`)
      .join(' ')}`,
    source: { label: 'Topsoil · $ cat ai.md', layer: 'topsoil' },
  },
  {
    id: 'projects',
    title: 'Projects',
    keywords: 'projects portfolio work built build apps applications products showcase examples',
    answer: projects.map((p) => `${p.name} (${statusLabel[p.status]}): ${p.tagline}.`).join(' '),
    source: { label: 'Topsoil · core samples', layer: 'topsoil' },
  },
  ...projects.map<Doc>((p) => ({
    id: `project-${p.slug}`,
    title: p.name,
    keywords: `${p.name} ${p.slug.replaceAll('-', ' ')} ${p.tagline} ${p.stack.join(' ')} ${p.architecture.nodes.map((n) => n.label).join(' ')}`,
    answer: `${p.name} (${statusLabel[p.status]}): ${p.tagline}. ${p.problem} Stack: ${list(p.stack)}. ${p.links.note ?? ''}`.trim(),
    source: { label: `Project · ${p.name}`, project: p.slug },
  })),
  {
    id: 'sediment',
    title: 'Environmental science',
    keywords: 'environmental science msc masters memorial university research thesis sampling data analysis statistics lab science',
    answer: `${sediment.degree}, ${sediment.school}. Research: ${sediment.research.title}. Methods he still uses: ${list(
      sediment.stations.map((s) => `${lc(s.method)} (now ${lc(s.becomes)})`),
    )}.`,
    source: { label: `Sheet 03 · ${layer('sediment').name}`, layer: 'sediment' },
  },
  {
    id: 'automotive',
    title: 'Automotive quality control',
    keywords: 'automotive car vehicle assembly inspection quality control qc nigeria manufacturing factory industry',
    answer: `${metamorphic.summary} Role: ${metamorphic.role}, ${metamorphic.employer}.`,
    source: { label: `Sheet 04 · ${layer('metamorphic').name}`, layer: 'metamorphic' },
  },
  {
    id: 'engineering',
    title: 'Engineering degree',
    keywords: 'engineering bsc bachelor degree university ibadan agricultural foundation undergraduate',
    answer: `${bedrock.degree}, ${bedrock.school}. ${bedrock.summary}`,
    source: { label: `Sheet 05 · ${layer('bedrock').name}`, layer: 'bedrock' },
  },
  {
    id: 'education',
    title: 'Education',
    keywords: 'education school study studied degrees diploma college qualifications keyin',
    answer: profile.education.map((e) => `${e.award}, ${e.school} (${e.year}).`).join(' '),
    source: { label: 'Core log', layer: 'core' },
  },
  {
    id: 'location',
    title: 'Location',
    keywords: 'where based location live city country canada newfoundland remote timezone time zone relocate',
    answer: `He's based in ${profile.location} (Newfoundland time). For questions about remote work or relocation, it's best to ask him directly.`,
    source: { label: 'Sheet 01 · title block', layer: 'atmosphere' },
  },
  {
    id: 'contact',
    title: 'Contact',
    keywords: 'contact email reach hire hiring available availability interview message talk connect linkedin github cv resume',
    answer: `Email ${profile.email}, or find him on GitHub (emeritus00) and LinkedIn. Availability and role details are best confirmed with him directly.`,
    source: { label: 'Sheet 06 · contact', layer: 'core' },
  },
  {
    id: 'site',
    title: 'How this site is built',
    keywords: 'site website portfolio built made how stack vite react typescript tailwind gsap lenis hosting',
    answer: `Vite, React, TypeScript and Tailwind, with GSAP and Lenis for the scroll. It's hosted on AWS: ${siteNodes
      .filter((n) => n.id !== 'visitor')
      .map((n) => n.label)
      .join(', ')}.`,
    source: { label: 'Fig. 1', layer: 'atmosphere' },
  },
  {
    id: 'assistant',
    title: 'How this assistant works',
    keywords: 'assistant chatbot bot chat you yourself this how work works private privacy retrieval search answer',
    answer:
      'I’m a retrieval assistant that runs entirely in your browser. I match your question against this site’s own content and answer only from it, so I can’t make things up. No AI model is called and nothing you type leaves this page.',
  },
  {
    id: 'egg',
    title: 'Secrets',
    keywords: 'easter egg secret hidden fun surprise joke',
    answer: 'Open the terminal (press /) and list everything, including hidden files. Then drill deeper than the brief asked.',
  },
]
