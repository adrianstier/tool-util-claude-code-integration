import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  helperText?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all',
              'checked:border-primary-600 checked:bg-primary-600',
              'focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100',
              className
            )}
            aria-describedby={helperText ? `${checkboxId}-helper` : undefined}
            {...props}
          />
          <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
        </div>
        {(label || helperText) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className="cursor-pointer text-sm font-medium text-gray-900"
              >
                {label}
              </label>
            )}
            {helperText && (
              <span
                id={`${checkboxId}-helper`}
                className="text-sm text-gray-600"
              >
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
