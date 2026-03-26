

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Lightbulb,
  Terminal,
  Zap,
} from 'lucide-react'

type CalloutType = 'info' | 'success' | 'warning' | 'error' | 'tip' | 'terminal' | 'note'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
  className?: string
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: typeof Info
    iconColor: string
    bgColor: string
    borderColor: string
    titleColor: string
    accentColor: string
  }
> = {
  info: {
    icon: Info,
    iconColor: 'text-cobalt-600 dark:text-cobalt-400',
    bgColor: 'bg-cobalt-50/50 dark:bg-cobalt-950/30',
    borderColor: 'border-l-cobalt-500',
    titleColor: 'text-cobalt-900 dark:text-cobalt-100',
    accentColor: 'bg-cobalt-500',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-sage-600 dark:text-sage-400',
    bgColor: 'bg-sage-50/50 dark:bg-sage-950/30',
    borderColor: 'border-l-sage-500',
    titleColor: 'text-sage-900 dark:text-sage-100',
    accentColor: 'bg-sage-500',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50/50 dark:bg-amber-950/30',
    borderColor: 'border-l-amber-500',
    titleColor: 'text-amber-900 dark:text-amber-100',
    accentColor: 'bg-amber-500',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50/50 dark:bg-red-950/30',
    borderColor: 'border-l-red-500',
    titleColor: 'text-red-900 dark:text-red-100',
    accentColor: 'bg-red-500',
  },
  tip: {
    icon: Lightbulb,
    iconColor: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-50/50 dark:bg-primary-950/30',
    borderColor: 'border-l-primary-500',
    titleColor: 'text-primary-900 dark:text-primary-100',
    accentColor: 'bg-primary-500',
  },
  terminal: {
    icon: Terminal,
    iconColor: 'text-ink-600 dark:text-ink-300',
    bgColor: 'bg-ink-50/50 dark:bg-ink-900/50',
    borderColor: 'border-l-ink-500',
    titleColor: 'text-ink-900 dark:text-ink-100',
    accentColor: 'bg-ink-500',
  },
  note: {
    icon: Zap,
    iconColor: 'text-plum-600 dark:text-plum-400',
    bgColor: 'bg-plum-50/50 dark:bg-plum-950/30',
    borderColor: 'border-l-plum-500',
    titleColor: 'text-plum-900 dark:text-plum-100',
    accentColor: 'bg-plum-500',
  },
}

const defaultTitles: Record<CalloutType, string> = {
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  tip: 'Pro Tip',
  terminal: 'Terminal',
  note: 'Note',
}

export default function Callout({
  type = 'info',
  title,
  children,
  className,
}: CalloutProps) {
  const config = calloutConfig[type]
  const Icon = config.icon
  const displayTitle = title ?? defaultTitles[type]

  return (
    <div
      className={cn(
        'my-6 rounded-xl border-l-4 p-5',
        config.bgColor,
        config.borderColor,
        'border border-ink-100 dark:border-ink-800 border-l-4',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center">
          <Icon className={cn('h-5 w-5', config.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {displayTitle && (
            <p className={cn('font-display font-semibold text-sm mb-1.5', config.titleColor)}>
              {displayTitle}
            </p>
          )}
          <div className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mt-2 [&>ol]:mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
