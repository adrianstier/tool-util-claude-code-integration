'use client'

import { useProgress } from './ProgressTracker'
import { CheckCircle2, Circle } from 'lucide-react'
import { trackModuleCompletion } from '@/lib/analytics'

interface ModuleProgressProps {
  moduleId: string
  trackName: string
  moduleName: string
}

export function ModuleProgress({
  moduleId,
  trackName,
  moduleName,
}: ModuleProgressProps) {
  const { isComplete, markComplete, markIncomplete } = useProgress()
  const completed = isComplete(moduleId)

  const handleToggle = () => {
    if (completed) {
      markIncomplete(moduleId)
    } else {
      markComplete(moduleId)
      trackModuleCompletion(trackName, moduleName, moduleId)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
      <button
        onClick={handleToggle}
        className={`flex flex-1 items-center gap-3 text-left transition-colors ${
          completed
            ? 'text-green-600 dark:text-green-400'
            : 'text-ink-600 hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400'
        }`}
      >
        {completed ? (
          <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
        ) : (
          <Circle className="h-6 w-6 flex-shrink-0" />
        )}
        <span className="font-medium">
          {completed ? 'Completed!' : 'Mark as complete'}
        </span>
      </button>
      {completed && (
        <span className="text-sm text-ink-600 dark:text-ink-300">
          Click to undo
        </span>
      )}
    </div>
  )
}

// Mini version for sidebar
export function ModuleProgressMini({ moduleId }: { moduleId: string }) {
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
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 text-sm transition-colors ${
        completed
          ? 'text-green-600 dark:text-green-400'
          : 'text-ink-500 hover:text-primary-600 dark:text-ink-400 dark:hover:text-primary-400'
      }`}
      title={completed ? 'Mark incomplete' : 'Mark complete'}
    >
      {completed ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      <span>{completed ? 'Done' : 'Mark done'}</span>
    </button>
  )
}
