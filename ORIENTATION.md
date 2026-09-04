# Orientation — claude-code-integration (codewithclaude.net)

_Last updated: 2026-09-03 · branch `main` · all checks green (lint, typecheck, 64 Jest assertions, 417 Playwright tests, production build)_

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

## Current state (verified 2026-09-03)

Everything below was found and fixed this session; all of it is verified green, none of it is deployed yet.

- **Duplicate `<h1>` site-wide** — shell rendered one, every MDX body repeated the title. Stripped from 36 files; track landings gained a real `<h1>` (they previously had none of their own).
- **Jest ran the Playwright specs** — 8 of 9 suites failed to load. Fixed with `testPathIgnorePatterns`.
- **`claude-*` colour tokens** — all 300+ usages migrated to `primary-*`; the alias scale deleted from `tailwind.config.ts`. (`claude-950` in `authors/page.tsx` was genuinely undefined — the alias stopped at 900.)
- **`order` collisions** from the March 2026 batch — every track renumbered `1..N`.
- **`lastUpdated` year typo** — 32 files said `2025-03-25` for content committed `2026-03-25`; restamped from git history.
- **Search missed the six March articles** — the hardcoded learning-track list is gone; entries are derived from the MDX.
- **Homepage** — durations and readiness now derived from content (they were off by up to 8×); Advanced Topics card added (8 of 8 tracks now shown).
- **`/git-github/:slug` 301** — now generated only while the track has no sub-articles, so a future article cannot be silently swallowed.
- **Duplicate "Modules" heading** on `/mcp` and `/advanced-topics` — MDX section renamed to "What Each Module Covers".
- **E2E suite** — 16 failures → 0. Stale expectations updated, the 404 check no longer trips on articles quoting `Module not found`, and the link-checker now verifies status over HTTP instead of rendering every page on a compile-on-demand dev server.
- **Repo hygiene** — `screenshots/`, `test-results/`, `playwright-report/`, `.serena/`, `.claude/settings.local.json` gitignored and untracked; stray `firebase-debug.log` / `.Rhistory` / `.DS_Store` deleted.

## Open threads (resume here)

- [ ] Nothing is committed or deployed yet — review the working tree, then commit and push.
- [ ] Per-article `duration` values are author estimates and look generous next to word counts (e.g. `agents` sums to 11 hours across 5 articles of 1.7k–3.8k words). Worth a calibration pass.
- [ ] `data-analysis` is still only Python/R intros; the deeper tutorials remain the V1.5 gap.
- [ ] `docs/` holds several superseded planning docs (`BUSINESS_REQUIREMENTS.md`, the handoff files); a `stale-vibecode-audit` pass would clear them.

## Related

- `CLAUDE.md` and `README.md` — both refreshed 2026-09-03 and now accurate on content status and conventions.
- `docs/superpowers/specs/2026-03-28-new-claude-features-integration-design.md` — the spec behind the last three commits; all 8 items shipped.
- `docs/UX-IMPROVEMENT-PLAN.md` — Phase 1 items marked done; its claim that `claude-*` classes were undefined is corrected inline.
- `~/repo-catalog` — record corrected 2026-09-03 (it described the stack as "Vite/React"; it is Next.js 14 + MDX). Note the GitHub repo was **renamed to `tool-util-claude-code-integration` on 2026-08-23**; this clone's `origin` still points at the old URL, which GitHub redirects.
