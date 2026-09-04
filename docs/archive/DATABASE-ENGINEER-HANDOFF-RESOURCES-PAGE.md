> **Archived 2026-09-04 — superseded.** Companion to the tech-lead handoff; the resources data layer it specifies has shipped. Kept for the rationale, not as a to-do list.

# Database Engineer Implementation Specification: Resources Page Data Layer

**Document Version:** 1.0
**Created:** 2026-01-14
**Database Engineer:** Claude (Opus 4.5)
**Source Document:** [Tech Lead Handoff](./TECH-LEAD-HANDOFF-RESOURCES-PAGE.md)
**Target Consumers:** Frontend Engineers, Backend Engineers (V1.5+)

---

## Executive Summary

This document provides the complete database and data layer implementation specification for the Resources page improvements. For **V1**, this focuses on **file-based static data architecture** optimized for Vercel static deployment. The design is **future-proofed** for database migration in V1.5+.

### Key Deliverables

| Deliverable | V1 Status | V1.5 Consideration |
|-------------|-----------|-------------------|
| Type definitions (`src/types/resources.ts`) | **Required** | Schema migration ready |
| Static data file (`src/data/resources.ts`) | **Required** | Database seeder compatible |
| Utility functions (`src/lib/resources.ts`) | **Required** | Repository pattern ready |
| Database schema design | Documented only | **Implementation** |
| API layer design | Not implemented | **Implementation** |

---

## Part 1: Architecture Analysis

### 1.1 Current State Assessment

**Existing Implementation:** [src/app/resources/page.tsx:100-307](src/app/resources/page.tsx#L100-L307)

| Aspect | Current | Issue | Solution |
|--------|---------|-------|----------|
| Data location | Inline in component | 207 lines of data in UI code | Extract to data layer |
| Type definitions | Local to file | Not reusable | Shared types module |
| Icon references | React components | Not serializable for SSR | String-based mapping |
| Unique identifiers | None (uses URL) | Not database-ready | Add `id` field |
| Temporal tracking | None | No recency sorting | Add `dateAdded` field |
| Search optimization | Tag arrays | Good but no indexes | Prepare for full-text search |

### 1.2 Project Constraints (from CLAUDE.md)

```
V1 Launch Status: READY ✅
- User authentication not implemented (V1 doesn't require it)
- Progress tracking is client-side only (localStorage)
- Hosting: Vercel static deployment
```

**Implication:** V1 data layer must be:
- File-based (no database runtime)
- Statically importable (build-time optimization)
- Serializable (SSR-compatible)
- Future-proof (easy database migration)

### 1.3 Existing Codebase Patterns

**Reference Files:**
- [src/lib/constants.ts](src/lib/constants.ts) - Constants organization pattern
- [src/lib/utils.ts](src/lib/utils.ts) - Utility function patterns (`groupBy`, `sortBy`)
- [src/lib/metadata.ts](src/lib/metadata.ts) - Schema generation patterns

**Established Conventions:**
- TypeScript strict mode
- `as const` for literal type inference
- Export both types and values
- JSDoc comments for public APIs
- Centralized schema generators

---

## Part 2: Type Definitions

### 2.1 Core Types Specification

**File:** `src/types/resources.ts`

```typescript
/**
 * Resource Category Types
 * Defines the four main sections of the Resources page
 */
export type ResourceCategory = 'our-tools' | 'learning' | 'official' | 'community'

/**
 * Skill Level Types
 * Used to indicate content difficulty
 */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

/**
 * Resource Interface
 * Core data structure for a single resource item
 *
 * @example
 * {
 *   id: 'cheatsheets',
 *   title: 'Cheatsheets',
 *   description: '7 quick reference guides...',
 *   url: '/tools/cheatsheets',
 *   icon: 'FileText',
 *   internal: true,
 *   category: 'our-tools',
 *   tags: ['reference', 'guide'],
 *   dateAdded: '2024-01-01'
 * }
 */
export interface Resource {
  /** Unique identifier (lowercase, hyphenated) - REQUIRED for database migration */
  id: string

  /** Display title */
  title: string

  /** Brief description (max 150 chars recommended for UI consistency) */
  description: string

  /** URL - relative for internal, absolute for external */
  url: string

  /** Lucide icon name (string, not component) for SSR compatibility */
  icon: string

  /** True for site-internal links, undefined/false for external */
  internal?: boolean

  /** Resource category for grouping */
  category: ResourceCategory

  /** Content difficulty level */
  skillLevel?: SkillLevel

  /** True to show "New" badge */
  isNew?: boolean

  /** Searchable tags (lowercase, no duplicates) */
  tags?: string[]

  /** ISO 8601 date string for sorting (YYYY-MM-DD) */
  dateAdded?: string

  /** Future: Priority for manual ordering (lower = higher priority) */
  sortOrder?: number
}

/**
 * Resource Section Configuration
 * Defines the visual presentation of each category section
 */
export interface ResourceSectionConfig {
  /** Category ID (matches ResourceCategory) */
  id: ResourceCategory

  /** Section heading */
  title: string

  /** Section subtitle/description */
  description: string

  /** Lucide icon name for section header */
  icon: string

  /** Tailwind CSS classes for section styling */
  colorClass: string
}

/**
 * Category Filter Option
 * Used in the filter UI component
 */
export interface CategoryFilterOption {
  /** Filter ID ('all' or ResourceCategory) */
  id: 'all' | ResourceCategory

  /** Display name */
  name: string

  /** Lucide icon name */
  icon: string
}

/**
 * Resource Filter State
 * Current filter/search state for URL persistence
 */
export interface ResourceFilterState {
  /** Active category filter */
  category: 'all' | ResourceCategory

  /** Search query string */
  search: string
}

/**
 * Grouped Resources
 * Resources organized by category
 */
export type GroupedResources = Record<ResourceCategory, Resource[]>
```

### 2.2 Type Validation Constants

```typescript
/**
 * Valid resource categories (for runtime validation)
 */
export const RESOURCE_CATEGORIES = [
  'our-tools',
  'learning',
  'official',
  'community'
] as const

/**
 * Valid skill levels (for runtime validation)
 */
export const SKILL_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
] as const

/**
 * Valid icon names (for runtime validation and autocomplete)
 */
export const VALID_ICON_NAMES = [
  'BookOpen',
  'ExternalLink',
  'GitBranch',
  'FileText',
  'Video',
  'Code2',
  'Wrench',
  'GraduationCap',
  'Lightbulb',
  'Users',
  'Terminal',
  'FolderOpen',
  'PenTool',
  'Server',
  'Search',
  'Layers',
  'Sparkles'
] as const

export type ValidIconName = typeof VALID_ICON_NAMES[number]
```

### 2.3 Type Guards

```typescript
/**
 * Type guard for ResourceCategory
 */
export function isResourceCategory(value: unknown): value is ResourceCategory {
  return typeof value === 'string' && RESOURCE_CATEGORIES.includes(value as ResourceCategory)
}

/**
 * Type guard for SkillLevel
 */
export function isSkillLevel(value: unknown): value is SkillLevel {
  return typeof value === 'string' && SKILL_LEVELS.includes(value as SkillLevel)
}

/**
 * Type guard for valid icon name
 */
export function isValidIconName(value: unknown): value is ValidIconName {
  return typeof value === 'string' && VALID_ICON_NAMES.includes(value as ValidIconName)
}
```

---

## Part 3: Static Data Layer

### 3.1 Section Configuration

**File:** `src/data/resources.ts`

```typescript
import type { ResourceSectionConfig, CategoryFilterOption, ResourceCategory } from '@/types/resources'

/**
 * Section Configuration
 * Visual configuration for each resource category section
 */
export const SECTION_CONFIG: Record<ResourceCategory, ResourceSectionConfig> = {
  'our-tools': {
    id: 'our-tools',
    title: 'Our Tools',
    description: 'Interactive tools and references we built for you',
    icon: 'Wrench',
    colorClass: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  },
  learning: {
    id: 'learning',
    title: 'Learning Paths',
    description: 'Structured courses and tracks to build your skills',
    icon: 'GraduationCap',
    colorClass: 'bg-cobalt-100 text-cobalt-700 dark:bg-cobalt-900/50 dark:text-cobalt-300',
  },
  official: {
    id: 'official',
    title: 'Official Resources',
    description: 'Documentation and tools from Anthropic',
    icon: 'BookOpen',
    colorClass: 'bg-sage-100 text-sage-700 dark:bg-sage-900/50 dark:text-sage-300',
  },
  community: {
    id: 'community',
    title: 'Community & External',
    description: 'Connect with others and explore third-party tools',
    icon: 'Users',
    colorClass: 'bg-plum-100 text-plum-700 dark:bg-plum-900/50 dark:text-plum-300',
  },
} as const

/**
 * Category Filter Options
 * Options for the category filter UI
 */
export const CATEGORY_FILTERS: CategoryFilterOption[] = [
  { id: 'all', name: 'All', icon: 'Layers' },
  { id: 'our-tools', name: 'Our Tools', icon: 'Wrench' },
  { id: 'learning', name: 'Learning', icon: 'GraduationCap' },
  { id: 'official', name: 'Official', icon: 'BookOpen' },
  { id: 'community', name: 'Community', icon: 'Users' },
] as const

/**
 * Category display order
 * Defines the order sections appear on the page
 */
export const CATEGORY_ORDER: ResourceCategory[] = [
  'our-tools',
  'learning',
  'official',
  'community',
] as const
```

### 3.2 Resource Data

```typescript
import type { Resource } from '@/types/resources'

/**
 * All Resources
 * Complete resource dataset for the Resources page
 *
 * Data Integrity Rules:
 * - id: lowercase, hyphenated, unique across all resources
 * - url: relative paths for internal=true, absolute URLs for external
 * - icon: must match a key in ICON_MAP (src/lib/resources.ts)
 * - tags: lowercase, no duplicates within a resource
 * - dateAdded: ISO 8601 format (YYYY-MM-DD)
 */
export const RESOURCES: Resource[] = [
  // ==========================================================================
  // Our Tools - Internal reference materials and interactive tools
  // ==========================================================================
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
    sortOrder: 1,
  },
  {
    id: 'code-snippets',
    title: 'Code Snippets',
    description: 'Copy-paste code patterns for common tasks',
    url: '/tools/snippets',
    internal: true,
    icon: 'Code2',
    category: 'our-tools',
    tags: ['code', 'patterns', 'copy', 'examples'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'slash-commands',
    title: 'Slash Commands',
    description: 'Built-in commands to speed up your workflow',
    url: '/tools/slash-commands',
    internal: true,
    icon: 'Terminal',
    category: 'our-tools',
    tags: ['commands', 'workflow', 'productivity'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'project-templates',
    title: 'Project Templates',
    description: '6 starter templates for web apps, data science, automation, and more',
    url: '/tools/templates',
    internal: true,
    icon: 'FolderOpen',
    category: 'our-tools',
    tags: ['templates', 'starter', 'projects', 'boilerplate'],
    dateAdded: '2024-01-01',
    sortOrder: 4,
  },
  {
    id: 'claude-md-generator',
    title: 'CLAUDE.md Generator',
    description: 'Create a CLAUDE.md file for your project',
    url: '/tools/claude-md-generator',
    internal: true,
    icon: 'PenTool',
    category: 'our-tools',
    isNew: true,
    tags: ['claude', 'config', 'generator', 'setup'],
    dateAdded: '2024-12-01',
    sortOrder: 5,
  },
  {
    id: 'mcp-explorer',
    title: 'MCP Server Explorer',
    description: 'Browse and configure MCP servers',
    url: '/tools/mcp-explorer',
    internal: true,
    icon: 'Server',
    category: 'our-tools',
    tags: ['mcp', 'servers', 'configuration', 'explore'],
    dateAdded: '2024-06-01',
    sortOrder: 6,
  },

  // ==========================================================================
  // Learning - Structured educational content
  // ==========================================================================
  {
    id: 'start-here-guide',
    title: 'Start Here Guide',
    description: 'Complete setup guide for beginners - install Claude Code, VS Code, and Git',
    url: '/start-here',
    internal: true,
    icon: 'GraduationCap',
    category: 'learning',
    skillLevel: 'beginner',
    tags: ['setup', 'installation', 'getting started', 'beginner'],
    dateAdded: '2024-01-01',
    sortOrder: 1,
  },
  {
    id: 'data-analysis-track',
    title: 'Data Analysis Track',
    description: 'Learn Python and R for data science with Claude',
    url: '/data-analysis',
    internal: true,
    icon: 'FileText',
    category: 'learning',
    skillLevel: 'intermediate',
    tags: ['python', 'r', 'data', 'analysis', 'science'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'git-github-guide',
    title: 'Git & GitHub Guide',
    description: 'Master version control from scratch',
    url: '/git-github',
    internal: true,
    icon: 'GitBranch',
    category: 'learning',
    skillLevel: 'beginner',
    tags: ['git', 'github', 'version control', 'collaboration'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'ai-agents-track',
    title: 'AI Agents Track',
    description: 'Build autonomous AI agents that can reason, plan, and take actions',
    url: '/agents',
    internal: true,
    icon: 'Lightbulb',
    category: 'learning',
    skillLevel: 'advanced',
    tags: ['agents', 'ai', 'autonomous', 'advanced'],
    dateAdded: '2024-03-01',
    sortOrder: 4,
  },
  {
    id: 'best-practices-guide',
    title: 'Best Practices Guide',
    description: 'Tips and techniques for working effectively with Claude Code',
    url: '/advanced-topics/best-practices',
    internal: true,
    icon: 'Lightbulb',
    category: 'learning',
    skillLevel: 'intermediate',
    tags: ['tips', 'techniques', 'best practices', 'effective'],
    dateAdded: '2024-02-01',
    sortOrder: 5,
  },

  // ==========================================================================
  // Official - Anthropic documentation and resources
  // ==========================================================================
  {
    id: 'claude-code-docs',
    title: 'Claude Code Documentation',
    description: 'Official documentation for Claude Code by Anthropic',
    url: 'https://docs.anthropic.com/en/docs/claude-code/overview',
    icon: 'BookOpen',
    category: 'official',
    tags: ['docs', 'documentation', 'official', 'anthropic'],
    dateAdded: '2024-01-01',
    sortOrder: 1,
  },
  {
    id: 'claude-code-github',
    title: 'Claude Code GitHub',
    description: 'Official Claude Code repository with examples and issues',
    url: 'https://github.com/anthropics/claude-code',
    icon: 'GitBranch',
    category: 'official',
    tags: ['github', 'source', 'issues', 'examples'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'anthropic-api-docs',
    title: 'Anthropic API Documentation',
    description: 'Full API reference for building with Claude',
    url: 'https://docs.anthropic.com/en/api/getting-started',
    icon: 'Code2',
    category: 'official',
    tags: ['api', 'reference', 'documentation', 'sdk'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'prompt-engineering',
    title: 'Claude Prompt Engineering',
    description: 'Best practices for writing effective prompts',
    url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
    icon: 'Lightbulb',
    category: 'official',
    tags: ['prompts', 'engineering', 'best practices'],
    dateAdded: '2024-01-01',
    sortOrder: 4,
  },

  // ==========================================================================
  // Community - External tools and community resources
  // ==========================================================================
  {
    id: 'vscode',
    title: 'VS Code',
    description: 'The recommended code editor for Claude Code',
    url: 'https://code.visualstudio.com/',
    icon: 'Code2',
    category: 'community',
    tags: ['editor', 'vscode', 'ide', 'tool'],
    dateAdded: '2024-01-01',
    sortOrder: 1,
  },
  {
    id: 'git',
    title: 'Git',
    description: 'Version control system - essential for any project',
    url: 'https://git-scm.com/',
    icon: 'GitBranch',
    category: 'community',
    tags: ['git', 'version control', 'tool'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    description: 'JavaScript runtime for running scripts and servers',
    url: 'https://nodejs.org/',
    icon: 'Wrench',
    category: 'community',
    tags: ['nodejs', 'javascript', 'runtime', 'server'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Popular language for data analysis and automation',
    url: 'https://www.python.org/',
    icon: 'Code2',
    category: 'community',
    tags: ['python', 'language', 'data', 'automation'],
    dateAdded: '2024-01-01',
    sortOrder: 4,
  },
  {
    id: 'anthropic-support',
    title: 'Anthropic Support',
    description: 'Official support channel for Claude products',
    url: 'https://support.anthropic.com/',
    icon: 'Users',
    category: 'community',
    tags: ['support', 'help', 'anthropic'],
    dateAdded: '2024-01-01',
    sortOrder: 5,
  },
  {
    id: 'reddit-claudeai',
    title: 'r/ClaudeAI Subreddit',
    description: 'Reddit community discussing Claude',
    url: 'https://reddit.com/r/ClaudeAI',
    icon: 'Users',
    category: 'community',
    tags: ['reddit', 'community', 'discussion'],
    dateAdded: '2024-01-01',
    sortOrder: 6,
  },
  {
    id: 'discord-anthropic',
    title: 'Claude Discord',
    description: 'Community Discord for Claude users',
    url: 'https://discord.gg/anthropic',
    icon: 'Users',
    category: 'community',
    tags: ['discord', 'community', 'chat'],
    dateAdded: '2024-01-01',
    sortOrder: 7,
  },
  {
    id: 'youtube-anthropic',
    title: 'Anthropic YouTube Channel',
    description: 'Official videos from Anthropic about Claude',
    url: 'https://www.youtube.com/@anthropic-ai',
    icon: 'Video',
    category: 'community',
    tags: ['youtube', 'videos', 'tutorials', 'anthropic'],
    dateAdded: '2024-01-01',
    sortOrder: 8,
  },
] as const

/**
 * Total resource count (for display and validation)
 */
export const RESOURCE_COUNT = RESOURCES.length

/**
 * Resource counts by category
 */
export const RESOURCE_COUNTS_BY_CATEGORY: Record<ResourceCategory, number> = {
  'our-tools': RESOURCES.filter(r => r.category === 'our-tools').length,
  'learning': RESOURCES.filter(r => r.category === 'learning').length,
  'official': RESOURCES.filter(r => r.category === 'official').length,
  'community': RESOURCES.filter(r => r.category === 'community').length,
}
```

---

## Part 4: Utility Functions

### 4.1 Icon Mapping

**File:** `src/lib/resources.ts`

```typescript
import {
  BookOpen,
  ExternalLink,
  GitBranch,
  FileText,
  Video,
  Code2,
  Wrench,
  GraduationCap,
  Lightbulb,
  Users,
  Terminal,
  FolderOpen,
  PenTool,
  Server,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  Resource,
  ResourceCategory,
  GroupedResources,
  SkillLevel
} from '@/types/resources'

/**
 * Icon mapping from string names to Lucide components
 * This enables SSR-compatible icon references in static data
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  ExternalLink,
  GitBranch,
  FileText,
  Video,
  Code2,
  Wrench,
  GraduationCap,
  Lightbulb,
  Users,
  Terminal,
  FolderOpen,
  PenTool,
  Server,
  Search,
  Layers,
  Sparkles,
} as const

/**
 * Get icon component from string name
 * Returns fallback icon if name not found
 *
 * @param iconName - String name of the Lucide icon
 * @returns Lucide icon component
 *
 * @example
 * const Icon = getIconComponent('FileText')
 * return <Icon className="h-5 w-5" />
 */
export function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || FileText
}
```

### 4.2 Resource Filtering

```typescript
/**
 * Filter resources by category and search query
 *
 * @param resources - Array of resources to filter
 * @param category - Category filter ('all' or specific category)
 * @param search - Search query string
 * @returns Filtered array of resources
 *
 * @example
 * const filtered = filterResources(RESOURCES, 'learning', 'git')
 */
export function filterResources(
  resources: readonly Resource[] | Resource[],
  category: 'all' | ResourceCategory,
  search: string
): Resource[] {
  const searchLower = search.toLowerCase().trim()

  return resources.filter((resource) => {
    // Category filter
    const matchesCategory = category === 'all' || resource.category === category

    // Search filter (matches title, description, or tags)
    const matchesSearch = searchLower === '' ||
      resource.title.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchLower))

    return matchesCategory && matchesSearch
  })
}

/**
 * Group resources by category
 *
 * @param resources - Array of resources to group
 * @returns Resources grouped by category
 *
 * @example
 * const grouped = groupResourcesByCategory(filteredResources)
 * // { 'our-tools': [...], 'learning': [...], ... }
 */
export function groupResourcesByCategory(
  resources: readonly Resource[] | Resource[]
): GroupedResources {
  const groups: GroupedResources = {
    'our-tools': [],
    'learning': [],
    'official': [],
    'community': [],
  }

  resources.forEach((resource) => {
    groups[resource.category].push(resource)
  })

  return groups
}

/**
 * Sort resources by sort order, then by date added (newest first)
 *
 * @param resources - Array of resources to sort
 * @returns Sorted array of resources
 */
export function sortResources(resources: Resource[]): Resource[] {
  return [...resources].sort((a, b) => {
    // First by sortOrder (if defined)
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder
    }
    if (a.sortOrder !== undefined) return -1
    if (b.sortOrder !== undefined) return 1

    // Then by dateAdded (newest first)
    if (a.dateAdded && b.dateAdded) {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    }

    return 0
  })
}

/**
 * Get resources marked as new
 *
 * @param resources - Array of resources to filter
 * @returns Resources with isNew=true
 */
export function getNewResources(resources: readonly Resource[] | Resource[]): Resource[] {
  return resources.filter(r => r.isNew === true)
}

/**
 * Get resources by skill level
 *
 * @param resources - Array of resources to filter
 * @param level - Skill level to filter by
 * @returns Resources matching the skill level
 */
export function getResourcesBySkillLevel(
  resources: readonly Resource[] | Resource[],
  level: SkillLevel
): Resource[] {
  return resources.filter(r => r.skillLevel === level)
}

/**
 * Get resource by ID
 *
 * @param resources - Array of resources to search
 * @param id - Resource ID to find
 * @returns Resource or undefined if not found
 */
export function getResourceById(
  resources: readonly Resource[] | Resource[],
  id: string
): Resource | undefined {
  return resources.find(r => r.id === id)
}

/**
 * Get internal resources only
 *
 * @param resources - Array of resources to filter
 * @returns Resources with internal=true
 */
export function getInternalResources(
  resources: readonly Resource[] | Resource[]
): Resource[] {
  return resources.filter(r => r.internal === true)
}

/**
 * Get external resources only
 *
 * @param resources - Array of resources to filter
 * @returns Resources with internal=undefined/false
 */
export function getExternalResources(
  resources: readonly Resource[] | Resource[]
): Resource[] {
  return resources.filter(r => !r.internal)
}
```

### 4.3 URL State Utilities

```typescript
import type { ResourceFilterState, ResourceCategory } from '@/types/resources'
import { RESOURCE_CATEGORIES } from '@/types/resources'

/**
 * Parse filter state from URL search params
 *
 * @param searchParams - URL search params
 * @returns Parsed filter state with defaults
 *
 * @example
 * const state = parseFilterState(new URLSearchParams('?category=learning&q=git'))
 * // { category: 'learning', search: 'git' }
 */
export function parseFilterState(
  searchParams: URLSearchParams | null
): ResourceFilterState {
  if (!searchParams) {
    return { category: 'all', search: '' }
  }

  const categoryParam = searchParams.get('category')
  const category: 'all' | ResourceCategory =
    categoryParam && RESOURCE_CATEGORIES.includes(categoryParam as ResourceCategory)
      ? (categoryParam as ResourceCategory)
      : 'all'

  const search = searchParams.get('q') || ''

  return { category, search }
}

/**
 * Build URL search params from filter state
 * Omits default values to keep URLs clean
 *
 * @param state - Current filter state
 * @returns URL search params string (without leading ?)
 *
 * @example
 * buildFilterParams({ category: 'learning', search: '' })
 * // 'category=learning'
 *
 * buildFilterParams({ category: 'all', search: 'git' })
 * // 'q=git'
 */
export function buildFilterParams(state: ResourceFilterState): string {
  const params = new URLSearchParams()

  if (state.category !== 'all') {
    params.set('category', state.category)
  }

  if (state.search.trim() !== '') {
    params.set('q', state.search.trim())
  }

  return params.toString()
}
```

### 4.4 Schema Generation for SEO

```typescript
import type { Resource } from '@/types/resources'
import { siteConfig } from '@/lib/metadata'

/**
 * Generate JSON-LD CollectionPage schema for resources
 *
 * @param resources - Array of resources to include
 * @returns JSON-LD schema object
 */
export function generateResourcesCollectionSchema(resources: readonly Resource[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Claude Code Resources',
    description: 'A curated collection of resources to help you master Claude Code and AI-powered development.',
    url: `${siteConfig.url}/resources`,
    numberOfItems: resources.length,
    itemListElement: resources.slice(0, 20).map((resource, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: resource.title,
      description: resource.description,
      url: resource.internal
        ? `${siteConfig.url}${resource.url}`
        : resource.url,
    })),
  }
}

/**
 * Generate JSON-LD ItemList schema for a category
 *
 * @param category - Category ID
 * @param resources - Resources in the category
 * @returns JSON-LD schema object
 */
export function generateCategorySchema(
  category: ResourceCategory,
  resources: Resource[]
) {
  const categoryNames: Record<ResourceCategory, string> = {
    'our-tools': 'Claude Code Learning Hub Tools',
    'learning': 'Learning Resources',
    'official': 'Official Anthropic Resources',
    'community': 'Community Resources',
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryNames[category],
    numberOfItems: resources.length,
    itemListElement: resources.map((resource, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: resource.title,
      url: resource.internal
        ? `${siteConfig.url}${resource.url}`
        : resource.url,
    })),
  }
}
```

---

## Part 5: Data Validation

### 5.1 Validation Functions

```typescript
import type { Resource } from '@/types/resources'
import { RESOURCE_CATEGORIES, SKILL_LEVELS, VALID_ICON_NAMES } from '@/types/resources'

/**
 * Validation result for a single resource
 */
interface ResourceValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate a single resource
 *
 * @param resource - Resource to validate
 * @param allResources - All resources (for uniqueness checks)
 * @returns Validation result
 */
export function validateResource(
  resource: Resource,
  allResources: readonly Resource[]
): ResourceValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required field checks
  if (!resource.id || resource.id.trim() === '') {
    errors.push('Missing required field: id')
  } else {
    // ID format check
    if (!/^[a-z0-9-]+$/.test(resource.id)) {
      errors.push(`Invalid id format: "${resource.id}" (must be lowercase, hyphenated)`)
    }
    // Uniqueness check
    const duplicates = allResources.filter(r => r.id === resource.id)
    if (duplicates.length > 1) {
      errors.push(`Duplicate id: "${resource.id}"`)
    }
  }

  if (!resource.title || resource.title.trim() === '') {
    errors.push('Missing required field: title')
  }

  if (!resource.description || resource.description.trim() === '') {
    errors.push('Missing required field: description')
  } else if (resource.description.length > 200) {
    warnings.push(`Description exceeds 200 chars (${resource.description.length})`)
  }

  if (!resource.url || resource.url.trim() === '') {
    errors.push('Missing required field: url')
  } else {
    // URL format check
    if (resource.internal && !resource.url.startsWith('/')) {
      errors.push(`Internal resource URL must start with /: "${resource.url}"`)
    }
    if (!resource.internal && !resource.url.startsWith('http')) {
      errors.push(`External resource URL must be absolute: "${resource.url}"`)
    }
  }

  if (!resource.icon) {
    errors.push('Missing required field: icon')
  } else if (!VALID_ICON_NAMES.includes(resource.icon as typeof VALID_ICON_NAMES[number])) {
    warnings.push(`Unknown icon name: "${resource.icon}"`)
  }

  if (!RESOURCE_CATEGORIES.includes(resource.category)) {
    errors.push(`Invalid category: "${resource.category}"`)
  }

  // Optional field checks
  if (resource.skillLevel && !SKILL_LEVELS.includes(resource.skillLevel)) {
    errors.push(`Invalid skillLevel: "${resource.skillLevel}"`)
  }

  if (resource.dateAdded && !/^\d{4}-\d{2}-\d{2}$/.test(resource.dateAdded)) {
    errors.push(`Invalid dateAdded format: "${resource.dateAdded}" (expected YYYY-MM-DD)`)
  }

  if (resource.tags) {
    const uniqueTags = new Set(resource.tags)
    if (uniqueTags.size !== resource.tags.length) {
      warnings.push('Duplicate tags detected')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate all resources
 *
 * @param resources - Array of resources to validate
 * @returns Validation summary
 */
export function validateAllResources(resources: readonly Resource[]) {
  const results = resources.map(r => ({
    id: r.id,
    ...validateResource(r, resources),
  }))

  const invalid = results.filter(r => !r.valid)
  const withWarnings = results.filter(r => r.warnings.length > 0)

  return {
    valid: invalid.length === 0,
    totalResources: resources.length,
    invalidCount: invalid.length,
    warningCount: withWarnings.length,
    results,
    summary: {
      errors: invalid.flatMap(r => r.errors.map(e => `[${r.id}] ${e}`)),
      warnings: withWarnings.flatMap(r => r.warnings.map(w => `[${r.id}] ${w}`)),
    },
  }
}
```

### 5.2 Build-Time Validation Script

**File:** `scripts/validate-resources.ts`

```typescript
#!/usr/bin/env ts-node
/**
 * Resource Data Validation Script
 * Run with: npx ts-node scripts/validate-resources.ts
 *
 * Validates:
 * - All required fields present
 * - ID uniqueness and format
 * - URL format consistency
 * - Icon name validity
 * - Category and skill level values
 * - Date format
 */

import { RESOURCES } from '../src/data/resources'
import { validateAllResources } from '../src/lib/resources'

console.log('🔍 Validating resources...\n')

const validation = validateAllResources(RESOURCES)

if (validation.valid) {
  console.log('✅ All resources valid!')
  console.log(`   Total: ${validation.totalResources}`)

  if (validation.warningCount > 0) {
    console.log(`\n⚠️  Warnings (${validation.warningCount}):`)
    validation.summary.warnings.forEach(w => console.log(`   ${w}`))
  }

  process.exit(0)
} else {
  console.log('❌ Validation failed!')
  console.log(`   Invalid: ${validation.invalidCount}/${validation.totalResources}`)

  console.log('\n🚫 Errors:')
  validation.summary.errors.forEach(e => console.log(`   ${e}`))

  if (validation.warningCount > 0) {
    console.log(`\n⚠️  Warnings:`)
    validation.summary.warnings.forEach(w => console.log(`   ${w}`))
  }

  process.exit(1)
}
```

---

## Part 6: Future Database Schema (V1.5+)

### 6.1 SQLite Schema Design

For V1.5 when database implementation is needed:

```sql
-- =============================================================================
-- Resources Table
-- Core resource data
-- =============================================================================
CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  internal INTEGER DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('our-tools', 'learning', 'official', 'community')),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  is_new INTEGER DEFAULT 0,
  date_added TEXT,
  sort_order INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Category index for filtered queries
CREATE INDEX idx_resources_category ON resources(category);

-- Sort order index for ordered retrieval
CREATE INDEX idx_resources_sort ON resources(category, sort_order);

-- =============================================================================
-- Resource Tags Table
-- Many-to-many relationship for searchable tags
-- =============================================================================
CREATE TABLE resource_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(resource_id, tag)
);

-- Tag search index
CREATE INDEX idx_resource_tags_tag ON resource_tags(tag);
CREATE INDEX idx_resource_tags_resource ON resource_tags(resource_id);

-- =============================================================================
-- Full-Text Search (optional, for advanced search)
-- =============================================================================
CREATE VIRTUAL TABLE resources_fts USING fts5(
  id,
  title,
  description,
  tags,
  content='resources',
  content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER resources_ai AFTER INSERT ON resources BEGIN
  INSERT INTO resources_fts(rowid, id, title, description, tags)
  SELECT NEW.rowid, NEW.id, NEW.title, NEW.description,
    (SELECT group_concat(tag, ' ') FROM resource_tags WHERE resource_id = NEW.id);
END;

CREATE TRIGGER resources_ad AFTER DELETE ON resources BEGIN
  INSERT INTO resources_fts(resources_fts, rowid, id, title, description, tags)
  VALUES('delete', OLD.rowid, OLD.id, OLD.title, OLD.description, '');
END;

CREATE TRIGGER resources_au AFTER UPDATE ON resources BEGIN
  INSERT INTO resources_fts(resources_fts, rowid, id, title, description, tags)
  VALUES('delete', OLD.rowid, OLD.id, OLD.title, OLD.description, '');
  INSERT INTO resources_fts(rowid, id, title, description, tags)
  SELECT NEW.rowid, NEW.id, NEW.title, NEW.description,
    (SELECT group_concat(tag, ' ') FROM resource_tags WHERE resource_id = NEW.id);
END;
```

### 6.2 Database Migration Script

**File:** `migrations/001_create_resources.ts`

```typescript
import { RESOURCES } from '../src/data/resources'

export async function up(db: Database) {
  // Create tables
  await db.exec(`
    CREATE TABLE resources (...);
    CREATE TABLE resource_tags (...);
    CREATE INDEX ...;
  `)

  // Seed from static data
  for (const resource of RESOURCES) {
    await db.run(`
      INSERT INTO resources (id, title, description, url, icon, internal, category, skill_level, is_new, date_added, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      resource.id,
      resource.title,
      resource.description,
      resource.url,
      resource.icon,
      resource.internal ? 1 : 0,
      resource.category,
      resource.skillLevel || null,
      resource.isNew ? 1 : 0,
      resource.dateAdded || null,
      resource.sortOrder || null,
    ])

    // Insert tags
    if (resource.tags) {
      for (const tag of resource.tags) {
        await db.run(
          'INSERT INTO resource_tags (resource_id, tag) VALUES (?, ?)',
          [resource.id, tag]
        )
      }
    }
  }
}

export async function down(db: Database) {
  await db.exec(`
    DROP TABLE IF EXISTS resource_tags;
    DROP TABLE IF EXISTS resources;
  `)
}
```

---

## Part 7: Performance Considerations

### 7.1 Build-Time Optimization

| Optimization | Implementation | Impact |
|--------------|----------------|--------|
| Static import | `RESOURCES` array imported at build time | Zero runtime fetch |
| Tree-shaking | Unused utilities eliminated | Smaller bundle |
| Type stripping | TypeScript types removed at build | No runtime overhead |
| Const assertion | `as const` enables literal types | Better tree-shaking |

### 7.2 Runtime Performance

| Concern | Mitigation |
|---------|------------|
| Filter recalculation | `useMemo` with category/search deps |
| Icon component lookup | Single `ICON_MAP` object, O(1) access |
| Grouped resources | Computed once per filter change |
| URL state sync | Debounced updates (300ms recommended) |

### 7.3 Bundle Size Impact

Estimated additions:
- Types: ~0 KB (stripped at build)
- Data file: ~8 KB (23 resources × ~350 bytes)
- Utilities: ~2 KB (tree-shaken)
- **Total: ~10 KB** (gzipped: ~3 KB)

---

## Part 8: Testing Strategy

### 8.1 Unit Tests

**File:** `src/lib/__tests__/resources.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import {
  getIconComponent,
  filterResources,
  groupResourcesByCategory,
  parseFilterState,
  buildFilterParams,
  validateResource,
} from '../resources'
import { RESOURCES } from '@/data/resources'
import { FileText } from 'lucide-react'

describe('getIconComponent', () => {
  it('returns correct icon for known names', () => {
    expect(getIconComponent('FileText')).toBe(FileText)
  })

  it('returns fallback for unknown names', () => {
    expect(getIconComponent('UnknownIcon')).toBe(FileText)
  })
})

describe('filterResources', () => {
  it('returns all resources for "all" category with empty search', () => {
    const result = filterResources(RESOURCES, 'all', '')
    expect(result.length).toBe(RESOURCES.length)
  })

  it('filters by category', () => {
    const result = filterResources(RESOURCES, 'learning', '')
    expect(result.every(r => r.category === 'learning')).toBe(true)
  })

  it('filters by search term in title', () => {
    const result = filterResources(RESOURCES, 'all', 'git')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(r =>
      r.title.toLowerCase().includes('git') ||
      r.description.toLowerCase().includes('git') ||
      r.tags?.some(t => t.includes('git'))
    )).toBe(true)
  })

  it('combines category and search filters', () => {
    const result = filterResources(RESOURCES, 'learning', 'beginner')
    expect(result.every(r => r.category === 'learning')).toBe(true)
  })
})

describe('groupResourcesByCategory', () => {
  it('groups resources into all categories', () => {
    const grouped = groupResourcesByCategory(RESOURCES)
    expect(Object.keys(grouped)).toEqual(['our-tools', 'learning', 'official', 'community'])
  })

  it('maintains resource count', () => {
    const grouped = groupResourcesByCategory(RESOURCES)
    const total = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0)
    expect(total).toBe(RESOURCES.length)
  })
})

describe('parseFilterState', () => {
  it('returns defaults for null params', () => {
    expect(parseFilterState(null)).toEqual({ category: 'all', search: '' })
  })

  it('parses category param', () => {
    const params = new URLSearchParams('?category=learning')
    expect(parseFilterState(params).category).toBe('learning')
  })

  it('ignores invalid category', () => {
    const params = new URLSearchParams('?category=invalid')
    expect(parseFilterState(params).category).toBe('all')
  })
})

describe('buildFilterParams', () => {
  it('returns empty string for defaults', () => {
    expect(buildFilterParams({ category: 'all', search: '' })).toBe('')
  })

  it('includes category when not all', () => {
    expect(buildFilterParams({ category: 'learning', search: '' })).toBe('category=learning')
  })

  it('includes search when not empty', () => {
    expect(buildFilterParams({ category: 'all', search: 'git' })).toBe('q=git')
  })
})

describe('validateResource', () => {
  it('validates correct resource', () => {
    const result = validateResource(RESOURCES[0], RESOURCES)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('catches missing id', () => {
    const invalid = { ...RESOURCES[0], id: '' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('id'))).toBe(true)
  })
})
```

### 8.2 Data Integrity Tests

```typescript
describe('RESOURCES data integrity', () => {
  it('has unique IDs', () => {
    const ids = RESOURCES.map(r => r.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('has valid categories', () => {
    const validCategories = ['our-tools', 'learning', 'official', 'community']
    expect(RESOURCES.every(r => validCategories.includes(r.category))).toBe(true)
  })

  it('has correct URL format for internal resources', () => {
    const internal = RESOURCES.filter(r => r.internal)
    expect(internal.every(r => r.url.startsWith('/'))).toBe(true)
  })

  it('has correct URL format for external resources', () => {
    const external = RESOURCES.filter(r => !r.internal)
    expect(external.every(r => r.url.startsWith('http'))).toBe(true)
  })
})
```

---

## Part 9: Implementation Checklist

### 9.1 File Creation Order

| Step | File | Priority | Dependencies |
|------|------|----------|--------------|
| 1 | `src/types/resources.ts` | **Critical** | None |
| 2 | `src/data/resources.ts` | **Critical** | Types |
| 3 | `src/lib/resources.ts` | **Critical** | Types |
| 4 | `scripts/validate-resources.ts` | Medium | Data + Lib |
| 5 | `src/lib/__tests__/resources.test.ts` | Medium | All above |

### 9.2 Acceptance Criteria

- [ ] All 23 resources have unique `id` fields
- [ ] All internal resources have relative URLs starting with `/`
- [ ] All external resources have absolute URLs starting with `http`
- [ ] All icons are valid Lucide icon names
- [ ] All categories are one of: `our-tools`, `learning`, `official`, `community`
- [ ] All skill levels (if present) are: `beginner`, `intermediate`, `advanced`
- [ ] All `dateAdded` values (if present) are in `YYYY-MM-DD` format
- [ ] Type exports work correctly (`import type { Resource } from '@/types/resources'`)
- [ ] Data exports work correctly (`import { RESOURCES } from '@/data/resources'`)
- [ ] Utility functions are tree-shakeable
- [ ] Validation script runs without errors
- [ ] All unit tests pass

### 9.3 Integration Points

**For Frontend Engineers:**
```typescript
// Import types
import type { Resource, ResourceCategory, GroupedResources } from '@/types/resources'

// Import data
import { RESOURCES, SECTION_CONFIG, CATEGORY_FILTERS } from '@/data/resources'

// Import utilities
import {
  getIconComponent,
  filterResources,
  groupResourcesByCategory,
  parseFilterState,
  buildFilterParams,
} from '@/lib/resources'
```

**For Backend Engineers (V1.5+):**
```typescript
// Seed database from static data
import { RESOURCES } from '@/data/resources'

// Validation for API input
import { validateResource, isResourceCategory } from '@/lib/resources'

// Schema for responses
import type { Resource } from '@/types/resources'
```

---

## Part 10: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Icon name typo | Medium | Low | Fallback icon + validation script |
| Duplicate IDs | Low | Medium | Validation script + unique constraint |
| URL format mismatch | Low | High | Validation + internal/external checks |
| Type drift | Low | Medium | Shared types + strict TypeScript |
| Bundle size growth | Low | Low | Tree-shaking + const assertions |

---

## Appendix A: Complete File Listing

```
src/
├── types/
│   └── resources.ts          # Type definitions (~100 lines)
│
├── data/
│   └── resources.ts          # Static resource data (~250 lines)
│
├── lib/
│   ├── resources.ts          # Utility functions (~200 lines)
│   └── __tests__/
│       └── resources.test.ts # Unit tests (~150 lines)
│
scripts/
└── validate-resources.ts     # Build-time validation (~50 lines)
```

**Total new code:** ~750 lines (excluding tests)

---

## Appendix B: Type Reference Card

```typescript
// Quick reference for all exported types

// Enums/Literals
type ResourceCategory = 'our-tools' | 'learning' | 'official' | 'community'
type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

// Core interfaces
interface Resource { ... }
interface ResourceSectionConfig { ... }
interface CategoryFilterOption { ... }
interface ResourceFilterState { ... }

// Derived types
type GroupedResources = Record<ResourceCategory, Resource[]>

// Constants
const RESOURCE_CATEGORIES: readonly ResourceCategory[]
const SKILL_LEVELS: readonly SkillLevel[]
const VALID_ICON_NAMES: readonly string[]
```

---

**Document Status:** Complete
**Ready for Implementation:** Yes
**Review Required:** None (self-contained data layer)
