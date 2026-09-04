'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export default function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from the article
    const article = document.querySelector('article')
    if (!article) return

    const elements = article.querySelectorAll('h2, h3')
    const items: TOCItem[] = []

    elements.forEach((el) => {
      const id = el.id
      if (id) {
        items.push({
          id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3,
        })
      }
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className={cn('', className)} aria-label="Table of contents">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <List className="h-4 w-4" />
        <span>On this page</span>
      </div>

      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                  // Update URL without scrolling
                  window.history.pushState(null, '', `#${heading.id}`)
                }
              }}
              className={cn(
                '-ml-px block border-l-2 py-1 transition-colors',
                heading.level === 3 ? 'pl-6' : 'pl-4',
                activeId === heading.id
                  ? 'border-primary-500 font-medium text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
