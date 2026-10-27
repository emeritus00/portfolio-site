import { docs, type Doc } from './knowledge'

/**
 * Small BM25 retriever over the knowledge docs. Deliberately simple: a few
 * hundred lines of content don't need embeddings, and it runs instantly offline.
 */

const STOP = new Set(
  'a an and are as at be but by can could did do does for from has have he her him his how i in is it its me my of on or our she so tell than that the their them then there they this to was what when where which who why will with would you your about any some more please know'.split(
    ' ',
  ),
)

/** Visitor words → the vocabulary the content uses. */
const SYNONYMS: Record<string, string> = {
  cert: 'certification',
  certified: 'certification',
  amazon: 'aws',
  qa: 'testing',
  tester: 'testing',
  tests: 'testing',
  quality: 'testing',
  hire: 'contact',
  reach: 'contact',
  email: 'contact',
  cv: 'resume',
  résumé: 'resume',
  llm: 'ai',
  gpt: 'ai',
  chatgpt: 'ai',
  claude: 'ai',
  copilot: 'ai',
  ml: 'ai',
  school: 'education',
  studied: 'education',
  job: 'experience',
  built: 'projects',
  apps: 'projects',
  work: 'projects',
  car: 'automotive',
  cars: 'automotive',
}

function stem(w: string) {
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3)
  if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2)
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1)
  return w
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/\[todo\]/g, ' ')
    .split(/[^a-z0-9é+#]+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => stem(SYNONYMS[w] ?? w))
}

interface Indexed {
  doc: Doc
  tf: Map<string, number>
  len: number
}

const index: Indexed[] = docs.map((doc) => {
  // Titles and keywords count double: they say what the doc is *about*.
  const tokens = [...tokenize(doc.title), ...tokenize(doc.title), ...tokenize(doc.keywords), ...tokenize(doc.keywords), ...tokenize(doc.answer)]
  const tf = new Map<string, number>()
  tokens.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1))
  return { doc, tf, len: tokens.length }
})
const avgLen = index.reduce((a, d) => a + d.len, 0) / index.length
const df = new Map<string, number>()
index.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1)))

function bm25(q: string[], d: Indexed, k1 = 1.4, b = 0.7) {
  return q.reduce((score, t) => {
    const f = d.tf.get(t)
    if (!f) return score
    const idf = Math.log(1 + (index.length - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5))
    return score + idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avgLen)))
  }, 0)
}

export interface Answer {
  doc: Doc | null
  related: Doc[]
}

const MIN_SCORE = 1.2

export function answer(question: string): Answer {
  const q = tokenize(question)
  if (!q.length) return { doc: null, related: [] }
  const ranked = index
    .map((d) => ({ doc: d.doc, score: bm25(q, d) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
  const top = ranked[0]
  if (!top || top.score < MIN_SCORE) return { doc: null, related: ranked.slice(0, 2).map((r) => r.doc) }
  return {
    doc: top.doc,
    related: ranked
      .slice(1)
      .filter((r) => r.score >= top.score * 0.55)
      .slice(0, 2)
      .map((r) => r.doc),
  }
}

export const suggestions = [
  'What does he build?',
  'Is he AWS certified?',
  'How does he approach testing?',
  'How does he use AI?',
  'Why the switch to software?',
  'How do I contact him?',
]
