/**
 * Ready-made CLAUDE.md starting points.
 *
 * These exist for two reasons. Most people want a good default rather than a
 * blank form, and a generated file that only ever lives in a client-side tool
 * is invisible to search — each preset here becomes its own page.
 *
 * Every preset follows the thin-file rule: CLAUDE.md is re-read on every task,
 * so anything used rarely belongs in a playbook the routing table points to.
 */

export interface Preset {
  slug: string
  name: string
  tagline: string
  stack: string[]
  /** Long procedures that should NOT live in CLAUDE.md, with their routing rule. */
  playbooks: { file: string; when: string }[]
  content: string
}

const SHARED_WORKFLOW = `## Working with Claude Code

- Explore the relevant files before proposing a change.
- For anything non-trivial, plan first (Shift+Tab into plan mode) and let me review.
- Run the verification command below before telling me something works.
- Keep commits small and conventional (\`feat:\`, \`fix:\`, \`docs:\`, \`chore:\`).`

export const PRESETS: Preset[] = [
  {
    slug: 'nextjs-supabase',
    name: 'Next.js + Supabase',
    tagline:
      'App Router, TypeScript, Tailwind and Supabase with row-level security.',
    stack: ['Next.js 14+', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    playbooks: [
      { file: 'db-migration.md', when: 'Changing the database schema' },
      { file: 'release.md', when: 'Cutting a production release' },
    ],
    content: `# <project name>

<One or two sentences: what this app does and who uses it.>

## Commands

- \`npm run dev\` — dev server
- \`npm run build\` — production build; must pass before any push
- \`npm run typecheck\` — TypeScript, no emit
- \`npm test\` — unit tests

## Architecture

- \`src/app\` — App Router pages and route handlers
- \`src/components\` — React components (PascalCase, one per file)
- \`src/lib\` — shared utilities (camelCase)
- Use the \`@/\` path alias for all imports.

## Conventions

IMPORTANT: Server Components by default. Add \`'use client'\` only for interactivity.
YOU MUST: use \`supabase.auth.getUser()\` in server components, never \`getSession()\`.
NEVER: commit \`.env.local\` or a service role key.

- Row-level security is always on. Filter soft deletes with \`.eq('is_deleted', false)\`.
- Add shadcn/ui components via the CLI; do not hand-write files in \`components/ui/\`.

## Verification

Run \`npm run build\` and \`npm run typecheck\`. Both must pass.

${SHARED_WORKFLOW}`,
  },
  {
    slug: 'r-data-analysis',
    name: 'R Data Analysis',
    tagline:
      'Tidyverse analysis project with reproducible figures and a clear data pipeline.',
    stack: ['R', 'tidyverse', 'ggplot2', 'renv'],
    playbooks: [
      { file: 'figure-standards.md', when: 'Producing a publication figure' },
      { file: 'data-import.md', when: 'Adding or refreshing a raw dataset' },
    ],
    content: `# <project name>

<What question this analysis answers, and for what output — paper, report, dashboard.>

## Commands

- \`Rscript scripts/00_run_all.R\` — full pipeline, raw data to figures
- \`renv::restore()\` — restore the package library
- \`Rscript -e 'testthat::test_dir("tests")'\` — tests

## Project Structure

- \`data/raw/\` — never edited, never written to
- \`data/processed/\` — generated; safe to delete and rebuild
- \`R/\` — functions only, no top-level side effects
- \`scripts/\` — numbered pipeline steps
- \`figures/\` — generated output

## Conventions

IMPORTANT: \`data/raw/\` is read-only. Every cleaning step is code, never a manual edit.
YOU MUST: set a seed for anything stochastic, and state it in the script.
NEVER: use \`setwd()\` or absolute paths. Use \`here::here()\`.

- Prefer tidyverse idiom; pipe with \`|>\`.
- Every figure is produced by a script, never saved by hand from the plot pane.

## Verification

Re-run the full pipeline from a clean \`data/processed/\`. It must reproduce every figure.

${SHARED_WORKFLOW}`,
  },
  {
    slug: 'python-research',
    name: 'Python Research Project',
    tagline:
      'Analysis codebase with notebooks for exploration and modules for anything reused.',
    stack: ['Python 3.11+', 'pandas', 'pytest', 'uv'],
    playbooks: [
      { file: 'experiment.md', when: 'Running a full experiment sweep' },
      { file: 'data-access.md', when: 'Pulling from the upstream data source' },
    ],
    content: `# <project name>

<What this project investigates, and what the output is.>

## Commands

- \`uv run python -m src.pipeline\` — run the pipeline
- \`uv run pytest\` — tests
- \`uv run ruff check .\` — lint

## Project Structure

- \`src/\` — importable modules; all reusable logic lives here
- \`notebooks/\` — exploration only
- \`data/raw/\`, \`data/processed/\` — raw is read-only
- \`outputs/\` — figures and tables, all generated

## Conventions

IMPORTANT: if a notebook cell gets reused, move it into \`src/\` and import it.
YOU MUST: type-hint anything in \`src/\`.
NEVER: commit data files or credentials.

- Set and record a random seed for anything stochastic.
- Paths come from a config module, never hard-coded.

## Verification

\`uv run pytest\` passes and the pipeline runs end to end from raw data.

${SHARED_WORKFLOW}`,
  },
  {
    slug: 'python-api',
    name: 'Python REST API',
    tagline: 'FastAPI service with typed schemas, tests and migrations.',
    stack: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'pytest'],
    playbooks: [
      { file: 'migration.md', when: 'Changing the database schema' },
      { file: 'deploy.md', when: 'Deploying to staging or production' },
    ],
    content: `# <project name>

<What this service does and who calls it.>

## Commands

- \`uv run uvicorn app.main:app --reload\` — dev server
- \`uv run pytest\` — tests
- \`uv run alembic upgrade head\` — apply migrations

## Architecture

- \`app/routers/\` — HTTP layer only; no business logic
- \`app/services/\` — business logic
- \`app/models/\` — SQLAlchemy models
- \`app/schemas/\` — Pydantic request and response models

## Conventions

IMPORTANT: routers stay thin. Logic belongs in services so it can be tested directly.
YOU MUST: define an explicit Pydantic response model for every endpoint.
NEVER: build SQL with string interpolation.

- Every schema change ships with a migration in the same commit.
- Secrets come from the environment, never from code or defaults.

## Verification

\`uv run pytest\` passes and the server starts cleanly.

${SHARED_WORKFLOW}`,
  },
  {
    slug: 'cli-tool',
    name: 'CLI Tool',
    tagline: 'A command-line tool where the interface is the contract.',
    stack: ['TypeScript or Python', 'argument parser', 'integration tests'],
    playbooks: [{ file: 'release.md', when: 'Publishing a new version' }],
    content: `# <project name>

<What the tool does, in one line, as a user would describe it.>

## Commands

- \`npm run build\` — build
- \`npm test\` — tests
- \`npm link\` — install locally for manual testing

## Architecture

- \`src/commands/\` — one file per subcommand
- \`src/lib/\` — logic, importable and testable without the CLI layer
- \`bin/\` — entry point

## Conventions

IMPORTANT: the command surface is a public contract. Renaming a flag is a breaking change.
YOU MUST: exit non-zero on failure and write errors to stderr.
NEVER: print secrets, tokens or full environment dumps in output or logs.

- Every command supports \`--help\`.
- Anything long-running gets progress output, and respects \`--quiet\`.

## Verification

Tests pass, and \`--help\` works for every subcommand.

${SHARED_WORKFLOW}`,
  },
  {
    slug: 'monorepo',
    name: 'Monorepo',
    tagline:
      'Several packages in one repository, where knowing the boundaries matters most.',
    stack: ['pnpm workspaces or Turborepo', 'TypeScript'],
    playbooks: [
      { file: 'add-package.md', when: 'Adding a new workspace package' },
      { file: 'release.md', when: 'Releasing and versioning packages' },
    ],
    content: `# <project name>

<What the system does, and what each package is responsible for.>

## Commands

- \`pnpm dev\` — everything in dev mode
- \`pnpm build\` — build all packages in dependency order
- \`pnpm test\` — all tests
- \`pnpm --filter <pkg> <cmd>\` — scope a command to one package

## Packages

- \`packages/core\` — shared domain logic; depends on nothing internal
- \`packages/ui\` — shared components
- \`apps/web\` — the application

## Conventions

IMPORTANT: dependencies point one way — apps depend on packages, never the reverse.
YOU MUST: state which package you are changing before editing.
NEVER: import across packages by relative path; use the package name.

- A change to \`core\` affects everything. Say so, and run the full build.

## Verification

\`pnpm build\` and \`pnpm test\` pass from the repository root.

${SHARED_WORKFLOW}`,
  },
]

export function getPreset(slug: string): Preset | undefined {
  return PRESETS.find((p) => p.slug === slug)
}

/** Renders the routing table that keeps rarely-used procedures out of CLAUDE.md. */
export function playbookSection(playbooks: Preset['playbooks']): string {
  if (!playbooks.length) return ''
  const rows = playbooks
    .map((p) => `- ${p.when} → read \`.claude/playbooks/${p.file}\` first`)
    .join('\n')
  return `\n## Playbooks\n\n${rows}\n`
}

/** The full file: preset body plus its playbook routing table. */
export function fullPreset(preset: Preset): string {
  return preset.content + '\n' + playbookSection(preset.playbooks)
}
