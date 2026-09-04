> **Archived 2026-09-04 — superseded.** This spec was implemented in `0779158` ("refactor: Resources page data layer"). The data layer it describes now lives in `src/data/resources.ts`, `src/lib/resources.ts` and `src/types/resources.ts`. Kept for the rationale, not as a to-do list.

# Technical Architecture Handoff: Resources Page Improvements

**Document Version:** 1.0
**Created:** 2026-01-14
**Tech Lead:** Claude (Opus 4.5)
**Target:** Database Engineer, Frontend Engineers, Backend Engineers

---

## Executive Summary

This document provides a comprehensive technical architecture for improving the `/resources` page. The improvements focus on **maintainability**, **performance**, **user experience**, and **alignment with existing codebase patterns**.

### Key Deliverables

1. **Data Layer Extraction** - Move resource data to a dedicated data file
2. **URL-Based State Management** - Persist filter state in URL query parameters
3. **Component Refactoring** - Extract reusable components aligned with existing patterns
4. **Performance Optimizations** - Implement virtualization-ready architecture
5. **SEO Enhancements** - Add structured data for resource discovery

---

## Part 1: Current State Analysis

### 1.1 Existing Architecture

**File:** `src/app/resources/page.tsx` (619 lines)

| Aspect | Current Implementation | Assessment |
|--------|----------------------|------------|
| **Data Storage** | Inline array (207 lines of data) | Needs extraction |
| **State Management** | `useState` for search/category | Works but not persistent |
| **Components** | `ResourceCard`, `ResourceSection` (local) | Could be reusable |
| **Filtering** | Client-side with `useMemo` | Efficient |
| **Types** | Well-defined interfaces | Good |
| **Accessibility** | ARIA attributes present | Good |

### 1.2 Comparison with Existing Patterns

| Pattern | Resources Page | Glossary Page | Cheatsheets Page |
|---------|---------------|---------------|------------------|
| Data location | Inline | Inline | Inline |
| Server/Client | Client ('use client') | Server | Client |
| Metadata | None | `export const metadata` | None |
| URL persistence | No | Hash links | No |
| Data structure | Flat with categories | Flat with categories | Nested sections |

### 1.3 Identified Technical Debt

1. **307 lines of resource data** embedded in component file
2. **No SEO metadata** (page is client-side only)
3. **Filter state lost on navigation** (no URL persistence)
4. **No structured data** for search engine resource discovery
5. **Duplicated type definitions** (could be shared)

---

## Part 2: Proposed Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Resources Module                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  Data Layer      │    │  Type Definitions │                   │
│  │  src/data/       │    │  src/types/        │                   │
│  │  resources.ts    │───▶│  resources.ts      │                   │
│  └──────────────────┘    └──────────────────┘                   │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Page Components                           ││
│  │  ┌─────────────────┐  ┌─────────────────┐                   ││
│  │  │ page.tsx        │  │ ResourcesClient  │                   ││
│  │  │ (Server)        │──│ (Client)         │                   ││
│  │  │ - Metadata      │  │ - Filtering      │                   ││
│  │  │ - Static data   │  │ - Search         │                   ││
│  │  │ - JSON-LD       │  │ - URL sync       │                   ││
│  │  └─────────────────┘  └─────────────────┘                   ││
│  └─────────────────────────────────────────────────────────────┘│
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Shared Components                         ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  ││
│  │  │ ResourceCard  │  │ ResourceGrid  │  │ CategoryFilter  │  ││
│  │  │ (reusable)    │  │ (reusable)    │  │ (reusable)      │  ││
│  │  └───────────────┘  └───────────────┘  └─────────────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 File Structure Changes

```
src/
├── app/
│   └── resources/
│       ├── page.tsx              # Server component (metadata + data)
│       └── ResourcesClient.tsx   # Client component (interactivity)
│
├── components/
│   └── resources/                # NEW: Extracted components
│       ├── ResourceCard.tsx
│       ├── ResourceSection.tsx
│       ├── ResourceFilters.tsx
│       └── index.ts              # Barrel export
│
├── data/                         # NEW: Data layer
│   └── resources.ts              # Resource definitions
│
├── types/                        # NEW: Shared types
│   └── resources.ts              # Resource interfaces
│
└── lib/
    └── resources.ts              # NEW: Resource utilities
```

---

## Part 3: Implementation Specifications

### 3.1 Data Layer Extraction

**File:** `src/data/resources.ts`

```typescript
// src/types/resources.ts
export type ResourceCategory = 'our-tools' | 'learning' | 'official' | 'community'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Resource {
  id: string                                    // NEW: Unique identifier
  title: string
  description: string
  url: string
  icon: string                                  // CHANGE: String icon name instead of component
  internal?: boolean
  category: ResourceCategory
  skillLevel?: SkillLevel
  isNew?: boolean
  tags?: string[]
  dateAdded?: string                            // NEW: For sorting by recency
}

export interface ResourceSectionConfig {
  id: ResourceCategory
  title: string
  description: string
  icon: string
  colorClass: string
}
```

**File:** `src/data/resources.ts`

```typescript
import type { Resource, ResourceSectionConfig } from '@/types/resources'

export const SECTION_CONFIG: Record<string, ResourceSectionConfig> = {
  'our-tools': {
    id: 'our-tools',
    title: 'Our Tools',
    description: 'Interactive tools and references we built for you',
    icon: 'Wrench',
    colorClass: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  },
  // ... other sections
}

export const RESOURCES: Resource[] = [
  {
    id: 'cheatsheets',
    title: 'Cheatsheets',
    description: '7 quick reference guides for Claude Code, Git, Terminal, Python, and more',
    url: '/tools/cheatsheets',
    internal: true,
    icon: 'FileText',
    category: 'our-tools',
    tags: ['reference', 'guide', 'quick', 'commands'],
    dateAdded: '2024-01-01',
  },
  // ... all other resources
]

// Utility exports
export const RESOURCE_CATEGORIES = ['our-tools', 'learning', 'official', 'community'] as const
export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const
```

**Rationale:**
- Icons as strings allow server-side rendering and dynamic imports
- Unique IDs enable future database migration
- Date tracking enables "recently added" sorting
- Separates data concerns from presentation

### 3.2 URL-Based State Management

**Implementation Strategy:** Use `nuqs` library or native `useSearchParams`

**File:** `src/app/resources/ResourcesClient.tsx`

```typescript
'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useResourceFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Read from URL
  const category = (searchParams.get('category') as ResourceCategory | 'all') || 'all'
  const search = searchParams.get('q') || ''

  // Update URL
  const setFilters = useCallback((updates: { category?: string; search?: string }) => {
    const params = new URLSearchParams(searchParams)

    if (updates.category !== undefined) {
      if (updates.category === 'all') {
        params.delete('category')
      } else {
        params.set('category', updates.category)
      }
    }

    if (updates.search !== undefined) {
      if (updates.search === '') {
        params.delete('q')
      } else {
        params.set('q', updates.search)
      }
    }

    const queryString = params.toString()
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [searchParams, router, pathname])

  return { category, search, setFilters }
}
```

**URL Examples:**
- `/resources` - All resources, no filter
- `/resources?category=learning` - Learning category
- `/resources?q=git` - Search for "git"
- `/resources?category=official&q=api` - Combined filters

**Benefits:**
- Shareable filtered views
- Browser back/forward navigation works
- Bookmarkable states
- SEO-friendly (search engines can index filtered views)

### 3.3 Server/Client Split Architecture

**File:** `src/app/resources/page.tsx` (Server Component)

```typescript
import { Metadata } from 'next'
import { RESOURCES, SECTION_CONFIG } from '@/data/resources'
import { ResourcesClient } from './ResourcesClient'
import { generateBreadcrumbSchema } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Resources | Claude Code Learning Hub',
  description: 'A curated collection of resources to help you master Claude Code and AI-powered development.',
  keywords: ['claude code', 'resources', 'documentation', 'tutorials', 'tools'],
  openGraph: {
    title: 'Resources | Claude Code Learning Hub',
    description: 'Curated resources for mastering Claude Code',
    type: 'website',
  },
}

export default function ResourcesPage() {
  // Generate JSON-LD structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
  ])

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Claude Code Resources',
    description: 'Curated collection of learning resources',
    numberOfItems: RESOURCES.length,
    itemListElement: RESOURCES.slice(0, 10).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.title,
      url: r.internal ? `https://claudecodelearning.com${r.url}` : r.url,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ResourcesClient
        resources={RESOURCES}
        sectionConfig={SECTION_CONFIG}
      />
    </>
  )
}
```

**File:** `src/app/resources/ResourcesClient.tsx` (Client Component)

```typescript
'use client'

import { useMemo } from 'react'
import { useResourceFilters } from './useResourceFilters'
import { ResourceSection } from '@/components/resources/ResourceSection'
import { ResourceFilters } from '@/components/resources/ResourceFilters'
import type { Resource, ResourceSectionConfig } from '@/types/resources'

interface ResourcesClientProps {
  resources: Resource[]
  sectionConfig: Record<string, ResourceSectionConfig>
}

export function ResourcesClient({ resources, sectionConfig }: ResourcesClientProps) {
  const { category, search, setFilters } = useResourceFilters()

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = category === 'all' || resource.category === category
      const searchLower = search.toLowerCase().trim()
      const matchesSearch = searchLower === '' ||
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchLower))

      return matchesCategory && matchesSearch
    })
  }, [resources, category, search])

  // ... rest of rendering logic
}
```

### 3.4 Component Extraction

**File:** `src/components/resources/ResourceCard.tsx`

```typescript
import Link from 'next/link'
import { ExternalLink, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getIconComponent } from '@/lib/resources'
import type { Resource, SkillLevel } from '@/types/resources'

const skillLevelColors: Record<SkillLevel, string> = {
  beginner: 'bg-sage-100 text-sage-700 dark:bg-sage-900/50 dark:text-sage-300',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  advanced: 'bg-plum-100 text-plum-700 dark:bg-plum-900/50 dark:text-plum-300',
}

interface ResourceCardProps {
  resource: Resource
  className?: string
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const { title, description, url, icon, internal, isNew, skillLevel } = resource
  const Icon = getIconComponent(icon)
  const Component = internal ? Link : 'a'
  const externalProps = internal ? {} : { target: '_blank', rel: 'noopener noreferrer' }

  return (
    <Component
      href={url}
      {...externalProps}
      className={cn(
        'group relative flex items-start gap-4 rounded-xl',
        'border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800 p-5',
        'transition-all hover:border-claude-300 dark:hover:border-claude-600',
        'hover:shadow-lg',
        className
      )}
    >
      {/* New Badge */}
      {isNew && (
        <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 z-10">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          New
        </span>
      )}

      {/* Icon */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-claude-100 dark:bg-claude-900/50 text-claude-600 dark:text-claude-400 transition-colors group-hover:bg-claude-200 dark:group-hover:bg-claude-900">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-claude-600 dark:group-hover:text-claude-400 transition-colors">
            {title}
          </h3>
          {!internal && (
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-claude-500" aria-hidden="true" />
          )}
          {skillLevel && (
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', skillLevelColors[skillLevel])}>
              {skillLevel}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>
    </Component>
  )
}
```

**File:** `src/lib/resources.ts` (Icon Mapping Utility)

```typescript
import {
  BookOpen, ExternalLink, GitBranch, FileText, Video, Code2,
  Wrench, GraduationCap, Lightbulb, Users, Terminal, FolderOpen,
  PenTool, Server, Search, Layers, Sparkles
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  BookOpen, ExternalLink, GitBranch, FileText, Video, Code2,
  Wrench, GraduationCap, Lightbulb, Users, Terminal, FolderOpen,
  PenTool, Server, Search, Layers, Sparkles
}

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || FileText
}
```

### 3.5 SEO & Metadata Strategy

**Structured Data Types to Implement:**

1. **BreadcrumbList** - Navigation hierarchy
2. **CollectionPage** - Resource collection metadata
3. **ItemList** - Resource items for rich snippets

**Open Graph & Twitter Cards:**
- Dynamic OG image showing resource count
- Category-specific descriptions when filtered

---

## Part 4: Implementation Plan

### Phase 1: Data Layer (Database Engineer / Frontend Engineer)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create `src/types/resources.ts` | High | 1h | None |
| Create `src/data/resources.ts` | High | 2h | Types |
| Create `src/lib/resources.ts` | High | 1h | Types |
| Add unique IDs to all resources | High | 30m | Data file |
| Add `dateAdded` to all resources | Medium | 30m | Data file |

### Phase 2: Component Extraction (Frontend Engineer)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Extract `ResourceCard.tsx` | High | 1h | Data layer |
| Extract `ResourceSection.tsx` | High | 1h | ResourceCard |
| Extract `ResourceFilters.tsx` | High | 1h | None |
| Create barrel export `index.ts` | Low | 15m | Components |
| Update page to use new components | High | 1h | All above |

### Phase 3: Server/Client Split (Frontend Engineer)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create `ResourcesClient.tsx` | High | 2h | Components |
| Convert `page.tsx` to server component | High | 1h | Client component |
| Add metadata export | High | 30m | Server component |
| Add JSON-LD structured data | Medium | 1h | Server component |

### Phase 4: URL State Management (Frontend Engineer)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement `useResourceFilters` hook | High | 2h | None |
| Update filters to use URL state | High | 1h | Hook |
| Add debounced search input | Medium | 30m | Hook |
| Test browser navigation | High | 30m | All above |

### Phase 5: Testing & Polish (Frontend Engineer / QA)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Unit tests for utilities | Medium | 1h | Utilities |
| Integration tests for filtering | Medium | 2h | Full implementation |
| Accessibility audit | High | 1h | Full implementation |
| Performance testing | Medium | 1h | Full implementation |

---

## Part 5: Technical Decisions & Rationale

### 5.1 Why Server/Client Split?

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Full Client** | Simpler, current approach | No SSR, no SEO metadata | Rejected |
| **Full Server** | Best SEO, fastest initial load | No interactivity without JS | Rejected |
| **Server + Client** | SEO + interactivity | More complexity | **Selected** |

### 5.2 Why String Icons Instead of Components?

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Component refs** | Type-safe, direct usage | Can't serialize for SSR | Rejected |
| **String names** | Serializable, dynamic | Needs mapping function | **Selected** |

### 5.3 Why URL State Over localStorage?

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **useState only** | Simple, current approach | Lost on navigation | Rejected |
| **localStorage** | Persists across sessions | Not shareable, no SEO | Rejected |
| **URL params** | Shareable, SEO, back/forward | Slightly more complex | **Selected** |

### 5.4 Why Not Use a Database Yet?

Per project constraints (CLAUDE.md), V1 is frontend-only:
- User authentication deferred to V1.5
- Backend progress persistence deferred
- Current static data approach aligns with Vercel static deployment

**Future-proofing:** Adding unique IDs and dateAdded fields prepares for database migration.

---

## Part 6: Acceptance Criteria

### 6.1 Data Layer
- [ ] All resource data lives in `src/data/resources.ts`
- [ ] Types are exported from `src/types/resources.ts`
- [ ] Each resource has a unique `id` field
- [ ] Icon mapping function handles all icons

### 6.2 Components
- [ ] `ResourceCard` is extracted and reusable
- [ ] `ResourceSection` is extracted and reusable
- [ ] `ResourceFilters` handles search and category
- [ ] Components follow existing project patterns (cn utility, Tailwind)

### 6.3 Server/Client Architecture
- [ ] `page.tsx` exports `metadata` for SEO
- [ ] JSON-LD structured data is rendered
- [ ] Client component handles all interactivity
- [ ] Data is passed as props (not imported in client)

### 6.4 URL State Management
- [ ] `/resources?category=learning` filters by category
- [ ] `/resources?q=git` filters by search term
- [ ] Browser back/forward works correctly
- [ ] Empty filters show clean URL (`/resources`)

### 6.5 Non-Functional Requirements
- [ ] No TypeScript errors
- [ ] Passes ESLint checks
- [ ] Lighthouse performance score >= 90
- [ ] All accessibility attributes preserved
- [ ] Dark mode works correctly

---

## Part 7: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| URL encoding issues with special characters | Medium | Low | URL-safe encoding, test with unicode |
| Hydration mismatch errors | Medium | Medium | Clear server/client boundary, no Date in initial render |
| Breaking existing bookmarks | N/A | N/A | No existing URL state to break |
| Performance regression | Low | Medium | Keep useMemo, profile with React DevTools |

---

## Part 8: Testing Strategy

### 8.1 Unit Tests

```typescript
// src/lib/__tests__/resources.test.ts
describe('getIconComponent', () => {
  it('returns correct icon for known names', () => {
    expect(getIconComponent('FileText')).toBe(FileText)
  })

  it('returns fallback for unknown names', () => {
    expect(getIconComponent('Unknown')).toBe(FileText)
  })
})
```

### 8.2 Integration Tests

```typescript
// tests/resources.spec.ts
test('filters resources by category via URL', async ({ page }) => {
  await page.goto('/resources?category=learning')
  await expect(page.locator('[data-testid="resource-card"]')).toHaveCount(5)
})

test('search filters resources', async ({ page }) => {
  await page.goto('/resources?q=git')
  await expect(page.locator('text=Git')).toBeVisible()
})

test('back button preserves filter state', async ({ page }) => {
  await page.goto('/resources')
  await page.click('[data-category="learning"]')
  await page.click('[data-category="official"]')
  await page.goBack()
  await expect(page).toHaveURL(/category=learning/)
})
```

### 8.3 Accessibility Tests

- Verify focus management on filter changes
- Test screen reader announcements for result counts
- Validate keyboard navigation through filters

---

## Part 9: Handoff Checklist

### For Database Engineer
- [ ] Review data structure in `src/types/resources.ts`
- [ ] Note: No database changes needed for V1
- [ ] Future consideration: Schema for `resources` table

### For Frontend Engineer
- [ ] Start with Phase 1 (Data Layer)
- [ ] Follow existing component patterns in `src/components/`
- [ ] Use `cn()` utility for class merging
- [ ] Match existing color tokens (primary, cobalt, sage, plum, amber)
- [ ] Test dark mode for all components

### For Backend Engineer
- [ ] No backend changes needed for V1
- [ ] Future: API endpoints for dynamic resources
- [ ] Future: Admin interface for resource management

### For QA Engineer
- [ ] Test URL state persistence
- [ ] Verify SEO metadata with social preview tools
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit with axe-core

---

## Appendix A: Current Resource Count

| Category | Count |
|----------|-------|
| Our Tools | 6 |
| Learning | 5 |
| Official | 4 |
| Community | 8 |
| **Total** | **23** |

## Appendix B: Related Files

- `src/app/glossary/page.tsx` - Similar pattern (server component with data)
- `src/app/tools/cheatsheets/page.tsx` - Similar data structure
- `src/components/Card.tsx` - Reference for card styling patterns
- `src/lib/utils.ts` - Contains `cn()` utility
- `src/lib/constants.ts` - Reference for constant organization

## Appendix C: Dependencies

No new dependencies required. All implementations use:
- Next.js built-in `useSearchParams`, `useRouter`
- Existing Lucide icons
- Existing Tailwind configuration

---

**Document Status:** Complete
**Ready for Implementation:** Yes
**Review Required Before Merge:** Architecture review by Tech Lead
