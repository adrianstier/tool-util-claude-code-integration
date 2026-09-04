'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ReadingProgressProps {
  className?: string
}

export default function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article')
      if (!article) return

      const articleRect = article.getBoundingClientRect()
      const articleTop = articleRect.top + window.scrollY
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      // Calculate how much of the article has been scrolled through
      const scrolled = scrollY - articleTop + windowHeight * 0.3
      const total = articleHeight - windowHeight * 0.3

      if (scrolled <= 0) {
        setProgress(0)
      } else if (scrolled >= total) {
        setProgress(100)
      } else {
        setProgress((scrolled / total) * 100)
      }
    }

    // Initial calculation
    updateProgress()

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-50 h-1 bg-gray-200 dark:bg-gray-800',
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-orange-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
