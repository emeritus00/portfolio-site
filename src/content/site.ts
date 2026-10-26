/**
 * The architecture of this site itself. Drawn as "Fig. 1" in the hero and
 * reused by the "How this site is built" footer panel.
 * Coordinates live in a 560 × 440 drawing space.
 */
export interface SiteNode {
  id: string
  /** Borehole-style marker, e.g. "BH-03". */
  tag: string
  label: string
  x: number
  y: number
  role: string
}

export interface SiteEdge {
  id: string
  from: string
  to: string
  /** Orthogonal SVG path in drawing coordinates. */
  d: string
  label: string
  /** Control-plane edges (provisioning) are drawn dashed. */
  control?: boolean
}

export const siteNodes: SiteNode[] = [
  { id: 'visitor', tag: 'BH-01', label: 'You', x: 48, y: 214, role: 'Your browser, wherever you are reading from.' },
  { id: 'dns', tag: 'BH-02', label: 'Route 53', x: 196, y: 70, role: 'DNS: resolves the domain to the CloudFront distribution.' },
  { id: 'cdn', tag: 'BH-03', label: 'CloudFront', x: 236, y: 214, role: 'CDN: serves the site from the edge over HTTPS, with long-lived caching for hashed assets.' },
  { id: 'acm', tag: 'BH-04', label: 'ACM', x: 236, y: 366, role: 'Certificate Manager: the free TLS certificate CloudFront presents.' },
  { id: 's3', tag: 'BH-05', label: 'S3', x: 440, y: 214, role: 'Private bucket holding the built site. Only CloudFront can read it (Origin Access Control).' },
  { id: 'ci', tag: 'BH-06', label: 'GitHub Actions', x: 440, y: 62, role: 'CI/CD: lint, type-check, test, build, then sync to S3 and invalidate the cache.' },
  { id: 'iac', tag: 'BH-07', label: 'Terraform', x: 440, y: 366, role: 'Infrastructure as code: every resource above is declared in /infra.' },
]

export const siteEdges: SiteEdge[] = [
  { id: 'e-dns', from: 'visitor', to: 'dns', d: 'M48 214 V70 H196', label: 'DNS' },
  { id: 'e-req', from: 'visitor', to: 'cdn', d: 'M48 214 H236', label: 'HTTPS' },
  { id: 'e-tls', from: 'acm', to: 'cdn', d: 'M236 366 V214', label: 'TLS' },
  { id: 'e-origin', from: 'cdn', to: 's3', d: 'M236 214 H440', label: 'OAC' },
  { id: 'e-deploy', from: 'ci', to: 's3', d: 'M440 62 V214', label: 'deploy' },
  { id: 'e-inval', from: 'ci', to: 'cdn', d: 'M440 62 H300 V214', label: 'invalidate' },
  { id: 'e-iac-s3', from: 'iac', to: 's3', d: 'M440 366 V214', label: 'provisions', control: true },
  { id: 'e-iac-acm', from: 'iac', to: 'acm', d: 'M440 366 H236', label: '', control: true },
]
