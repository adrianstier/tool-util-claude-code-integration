# UX Improvement Plan — Claude Code Learning Hub

**Date:** February 11, 2026
**Analysis by:** 4-agent UX swarm (Information Architecture, Visual Design & Accessibility, Learning Experience, Technical Performance)

---

## Executive Summary

The platform has a strong foundation — well-structured MDX content, a cohesive design system, excellent dark mode, and good SEO fundamentals. However, four cross-cutting problems emerged from every agent's analysis:

1. **Homepage doesn't reflect reality** — Only 5 of 8 tracks shown; 2 of those are empty stubs
2. **Content is disconnected** — Glossary never linked, cross-track references sparse, search hardcoded
3. **Progress tracking exists but is invisible** — localStorage saves progress that no UI displays
4. **Production gaps** — Missing error boundaries, broken OG images, non-persistent newsletter

---

## Phase 1: Critical Fixes (1-2 days)

### Homepage & Navigation

- **Add Git & GitHub + MCP tracks to homepage grid** — Currently missing from `learningTracks` array in `src/app/page.tsx` (lines 108-174). Users cannot discover 2 of 8 tracks from the homepage.
- **Reconcile "Coming Soon" status for App Builder & Automation** — Both show "Coming Soon" tags on homepage but are recommended in `LEARNING_PATHS`. Either hide from homepage cards or deliver at least 1 complete tutorial per track.
- **Fix MCP order collision** — `content/mcp/index.mdx` and `content/agents/index.mdx` both have `order: 6`. Assign MCP `order: 7`.
- **Add MCP and Agents tracks to SearchModal** — `src/components/SearchModal.tsx` hardcodes ~50 items; MCP modules and multi-agent-architectures are missing.

### Technical / Production

- **Create `src/app/error.tsx`** — No global error boundary exists. Unhandled errors show raw Next.js error page.
- **Fix OpenGraph image references** — `src/lib/metadata.ts` references `/opengraph-image` and `/twitter-image` routes that don't exist. Either create dynamic generation routes or point metadata to the static `public/og-image.png`.
- **Fix module sort order in `src/lib/mdx.ts`** — `getAllContent()` returns files in filesystem order, not by frontmatter `order` field. Sort by `order` to prevent broken sequencing.
- **Audit and fix duplicate frontmatter order values** — Start Here has two modules at `order: 4`; Data Analysis has `index.mdx` and `python-intro.mdx` both at `order: 2`.

### Accessibility

- **Fix undefined color classes** — `Tabs.tsx`, `FileTree.tsx`, and `CodeBlock.tsx` reference `claude-500`/`claude-600` which don't exist in Tailwind config. Replace with `primary-500`/`primary-600`.
- **Fix low-contrast secondary text** — `text-gray-500` on white backgrounds fails WCAG AA (ratio ~2.8:1). Affected: Tabs inactive labels, FileTree file names, Footer links, TOC inactive links, SearchModal descriptions. Use `gray-600` minimum.
- **Add `scope="col"` to InfoTable headers** — `src/components/mdx/InfoTable.tsx` lines 66-78 missing scope attributes for screen readers.

---

## Phase 2: Information Architecture (3-5 days)

### Discovery & Cross-Linking

- **Generate search items dynamically** — Replace hardcoded `searchItems` array in `SearchModal.tsx` with items generated from `getAllContent()` and `getAllTracks()` at build time. Prevents orphan pages when new content is added.
- **Add cross-track links between Agents and MCP** — Agents track never mentions MCP despite MCP being central to agent tooling. Add "Next: Connect agents to real data with MCP" callout at end of agents modules.
- **Link glossary from content** — 66-term glossary exists at `/glossary` but 0 content files link to it. Add contextual glossary links on first mention of technical terms (SSH Key, Repository, API, etc.).
- **Display learning paths on homepage** — `LEARNING_PATHS` defined in `constants.ts` (lines 113-135) but never rendered. Create a "Choose Your Path" section showing Beginner/Analyst/Developer personas with recommended track sequences.
- **Update learning paths to include new tracks** — Current paths omit Agents, MCP, and Advanced Topics entirely.

### Track Ordering & Prerequisites

- **Reorder Git & GitHub to order 2 or 3** — Currently order 5, but referenced as a prerequisite in 4 track index pages. Start Here index explicitly says "New to coding? Start with Git & GitHub after setup."
- **Add soft prerequisite gating** — Display info callout on advanced pages: "Make sure you've completed Start Here and Quick Start Exercise before continuing." Use frontmatter `prerequisites` field (currently only used by Data Analysis).
- **Move "Using Claude for Git" earlier in Git track** — Currently Part 12 (last, after troubleshooting). Should be Part 2-3 to center Claude's role as a natural way to do Git tasks.

### Progress Visibility

- **Display progress rings on track pages** — `ProgressTracker.tsx` saves to localStorage but no track page shows "3/5 modules completed — 60%".
- **Show checkmarks next to completed modules** in track outlines.
- **Add "continue from where you left off" section** to homepage.

---

## Phase 3: Learning Experience (1-2 weeks)

### Content Gaps

- **Create persona-specific "First 30 Minutes" exercises** — Current Quick Start Exercise is CSV/research-focused. Add variants for Web Dev ("Build a component") and Automation ("Write a shell script").
- **Add guided MCP build exercise** — MCP track has "install Context7" quick start but no "Build Your First MCP Server" walkthrough. Reference `building-custom-mcps.mdx` from index page.
- **Add cost/token budget guidance** — Nowhere on the platform mentions cost. Add a section to Advanced Topics or Agents covering token estimation, spending limits, and common expensive mistakes (infinite agent loops).
- **Add "skip setup" shortcut for experienced users** — A developer who already has VS Code + Git + Node.js shouldn't need to read through Homebrew installation. Add callout: "Already set up? Jump to Quick Start Exercise."

### Content Quality

- **Reduce research-centric bias in examples** — Case studies are all academic (publication figures, grad student code). Add at least one non-research example per track (web dev, automation, data engineering).
- **Add "make a mistake and fix it" exercises** — Git track is all happy-path demos. Include deliberate error recovery exercises.
- **Add interactive knowledge checks** — No assessment mechanism exists. Even simple "What does `git rebase` do?" checkpoints would boost retention.

### Stub Tracks

- **Either complete or hide App Builder & Automation** — Both are visible on homepage with full cards but contain only overview + placeholder projects. Options:
  - (a) Deliver at least 1 complete tutorial per track
  - (b) Remove from homepage grid, show only in "Coming Soon" section
  - (c) Change card UX to "Register Interest" instead of "Learn →"

---

## Phase 4: Visual Design & Technical Polish (1-2 weeks)

### Design System Consistency

- **Standardize color naming** — Mix of `claude-*`, `primary-*`, and `ink-*` references across components. Deprecate `claude-*` aliases; use `primary-*` consistently.
- **Replace hardcoded gray colors** — `CodeBlock.tsx`, `FileTree.tsx`, and `Tabs.tsx` use `gray-200`/`gray-700` instead of design system `ink-100`/`ink-800` tokens.
- **Add responsive typography** — Headings are same size on mobile and desktop. Add `text-2xl sm:text-3xl md:text-4xl` scaling.

### Accessibility

- **Add focus trap to SearchModal** — Users can tab out of modal to background content. Implement focus trap or use a focus management library.
- **Add `aria-live="polite"` to dynamic content** — Progress updates and search result counts don't announce to screen readers.
- **Add `aria-label` to icon-only buttons** — Navigation menu toggle (`Navigation.tsx` line 92) and similar icon buttons lack labels.
- **Make reduced-motion respect component-level** — `globals.css` respects `prefers-reduced-motion` but individual component transitions (Card hover, Navigation) use hardcoded `transition-all duration-300`. Use Tailwind `motion-safe:` utilities.

### Performance

- **Code-split Mermaid library** — `import mermaid from 'mermaid'` loads ~300-400KB on every page. Convert to dynamic import: `const mermaid = await import('mermaid').then(m => m.default)`.
- **Enable newsletter persistence** — `src/app/api/newsletter/route.ts` uses in-memory `Set<string>()`. Enable one of the commented-out integrations (Resend, ConvertKit) or connect to database.
- **Add `revalidate` export to dynamic pages** — No ISR strategy exists. Add `export const revalidate = 3600` (1 hour) to `[track]/page.tsx` and `[track]/[slug]/page.tsx`.
- **Add `loading.tsx` skeletons** to critical routes for perceived performance.

---

## Phase 5: Nice-to-Have Polish (Ongoing)

- **Full-text search within modules** — Currently only title/description matching. Allow searching content body.
- **Platform preference persistence** — Mac/Windows tabs reset per page. Store choice in localStorage.
- **Module completion badges** — Sharable "I completed Git & GitHub" badges for social sharing.
- **Estimated time remaining per module** — Show "~10 minutes left" based on scroll position.
- **Print styles** — `@media print` for printable guides.
- **Offline fallback** — Service worker for precaching core pages.
- **GDPR consent** — GA script loads without checking user consent.
- **Blog route verification** — `sitemap.ts` calls `getAllBlogPosts()` but no blog route is visible in codebase.

---

## Summary Scoring (Current State)

| Dimension | Score | Key Issue |
|---|---|---|
| Information Architecture | 6/10 | Homepage shows 5/8 tracks; search hardcoded |
| Visual Design | 8/10 | Strong design system; color naming inconsistency |
| Accessibility | 5/10 | Low contrast text, missing focus traps, no aria-live |
| Learning Experience | 7/10 | Excellent writing; weak practice exercises outside research |
| Progress Tracking | 4/10 | Tracked but invisible; no verification |
| Technical Performance | 7/10 | Good static gen; missing error boundary + OG images |
| Content Completeness | 6/10 | 2/8 tracks are empty stubs; glossary unlinked |
| **Overall** | **6.5/10** | **Strong foundation with actionable gaps** |

---

## Files Referenced

| File | Issues |
|---|---|
| `src/app/page.tsx` | Missing tracks in grid, Coming Soon inconsistency |
| `src/components/SearchModal.tsx` | Hardcoded items, missing new pages, no focus trap |
| `src/lib/mdx.ts` | Module sort order uses filesystem not frontmatter |
| `src/lib/constants.ts` | Learning paths incomplete, order collisions |
| `src/lib/metadata.ts` | Broken OG/Twitter image references |
| `src/components/mdx/Tabs.tsx` | Undefined `claude-*` colors, low contrast |
| `src/components/mdx/FileTree.tsx` | Hardcoded gray colors, undefined `claude-*` |
| `src/components/CodeBlock.tsx` | Hardcoded colors, no syntax highlighting |
| `src/components/mdx/InfoTable.tsx` | Missing `scope="col"` on headers |
| `src/components/ProgressTracker.tsx` | Progress saved but never displayed |
| `src/components/mdx/Diagram.tsx` | Mermaid not code-split (~300-400KB) |
| `src/app/api/newsletter/route.ts` | In-memory storage, not persistent |
| `content/agents/index.mdx` | Order 6 collision with MCP |
| `content/mcp/index.mdx` | Order 6 collision with Agents |
| `content/start-here/*.mdx` | Duplicate order values |
| `content/app-builder/index.mdx` | Empty stub with Coming Soon |
| `content/automation/index.mdx` | Empty stub with Coming Soon |
