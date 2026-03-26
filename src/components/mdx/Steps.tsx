

import { ReactNode, Children, isValidElement } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepsProps {
  children: ReactNode
  className?: string
}

interface StepProps {
  title: string
  children: ReactNode
  className?: string
}

export function Steps({ children, className }: StepsProps) {
  const steps = Children.toArray(children).filter(isValidElement)

  return (
    <div className={cn('my-8', className)}>
      <ol className="relative space-y-6">
        {steps.map((step, index) => {
          if (!isValidElement(step)) return null

          return (
            <li key={index} className="relative pl-12">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[19px] top-12 bottom-0 w-px bg-ink-200 dark:bg-ink-700" />
              )}

              {/* Step number circle */}
              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 dark:bg-white text-sm font-bold text-white dark:text-ink-900">
                {index + 1}
              </div>

              {step}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Step({ title, children, className }: StepProps) {
  return (
    <div className={cn('', className)}>
      <h4 className="font-display text-lg font-semibold text-ink-900 dark:text-paper-50 mb-3">
        {title}
      </h4>
      <div className="text-ink-600 dark:text-ink-300 leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mt-2 [&>ol]:mt-2">
        {children}
      </div>
    </div>
  )
}

// Checklist components
interface ChecklistProps {
  children: ReactNode
  className?: string
}

interface ChecklistItemProps {
  children: ReactNode
  checked?: boolean
  className?: string
}

export function Checklist({ children, className }: ChecklistProps) {
  return (
    <ul className={cn('my-6 space-y-3 list-none pl-0 ml-0', className)} role="list" style={{ listStyle: 'none' }}>
      {children}
    </ul>
  )
}

export function ChecklistItem({ children, checked = false, className }: ChecklistItemProps) {
  return (
    <li className={cn('flex items-start gap-3 pl-0 ml-0', className)} style={{ listStyle: 'none' }}>
      <div
        className={cn(
          'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200',
          checked
            ? 'border-sage-500 bg-sage-500 text-white shadow-sm'
            : 'border-ink-300 dark:border-ink-600 bg-paper-50 dark:bg-ink-800'
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </div>
      <span
        className={cn(
          'text-ink-700 dark:text-ink-200 leading-relaxed',
          checked && 'line-through text-ink-400 dark:text-ink-500'
        )}
      >
        {children}
      </span>
    </li>
  )
}
