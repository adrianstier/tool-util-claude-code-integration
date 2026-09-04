/**
 * Resource Utilities
 * Utility functions for the Resources page data layer
 */

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
  ResourceFilterState,
  SkillLevel,
} from '@/types/resources'
import {
  RESOURCE_CATEGORIES,
  SKILL_LEVELS,
  VALID_ICON_NAMES,
} from '@/types/resources'
import { siteConfig } from '@/lib/metadata'

// =============================================================================
// Icon Mapping
// =============================================================================

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

// =============================================================================
// Resource Filtering
// =============================================================================

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
    const matchesSearch =
      searchLower === '' ||
      resource.title.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.tags?.some((tag) => tag.toLowerCase().includes(searchLower))

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
    learning: [],
    official: [],
    community: [],
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
export function getNewResources(
  resources: readonly Resource[] | Resource[]
): Resource[] {
  return resources.filter((r) => r.isNew === true)
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
  return resources.filter((r) => r.skillLevel === level)
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
  return resources.find((r) => r.id === id)
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
  return resources.filter((r) => r.internal === true)
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
  return resources.filter((r) => !r.internal)
}

// =============================================================================
// URL State Utilities
// =============================================================================

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
    categoryParam &&
    RESOURCE_CATEGORIES.includes(categoryParam as ResourceCategory)
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

// =============================================================================
// Schema Generation for SEO
// =============================================================================

/**
 * Generate JSON-LD CollectionPage schema for resources
 *
 * @param resources - Array of resources to include
 * @returns JSON-LD schema object
 */
export function generateResourcesCollectionSchema(
  resources: readonly Resource[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Claude Code Resources',
    description:
      'A curated collection of resources to help you master Claude Code and AI-powered development.',
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
    learning: 'Learning Resources',
    official: 'Official Anthropic Resources',
    community: 'Community Resources',
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

// =============================================================================
// Data Validation
// =============================================================================

/**
 * Validation result for a single resource
 */
export interface ResourceValidationResult {
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
      errors.push(
        `Invalid id format: "${resource.id}" (must be lowercase, hyphenated)`
      )
    }
    // Uniqueness check
    const duplicates = allResources.filter((r) => r.id === resource.id)
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
    warnings.push(
      `Description exceeds 200 chars (${resource.description.length})`
    )
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
  } else if (
    !VALID_ICON_NAMES.includes(
      resource.icon as (typeof VALID_ICON_NAMES)[number]
    )
  ) {
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
    errors.push(
      `Invalid dateAdded format: "${resource.dateAdded}" (expected YYYY-MM-DD)`
    )
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
  const results = resources.map((r) => ({
    id: r.id,
    ...validateResource(r, resources),
  }))

  const invalid = results.filter((r) => !r.valid)
  const withWarnings = results.filter((r) => r.warnings.length > 0)

  return {
    valid: invalid.length === 0,
    totalResources: resources.length,
    invalidCount: invalid.length,
    warningCount: withWarnings.length,
    results,
    summary: {
      errors: invalid.flatMap((r) => r.errors.map((e) => `[${r.id}] ${e}`)),
      warnings: withWarnings.flatMap((r) =>
        r.warnings.map((w) => `[${r.id}] ${w}`)
      ),
    },
  }
}
