# CLAUDE.md — Claude Code Learning Hub

## What This Is

A Next.js 14 learning platform at [codewithclaude.net](https://codewithclaude.net) that teaches Claude Code, VS Code, Git, Python, R, MCP, and AI agents through guided tutorials. Content is MDX-based. Deployed on Vercel.

## Key Commands

```bash
npm run dev              # Dev server (localhost:3001)
npm run build            # Production build
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm test                 # Jest unit tests
npm run format           # Prettier
```

## Architecture

### Routing

Next.js App Router with dynamic routes:
- `src/app/page.tsx` — Homepage
- `src/app/[track]/page.tsx` — Track landing (renders `content/<track>/index.mdx`)
- `src/app/[track]/[slug]/page.tsx` — Article page (renders `content/<track>/<slug>.mdx`)
- `src/app/tools/*` — Interactive tools (6 tool pages)
- `src/app/blog/*` — Blog with RSS feed
- `src/app/api/newsletter/route.ts` — Newsletter signup API

### Content Pipeline

MDX files in `content/` → parsed by `src/lib/mdx.ts` using `gray-matter` for frontmatter + `next-mdx-remote` for rendering. Custom MDX components in `src/components/mdx/` (Callout, Tabs, Steps, FileTree, InfoTable, Diagram, KeyboardShortcut).

### Styling

Tailwind CSS 3 with `class`-based dark mode. Custom color scales: `primary` (terracotta), `ink` (slate), `paper` (warm white), plus `cobalt`, `sage`, `amber`, `plum` accent tracks. Typography plugin for prose. Three Google Fonts via `next/font`: Plus Jakarta Sans, Space Grotesk, JetBrains Mono.

### SEO

Extensive JSON-LD structured data (WebSite, Organization, LearningResource, SoftwareApplication, Article, FAQ, Course, BreadcrumbList, HowTo schemas). OpenGraph + Twitter card metadata. Sitemap at `/sitemap.ts`, RSS at `/blog/feed.xml`, `robots.txt` and `llms.txt` in public.

### State

Client-side only (no backend auth in V1). Progress tracked in localStorage via `ProgressTracker.tsx`. Theme preference stored client-side via `ThemeProvider.tsx`.

## Content Structure

```
content/
  start-here/         # 11 articles — setup, platforms, voice/remote, research
  advanced-topics/    # 5 articles — best practices, power features, skills, plugins, cursor
  agents/             # 5 articles — using, building, products, multi-agent, SDK
  mcp/                # 4 articles — fundamentals, servers, custom, workflows
  data-analysis/      # 2 articles — Python intro, R intro
  app-builder/        # Self-contained landing page + computer use & dispatch
  git-github/         # Self-contained landing page (the whole tutorial)
  automation/         # Self-contained landing page (the whole tutorial)
  blog/               # Blog posts
```

**Self-contained tracks.** `git-github`, `automation` and `app-builder` carry their
tutorial on `index.mdx` itself and declare `selfContained: true`. `getTrackStats()`
(`src/lib/tracks.ts`) counts that as a lesson, so the homepage reports honest
durations and never shows a false "Coming Soon".

Each MDX file has frontmatter: `title`, `description`, `order`, `track`, `duration`, `platform`, `prerequisites`, `lastUpdated`, and (on self-contained track indexes) `selfContained`.

Two rules the content pipeline depends on:

1. **Never start an MDX body with `# Heading`.** The page shell renders `title` as the
   page's only `<h1>` — for articles, blog posts *and* track landings. A body `#` creates
   a duplicate `<h1>` (an a11y/SEO defect that shipped site-wide until 2026-09-03). Start
   at `##`.
2. **`order` is unique within a track**, numbered `1..N`; every `index.mdx` is `order: 0`.
   Track position on the homepage comes from the `learningTracks` array in
   `src/app/page.tsx`, *not* from frontmatter.

## File Ownership

These areas are independently editable (safe for parallel work):

- `src/app/tools/*` — each tool page is standalone
- `content/<track>/` — each track's content is independent
- `src/components/mdx/` — each MDX component is independent
- `src/components/ui/` — each UI primitive is independent
- `templates/` — independent starter templates
- `tests/` — each spec file is independent
- `public/` — static assets

Shared/cross-cutting (changes here affect many things):
- `src/app/layout.tsx` — root layout, fonts, analytics, providers
- `src/components/Navigation.tsx` — site nav (references all tracks)
- `src/lib/constants.ts` — track definitions, site config
- `src/lib/metadata.ts` — SEO metadata generators
- `tailwind.config.ts` — design tokens
- `next.config.js` — MDX plugin config

## Conventions

- **Components**: PascalCase, one per file
- **Utilities**: camelCase in `src/lib/`
- **Content**: kebab-case filenames
- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `style:`)
- **Branches**: `feature/*`, `fix/*`, `docs/*`
- **Platform**: all setup content must cover both Mac and Windows
- **Audience**: beginner-first; every decision should serve learning

## V1 Status

**Shipped** (as of 2026-09-03): all 8 tracks have content — Start Here, Advanced Topics,
Agents, MCP, Data Analysis (2 articles), plus Git & GitHub, Automation and App Builder as
self-contained landing-page tutorials. Interactive tools (CLAUDE.md generator, MCP explorer, slash commands, snippets, cheatsheets, templates). Newsletter API. GA4 analytics. Progress tracking (client-side). Glossary. Blog with RSS.

**Deferred to V1.5**: deeper Python/R tutorials in Data Analysis, breaking the
self-contained tracks into multi-article sequences, user authentication, server-side
progress persistence.

## Environment

All env vars are optional for local dev. See `.env.example`. Key ones:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4
- `NEXT_PUBLIC_SITE_URL` — defaults to `https://codewithclaude.net`
- `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` — newsletter

## Common Tasks

### Add a new article to an existing track

1. Create `content/<track>/<slug>.mdx` with frontmatter (see existing articles for format)
2. Set `order` to position it in the track's sequence, and renumber siblings so the values
   stay unique — do not reuse a number
3. Start the body at `##`, never `#` (the shell owns the `<h1>`)
4. The dynamic route `[track]/[slug]` picks it up automatically — no router changes needed.
   Search (`src/lib/search.ts`), the sitemap, and the homepage duration all derive from the
   file, so nothing else needs editing.
5. **Adding the first sub-article to `git-github`** also switches off the legacy
   `/git-github/:slug` → `/git-github` 301 in `next.config.js`; that redirect is generated
   only while the track has no sub-articles, so it will not swallow the new page.

### Add a new learning track

1. Create `content/<new-track>/index.mdx` with track overview
2. Add the track slug to `src/lib/constants.ts` (`TRACKS`, `ALL_TRACK_SLUGS`, `TRACK_NAMES`)
3. Add track metadata to `src/lib/metadata.ts` (`trackMetadata`)
4. Add a card to the homepage in `src/app/page.tsx` (`learningTracks` array)
5. Add nav entry in `src/components/Navigation.tsx`

### Add a new interactive tool

1. Create `src/app/tools/<tool-name>/page.tsx`
2. The `/tools` layout (`src/app/tools/layout.tsx`) wraps it automatically

### Modify the design system

Edit `tailwind.config.ts`. Color scales, shadows, animations, fonts, and spacing are all defined there.
