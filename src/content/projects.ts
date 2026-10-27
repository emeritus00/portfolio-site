/**
 * Topsoil projects. Everything visible on a project card comes from here.
 *
 * Rules: never invent metrics, users or results. Anything not yet confirmed
 * is written as "[TODO] …" and renders with a visible TODO marker.
 */

export type ProjectStatus = 'live' | 'ready' | 'in-development' | 'r-and-d'

export const statusLabel: Record<ProjectStatus, string> = {
  live: 'Live',
  ready: 'Complete · Private',
  'in-development': 'In development',
  'r-and-d': 'R&D',
}

export type ArchNodeKind = 'client' | 'edge' | 'api' | 'service' | 'data' | 'cloud' | 'external'

export interface ArchNode {
  id: string
  label: string
  kind: ArchNodeKind
  /** Why this piece exists — shown when the node is clicked. */
  decision: string
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
}

export interface InspectionReport {
  /** What was tested (features / risks). */
  scope: string[]
  /** Test approach and levels (ISTQB terms welcome). */
  approach: string[]
  /** Coverage statement — only real numbers, or a TODO. */
  coverage: string
  knownLimitations: string[]
}

export interface Project {
  slug: string
  name: string
  tagline: string
  status: ProjectStatus
  problem: string
  role: string
  stack: string[]
  architecture: { nodes: ArchNode[]; edges: ArchEdge[] }
  inspection: InspectionReport
  links: { repo?: string; live?: string; note?: string }
}

export const projects: Project[] = [
  {
    slug: 'kilariti',
    name: 'Kilariti.',
    tagline: 'Multi-tenant invoicing platform',
    status: 'ready',
    problem:
      'Small businesses need to issue, track and reconcile invoices without their data ever leaking between organisations. [TODO] refine problem statement.',
    role: 'Sole developer — design, build and test. [TODO] confirm.',
    stack: ['[TODO] stack'],
    architecture: {
      nodes: [
        { id: 'client', label: 'Web client', kind: 'client', decision: '[TODO] Why this frontend approach.' },
        { id: 'api', label: 'API', kind: 'api', decision: '[TODO] How tenant context is resolved on every request.' },
        { id: 'db', label: 'Database', kind: 'data', decision: '[TODO] Tenant isolation strategy (row-level, schema-per-tenant, …).' },
      ],
      edges: [
        { from: 'client', to: 'api', label: 'HTTPS' },
        { from: 'api', to: 'db', label: 'tenant-scoped' },
      ],
    },
    inspection: {
      scope: ['Tenant data isolation', 'Invoice lifecycle', '[TODO]'],
      approach: ['[TODO] test levels and techniques used'],
      coverage: '[TODO]',
      knownLimitations: ['Not yet deployed', '[TODO]'],
    },
    links: { note: 'Private repository · not yet deployed' },
  },
  {
    slug: 'aviation-management',
    name: 'Aviation Management System',
    tagline: 'Full-stack airport & flight management, deployed on AWS',
    status: 'live',
    problem: '[TODO] What problem does it solve and for whom?',
    role: '[TODO] Your role.',
    stack: ['[TODO] stack', 'AWS'],
    architecture: {
      nodes: [
        { id: 'client', label: 'Frontend', kind: 'client', decision: '[TODO]' },
        { id: 'api', label: 'Backend API', kind: 'api', decision: '[TODO]' },
        { id: 'db', label: 'Database', kind: 'data', decision: '[TODO]' },
        { id: 'aws', label: 'AWS hosting', kind: 'cloud', decision: '[TODO] Which AWS services and why.' },
      ],
      edges: [
        { from: 'client', to: 'api', label: 'REST' },
        { from: 'api', to: 'db' },
        { from: 'aws', to: 'api', label: 'hosts' },
      ],
    },
    inspection: {
      scope: ['[TODO]'],
      approach: ['[TODO]'],
      coverage: '[TODO]',
      knownLimitations: ['[TODO]'],
    },
    links: { repo: '[TODO]', live: '[TODO]' },
  },
  {
    slug: 'carpadi',
    name: 'CarPadi',
    tagline: 'Two-sided vehicle rental marketplace for Nigeria',
    status: 'in-development',
    problem:
      'Vehicle owners and renters in Lagos, Abuja, Port Harcourt and Ibadan lack a trusted way to find each other. [TODO] refine.',
    role: '[TODO] Your role.',
    stack: ['[TODO] stack'],
    architecture: {
      nodes: [
        { id: 'renter', label: 'Renter app', kind: 'client', decision: '[TODO]' },
        { id: 'owner', label: 'Owner app', kind: 'client', decision: '[TODO]' },
        { id: 'api', label: 'Marketplace API', kind: 'api', decision: '[TODO]' },
        { id: 'db', label: 'Database', kind: 'data', decision: '[TODO]' },
      ],
      edges: [
        { from: 'renter', to: 'api' },
        { from: 'owner', to: 'api' },
        { from: 'api', to: 'db' },
      ],
    },
    inspection: {
      scope: ['[TODO]'],
      approach: ['[TODO]'],
      coverage: '[TODO]',
      knownLimitations: ['In active development'],
    },
    links: { note: 'In development' },
  },
  {
    slug: 'bimz-food-hub',
    name: 'Bimz Food Hub',
    tagline: 'Bulk food-sharing platform — web + mobile',
    status: 'ready',
    problem:
      'Households in Lagos pool bulk food orders on a weekly cycle: purchases happen on market day and deliveries go out at the weekend.',
    role: '[TODO] Your role.',
    stack: ['React', '[TODO] backend', '[TODO] mobile'],
    architecture: {
      nodes: [
        { id: 'web', label: 'React web app', kind: 'client', decision: '[TODO]' },
        { id: 'mobile', label: 'Mobile app', kind: 'client', decision: '[TODO]' },
        { id: 'api', label: 'Backend API', kind: 'api', decision: '[TODO]' },
        { id: 'cycle', label: 'Weekly order cycle', kind: 'service', decision: '[TODO] How the cycle closes orders before market day.' },
        { id: 'db', label: 'Database', kind: 'data', decision: '[TODO]' },
      ],
      edges: [
        { from: 'web', to: 'api' },
        { from: 'mobile', to: 'api' },
        { from: 'api', to: 'cycle' },
        { from: 'api', to: 'db' },
      ],
    },
    inspection: {
      scope: ['Order cycle cut-off', '[TODO]'],
      approach: ['[TODO]'],
      coverage: '[TODO]',
      knownLimitations: ['Not yet deployed', '[TODO]'],
    },
    links: { note: 'Private repository · not yet deployed' },
  },
  {
    slug: 'dovas-auto',
    name: 'Dovas Auto',
    tagline: 'Bookings, garage management & spare parts for a multi-location workshop',
    status: 'ready',
    problem:
      'A multi-location auto workshop needs one system for workshop, home, office and roadside bookings, garage operations, and parts sales that checks a part actually fits the customer’s car.',
    role: '[TODO] Your role.',
    stack: ['[TODO] stack'],
    architecture: {
      nodes: [
        { id: 'client', label: 'Customer app', kind: 'client', decision: '[TODO]' },
        { id: 'staff', label: 'Garage dashboard', kind: 'client', decision: '[TODO]' },
        { id: 'api', label: 'API', kind: 'api', decision: '[TODO]' },
        { id: 'match', label: 'Car-matching check', kind: 'service', decision: '[TODO] How part ↔ vehicle compatibility is verified.' },
        { id: 'db', label: 'Database', kind: 'data', decision: '[TODO]' },
      ],
      edges: [
        { from: 'client', to: 'api' },
        { from: 'staff', to: 'api' },
        { from: 'api', to: 'match' },
        { from: 'api', to: 'db' },
      ],
    },
    inspection: {
      scope: ['Booking types', 'Part compatibility checks', '[TODO]'],
      approach: ['[TODO]'],
      coverage: '[TODO]',
      knownLimitations: ['Not yet deployed', '[TODO]'],
    },
    links: { note: 'Private repository · not yet deployed' },
  },
  {
    slug: 'agri-quality-grading',
    name: 'Agri Quality Grading Platform',
    tagline: 'Farmer-to-buyer marketplace with photo-based produce grading',
    status: 'r-and-d',
    problem:
      'Buyers can’t judge produce quality remotely, so farmers lose on price. Computer-vision grading from a photo aims to make quality visible. [TODO] refine.',
    role: '[TODO] Your role.',
    stack: ['[TODO] stack'],
    architecture: {
      nodes: [
        { id: 'farmer', label: 'Farmer app', kind: 'client', decision: '[TODO]' },
        { id: 'api', label: 'Marketplace API', kind: 'api', decision: '[TODO]' },
        { id: 'cv', label: 'Grading model', kind: 'service', decision: '[TODO] Model approach — research stage.' },
        { id: 'buyer', label: 'Buyer app', kind: 'client', decision: '[TODO]' },
      ],
      edges: [
        { from: 'farmer', to: 'api', label: 'photo' },
        { from: 'api', to: 'cv', label: 'grade' },
        { from: 'buyer', to: 'api' },
      ],
    },
    inspection: {
      scope: ['[TODO]'],
      approach: ['[TODO]'],
      coverage: 'Research stage — not applicable yet',
      knownLimitations: ['Research & development'],
    },
    links: { note: 'Research & development' },
  },
]
