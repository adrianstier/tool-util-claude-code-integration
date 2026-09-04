import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-error-600">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={cn(
            'rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            error &&
              'border-error-500 focus:border-error-500 focus:ring-error-200',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <span
            id={`${inputId}-error`}
            className="text-sm text-error-600"
            role="alert"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className="text-sm text-gray-600">
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
