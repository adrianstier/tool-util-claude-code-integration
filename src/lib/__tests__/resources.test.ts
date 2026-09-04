/**
 * Resource Utilities Tests
 * Unit tests for the Resources page data layer
 */

import { FileText } from 'lucide-react'
import {
  getIconComponent,
  filterResources,
  groupResourcesByCategory,
  sortResources,
  getNewResources,
  getResourcesBySkillLevel,
  getResourceById,
  getInternalResources,
  getExternalResources,
  parseFilterState,
  buildFilterParams,
  validateResource,
  validateAllResources,
  ICON_MAP,
} from '../resources'
import { RESOURCES, RESOURCE_COUNT } from '@/data/resources'
import type { Resource } from '@/types/resources'

// =============================================================================
// Icon Mapping Tests
// =============================================================================

describe('getIconComponent', () => {
  it('returns correct icon for known names', () => {
    expect(getIconComponent('FileText')).toBe(FileText)
  })

  it('returns fallback for unknown names', () => {
    expect(getIconComponent('UnknownIcon')).toBe(FileText)
  })

  it('returns fallback for empty string', () => {
    expect(getIconComponent('')).toBe(FileText)
  })

  it('has all expected icons in ICON_MAP', () => {
    const expectedIcons = [
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
    ]
    expectedIcons.forEach((icon) => {
      expect(ICON_MAP[icon]).toBeDefined()
    })
  })
})

// =============================================================================
// Resource Filtering Tests
// =============================================================================

describe('filterResources', () => {
  it('returns all resources for "all" category with empty search', () => {
    const result = filterResources(RESOURCES, 'all', '')
    expect(result.length).toBe(RESOURCES.length)
  })

  it('filters by category', () => {
    const result = filterResources(RESOURCES, 'learning', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((r) => r.category === 'learning')).toBe(true)
  })

  it('filters by search term in title', () => {
    const result = filterResources(RESOURCES, 'all', 'git')
    expect(result.length).toBeGreaterThan(0)
    expect(
      result.some(
        (r) =>
          r.title.toLowerCase().includes('git') ||
          r.description.toLowerCase().includes('git') ||
          r.tags?.some((t) => t.includes('git'))
      )
    ).toBe(true)
  })

  it('filters by search term in description', () => {
    const result = filterResources(RESOURCES, 'all', 'version control')
    expect(result.length).toBeGreaterThan(0)
  })

  it('filters by search term in tags', () => {
    const result = filterResources(RESOURCES, 'all', 'reference')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((r) => r.tags?.includes('reference'))).toBe(true)
  })

  it('combines category and search filters', () => {
    const result = filterResources(RESOURCES, 'learning', 'beginner')
    expect(result.every((r) => r.category === 'learning')).toBe(true)
  })

  it('returns empty array when no matches', () => {
    const result = filterResources(RESOURCES, 'all', 'xyznonexistent123')
    expect(result.length).toBe(0)
  })

  it('handles case-insensitive search', () => {
    const result1 = filterResources(RESOURCES, 'all', 'GIT')
    const result2 = filterResources(RESOURCES, 'all', 'git')
    expect(result1.length).toBe(result2.length)
  })

  it('trims whitespace from search', () => {
    const result1 = filterResources(RESOURCES, 'all', '  git  ')
    const result2 = filterResources(RESOURCES, 'all', 'git')
    expect(result1.length).toBe(result2.length)
  })
})

// =============================================================================
// Resource Grouping Tests
// =============================================================================

describe('groupResourcesByCategory', () => {
  it('groups resources into all categories', () => {
    const grouped = groupResourcesByCategory(RESOURCES)
    expect(Object.keys(grouped)).toEqual([
      'our-tools',
      'learning',
      'official',
      'community',
    ])
  })

  it('maintains resource count', () => {
    const grouped = groupResourcesByCategory(RESOURCES)
    const total = Object.values(grouped).reduce(
      (sum, arr) => sum + arr.length,
      0
    )
    expect(total).toBe(RESOURCES.length)
  })

  it('places resources in correct categories', () => {
    const grouped = groupResourcesByCategory(RESOURCES)
    Object.entries(grouped).forEach(([category, resources]) => {
      expect(resources.every((r) => r.category === category)).toBe(true)
    })
  })

  it('handles empty array', () => {
    const grouped = groupResourcesByCategory([])
    expect(grouped['our-tools']).toHaveLength(0)
    expect(grouped['learning']).toHaveLength(0)
    expect(grouped['official']).toHaveLength(0)
    expect(grouped['community']).toHaveLength(0)
  })
})

// =============================================================================
// Resource Sorting Tests
// =============================================================================

describe('sortResources', () => {
  const testResources: Resource[] = [
    {
      id: 'c',
      title: 'C',
      description: 'Third',
      url: '/c',
      icon: 'FileText',
      category: 'our-tools',
      sortOrder: 3,
    },
    {
      id: 'a',
      title: 'A',
      description: 'First',
      url: '/a',
      icon: 'FileText',
      category: 'our-tools',
      sortOrder: 1,
    },
    {
      id: 'b',
      title: 'B',
      description: 'Second',
      url: '/b',
      icon: 'FileText',
      category: 'our-tools',
      sortOrder: 2,
    },
  ]

  it('sorts by sortOrder', () => {
    const sorted = sortResources(testResources)
    expect(sorted[0].id).toBe('a')
    expect(sorted[1].id).toBe('b')
    expect(sorted[2].id).toBe('c')
  })

  it('does not mutate original array', () => {
    const original = [...testResources]
    sortResources(testResources)
    expect(testResources).toEqual(original)
  })

  it('handles resources without sortOrder', () => {
    const withoutOrder: Resource[] = [
      {
        id: 'x',
        title: 'X',
        description: 'X',
        url: '/x',
        icon: 'FileText',
        category: 'our-tools',
        dateAdded: '2024-01-01',
      },
      {
        id: 'y',
        title: 'Y',
        description: 'Y',
        url: '/y',
        icon: 'FileText',
        category: 'our-tools',
        dateAdded: '2024-06-01',
      },
    ]
    const sorted = sortResources(withoutOrder)
    // Newer date should come first when no sortOrder
    expect(sorted[0].id).toBe('y')
  })
})

// =============================================================================
// Resource Getter Tests
// =============================================================================

describe('getNewResources', () => {
  it('returns only resources marked as new', () => {
    const newResources = getNewResources(RESOURCES)
    expect(newResources.every((r) => r.isNew === true)).toBe(true)
  })
})

describe('getResourcesBySkillLevel', () => {
  it('returns beginner resources', () => {
    const beginners = getResourcesBySkillLevel(RESOURCES, 'beginner')
    expect(beginners.every((r) => r.skillLevel === 'beginner')).toBe(true)
  })

  it('returns intermediate resources', () => {
    const intermediate = getResourcesBySkillLevel(RESOURCES, 'intermediate')
    expect(intermediate.every((r) => r.skillLevel === 'intermediate')).toBe(
      true
    )
  })

  it('returns advanced resources', () => {
    const advanced = getResourcesBySkillLevel(RESOURCES, 'advanced')
    expect(advanced.every((r) => r.skillLevel === 'advanced')).toBe(true)
  })
})

describe('getResourceById', () => {
  it('returns resource with matching ID', () => {
    const resource = getResourceById(RESOURCES, 'cheatsheets')
    expect(resource).toBeDefined()
    expect(resource?.id).toBe('cheatsheets')
  })

  it('returns undefined for non-existent ID', () => {
    const resource = getResourceById(RESOURCES, 'nonexistent')
    expect(resource).toBeUndefined()
  })
})

describe('getInternalResources', () => {
  it('returns only internal resources', () => {
    const internal = getInternalResources(RESOURCES)
    expect(internal.every((r) => r.internal === true)).toBe(true)
  })

  it('returns resources with relative URLs', () => {
    const internal = getInternalResources(RESOURCES)
    expect(internal.every((r) => r.url.startsWith('/'))).toBe(true)
  })
})

describe('getExternalResources', () => {
  it('returns only external resources', () => {
    const external = getExternalResources(RESOURCES)
    expect(external.every((r) => !r.internal)).toBe(true)
  })

  it('returns resources with absolute URLs', () => {
    const external = getExternalResources(RESOURCES)
    expect(external.every((r) => r.url.startsWith('http'))).toBe(true)
  })
})

// =============================================================================
// URL State Tests
// =============================================================================

describe('parseFilterState', () => {
  it('returns defaults for null params', () => {
    expect(parseFilterState(null)).toEqual({ category: 'all', search: '' })
  })

  it('parses category param', () => {
    const params = new URLSearchParams('?category=learning')
    expect(parseFilterState(params).category).toBe('learning')
  })

  it('parses search param', () => {
    const params = new URLSearchParams('?q=git')
    expect(parseFilterState(params).search).toBe('git')
  })

  it('parses both params', () => {
    const params = new URLSearchParams('?category=official&q=api')
    const state = parseFilterState(params)
    expect(state.category).toBe('official')
    expect(state.search).toBe('api')
  })

  it('ignores invalid category', () => {
    const params = new URLSearchParams('?category=invalid')
    expect(parseFilterState(params).category).toBe('all')
  })

  it('handles empty params', () => {
    const params = new URLSearchParams('')
    expect(parseFilterState(params)).toEqual({ category: 'all', search: '' })
  })
})

describe('buildFilterParams', () => {
  it('returns empty string for defaults', () => {
    expect(buildFilterParams({ category: 'all', search: '' })).toBe('')
  })

  it('includes category when not all', () => {
    expect(buildFilterParams({ category: 'learning', search: '' })).toBe(
      'category=learning'
    )
  })

  it('includes search when not empty', () => {
    expect(buildFilterParams({ category: 'all', search: 'git' })).toBe('q=git')
  })

  it('includes both when set', () => {
    const params = buildFilterParams({ category: 'official', search: 'api' })
    expect(params).toContain('category=official')
    expect(params).toContain('q=api')
  })

  it('trims search whitespace', () => {
    expect(buildFilterParams({ category: 'all', search: '  git  ' })).toBe(
      'q=git'
    )
  })
})

// =============================================================================
// Validation Tests
// =============================================================================

describe('validateResource', () => {
  const validResource: Resource = {
    id: 'test-resource',
    title: 'Test Resource',
    description: 'A test resource for validation',
    url: '/test',
    icon: 'FileText',
    category: 'our-tools',
    internal: true,
  }

  it('validates correct resource', () => {
    const result = validateResource(validResource, [validResource])
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('catches missing id', () => {
    const invalid = { ...validResource, id: '' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('id'))).toBe(true)
  })

  it('catches invalid id format', () => {
    const invalid = { ...validResource, id: 'Invalid ID!' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('format'))).toBe(true)
  })

  it('catches duplicate id', () => {
    const resources = [validResource, validResource]
    const result = validateResource(validResource, resources)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('Duplicate'))).toBe(true)
  })

  it('catches missing title', () => {
    const invalid = { ...validResource, title: '' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('title'))).toBe(true)
  })

  it('catches missing description', () => {
    const invalid = { ...validResource, description: '' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('description'))).toBe(true)
  })

  it('warns on long description', () => {
    const longDesc = { ...validResource, description: 'a'.repeat(250) }
    const result = validateResource(longDesc, [longDesc])
    expect(result.warnings.some((w) => w.includes('exceeds'))).toBe(true)
  })

  it('catches internal resource with absolute URL', () => {
    const invalid = { ...validResource, url: 'https://example.com' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('must start with /'))).toBe(
      true
    )
  })

  it('catches external resource with relative URL', () => {
    const invalid = { ...validResource, internal: false, url: '/relative' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('absolute'))).toBe(true)
  })

  it('warns on unknown icon', () => {
    const unknown = { ...validResource, icon: 'UnknownIcon' }
    const result = validateResource(unknown, [unknown])
    expect(result.warnings.some((w) => w.includes('Unknown icon'))).toBe(true)
  })

  it('catches invalid category', () => {
    const invalid = {
      ...validResource,
      category: 'invalid' as Resource['category'],
    }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('category'))).toBe(true)
  })

  it('catches invalid skill level', () => {
    const invalid = {
      ...validResource,
      skillLevel: 'expert' as Resource['skillLevel'],
    }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('skillLevel'))).toBe(true)
  })

  it('catches invalid date format', () => {
    const invalid = { ...validResource, dateAdded: '01-01-2024' }
    const result = validateResource(invalid, [invalid])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('dateAdded'))).toBe(true)
  })

  it('warns on duplicate tags', () => {
    const dupTags = { ...validResource, tags: ['tag', 'tag'] }
    const result = validateResource(dupTags, [dupTags])
    expect(result.warnings.some((w) => w.includes('Duplicate tags'))).toBe(true)
  })
})

describe('validateAllResources', () => {
  it('validates RESOURCES data without errors', () => {
    const validation = validateAllResources(RESOURCES)
    expect(validation.valid).toBe(true)
    expect(validation.invalidCount).toBe(0)
  })

  it('returns correct total count', () => {
    const validation = validateAllResources(RESOURCES)
    expect(validation.totalResources).toBe(RESOURCE_COUNT)
  })
})

// =============================================================================
// Data Integrity Tests
// =============================================================================

describe('RESOURCES data integrity', () => {
  it('has unique IDs', () => {
    const ids = RESOURCES.map((r) => r.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('has valid categories', () => {
    const validCategories = ['our-tools', 'learning', 'official', 'community']
    expect(RESOURCES.every((r) => validCategories.includes(r.category))).toBe(
      true
    )
  })

  it('has correct URL format for internal resources', () => {
    const internal = RESOURCES.filter((r) => r.internal)
    expect(internal.every((r) => r.url.startsWith('/'))).toBe(true)
  })

  it('has correct URL format for external resources', () => {
    const external = RESOURCES.filter((r) => !r.internal)
    expect(external.every((r) => r.url.startsWith('http'))).toBe(true)
  })

  it('has expected resource count', () => {
    expect(RESOURCES.length).toBe(23)
  })

  it('has resources in each category', () => {
    const categories = ['our-tools', 'learning', 'official', 'community']
    categories.forEach((cat) => {
      const count = RESOURCES.filter((r) => r.category === cat).length
      expect(count).toBeGreaterThan(0)
    })
  })

  it('has all required fields on every resource', () => {
    RESOURCES.forEach((r) => {
      expect(r.id).toBeTruthy()
      expect(r.title).toBeTruthy()
      expect(r.description).toBeTruthy()
      expect(r.url).toBeTruthy()
      expect(r.icon).toBeTruthy()
      expect(r.category).toBeTruthy()
    })
  })
})
