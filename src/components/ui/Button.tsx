import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

    const variants = {
      primary:
        'bg-gradient-to-r from-primary-600 to-orange-500 text-white shadow-md hover:shadow-lg hover:scale-105 focus-visible:ring-primary-500',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
      outline:
        'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500',
      ghost:
        'text-gray-700 hover:bg-gray-100 hover:text-primary-600 focus-visible:ring-gray-500',
      danger:
        'bg-error-600 text-white shadow-md hover:bg-error-700 hover:shadow-lg focus-visible:ring-error-500',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className={cn('animate-spin', iconSizes[size])}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={cn(iconSizes[size], 'flex-shrink-0')} />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className={cn(iconSizes[size], 'flex-shrink-0')} />
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
