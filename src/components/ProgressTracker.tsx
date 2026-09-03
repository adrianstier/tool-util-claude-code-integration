'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import logger from '@/lib/logger'

interface Progress {
  completedModules: string[]
  startedAt: string | null
  lastVisited: string | null
}

interface ProgressContextType {
  progress: Progress
  markComplete: (moduleId: string) => void
  markIncomplete: (moduleId: string) => void
  isComplete: (moduleId: string) => boolean
  getCompletionPercentage: (trackModules: string[]) => number
  resetProgress: () => void
}

const defaultProgress: Progress = {
  completedModules: [],
  startedAt: null,
  lastVisited: null,
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

const STORAGE_KEY = 'claude-code-learning-progress'

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(defaultProgress)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate parsed data has expected structure
        if (parsed && Array.isArray(parsed.completedModules)) {
          setProgress(parsed)
        } else {
          throw new Error('Invalid progress data structure')
        }
      } else {
        // First visit - set startedAt
        const initial = {
          ...defaultProgress,
          startedAt: new Date().toISOString(),
        }
        setProgress(initial)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      }
    } catch (error) {
      // Log error and reset to defaults on corruption
      logger.error('Error loading progress, resetting to defaults:', error instanceof Error ? error.message : error)
      const initial = {
        ...defaultProgress,
        startedAt: new Date().toISOString(),
      }
      setProgress(initial)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      } catch {
        // localStorage may be unavailable (private browsing, etc)
        logger.warn('localStorage unavailable, progress will not persist')
      }
    }
    setIsLoaded(true)
  }, [])

  // Update lastVisited on mount
  useEffect(() => {
    if (isLoaded) {
      setProgress((prev) => {
        const updated = {
          ...prev,
          lastVisited: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    }
  }, [isLoaded])

  const markComplete = (moduleId: string) => {
    if (progress.completedModules.includes(moduleId)) return

    const updated = {
      ...progress,
      completedModules: [...progress.completedModules, moduleId],
      lastVisited: new Date().toISOString(),
    }
    setProgress(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const markIncomplete = (moduleId: string) => {
    const updated = {
      ...progress,
      completedModules: progress.completedModules.filter((id) => id !== moduleId),
      lastVisited: new Date().toISOString(),
    }
    setProgress(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const isComplete = (moduleId: string) => {
    return progress.completedModules.includes(moduleId)
  }

  const getCompletionPercentage = (trackModules: string[]) => {
    if (trackModules.length === 0) return 0
    const completed = trackModules.filter((id) =>
      progress.completedModules.includes(id)
    ).length
    return Math.round((completed / trackModules.length) * 100)
  }

  const resetProgress = () => {
    const reset = {
      ...defaultProgress,
      startedAt: new Date().toISOString(),
      lastVisited: new Date().toISOString(),
    }
    setProgress(reset)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reset))
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markComplete,
        markIncomplete,
        isComplete,
        getCompletionPercentage,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

// Completion checkbox component
interface CompletionCheckboxProps {
  moduleId: string
  label?: string
  className?: string
}

export function CompletionCheckbox({
  moduleId,
  label,
  className = '',
}: CompletionCheckboxProps) {
  const { isComplete, markComplete, markIncomplete } = useProgress()
  const completed = isComplete(moduleId)

  const handleToggle = () => {
    if (completed) {
      markIncomplete(moduleId)
    } else {
      markComplete(moduleId)
    }
  }

  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
    >
      <button
        onClick={handleToggle}
        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
          completed
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
        }`}
        aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {completed && (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      {label && (
        <span
          className={`text-sm ${
            completed
              ? 'text-gray-500 dark:text-gray-400 line-through'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
        </span>
      )}
    </label>
  )
}

// Progress bar component
interface ProgressBarProps {
  trackModules: string[]
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({
  trackModules,
  showPercentage = true,
  className = '',
}: ProgressBarProps) {
  const { getCompletionPercentage } = useProgress()
  const percentage = getCompletionPercentage(trackModules)

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {percentage}% Complete
          </span>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-orange-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Progress stats component
export function ProgressStats({ className = '' }: { className?: string }) {
  const { progress } = useProgress()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {progress.completedModules.length}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Completed
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {formatDate(progress.startedAt)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Started
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {formatDate(progress.lastVisited)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last Visit
        </div>
      </div>
    </div>
  )
}
