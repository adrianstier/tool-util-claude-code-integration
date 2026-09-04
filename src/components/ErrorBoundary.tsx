'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import logger from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <AlertTriangle className="mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
          <h2 className="mb-2 text-xl font-semibold text-red-700 dark:text-red-300">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-red-600 dark:text-red-400">
            An error occurred while loading this content. Please try refreshing
            the page.
          </p>
          {this.state.error && (
            <details className="mb-6 w-full max-w-md text-left">
              <summary className="cursor-pointer text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-red-100 p-3 text-xs text-red-800 dark:bg-red-900/40 dark:text-red-200">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
