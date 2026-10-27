# STRATA — Adewale Gbadamosi

A portfolio designed as a **career core sample**. Scrolling drills down through the layers of an unusual path:

| Layer | Chapter |
|---|---|
| Atmosphere | Cloud: hero and this site's own AWS architecture |
| Topsoil | Software development: stack, AI, projects |
| Sediment | M.Sc. Environmental Science |
| Metamorphic | Automotive quality control |
| Bedrock | B.Sc. Agricultural & Environmental Engineering |
| Core sample | Readout and contact |

Built with Vite, React, TypeScript, Tailwind CSS v4, GSAP ScrollTrigger and Lenis. It's hosted on AWS (S3 + CloudFront + ACM), provisioned with Terraform and deployed by GitHub Actions.

---

## Run it locally

You need Node 22+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | oxlint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Vitest unit tests (site assistant retrieval) |
| `npm run og` | Re-render `public/og-image.png` from `scripts/og/og.html` with your installed Chrome |

---

## Edit the content

Everything a visitor reads lives in `src/content/`. You never need to touch components to change text.

| File | Controls |
|---|---|
| `profile.ts` | Name, thesis, links, email, certifications, education, stack, AI practices, CV path |
| `layers.ts` | Each layer's title, years, depth range, summary |
| `projects.ts` | Projects: problem, role, stack, architecture diagram (nodes, edges, decisions), inspection report, status, links |
| `chapters.ts` | Sediment sampling stations, the Metamorphic checklist, Bedrock foundations |
| `throughline.ts` | Skills that start deep and resurface higher up (the glowing thread) |
| `site.ts` | Fig. 1 architecture, footer pipeline, Lighthouse scores |

### TODO markers
Unconfirmed facts are written as `[TODO]`. They render as a visible **TODO** badge, so nothing invented ever looks real. Search for them with:

```bash
grep -rn "\[TODO\]" src/content
```

A few behaviours depend on them:
- **Inspection stamps** read **"DRAFT · PENDING DATA"** until a project's inspection report has no TODOs left. After that, the stamp becomes **"INSPECTED ✓"**.
- **The CV button** shows a TODO until you put your CV at `public/cv.pdf` and set `cvPath: '/cv.pdf'` in `profile.ts`.

### The site assistant
"Ask the core" (the ✦ Ask button, or `ask …` in the terminal) answers questions using only your content. It builds its knowledge from `src/content/*` (see `src/lib/assistant/knowledge.ts`), and a small BM25 search runs in the browser. No AI model is called, there's no backend, and visitor questions never leave the page. If you add content that it should find, run `npm test`: the tests check that common questions still land on the right answers.

### Social preview image
`public/og-image.png` (1200×630) is rendered from `scripts/og/og.html`. Edit the HTML, then run `npm run og`.

---

## Deploy to AWS

```
GitHub (push to main) → Actions: lint · typecheck · test · build · terraform validate
                      → OIDC → IAM role → S3 sync → CloudFront invalidation
Visitor → (Route 53) → CloudFront (HTTPS, security headers) → private S3 bucket
```

### 1. Provision the infrastructure (one time)

You need the AWS CLI logged in to your account, and Terraform 1.10 or newer:

```bash
brew install awscli hashicorp/tap/terraform
```

No Homebrew? Use Docker instead, e.g. `docker run --rm -v ~/.aws:/root/.aws:ro -v "$PWD":/w -w /w hashicorp/terraform:1.13 plan`.

**New GitHub repos use immutable OIDC subjects** (`repo:owner@ID/name@ID:…`). Set `github_ids` in `terraform.tfvars`; the command is in `variables.tf`.

**State** lives in S3, not on your machine: the bucket `strata-portfolio-tfstate-286153084936` (ca-central-1) is versioned, encrypted, private and HTTPS-only. It keeps old state versions for 90 days, and `use_lockfile` stops two `apply` runs from colliding. The settings are in `infra/backend.hcl`.

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # set budget_email, github_repository, optional domain_name
terraform init -backend-config=backend.hcl
terraform apply
```

This creates:
- a private S3 bucket
- a CloudFront distribution with Origin Access Control and security headers (including a strict CSP)
- an ACM certificate and Route 53 records, only if `domain_name` is set
- an OIDC-trusted deploy role for GitHub Actions, allowed to write only this bucket and invalidate only this distribution
- a $5/month budget alert

**Custom domain:** register it in Route 53 first, or create a hosted zone for it there, then set `domain_name`. Leave it empty to use the `*.cloudfront.net` URL.

**State bucket (one time, before the first `init`).** It's created with the AWS CLI rather than Terraform, because Terraform needs it to exist first:

```bash
B=strata-portfolio-tfstate-<your-account-id>
aws s3api create-bucket --bucket $B --region ca-central-1 --create-bucket-configuration LocationConstraint=ca-central-1
aws s3api put-bucket-versioning --bucket $B --versioning-configuration Status=Enabled
aws s3api put-public-access-block --bucket $B --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

Then set `bucket` in `infra/backend.hcl`.

### 2. Connect GitHub

Push this repo to GitHub. Then, under **Settings → Secrets and variables → Actions → Variables**, add the values from `terraform output`:

| Variable | From |
|---|---|
| `AWS_ROLE_ARN` | `deploy_role_arn` |
| `AWS_REGION` | `aws_region` |
| `S3_BUCKET` | `s3_bucket` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` |
| `SITE_URL` | `site_url` |

These are variables, not secrets: none of them grants access on its own. The OIDC trust policy only accepts pushes to `main` of the repository named in `github_repository`.

### 3. Ship

Push to `main`. The pipeline (`.github/workflows/ci.yml`) runs these steps:
1. **Verify:** lint, type-check, test and build.
2. **Infra check:** `terraform fmt` and `terraform validate`.
3. **Deploy**, only on `main` and only once `AWS_ROLE_ARN` exists:
   - hashed assets are uploaded with a 1-year immutable cache;
   - `index.html` and the other root files are always revalidated by browsers, but CloudFront keeps them at the edge for a day (`s-maxage`), so visitors never wait on S3;
   - CloudFront is invalidated.

Pull requests run steps 1–2 only.

### Cost
At portfolio traffic, about **$0–0.05/month** without a domain. CloudFront's always-free tier covers 1 TB and 10M requests a month. With a custom domain, add $0.50/month for the Route 53 hosted zone plus the domain's yearly fee (~$15 for a .com). The budget alarm emails you well before anything surprising.

---

## Quality bar

- **Lighthouse (mobile, live site):** Performance 93–100 (100 on a warm edge cache), Accessibility 100, Best Practices 100, SEO 100.
- **Pre-rendered:** `npm run build` renders the page to static HTML (`src/entry-server.tsx`, `scripts/prerender.mjs`), so it paints with no JavaScript. The app bundle is fetched only after that first paint (`boot.js`), then React hydrates.
- **Bundle splitting:** first load is about 141 KB of JS (gzip). The terminal, easter egg, assistant and animation library load only when used.
- **Reduced motion:** `prefers-reduced-motion` gives a calm, static version with no smooth scroll and no moving particles, with everything drawn immediately.
- **Keyboard:** the whole site works from the keyboard, with visible focus, a skip link and focus returned after every overlay.
- **Phones:** heavy effects are skipped, and the depth gauge becomes a bottom bar.
- **Light/dark:** follows the OS setting, can be switched in the toolbar or with `theme light|dark`, and never flashes the wrong theme on load.

## Project structure

```
src/
  content/        ← all editable text and data
  layers/         one component per stratum
  components/     depth gauge, terminal, assistant, project cards, diagrams, through-line, core tray, footer
  lib/            hatches, theme, assistant retrieval, seeded randomness
  motion/         Lenis + GSAP ScrollTrigger setup
  hooks/
infra/            Terraform (S3, CloudFront, ACM, Route 53, OIDC deploy role, budget)
scripts/og/       social preview image source
.github/workflows CI/CD
```

## Hidden extras
Press `/` and type `help`. There's more than `help` lists.
