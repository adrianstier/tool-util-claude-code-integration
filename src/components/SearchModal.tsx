'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, Rocket, BarChart3, Hammer, Zap, BookOpen, ArrowRight, Command, FolderOpen, Code, FileCode, Server, Brain } from 'lucide-react'

import type { SearchIndexItem } from '@/lib/search'

type SearchItem = SearchIndexItem

/** Icon keys are used because React elements cannot cross the server boundary. */
const ICONS: Record<string, React.ReactNode> = {
  rocket: <Rocket className="h-4 w-4" />,
  chart: <BarChart3 className="h-4 w-4" />,
  hammer: <Hammer className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  brain: <Brain className="h-4 w-4" />,
  server: <Server className="h-4 w-4" />,
  code: <Code className="h-4 w-4" />,
  file: <FileText className="h-4 w-4" />,
  fileCode: <FileCode className="h-4 w-4" />,
  folder: <FolderOpen className="h-4 w-4" />,
  command: <Command className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
}

/**
 * Entries that do not come from content/*. Learning-track entries are derived
 * from the MDX files and passed in as `contentItems`, so new articles are
 * searchable without touching this file.
 */
const staticItems: SearchItem[] = [
  {
    title: 'CLAUDE.md Generator',
    description: 'Build a project CLAUDE.md interactively',
    href: '/tools/claude-md-generator',
    category: 'Tools',
    iconKey: 'file',
  },
  {
    title: 'Slash Commands Library',
    description: 'Ready-to-use slash commands for Claude Code',
    href: '/tools/slash-commands',
    category: 'Tools',
    iconKey: 'command',
  },
  {
    title: 'Project Templates',
    description: 'Starter templates for new projects',
    href: '/tools/templates',
    category: 'Tools',
    iconKey: 'folder',
  },
  {
    title: 'Code Snippets',
    description: 'Copy-paste patterns for common tasks',
    href: '/tools/snippets',
    category: 'Tools',
    iconKey: 'code',
  },
  {
    title: 'Cheat Sheets',
    description: 'Quick reference cards for Claude Code, Git, and the terminal',
    href: '/tools/cheatsheets',
    category: 'Tools',
    iconKey: 'fileCode',
  },
  {
    title: 'MCP Server Explorer',
    description: 'Browse and compare MCP servers',
    href: '/tools/mcp-explorer',
    category: 'Tools',
    iconKey: 'server',
  },
  {
    title: 'Glossary',
    description: 'Plain-English definitions of Claude Code, Git, and AI terms',
    href: '/glossary',
    category: 'Resources',
    iconKey: 'book',
  },
  {
    title: 'Resources',
    description: 'Curated guides, docs, and references',
    href: '/resources',
    category: 'Resources',
    iconKey: 'book',
  },
  {
    title: 'Blog',
    description: 'Updates and notes from the site',
    href: '/blog',
    category: 'Resources',
    iconKey: 'file',
  },
]

export default function SearchModal({
  contentItems = [],
}: {
  contentItems?: SearchIndexItem[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const searchItems = useMemo(
    () => [...contentItems, ...staticItems],
    [contentItems]
  )

  const filteredItems = useMemo(() => {
    if (!query) return searchItems
    const lowerQuery = query.toLowerCase()
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    )
  }, [query, searchItems])

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {}
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [filteredItems])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }

      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault()
      router.push(filteredItems[selectedIndex].href)
      setIsOpen(false)
    }
  }

  const handleItemClick = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  // Pre-compute item indices for keyboard navigation (must be before early return)
  const itemIndices = useMemo(() => {
    const indices: Map<string, number> = new Map()
    let idx = 0
    Object.values(groupedItems).forEach((items) => {
      items.forEach((item) => {
        indices.set(item.href, idx++)
      })
    })
    return indices
  }, [groupedItems])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 transition-colors hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-[20%] z-[300] w-full max-w-xl -translate-x-1/2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            aria-label="Search documentation"
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {category}
                </div>
                {items.map((item) => {
                  const currentIndex = itemIndices.get(item.href) ?? 0
                  const isSelected = currentIndex === selectedIndex
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleItemClick(item.href)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isSelected
                            ? 'bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {ICONS[item.iconKey] ?? ICONS.file}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {item.description}
                        </div>
                      </div>
                      {isSelected && (
                        <ArrowRight className="h-4 w-4 text-primary-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">↵</kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </>
  )
}
