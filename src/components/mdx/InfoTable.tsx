

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InfoTableColumn {
  key: string
  header: string
  className?: string
}

interface InfoTableRow {
  [key: string]: ReactNode
}

interface InfoTableProps {
  columns: InfoTableColumn[]
  rows: InfoTableRow[]
  variant?: 'default' | 'striped' | 'cards'
  className?: string
}

export function InfoTable({
  columns,
  rows,
  variant = 'default',
  className,
}: InfoTableProps) {
  if (variant === 'cards') {
    return (
      <div className={cn('my-6 grid gap-4 sm:grid-cols-2', className)}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900/50 p-5 transition-colors duration-200 hover:border-primary-300 dark:hover:border-primary-700"
          >
            {columns.map((col, colIndex) => (
              <div key={col.key} className={cn(colIndex === 0 ? 'mb-2' : 'mb-1')}>
                {colIndex === 0 ? (
                  <h4 className="font-display font-semibold text-ink-900 dark:text-ink-100">
                    {row[col.key]}
                  </h4>
                ) : (
                  <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                    <span className="font-medium text-ink-500 dark:text-ink-500">
                      {col.header}:
                    </span>{' '}
                    {row[col.key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('my-6 overflow-hidden rounded-xl border border-ink-200 dark:border-ink-700', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 font-display font-semibold text-ink-900 dark:text-ink-100',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'transition-colors hover:bg-ink-50 dark:hover:bg-ink-800/30',
                  variant === 'striped' && rowIndex % 2 === 1 && 'bg-ink-50/50 dark:bg-ink-800/20'
                )}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3',
                      colIndex === 0
                        ? 'font-medium text-ink-900 dark:text-ink-100'
                        : 'text-ink-600 dark:text-ink-400',
                      col.className
                    )}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Simple row-based component for easier MDX authoring
interface InfoRowProps {
  children: ReactNode
}

interface InfoRowsProps {
  headers: string[]
  children: ReactNode
  variant?: 'default' | 'striped' | 'cards'
  className?: string
}

export function InfoRow({ children }: InfoRowProps) {
  return <>{children}</>
}

export function InfoRows({ headers, children, variant = 'default', className }: InfoRowsProps) {
  // This component is designed for declarative MDX usage
  // Children should be InfoRow components
  return (
    <div className={cn('my-6', className)}>
      {variant === 'cards' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Cards variant renders children directly */}
          {children}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink-200 dark:border-ink-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800/50">
                  {headers.map((header, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-4 py-3 font-display font-semibold text-ink-900 dark:text-ink-100"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {children}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Card-style item for visual variety
interface InfoCardProps {
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  href?: string
  className?: string
}

export function InfoCard({ title, description, meta, href, className }: InfoCardProps) {
  const content = (
    <>
      <h4 className="font-display font-semibold text-ink-900 dark:text-ink-100 mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-2">
          {description}
        </p>
      )}
      {meta && (
        <p className="text-xs text-ink-500 dark:text-ink-500">
          {meta}
        </p>
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'block rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900/50 p-5 transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md',
          className
        )}
      >
        {content}
      </a>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900/50 p-5 transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md',
        className
      )}
    >
      {content}
    </div>
  )
}

// Grid wrapper for cards
interface InfoGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function InfoGrid({ children, columns = 2, className }: InfoGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('my-6 grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}

export default InfoTable
