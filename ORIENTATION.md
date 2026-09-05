# Orientation — claude-code-integration (codewithclaude.net)

_Last updated: 2026-09-05 · branch `main`, 2 commits ahead of `origin/main`, not pushed · all checks green (lint, typecheck, format:check, 64 Jest assertions, 423 Playwright tests, clean build 58/58)_

## What this is

A public Next.js 14 learning site — **[codewithclaude.net](https://codewithclaude.net)** — that teaches Claude Code, VS Code, Git/GitHub, Python, R, MCP, and AI agents through guided MDX tutorials. Adrian's independent (non-Anthropic) teaching product: beginner-first, free, client-side state only. Deployed on Vercel.

## Content inventory

| Track             | Lessons | Duration | Shape                                  |
| ----------------- | ------- | -------- | -------------------------------------- |
| `start-here`      | 11      | 5.3 h    | Landing + articles                     |
| `agents`          | 5       | 11 h     | Landing + articles                     |
| `app-builder`     | 2       | 7.4 h    | **Self-contained** landing + 1 article |
| `advanced-topics` | 5       | 4.6 h    | Landing + articles                     |
| `data-analysis`   | 2       | 4 h      | Landing + articles                     |
| `automation`      | 1       | 3.5 h    | **Self-contained** landing             |
| `mcp`             | 4       | 3 h      | Landing + articles                     |
| `git-github`      | 1       | 90 min   | **Self-contained** landing             |

**Self-contained** means the tutorial lives on `index.mdx` itself — 2,100+ words, not a stub. Those three declare `selfContained: true` and `getTrackStats()` counts them as a lesson. No track is "coming soon".

Plus: 2 blog posts + RSS, 6 interactive tools under `/tools`, glossary, resources, authors. 58 routes prerendered.

## Architecture

- **Content pipeline:** `content/<track>/<slug>.mdx` → `src/lib/mdx.ts` (gray-matter + `getAllContent()` sorted by `order`) → `next-mdx-remote` → `src/app/[track]/[slug]/page.tsx`; landings by `src/app/[track]/page.tsx`.
- **Derived from content (do not hardcode):** `src/lib/search.ts` builds the Cmd-K search index at build time (passed `layout.tsx` → `Navigation` → `SearchModal`); `src/lib/tracks.ts` derives each homepage card's duration and readiness.
- **Cross-cutting:** `src/app/layout.tsx`, `src/components/Navigation.tsx`, `src/lib/constants.ts`, `src/lib/metadata.ts`, `tailwind.config.ts`, `next.config.js`.
- **Commands:** `npm run dev` (port **3001**) · `build` · `typecheck` · `lint` · `npm test` · `npx playwright test`.

## Two content rules the pipeline depends on

1. **Never start an MDX body with `# Heading`** — the shell owns the page's only `<h1>`, on articles, blog posts _and_ track landings. Start at `##`.
2. **`order` is unique within a track**, `1..N`; every `index.mdx` is `order: 0`. Homepage track position comes from the `learningTracks` array in `src/app/page.tsx`, not frontmatter.

## Current state

Two passes of remediation, all committed to `fix/site-audit-remediation` and verified, none deployed.

**Pass 1 — the audit fixes (2026-09-03)**

- **Duplicate `<h1>` site-wide** — shell rendered one, every MDX body repeated the title. Stripped from 36 files; track landings gained a real `<h1>` (they previously had none of their own).
- **Jest ran the Playwright specs** — 8 of 9 suites failed to load. Fixed with `testPathIgnorePatterns`.
- **`claude-*` colour tokens** — all usages migrated to `primary-*`; the alias scale deleted. (`claude-950` was genuinely undefined — the alias stopped at 900.)
- **`order` collisions** renumbered `1..N`; **`lastUpdated`** restamped on 32 files that said 2025 for 2026 content.
- **Search and homepage derived from content** (`src/lib/search.ts`, `src/lib/tracks.ts`); the `git-github` redirect made self-healing; duplicate "Modules" heading renamed.
- **E2E 16 failures → 0**, plus repo hygiene and doc updates.

**Pass 2 — the remaining threads (2026-09-04)**

- **Durations recalibrated.** Measured against consumption time, deliberately-estimated articles sit at 1.0–1.8×; a legacy group sat at 2.5–78× (`app-builder/index` claimed 6–8 hours for a ~19-minute page). Outliers brought to the house standard; `duration` removed from the four non-`selfContained` indexes, where it held a track-level estimate.
- **WCAG AA.** The UX plan named the wrong token _and_ the wrong ratio. `gray-500` passes (4.83:1). The real failures were `ink-400` (3.05:1) and `ink-500` on dark (2.54:1), carrying real text — including the Footer's "not affiliated with Anthropic" disclaimer. All text moved to `ink-600` / `dark:ink-300`.
- **`article:published_time` was the build clock**, re-dating every article on every deploy. Now `modifiedTime` from frontmatter.
- **Prettier** now passes repo-wide, but **MDX is excluded** (`.prettierignore`): its printer indents a JSX closing tag after a markdown list, which MDX parses as list content — it silently broke `/git-github` prerendering, and only a _clean_ build surfaced it. Verified the `src/` reformat changes nothing visible by diffing all 51 prerendered pages before and after.
- **`caniuse-lite`** updated; **`docs/`** archived and indexed.

**Pass 3 — diagrams and mobile layout (2026-09-05)**

- **Diagrams were unreadable on a phone**: the container scaled an 800px diagram into a 308px column (~5px labels) instead of scrolling. Now scrolls at natural size with a fade affordance. Expanding a diagram also used to make it _smaller_, and the panel sat below the sticky nav so its own title and close button were covered.
- **Semantic colour** (`src/lib/diagram-theme.ts`): five roles — actor/process/data/result/muted — injected as `classDef`s. Every node used to be identical, so a model, a client and a server were indistinguishable.
- **Ten diagrams redrawn** from narrow columns (up to 5.3:1) into horizontal flows; four "stage + steps" subgraph chains became one node per stage, since Mermaid lays chained subgraphs out as a diagonal staircase.
- **`tests/diagram-quality.spec.ts`** gates all 78 diagrams: render errors, clipped labels, sub-12px text, downscaling, aspect ratio, phone legibility, viewport spill.
- **`tests/mobile-layout.spec.ts`** checks 26 pages for horizontal overflow at 390px. Fixed two real causes: `CodeBlock` sized lines with `flex-1` (long lines escaped the `<pre>` instead of scrolling it), and long URLs in inline `<code>` set a table's min-content width.

**Two hazards worth knowing before touching diagrams or tables:**

1. **Never restyle Mermaid labels with CSS that makes them bigger.** Mermaid measures each label at render time and sizes the `foreignObject` to fit; `text-[13px] px-1.5 py-0.5` inflated a span to 60px inside a 22px box and the text vanished. The one safe override in place is a line-height _reduction_, needed because Mermaid measures with its own font metrics and under-reserves ~2px per line.
2. **A passing number is not a passing design.** Letting the table shrink to the viewport removed the overflow and crushed a URL column to two characters per line. Screenshot at 390px before believing a layout fix.

## Open threads (resume here)

- [ ] **Nothing is pushed.** `main` is 2 commits ahead of `origin/main`; pushing deploys to production.
- [ ] `data-analysis` is still only Python/R intros — the deeper tutorials remain the V1.5 gap, and it is the thinnest track relative to its billing.
- [ ] `docs/UX-IMPROVEMENT-PLAN.md` Phases 2–4 are the standing backlog (glossary cross-linking, learning paths on the homepage, progress visibility). Phase 1 is closed.
- [ ] An incremental `next build` reported success while `/git-github` failed to prerender. Worth a `rm -rf .next` before trusting any build that touches MDX.
- [ ] 15 of 34 diagrams are wider than the ~888px article column and rely on scroll + expand. The column cannot grow (`max-w-7xl` minus a 280px TOC), so the remaining lever is redrawing the widest few — `/start-here` "Claude Code vs Traditional AI" is 2612px.
- [ ] Tables scroll sideways on a phone but have no fade affordance like diagrams do. A pure-CSS scroll shadow would make it discoverable; `InfoTable` is a server component, so it needs no JS.
- [ ] No CI runs these gates. Everything here was verified locally; a GitHub Action running lint/typecheck/format:check/jest/playwright would stop the next regression reaching main.

## Related

- `CLAUDE.md` and `README.md` — both refreshed 2026-09-03 and now accurate on content status and conventions.
- `docs/superpowers/specs/2026-03-28-new-claude-features-integration-design.md` — the spec behind the last three commits; all 8 items shipped.
- `docs/UX-IMPROVEMENT-PLAN.md` — Phase 1 items marked done; its claim that `claude-*` classes were undefined is corrected inline.
- `~/repo-catalog` — record corrected 2026-09-03 (it described the stack as "Vite/React"; it is Next.js 14 + MDX). Note the GitHub repo was **renamed to `tool-util-claude-code-integration` on 2026-08-23**; this clone's `origin` still points at the old URL, which GitHub redirects.
