'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import logger from '@/lib/logger'
import mermaid from 'mermaid'
import {
  GitBranch,
  Workflow,
  GitMerge,
  Database,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { themeVariables, withClassDefs } from '@/lib/diagram-theme'

type DiagramType =
  | 'flowchart'
  | 'sequence'
  | 'git'
  | 'er'
  | 'journey'
  | 'pie'
  | 'mindmap'

interface DiagramProps {
  children: string
  title?: string
  caption?: string
  type?: DiagramType
  className?: string
  theme?: 'default' | 'forest' | 'dark' | 'neutral'
}

const typeConfig: Record<
  DiagramType,
  { icon: typeof Workflow; label: string }
> = {
  flowchart: { icon: Workflow, label: 'Flowchart' },
  sequence: { icon: GitBranch, label: 'Sequence' },
  git: { icon: GitMerge, label: 'Git Graph' },
  er: { icon: Database, label: 'Entity Relationship' },
  journey: { icon: Workflow, label: 'User Journey' },
  pie: { icon: Workflow, label: 'Pie Chart' },
  mindmap: { icon: Workflow, label: 'Mind Map' },
}

function initMermaid(isDark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: themeVariables(isDark),
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      padding: 16,
      nodeSpacing: 60,
      // Generous rank spacing keeps edge labels off the connectors they
      // annotate; at the old 50 they overlapped and punched holes in the line.
      rankSpacing: 80,
      useMaxWidth: false,
    },
    sequence: {
      diagramMarginX: 40,
      diagramMarginY: 16,
      actorMargin: 60,
      boxMargin: 12,
      boxTextMargin: 6,
      noteMargin: 12,
      messageMargin: 40,
      useMaxWidth: false,
    },
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  })
}

export default function Diagram({
  children,
  title,
  caption,
  type = 'flowchart',
  className,
}: DiagramProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [canScroll, setCanScroll] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () =>
      setIsDark(document.documentElement.classList.contains('dark'))
    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  // Render mermaid diagram
  useEffect(() => {
    let cancelled = false
    const renderDiagram = async () => {
      try {
        initMermaid(isDark)
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`
        const { svg: renderedSvg } = await mermaid.render(
          id,
          withClassDefs(children, isDark)
        )
        if (cancelled) return
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        if (cancelled) return
        logger.error('Mermaid rendering error:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to render diagram'
        )
      }
    }
    renderDiagram()
    return () => {
      cancelled = true
    }
  }, [children, isDark])

  // Track whether the diagram overflows, so the scroll affordance only appears
  // when there is actually something to scroll to.
  const measure = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScroll(el.scrollWidth - el.clientWidth > 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    measure()
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [svg, isExpanded, measure])

  // Escape closes the expanded view
  useEffect(() => {
    if (!isExpanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded])

  const config = typeConfig[type]
  const Icon = config.icon

  if (error) {
    return (
      <div
        className={cn(
          'my-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30',
          className
        )}
      >
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Diagram Error: {error}
        </p>
        <pre className="mt-2 overflow-auto text-xs text-red-500 dark:text-red-300">
          {children}
        </pre>
      </div>
    )
  }

  return (
    <figure
      className={cn(
        'group relative my-8',
        isExpanded &&
          'fixed inset-3 z-modal my-0 flex flex-col rounded-2xl bg-white shadow-2xl dark:bg-ink-900 sm:inset-6',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'mb-3 flex items-center justify-between gap-3',
          isExpanded && 'px-6 pt-6'
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
          {title ? (
            <span className="truncate font-display text-sm font-semibold text-ink-900 dark:text-ink-100">
              {title}
            </span>
          ) : (
            <span className="text-xs font-medium uppercase tracking-wide text-ink-600 dark:text-ink-300">
              {config.label}
            </span>
          )}
        </div>

        {/* Expand/collapse. Always visible: it used to be opacity-0 until
            hover, which made it undiscoverable on touch — exactly where a
            zoomed view matters most. */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'shrink-0 rounded-lg p-1.5 transition-colors',
            'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
            'dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
          )}
          aria-label={isExpanded ? 'Collapse diagram' : 'Expand diagram'}
          aria-expanded={isExpanded}
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
        className={cn(
          'relative rounded-xl',
          'border border-ink-200 dark:border-ink-700',
          'bg-white dark:bg-ink-900',
          isExpanded && 'mx-6 mb-6 min-h-0 flex-1'
        )}
      >
        <div
          ref={scrollRef}
          onScroll={measure}
          className={cn(
            // Scroll rather than shrink. The previous `overflow-hidden` with
            // `max-w-full` scaled an 800px diagram into a 308px phone column,
            // rendering the labels at roughly 5px.
            'rounded-xl',
            isExpanded ? 'overflow-auto' : 'overflow-x-auto overflow-y-hidden',
            'flex justify-center p-4 sm:p-6',
            isExpanded && 'h-full items-center',
            // Keep the SVG at its natural size; only cap it when expanded.
            '[&>svg]:h-auto [&>svg]:max-w-none [&>svg]:shrink-0',
            // Mermaid draws labels in <foreignObject>, whose HTML children are
            // real boxes that escape the SVG's bounds and get counted in the
            // document's scroll width — a diagram wider than a phone pushed the
            // whole page sideways. Clipping at the SVG box stops that; the
            // viewBox is sized to the content, so nothing real is cut off.
            '[&>svg]:overflow-hidden',
            // Only non-geometric properties may be restyled here. Mermaid
            // measures every label at render time and sizes the foreignObject
            // to fit, so changing font-size or padding afterwards overflows the
            // box it reserved and the text gets clipped away — which is exactly
            // what happened when this carried `text-[13px] px-1.5 py-0.5`.
            // Label typography belongs in `themeVariables.fontSize`.
            // The one exception: Mermaid measures multi-line labels with its own
            // font metrics, not ours, and under-reserves by roughly 2px per line
            // — enough to clip the last row of a four-line node. Tightening
            // line-height shrinks the content to fit the box it already
            // reserved. Only changes that make a label SMALLER are safe here.
            '[&_.nodeLabel]:leading-tight [&_.nodeLabel_p]:leading-tight',
            '[&_.flowchart-link]:stroke-[1.75px]',
            '[&_path.messageLine0]:stroke-[1.75px]'
          )}
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        {/* Right-edge fade: the affordance that says "there is more sideways".
            Only rendered while the content actually overflows. */}
        {canScroll && !atEnd && (
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 w-12 rounded-r-xl',
              'bg-gradient-to-l from-white to-transparent dark:from-ink-900'
            )}
          />
        )}
      </div>

      {canScroll && !isExpanded && (
        <p className="mt-2 text-center text-xs text-ink-600 dark:text-ink-300 sm:hidden">
          Scroll sideways to see the whole diagram, or tap the expand icon.
        </p>
      )}

      {/* Caption */}
      {caption && (
        <figcaption
          className={cn(
            'mt-3 text-center text-sm text-ink-600 dark:text-ink-300',
            isExpanded && 'px-6 pb-6'
          )}
        >
          {caption}
        </figcaption>
      )}

      {/* Backdrop for expanded mode */}
      {isExpanded && (
        <div
          className="fixed inset-0 -z-10 bg-black/50"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </figure>
  )
}
