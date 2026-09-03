# Claude Code Learning Hub

**[codewithclaude.net](https://codewithclaude.net)**

A free, guided learning platform for Claude Code, VS Code, Git/GitHub, Python, R, MCP, and AI agents. Step-by-step tutorials designed for beginners through advanced developers.

*Last updated: 2026-09-03*

## Quick Start

```bash
git clone git@github.com:adrianstier/claude-code-integration.git
cd claude-code-integration
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Content**: MDX with gray-matter frontmatter, remark-gfm, rehype-highlight, rehype-slug
- **Styling**: Tailwind CSS 3 with @tailwindcss/typography, dark mode (`class` strategy)
- **Fonts**: Plus Jakarta Sans (body), Space Grotesk (display), JetBrains Mono (code) via next/font
- **Testing**: Jest + Testing Library (unit), Playwright (E2E)
- **Analytics**: GA4 (optional, via `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- **Deployment**: Vercel (primary), Render config also present
- **SEO**: JSON-LD structured data, OpenGraph/Twitter cards, sitemap, RSS feed, robots.txt

## Learning Tracks

| Track | Lessons | Duration | Shape |
|---|---|---|---|
| **Start Here** — setup, platforms, research workflows, voice & remote | 11 | 5.3 hours | Landing page + articles |
| **AI Agents** — using, building, the Agent SDK, multi-agent architectures | 5 | 11 hours | Landing page + articles |
| **App Builder** — web apps, computer use & dispatch | 2 | 7.4 hours | Self-contained landing page + 1 article |
| **Advanced Topics** — best practices, power features, skills, plugins & hooks | 5 | 4.6 hours | Landing page + articles |
| **Data Analysis** — Python & R for data work | 2 | 4 hours | Landing page + articles |
| **Automation** — scripts & workflow automation | 1 | 3.5 hours | Self-contained landing page |
| **MCP Integration** — Model Context Protocol servers & workflows | 4 | 3 hours | Landing page + articles |
| **Git & GitHub** — version control fundamentals | 1 | 90 min | Self-contained landing page |

Three tracks (`git-github`, `automation`, `app-builder`) carry their tutorial **on the landing page itself**, declared with `selfContained: true` in `index.mdx` frontmatter. The homepage reads durations and readiness from the content via `getTrackStats()` (`src/lib/tracks.ts`) rather than a hardcoded list, so a card cannot advertise a track that has not been written.

## Interactive Tools

- **CLAUDE.md Generator** (`/tools/claude-md-generator`) — Build project config files interactively
- **Slash Commands Library** (`/tools/slash-commands`) — Ready-to-use commands
- **MCP Explorer** (`/tools/mcp-explorer`) — Browse MCP servers
- **Cheatsheets** (`/tools/cheatsheets`) — Quick reference cards
- **Snippets** (`/tools/snippets`) — Copy-paste code patterns
- **Templates** (`/tools/templates`) — Project starter templates

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    [track]/[slug]/       # Dynamic content routes
    api/newsletter/       # Newsletter signup endpoint
    blog/                 # Blog with RSS feed
    glossary/             # Glossary page
    resources/            # Curated resources
    tools/                # Interactive tools (6 tools)
    authors/              # Author pages
  components/
    mdx/                  # MDX components (Callout, Tabs, Steps, FileTree, etc.)
    ui/                   # Reusable UI primitives (Button, Badge, Input, etc.)
    Navigation.tsx        # Main nav with mobile menu
    Footer.tsx
    ThemeProvider.tsx      # Dark mode provider
    ProgressTracker.tsx    # Client-side progress (localStorage)
    SearchModal.tsx        # Search overlay
    ...
  lib/
    mdx.ts                # MDX file loading & frontmatter parsing
    search.ts             # Builds the search index from content/ at build time
    tracks.ts             # Derives per-track lesson count & duration from content
    metadata.ts           # SEO metadata & JSON-LD schema generators
    analytics.ts          # GA4 event tracking
    constants.ts          # Track definitions, site config
    resources.ts          # Resource data helpers
    blog.ts               # Blog utilities
  data/
    resources.ts          # Curated resource listings
content/                  # MDX learning content
  start-here/             # 11 articles (setup, platforms, voice/remote, research)
  advanced-topics/        # 5 articles (best practices, power features, skills, plugins)
  agents/                 # 5 articles (using, building, products, multi-agent, SDK)
  mcp/                    # 4 articles (fundamentals, servers, custom, workflows)
  data-analysis/          # 2 articles (Python intro, R intro)
  app-builder/            # Self-contained landing page + computer use & dispatch
  git-github/             # Self-contained landing page (the whole tutorial)
  automation/             # Self-contained landing page (the whole tutorial)
  blog/                   # Blog posts
templates/                # Starter templates for new projects
public/                   # Static assets, OG image, manifest, robots.txt
tests/                    # Playwright E2E specs
scripts/                  # DB migration & validation scripts
```

## Scripts

```bash
npm run dev              # Dev server on port 3001
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
npm run format           # Prettier (write)
npm run format:check     # Prettier (check)
npm run typecheck        # tsc --noEmit
npm test                 # Jest
npm run test:watch       # Jest watch
npm run test:coverage    # Jest coverage
npm run validate:resources  # Validate resource links
```

## Environment Variables

Copy `.env.example` to `.env.local`. All are optional for local dev:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID
- `NEXT_PUBLIC_SITE_URL` — Production URL (defaults to `https://codewithclaude.net`)
- `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` — Newsletter (Resend)
- `NEXT_PUBLIC_ENABLE_AUTH` — Feature flag (unused in V1)
- `NEXT_PUBLIC_ENABLE_PROGRESS_TRACKING` — Feature flag (unused in V1)

## Design System

Custom Tailwind theme with warm color palette:

- **Primary**: Terracotta (`primary-*`) — CTAs, branding
- **Ink**: Slate (`ink-*`) — Text, dark UI
- **Paper**: Warm white (`paper-*`) — Backgrounds
- **Accents**: `cobalt-*` (blue), `sage-*` (green), `amber-*` (yellow), `plum-*` (purple) — Track colors
- **Shadows**: Custom warm shadows (`shadow-card`, `shadow-glow`, `shadow-elevated`)
- **Animations**: `fade-in`, `fade-in-up`, `slide-in-right`, `scale-in`, `float`, `shimmer`

## Content Authoring

Articles are MDX files in `content/<track>/<slug>.mdx` with frontmatter:

```yaml
---
title: "Article Title"
description: "Brief description for SEO"
order: 1                # unique within the track; index.mdx is always 0
track: "start-here"
duration: "15 min"      # feeds the homepage track duration
platform: "both"        # mac | windows | both
prerequisites: ["mac-setup"]
lastUpdated: "2026-03-28"
---
```

**Do not start the MDX body with an `# H1`.** The page shell renders the `title`
as the page's only `<h1>`; a heading in the body creates a second one. Start at
`##`.

Available MDX components: `Callout`, `Tabs`/`Tab`, `Steps`/`Step`, `FileTree`, `InfoTable`, `Diagram`, `KeyboardShortcut`.

## Contributing

1. Read `CLAUDE.md` for architecture context and conventions
2. Branch from `main` (`feature/*`, `fix/*`, `docs/*`)
3. Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `style:`)
4. Test on both Mac and Windows paths where applicable
5. Run `npm run lint && npm run typecheck` before pushing

## License

MIT
