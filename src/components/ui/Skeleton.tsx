import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export default function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200'

  const variants = {
    text: 'rounded h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style = {
    width: width
      ? typeof width === 'number'
        ? `${width}px`
        : width
      : undefined,
    height: height
      ? typeof height === 'number'
        ? `${height}px`
        : height
      : undefined,
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={style}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  )
}

// Preset skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <Skeleton variant="circular" width={56} height={56} className="mb-6" />
      <Skeleton variant="text" className="mb-4 h-6 w-3/4" />
      <Skeleton variant="text" className="mb-2 h-4 w-full" />
      <Skeleton variant="text" className="mb-2 h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-2/3" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn('h-4', i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  )
}
