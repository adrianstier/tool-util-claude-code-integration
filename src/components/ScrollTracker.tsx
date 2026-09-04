'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackScrollDepth, trackTimeOnPage } from '@/lib/analytics'
import { TIMING } from '@/lib/constants'

// Tracks scroll depth and time on page for analytics
export default function ScrollTracker() {
  const pathname = usePathname()
  const trackedDepths = useRef<Set<25 | 50 | 75 | 100>>(new Set())
  const startTime = useRef<number>(Date.now())
  const trackedTimeThresholds = useRef<Set<number>>(new Set())

  useEffect(() => {
    // Reset tracking on page change
    trackedDepths.current = new Set()
    trackedTimeThresholds.current = new Set()
    startTime.current = Date.now()

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) return

      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      // Track milestone depths
      const milestones: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100]
      for (const milestone of milestones) {
        if (
          scrollPercent >= milestone &&
          !trackedDepths.current.has(milestone)
        ) {
          trackedDepths.current.add(milestone)
          trackScrollDepth(milestone, pathname)
        }
      }
    }

    const handleTimeTracking = () => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000)

      // Track time milestones: 30s, 60s, 120s, 300s
      const timeThresholds = [30, 60, 120, 300]
      for (const threshold of timeThresholds) {
        if (
          elapsed >= threshold &&
          !trackedTimeThresholds.current.has(threshold)
        ) {
          trackedTimeThresholds.current.add(threshold)
          trackTimeOnPage(threshold, pathname)
        }
      }
    }

    // Initial check
    handleScroll()

    // Set up listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    const timeInterval = setInterval(handleTimeTracking, TIMING.SCROLL_CHECK)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeInterval)
    }
  }, [pathname])

  return null
}
