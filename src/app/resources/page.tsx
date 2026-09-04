'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, Search, Sparkles } from 'lucide-react'

// Import shared data layer
import {
  RESOURCES,
  SECTION_CONFIG,
  CATEGORY_FILTERS,
  CATEGORY_ORDER,
} from '@/data/resources'
import {
  getIconComponent,
  filterResources,
  groupResourcesByCategory,
} from '@/lib/resources'
import type { Resource, ResourceCategory, SkillLevel } from '@/types/resources'

// =============================================================================
// Configuration
// =============================================================================

const skillLevelColors: Record<SkillLevel, string> = {
  beginner: 'bg-sage-100 text-sage-700 dark:bg-sage-900/50 dark:text-sage-300',
  intermediate:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  advanced: 'bg-plum-100 text-plum-700 dark:bg-plum-900/50 dark:text-plum-300',
}

// =============================================================================
// Components
// =============================================================================

function ResourceCard({ resource }: { resource: Resource }) {
  const { title, description, url, icon, internal, isNew, skillLevel } =
    resource
  const Icon = getIconComponent(icon)
  const Component = internal ? Link : 'a'
  const externalProps = internal
    ? {}
    : { target: '_blank', rel: 'noopener noreferrer' }

  return (
    <Component
      href={url}
      {...externalProps}
      className="group relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600"
    >
      {/* New Badge */}
      {isNew && (
        <span className="absolute -right-2 -top-2 z-10 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          New
        </span>
      )}

      {/* Icon */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-400 dark:group-hover:bg-primary-900">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
            {title}
          </h3>
          {!internal && (
            <ExternalLink
              className="h-4 w-4 text-gray-400 group-hover:text-primary-500"
              aria-hidden="true"
            />
          )}
          {skillLevel && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${skillLevelColors[skillLevel]}`}
            >
              {skillLevel}
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </Component>
  )
}

function ResourceSection({
  categoryId,
  resources,
}: {
  categoryId: ResourceCategory
  resources: Resource[]
}) {
  const config = SECTION_CONFIG[categoryId]
  const SectionIcon = getIconComponent(config.icon)

  if (resources.length === 0) return null

  return (
    <section
      id={`section-${categoryId}`}
      className="mb-12 scroll-mt-32"
      aria-labelledby={`heading-${categoryId}`}
    >
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.colorClass}`}
          >
            <SectionIcon className="h-4 w-4" aria-hidden="true" />
            <span>{config.title}</span>
          </div>
        </div>
        <p
          id={`heading-${categoryId}`}
          className="text-gray-600 dark:text-gray-400"
        >
          {config.description}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<
    ResourceCategory | 'all'
  >('all')

  // Filter resources using shared utility
  const filteredResources = useMemo(() => {
    return filterResources(RESOURCES, selectedCategory, searchQuery)
  }, [searchQuery, selectedCategory])

  // Group filtered resources by category using shared utility
  const groupedResources = useMemo(() => {
    return groupResourcesByCategory(filteredResources)
  }, [filteredResources])

  // Get visible sections for sticky nav
  const visibleSections = CATEGORY_ORDER.filter(
    (id) => groupedResources[id].length > 0
  )

  // Get icons for quick start and filters
  const GraduationCapIcon = getIconComponent('GraduationCap')
  const BookOpenIcon = getIconComponent('BookOpen')
  const GitBranchIcon = getIconComponent('GitBranch')

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Resources</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Resources
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          A curated collection of resources to help you master Claude Code and
          AI-powered development. From official documentation to community
          tools.
        </p>
      </div>

      {/* Quick Start */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary-50 to-orange-50 p-8 dark:from-gray-800 dark:to-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Start
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/start-here"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500"
          >
            <GraduationCapIcon className="h-4 w-4" aria-hidden="true" />
            Start Learning
          </Link>
          <a
            href="https://docs.anthropic.com/en/docs/claude-code/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:border-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-primary-600"
          >
            <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
            Official Docs
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          <a
            href="https://github.com/anthropics/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:border-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-primary-600"
          >
            <GitBranchIcon className="h-4 w-4" aria-hidden="true" />
            GitHub
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            aria-label="Search resources"
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Category Filters */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORY_FILTERS.map((cat) => {
            const Icon = getIconComponent(cat.icon)
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredResources.length} of {RESOURCES.length} resources
        </p>
      </div>

      {/* Sticky Section Navigation */}
      {filteredResources.length > 0 && visibleSections.length > 1 && (
        <nav
          className="sticky top-16 z-10 -mx-4 mb-8 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95"
          aria-label="Resource sections"
        >
          <div className="flex gap-4 overflow-x-auto">
            {visibleSections.map((id) => {
              const config = SECTION_CONFIG[id]
              return (
                <a
                  key={id}
                  href={`#section-${id}`}
                  className="whitespace-nowrap text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {config.title}
                  <span className="ml-1 text-gray-400">
                    ({groupedResources[id].length})
                  </span>
                </a>
              )
            })}
          </div>
        </nav>
      )}

      {/* Resource Sections or Empty State */}
      {filteredResources.length === 0 ? (
        <div className="py-16 text-center" role="status" aria-live="polite">
          <Search
            className="mx-auto h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No resources found
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="mt-4 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {CATEGORY_ORDER.map((categoryId) => (
            <ResourceSection
              key={categoryId}
              categoryId={categoryId}
              resources={groupedResources[categoryId]}
            />
          ))}
        </>
      )}

      {/* Contribute Section */}
      <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Know a great resource?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Help us improve this list by suggesting resources that helped you.
        </p>
        <a
          href="https://github.com/anthropics/claude-code/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <GitBranchIcon className="h-4 w-4" aria-hidden="true" />
          Suggest a resource on GitHub
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
