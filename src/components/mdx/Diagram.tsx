'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import logger from '@/lib/logger'
import mermaid from 'mermaid'
import { GitBranch, Workflow, GitMerge, Database, Maximize2, Minimize2 } from 'lucide-react'

type DiagramType = 'flowchart' | 'sequence' | 'git' | 'er' | 'journey' | 'pie' | 'mindmap'

interface DiagramProps {
  children: string
  title?: string
  caption?: string
  type?: DiagramType
  className?: string
  theme?: 'default' | 'forest' | 'dark' | 'neutral'
}

const typeConfig: Record<DiagramType, { icon: typeof Workflow; label: string }> = {
  flowchart: { icon: Workflow, label: 'Flowchart' },
  sequence: { icon: GitBranch, label: 'Sequence' },
  git: { icon: GitMerge, label: 'Git Graph' },
  er: { icon: Database, label: 'Entity Relationship' },
  journey: { icon: Workflow, label: 'User Journey' },
  pie: { icon: Workflow, label: 'Pie Chart' },
  mindmap: { icon: Workflow, label: 'Mind Map' },
}

// Initialize mermaid with custom theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    // Match the design system colors
    primaryColor: '#E07A5F', // primary-500 (terracotta)
    primaryTextColor: '#1F2937', // ink-900
    primaryBorderColor: '#C96A51', // primary-600
    secondaryColor: '#F4A261', // amber-ish
    secondaryTextColor: '#1F2937',
    tertiaryColor: '#A3B18A', // sage-ish
    lineColor: '#6B7280', // ink-500
    textColor: '#374151', // ink-700
    mainBkg: '#FFF7ED', // warm white background
    nodeBorder: '#E07A5F',
    clusterBkg: '#FEF3E9',
    clusterBorder: '#E07A5F',
    titleColor: '#1F2937',
    edgeLabelBackground: '#FFFFFF',
    // Flowchart specific
    nodeTextColor: '#1F2937',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 15,
    nodeSpacing: 50,
    rankSpacing: 50,
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
  },
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
})

export default function Diagram({
  children,
  title,
  caption,
  type = 'flowchart',
  className,
}: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  // Render mermaid diagram
  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        // Update theme for dark mode
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: isDark ? {
            primaryColor: '#E07A5F',
            primaryTextColor: '#F3F4F6',
            primaryBorderColor: '#C96A51',
            secondaryColor: '#F4A261',
            secondaryTextColor: '#F3F4F6',
            tertiaryColor: '#A3B18A',
            lineColor: '#9CA3AF',
            textColor: '#E5E7EB',
            mainBkg: '#1F2937',
            nodeBorder: '#E07A5F',
            clusterBkg: '#374151',
            clusterBorder: '#E07A5F',
            titleColor: '#F3F4F6',
            edgeLabelBackground: '#374151',
            nodeTextColor: '#F3F4F6',
          } : {
            primaryColor: '#E07A5F',
            primaryTextColor: '#1F2937',
            primaryBorderColor: '#C96A51',
            secondaryColor: '#F4A261',
            secondaryTextColor: '#1F2937',
            tertiaryColor: '#A3B18A',
            lineColor: '#6B7280',
            textColor: '#374151',
            mainBkg: '#FFF7ED',
            nodeBorder: '#E07A5F',
            clusterBkg: '#FEF3E9',
            clusterBorder: '#E07A5F',
            titleColor: '#1F2937',
            edgeLabelBackground: '#FFFFFF',
            nodeTextColor: '#1F2937',
          },
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        })

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, children.trim())
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        logger.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderDiagram()
  }, [children, isDark])

  const config = typeConfig[type]
  const Icon = config.icon

  if (error) {
    return (
      <div className={cn(
        'my-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4',
        className
      )}>
        <p className="text-red-600 dark:text-red-400 text-sm font-medium">
          Diagram Error: {error}
        </p>
        <pre className="mt-2 text-xs text-red-500 dark:text-red-300 overflow-auto">
          {children}
        </pre>
      </div>
    )
  }

  return (
    <figure
      className={cn(
        'my-8 relative group',
        isExpanded && 'fixed inset-4 z-50 flex flex-col bg-white dark:bg-ink-900 rounded-2xl shadow-2xl',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between gap-3 mb-3',
        isExpanded && 'px-6 pt-6'
      )}>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          {title && (
            <span className="font-display font-semibold text-sm text-ink-900 dark:text-ink-100">
              {title}
            </span>
          )}
          {!title && (
            <span className="text-xs text-ink-500 dark:text-ink-400 uppercase tracking-wide font-medium">
              {config.label}
            </span>
          )}
        </div>

        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'p-1.5 rounded-lg transition-all',
            'text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200',
            'hover:bg-ink-100 dark:hover:bg-ink-800',
            'opacity-0 group-hover:opacity-100',
            isExpanded && 'opacity-100'
          )}
          aria-label={isExpanded ? 'Collapse diagram' : 'Expand diagram'}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Diagram container */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-xl',
          'border border-ink-100 dark:border-ink-800',
          'bg-white dark:bg-ink-900',
          isExpanded ? 'flex-1 mx-6 mb-6' : 'p-6'
        )}
      >
        {/* SVG diagram - content is generated by mermaid library, not user input */}
        <div
          className={cn(
            'relative w-full flex items-center justify-center',
            isExpanded && 'h-full',
            '[&>svg]:max-w-full [&>svg]:h-auto',
            isExpanded && '[&>svg]:max-h-full'
          )}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className={cn(
          'mt-3 text-center text-sm text-ink-500 dark:text-ink-400',
          isExpanded && 'px-6 pb-6'
        )}>
          {caption}
        </figcaption>
      )}

      {/* Backdrop for expanded mode */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </figure>
  )
}
