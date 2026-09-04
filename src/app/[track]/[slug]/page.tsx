import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getContentBySlug, getAllContent } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import CodeBlock from '@/components/CodeBlock'
import Card from '@/components/Card'
import Link from 'next/link'
import TableOfContents from '@/components/TableOfContents'
import ReadingProgress from '@/components/ReadingProgress'
import ArticleNavigation from '@/components/ArticleNavigation'
import {
  Callout,
  Steps,
  Step,
  Checklist,
  ChecklistItem,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  FileTree,
  FolderNode,
  FileNode,
  Kbd,
  Diagram,
  InfoTable,
  InfoCard,
  InfoGrid,
  InfoRow,
  InfoRows,
} from '@/components/mdx'
import { Clock, BookOpen, Monitor, ChevronRight, Calendar } from 'lucide-react'
import { formatDate, getWordCount } from '@/lib/utils'
import {
  getContentPageMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
  siteConfig,
  trackMetadata as trackSeoMetadata,
} from '@/lib/metadata'
import SocialShare, { FloatingShareBar } from '@/components/SocialShare'
import NewsletterSignup from '@/components/NewsletterSignup'
import { ModuleProgress } from '@/components/ModuleProgress'
import { ALL_TRACK_SLUGS, TRACK_NAMES } from '@/lib/constants'

export const revalidate = 3600

interface PageProps {
  params: {
    track: string
    slug: string
  }
}

// Generate dynamic metadata for each content page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const content = getContentBySlug(params.track, params.slug)
  if (!content) {
    return {}
  }
  return getContentPageMetadata(params.track, params.slug, content.frontmatter)
}

// Apple icon component (lucide-react doesn't have Apple)
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

// Components available in MDX
const components = {
  CodeBlock,
  Card,
  Link,
  // MDX Components
  Callout,
  Steps,
  Step,
  Checklist,
  ChecklistItem,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  FileTree,
  FolderNode,
  FileNode,
  Kbd,
  Diagram,
  InfoTable,
  InfoCard,
  InfoGrid,
  InfoRow,
  InfoRows,
  // Map MDX code blocks to our CodeBlock component
  pre: ({ children }: { children?: React.ReactNode }) => {
    const child = (
      children as { props?: { children?: string; className?: string } }
    )?.props
    const code = child?.children || ''
    const language = child?.className?.replace('language-', '') || 'bash'

    return <CodeBlock code={code} language={language} />
  },
  code: ({
    children,
    className,
  }: {
    children?: React.ReactNode
    className?: string
  }) => {
    if (!className) {
      return (
        <code className="rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-primary-700 dark:border-gray-700 dark:bg-gray-800 dark:text-primary-300">
          {children}
        </code>
      )
    }
    return <code className={className}>{children}</code>
  },
  // Optimized image component for MDX
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src) return null
    // For external images, use regular img tag
    if (src.startsWith('http')) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || 'Article image'}
          loading="lazy"
          className="my-4 rounded-lg"
          {...props}
        />
      )
    }
    // For local images, use Next.js Image
    return (
      <Image
        src={src}
        alt={alt || 'Article image'}
        width={800}
        height={450}
        className="my-4 rounded-lg"
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 728px"
      />
    )
  },
}

export async function generateStaticParams() {
  const params: { track: string; slug: string }[] = []

  for (const track of ALL_TRACK_SLUGS) {
    const content = getAllContent(track)
    for (const item of content) {
      if (item.slug !== 'index') {
        params.push({
          track,
          slug: item.slug,
        })
      }
    }
  }

  return params
}

// Get adjacent articles for navigation
function getAdjacentContent(track: string, currentSlug: string) {
  const allContent = getAllContent(track).filter(
    (item) => item.slug !== 'index'
  )
  const currentIndex = allContent.findIndex((item) => item.slug === currentSlug)

  return {
    previous: currentIndex > 0 ? allContent[currentIndex - 1] : null,
    next:
      currentIndex < allContent.length - 1
        ? allContent[currentIndex + 1]
        : null,
  }
}

// Use TRACK_NAMES from constants (aliased for backwards compatibility in this file)
const trackNames = TRACK_NAMES

export default async function ContentPage({ params }: PageProps) {
  const { track, slug } = params
  const content = getContentBySlug(track, slug)

  if (!content) {
    notFound()
  }

  const {
    frontmatter,
    content: mdxContent,
    readingTime,
    lastModified,
  } = content
  const { previous, next } = getAdjacentContent(track, slug)

  const PlatformIcon = frontmatter.platform === 'mac' ? AppleIcon : Monitor

  // Track display name for structured data
  const trackDisplayName =
    trackSeoMetadata[track]?.title ||
    trackNames[track] ||
    track.replace(/-/g, ' ')

  // Generate structured data for breadcrumbs
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: trackDisplayName, url: `${siteConfig.url}/${track}` },
    { name: frontmatter.title, url: `${siteConfig.url}/${track}/${slug}` },
  ])

  // Calculate word count for enhanced schema
  const wordCount = getWordCount(mdxContent)

  // Get keywords from track metadata
  const trackKeywords = trackSeoMetadata[track]?.keywords || []

  // Generate article schema for SEO and AI recognition with enhanced properties
  const articleSchema = generateArticleSchema(
    frontmatter.title,
    frontmatter.description || '',
    `${siteConfig.url}/${track}/${slug}`,
    lastModified,
    lastModified,
    {
      wordCount,
      readingTime,
      keywords: trackKeywords,
    }
  )

  // Generate HowTo schema for tutorial pages (start-here, data-analysis tracks)
  const isTutorial = [
    'start-here',
    'data-analysis',
    'app-builder',
    'automation',
    'git-github',
  ].includes(track)
  const howToSchema = isTutorial
    ? generateHowToSchema(
        `How to ${frontmatter.title}`,
        frontmatter.description ||
          `Learn ${frontmatter.title} with step-by-step guidance`,
        [
          {
            name: 'Read the guide',
            text: 'Follow along with the comprehensive tutorial content',
          },
          {
            name: 'Practice with examples',
            text: 'Try the code examples and exercises provided',
          },
          {
            name: 'Apply your knowledge',
            text: 'Use what you learned in your own projects',
          },
        ],
        frontmatter.duration || `PT${readingTime}M`
      )
    : null

  return (
    <>
      {/* JSON-LD Structured Data for SEO and AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
      )}

      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main Content */}
          <article className="min-w-0">
            {/* Breadcrumbs */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
              <Link
                href="/"
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/${track}`}
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                {trackNames[track] || track}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="truncate font-medium text-gray-900 dark:text-white">
                {frontmatter.title}
              </span>
            </nav>

            {/* Article Header */}
            <header className="mb-10">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                {frontmatter.title}
              </h1>

              {frontmatter.description && (
                <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
                  {frontmatter.description}
                </p>
              )}

              {/* Meta info */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {frontmatter.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{frontmatter.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
                {lastModified && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(lastModified)}</span>
                  </div>
                )}
                {frontmatter.platform && (
                  <div className="flex items-center gap-1.5 text-ink-500 dark:text-ink-400">
                    <PlatformIcon className="h-4 w-4" />
                    <span className="capitalize">{frontmatter.platform}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Article Content */}
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-8 lg:p-10">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <MDXRemote source={mdxContent} components={components} />
              </div>
            </div>

            {/* Module Progress */}
            <div className="mt-6">
              <ModuleProgress
                moduleId={`${track}/${slug}`}
                trackName={trackNames[track] || track}
                moduleName={frontmatter.title}
              />
            </div>

            {/* Article Navigation */}
            <div className="mt-10">
              <ArticleNavigation
                previous={
                  previous
                    ? {
                        href: `/${track}/${previous.slug}`,
                        title: previous.frontmatter.title,
                        description: previous.frontmatter.description,
                      }
                    : undefined
                }
                next={
                  next
                    ? {
                        href: `/${track}/${next.slug}`,
                        title: next.frontmatter.title,
                        description: next.frontmatter.description,
                      }
                    : undefined
                }
              />
            </div>

            {/* Share & Newsletter Section */}
            <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-700">
              <div className="grid gap-8 sm:grid-cols-2">
                {/* Social Share */}
                <SocialShare
                  title={frontmatter.title}
                  url={`${siteConfig.url}/${track}/${slug}`}
                  description={frontmatter.description}
                />

                {/* Newsletter Signup */}
                <NewsletterSignup variant="compact" />
              </div>
            </div>

            {/* Back to track link */}
            <nav className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
              <Link
                href={`/${track}`}
                className="inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to {trackNames[track] || track}
              </Link>
            </nav>
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
                <TableOfContents />
              </div>

              {/* Quick links */}
              <div className="mt-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href={`/${track}`}
                      className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      {trackNames[track]} Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/start-here"
                      className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      Getting Started
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/advanced-topics/best-practices"
                      className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      Best Practices
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Share Bar for Mobile */}
      <FloatingShareBar
        title={frontmatter.title}
        url={`${siteConfig.url}/${track}/${slug}`}
      />
    </>
  )
}
