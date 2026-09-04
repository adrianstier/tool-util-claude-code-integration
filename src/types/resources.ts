/**
 * Resource Types
 * Shared type definitions for the Resources page data layer
 */

// =============================================================================
// Core Type Definitions
// =============================================================================

/**
 * Resource Category Types
 * Defines the four main sections of the Resources page
 */
export type ResourceCategory =
  | 'our-tools'
  | 'learning'
  | 'official'
  | 'community'

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

  /** Priority for manual ordering (lower = higher priority) */
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

// =============================================================================
// Validation Constants
// =============================================================================

/**
 * Valid resource categories (for runtime validation)
 */
export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  'our-tools',
  'learning',
  'official',
  'community',
] as const

/**
 * Valid skill levels (for runtime validation)
 */
export const SKILL_LEVELS: readonly SkillLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
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
  'Sparkles',
] as const

export type ValidIconName = (typeof VALID_ICON_NAMES)[number]

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard for ResourceCategory
 */
export function isResourceCategory(value: unknown): value is ResourceCategory {
  return (
    typeof value === 'string' &&
    RESOURCE_CATEGORIES.includes(value as ResourceCategory)
  )
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
  return (
    typeof value === 'string' &&
    VALID_ICON_NAMES.includes(value as ValidIconName)
  )
}
