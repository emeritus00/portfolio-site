import type { ReactNode } from 'react'
import { layers } from '../../content/layers'
import { profile } from '../../content/profile'
import { projects, statusLabel } from '../../content/projects'
import { askAssistant } from '../../lib/assistant/bus'
import { answer } from '../../lib/assistant/retrieve'
import { getTheme, setTheme } from '../../lib/theme'
import { Fact } from '../ui/Fact'
import { scrollToElement, scrollToLayer } from '../../motion/scroll'

export interface CommandResult {
  out: ReactNode[]
  /** Runs after output is printed. Return true to close the terminal. */
  after?: () => boolean | void
}

export interface Ctx {
  openMantle: () => void
}

interface Command {
  summary: string
  /** Hidden commands never appear in help or autocomplete. */
  hidden?: boolean
  run: (args: string[], ctx: Ctx) => CommandResult
}

const dim = (s: ReactNode) => <span className="text-muted">{s}</span>
const hi = (s: ReactNode) => <span className="text-accent">{s}</span>
const link = (href: string, text: string) => (
  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-accent underline underline-offset-2">
    {text}
  </a>
)
const pad = (s: string, n: number) => s.padEnd(n, ' ')

const drillable = layers.map((l) => l.id)

const scrollToProject = (slug: string) => {
  const el = document.getElementById(`${slug}-title`)?.closest('article')
  if (el instanceof HTMLElement) scrollToElement(el, -24)
}

export const commands: Record<string, Command> = {
  help: {
    summary: 'list commands',
    run: () => ({
      out: [
        dim('Available commands:'),
        ...Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .map(([name, c]) => (
            <span key={name}>
              {hi(pad(name, 14))}
              {dim(c.summary)}
            </span>
          )),
        dim('Tab completes · ↑↓ history · Esc closes'),
      ],
    }),
  },
  whoami: {
    summary: 'who is this',
    run: () => ({
      out: [
        <span key="n" className="font-semibold text-fg">
          {profile.name} · {profile.role}, {profile.location}
        </span>,
        profile.thesis.join(' '),
        dim(profile.edge),
      ],
    }),
  },
  ls: {
    summary: 'ls projects',
    run: (args) => {
      if (args.includes('-a')) {
        return {
          out: [
            <span key="a">
              {hi('projects/')}  {hi('layers/')}  stack.txt  certs.txt  {dim('.mantle')}
            </span>,
          ],
        }
      }
      if (args[0] === 'layers') {
        return { out: layers.map((l) => <span key={l.id}>{hi(pad(l.id, 13))}{l.chapter}</span>) }
      }
      if (args[0] && args[0] !== 'projects') return { out: [`ls: ${args[0]}: no such directory. Try ${hi('ls projects')}.`] }
      return {
        out: [
          ...projects.map((p) => (
            <span key={p.slug}>
              {hi(pad(p.slug, 22))}
              {pad(statusLabel[p.status], 20)}
              {dim(p.tagline)}
            </span>
          )),
          dim(`open <name> jumps to a project`),
        ],
      }
    },
  },
  open: {
    summary: 'open <project>',
    run: (args) => {
      const p = projects.find((x) => x.slug === args[0] || x.slug.startsWith(args[0] ?? '\0'))
      if (!p) return { out: [`open: unknown project. Try ${hi('ls projects')}.`] }
      return { out: [dim(`Opening ${p.name}…`)], after: () => (scrollToProject(p.slug), true) }
    },
  },
  cat: {
    summary: 'cat stack',
    run: (args) => {
      if (args[0] !== 'stack' && args[0] !== 'stack.txt') {
        return { out: [args[0] ? `cat: ${args[0]}: no such file` : `usage: ${hi('cat stack')}`] }
      }
      return {
        out: Object.entries(profile.stack).map(([k, v]) => (
          <span key={k}>
            {dim(pad(k, 12))}
            {v.join(' · ')}
          </span>
        )),
      }
    },
  },
  certs: {
    summary: 'certifications',
    run: () => ({ out: profile.certifications.map((c) => <span key={c.name}>{hi('✓ ')}{c.name}</span>) }),
  },
  drill: {
    summary: 'drill <layer>',
    run: (args, ctx) => {
      const target = args[0]
      if (target === 'mantle' || target === 'deeper') {
        // Open after the terminal has closed and handed focus back, so the egg keeps focus.
        return { out: [dim('Bit temperature rising…')], after: () => (setTimeout(ctx.openMantle, 450), true) }
      }
      if (!target || !drillable.includes(target as never)) {
        return { out: [`usage: drill <${drillable.join('|')}>`] }
      }
      return { out: [dim(`Drilling to ${target}…`)], after: () => (scrollToLayer(target), true) }
    },
  },
  contact: {
    summary: 'ways to reach me',
    run: () => ({
      out: [
        <span key="e">{dim(pad('email', 10))}{link(`mailto:${profile.email}`, profile.email)}</span>,
        <span key="g">{dim(pad('github', 10))}{link(profile.links.github, 'github.com/emeritus00')}</span>,
        <span key="l">{dim(pad('linkedin', 10))}{link(profile.links.linkedin, 'in/adewale-gbadamosi')}</span>,
      ],
    }),
  },
  resume: {
    summary: 'download CV',
    run: () =>
      profile.cvPath.includes('[TODO]')
        ? { out: ['The CV isn’t uploaded yet. Email me and I’ll send it.', link(`mailto:${profile.email}`, profile.email)] }
        : {
            out: [dim('Downloading CV…')],
            after: () => {
              window.open(profile.cvPath, '_blank')
            },
          },
  },
  ask: {
    summary: 'ask <question>',
    run: (args) => {
      if (!args.length) return { out: [dim('Opening the assistant…')], after: () => (setTimeout(() => askAssistant(), 400), true) }
      const { doc } = answer(args.join(' '))
      if (!doc) return { out: ['Not on the site. Try: ask what does he build?', dim(`Or email ${profile.email}`)] }
      return {
        out: [
          <span key="t" className="text-accent">{doc.title}</span>,
          <Fact key="a">{doc.answer}</Fact>,
          ...(doc.source ? [dim(`source: ${doc.source.label}`)] : []),
        ],
      }
    },
  },
  theme: {
    summary: 'theme [light|dark]',
    run: (args) => {
      const next = args[0] === 'light' || args[0] === 'dark' ? args[0] : getTheme() === 'dark' ? 'light' : 'dark'
      setTheme(next)
      return { out: [dim(`Theme set to ${next}.`)] }
    },
  },
  clear: { summary: 'clear the screen', run: () => ({ out: [] }) },
  exit: { summary: 'close terminal', run: () => ({ out: [], after: () => true }) },
  sudo: {
    summary: '',
    hidden: true,
    run: () => ({ out: ['Nice try. Bedrock is load-bearing.'] }),
  },
}

export function runCommand(input: string, ctx: Ctx): CommandResult & { clear?: boolean } {
  const [name, ...args] = input.trim().split(/\s+/)
  if (!name) return { out: [] }
  if (name === 'clear') return { out: [], clear: true }
  const cmd = commands[name.toLowerCase()]
  if (!cmd) return { out: [`${name}: command not found. Type help.`] }
  return cmd.run(args, ctx)
}

/** Tab completion over visible command names and their first argument. */
export function complete(input: string): string {
  const parts = input.trimStart().split(/\s+/)
  const visible = Object.entries(commands).filter(([, c]) => !c.hidden).map(([n]) => n)
  if (parts.length === 1) {
    const m = visible.filter((n) => n.startsWith(parts[0]))
    return m.length === 1 ? `${m[0]} ` : input
  }
  const options: Record<string, string[]> = {
    drill: drillable,
    open: projects.map((p) => p.slug),
    ls: ['projects', 'layers'],
    cat: ['stack'],
    theme: ['light', 'dark'],
  }
  const opts = options[parts[0]] ?? []
  const m = opts.filter((o) => o.startsWith(parts[1] ?? ''))
  return m.length === 1 ? `${parts[0]} ${m[0]}` : input
}
