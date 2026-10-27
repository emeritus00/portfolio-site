// Injects the server-rendered page into dist/index.html so the first paint needs no JavaScript,
// and defers the app bundle until after that paint. React then hydrates the HTML.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render } = await import(`${root}dist-ssr/entry-server.js`)

const file = `${root}dist/index.html`
const html = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`)

let out = html.replace(marker, `<div id="root">${render()}</div>`)

// Load the app only after the pre-rendered page has painted. Otherwise, on slow mobile
// connections, ~140 KB of JS competes with the render-blocking CSS and delays first paint.
// rAF fires once rendering is unblocked; the timeout lands just after that first frame.
const entry = out.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
if (!entry) throw new Error('prerender: entry <script type="module"> not found')
out = out
  .replace(entry[0], '')
  .replace(/\s*<link rel="modulepreload"[^>]*>/g, '')
  .replace('</head>', '    <script src="/boot.js" defer></script>\n  </head>')
await writeFile(`${root}dist/boot.js`, `requestAnimationFrame(() => setTimeout(() => import(${JSON.stringify(entry[1])}), 0))\n`)
await writeFile(file, out)
await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log('prerender: dist/index.html now contains the rendered page')
// Imported modules (GSAP's ticker) keep timers alive in Node; we're done.
process.exit(0)
