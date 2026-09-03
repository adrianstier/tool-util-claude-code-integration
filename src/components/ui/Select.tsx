import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  options: Array<{ value: string; label: string }>
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      id,
      options,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-error-600">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm transition-colors',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
              error &&
                'border-error-500 focus:border-error-500 focus:ring-error-200',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
        {error && (
          <span
            id={`${selectId}-error`}
            className="text-sm text-error-600"
            role="alert"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${selectId}-helper`} className="text-sm text-gray-600">
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
