'use client'

import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Error Visual */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
            <AlertTriangle className="h-10 w-10 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-4 text-3xl font-bold text-ink-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mx-auto mb-8 max-w-md text-ink-600 dark:text-ink-400">
          An unexpected error occurred. You can try again or head back to the
          homepage to continue your learning journey.
        </p>

        {/* Actions */}
        <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            <RefreshCw className="h-5 w-5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-600 px-6 py-3 text-base font-semibold text-primary-600 transition-all hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30"
          >
            <Home className="h-5 w-5" />
            Go home
          </Link>
        </div>

        {/* Expandable Error Details */}
        <details className="mx-auto max-w-lg rounded-xl border border-ink-200 bg-white p-4 text-left dark:border-ink-700 dark:bg-ink-800/50">
          <summary className="cursor-pointer text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-200">
            Error details
          </summary>
          <div className="mt-3 rounded-lg bg-ink-50 p-3 dark:bg-ink-900">
            <p className="break-words font-mono text-sm text-ink-700 dark:text-ink-300">
              {error.message || 'An unknown error occurred'}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-ink-600 dark:text-ink-300">
                Digest: {error.digest}
              </p>
            )}
          </div>
        </details>

        {/* Help Text */}
        <p className="mt-8 text-sm text-ink-600 dark:text-ink-300">
          If this keeps happening,{' '}
          <a
            href="https://github.com/anthropics/claude-code/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            report an issue
          </a>
        </p>
      </div>
    </main>
  )
}
