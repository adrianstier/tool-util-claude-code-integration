import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTrackMetadata, getAllContent } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Card from '@/components/Card'
import CodeBlock from '@/components/CodeBlock'
import Link from 'next/link'
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
import {
  getTrackPageMetadata,
  generateBreadcrumbSchema,
  generateCourseSchema,
  generateFAQSchema,
  siteConfig,
  trackMetadata as trackSeoMetadata,
} from '@/lib/metadata'

export const revalidate = 3600

// Track-specific FAQs for rich snippets
const trackFaqs: Record<string, { question: string; answer: string }[]> = {
  'start-here': [
    {
      question: 'How long does it take to set up Claude Code?',
      answer:
        'Setting up Claude Code typically takes 15-30 minutes. Our guide walks you through installing Node.js, VS Code, and Claude Code itself with step-by-step instructions for both Mac and Windows.',
    },
    {
      question: 'Do I need to know how to code to use Claude Code?',
      answer:
        'No prior coding experience is required. Claude Code helps you write and understand code, making it an excellent tool for beginners learning to program.',
    },
    {
      question: 'Is Claude Code free to use?',
      answer:
        'Claude Code requires a Claude subscription (Pro, Team, or Enterprise). Check the Anthropic website for current pricing. This learning hub is completely free.',
    },
  ],
  'data-analysis': [
    {
      question: 'Should I learn Python or R for data analysis?',
      answer:
        'Both are excellent choices. Python is more versatile and widely used in industry, while R excels in statistical analysis and academic research. Our tutorials cover both.',
    },
    {
      question: 'Can Claude Code help with statistical analysis?',
      answer:
        'Yes, Claude Code can help you write statistical analysis code, explain statistical concepts, debug data analysis scripts, and create visualizations in Python or R.',
    },
  ],
  'git-github': [
    {
      question: 'What is the difference between Git and GitHub?',
      answer:
        'Git is a version control system that tracks changes in your code locally. GitHub is a cloud platform that hosts Git repositories and enables collaboration with others.',
    },
    {
      question: 'Do I need to know command line to use Git?',
      answer:
        'While command line Git is powerful, you can also use VS Code integrated Git tools or GitHub Desktop. Our tutorials cover both approaches for beginners.',
    },
  ],
  'app-builder': [
    {
      question: 'What frameworks does the App Builder track cover?',
      answer:
        'We cover modern web development including React, Next.js, and full-stack development. You will learn to build real web applications with Claude Code as your coding partner.',
    },
    {
      question: 'Can I build mobile apps with Claude Code?',
      answer:
        'Yes, you can use Claude Code to help build mobile apps with frameworks like React Native. While our current focus is web apps, the skills transfer to mobile development.',
    },
  ],
  automation: [
    {
      question: 'What tasks can I automate with Claude Code?',
      answer:
        'You can automate file operations, data processing, API interactions, report generation, email sending, web scraping, and many other repetitive tasks using Python or shell scripts.',
    },
    {
      question: 'Is automation safe for production use?',
      answer:
        'Yes, but always test thoroughly and implement proper error handling. Our tutorials cover best practices for building reliable automation scripts.',
    },
  ],
  agents: [
    {
      question: 'What are MCP servers?',
      answer:
        'MCP (Model Context Protocol) servers extend Claude capabilities by connecting it to external tools and data sources, enabling more powerful AI agent behaviors.',
    },
    {
      question: 'Do I need advanced coding skills to build AI agents?',
      answer:
        'Basic programming knowledge helps, but our tutorials start from fundamentals. Claude Code assists with the complex parts, making agent development accessible.',
    },
  ],
  mcp: [
    {
      question: 'What is MCP (Model Context Protocol)?',
      answer:
        'MCP is an open standard that connects Claude Code to external data sources and tools like databases, GitHub, web search, and more. Think of it as USB-C for AI — one universal protocol for all integrations.',
    },
    {
      question: 'How do I install MCP servers in Claude Code?',
      answer:
        'Use the CLI command: claude mcp add <server-name> -- npx -y @package/name. You can also add servers via JSON config in .mcp.json (project) or ~/.claude.json (user). Type /mcp in Claude Code to check status.',
    },
    {
      question: 'Can I build my own MCP server?',
      answer:
        'Yes! MCP servers can be built in TypeScript or Python using the official SDKs. A basic server takes about 100 lines of code and can expose tools, resources, and prompts to Claude.',
    },
  ],
  'advanced-topics': [
    {
      question: 'What are Claude Code best practices?',
      answer:
        'Best practices include using CLAUDE.md files, writing clear prompts, understanding context limits, structuring projects well, and leveraging slash commands and hooks.',
    },
    {
      question: 'How do I customize Claude Code for my workflow?',
      answer:
        'You can customize Claude Code through CLAUDE.md project files, global settings, custom slash commands, hooks, and MCP server configurations.',
    },
  ],
}

interface TrackPageProps {
  params: {
    track: string
  }
}

// Generate dynamic metadata for each track
export async function generateMetadata({
  params,
}: TrackPageProps): Promise<Metadata> {
  return getTrackPageMetadata(params.track)
}

const components = {
  Card,
  CodeBlock,
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
    // Extract code content and language from children
    const child = (children as { props?: { children?: string; className?: string } })?.props
    const code = child?.children || ''
    const language = child?.className?.replace('language-', '') || 'bash'

    return <CodeBlock code={code} language={language} />
  },
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    // Inline code (not in pre blocks)
    if (!className) {
      return <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200">{children}</code>
    }
    // Let pre handle code blocks
    return <code className={className}>{children}</code>
  },
}

export async function generateStaticParams() {
  return [
    { track: 'start-here' },
    { track: 'data-analysis' },
    { track: 'app-builder' },
    { track: 'automation' },
    { track: 'git-github' },
    { track: 'agents' },
    { track: 'mcp' },
    { track: 'advanced-topics' },
  ]
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { track } = params
  const metadata = getTrackMetadata(track)

  if (!metadata) {
    notFound()
  }

  const allContent = getAllContent(track).filter((item) => item.slug !== 'index')

  // Track display name
  const trackDisplayName =
    trackSeoMetadata[track]?.title || track.replace(/-/g, ' ')

  // Generate structured data for breadcrumbs
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: trackDisplayName, url: `${siteConfig.url}/${track}` },
  ])

  // Generate course schema for the track
  const courseSchema = generateCourseSchema(
    trackDisplayName,
    trackSeoMetadata[track]?.description || metadata.frontmatter.description,
    `${siteConfig.url}/${track}`,
    allContent.map((item) => ({
      name: item.frontmatter.title,
      description: item.frontmatter.description || '',
    }))
  )

  // Generate FAQ schema if FAQs exist for this track
  const faqs = trackFaqs[track] || []
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          className="mb-8 flex items-center space-x-2 text-sm text-ink-600 dark:text-ink-300"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="capitalize text-ink-900 dark:text-paper-50 font-medium" aria-current="page">
            {track.replaceAll('-', ' ')}
          </span>
        </nav>

      {/* Track Header — the page's single h1 (MDX bodies must not repeat it) */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 dark:text-paper-50 text-balance">
          {metadata.frontmatter.title || trackDisplayName}
        </h1>
        {metadata.frontmatter.description && (
          <p className="mt-4 text-lg sm:text-xl text-ink-600 dark:text-ink-300 leading-relaxed">
            {metadata.frontmatter.description}
          </p>
        )}
      </header>

      {/* Track Overview from index.mdx */}
      <div className="mb-12 rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote source={metadata.content} components={components} />
        </div>
      </div>

      {/* Module List */}
      {allContent.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Modules</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allContent.map((item) => (
              <Card
                key={item.slug}
                title={item.frontmatter.title}
                description={item.frontmatter.description || ''}
                href={`/${track}/${item.slug}`}
              >
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {item.frontmatter.duration && (
                    <span className="flex items-center">
                      <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item.frontmatter.duration}
                    </span>
                  )}
                  <span>{item.readingTime} min read</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  )
}
