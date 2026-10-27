// Injects the server-rendered page into dist/index.html so the first paint needs no JavaScript.
// React then hydrates that HTML instead of building the page from scratch.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render } = await import(`${root}dist-ssr/entry-server.js`)

const file = `${root}dist/index.html`
const html = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`)

await writeFile(file, html.replace(marker, `<div id="root">${render()}</div>`))
await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log('prerender: dist/index.html now contains the rendered page')
// Imported modules (GSAP's ticker) keep timers alive in Node; we're done.
process.exit(0)
