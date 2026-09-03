'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ArticleLink {
  href: string
  title: string
  description?: string
}

interface ArticleNavigationProps {
  previous?: ArticleLink
  next?: ArticleLink
  className?: string
}

export default function ArticleNavigation({
  previous,
  next,
  className,
}: ArticleNavigationProps) {
  if (!previous && !next) return null

  return (
    <nav
      className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)}
      aria-label="Article navigation"
    >
      {previous ? (
        <Link
          href={previous.href}
          className={cn(
            'group flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800 p-4 transition-all',
            'hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md',
            'sm:col-start-1'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 group-hover:text-primary-500 dark:group-hover:text-primary-400">
            <ChevronLeft className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Previous
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-white truncate">
              {previous.title}
            </p>
            {previous.description && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 truncate">
                {previous.description}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next && (
        <Link
          href={next.href}
          className={cn(
            'group flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800 p-4 transition-all',
            'hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md',
            'sm:col-start-2 text-right'
          )}
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Next
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-white truncate">
              {next.title}
            </p>
            {next.description && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 truncate">
                {next.description}
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 group-hover:text-primary-500 dark:group-hover:text-primary-400">
            <ChevronRight className="h-5 w-5" />
          </div>
        </Link>
      )}
    </nav>
  )
}
