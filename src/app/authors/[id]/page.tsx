import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  siteConfig,
  generatePersonSchema,
  generateBreadcrumbSchema,
} from '@/lib/metadata'
import { getAllContent } from '@/lib/mdx'
import { Users, BookOpen, Code, ArrowLeft, ExternalLink } from 'lucide-react'

interface AuthorData {
  id: string
  name: string
  role: string
  bio: string
  fullBio: string
  expertise: string[]
  links: { name: string; url: string }[]
  image?: string
}

// Author data - can be expanded or moved to a separate data file
const authorsData: Record<string, AuthorData> = {
  team: {
    id: 'team',
    name: 'Claude Code Learning Hub Team',
    role: 'Editorial Team',
    bio: 'A dedicated team of developers, educators, and AI enthusiasts.',
    fullBio: `The Claude Code Learning Hub Team is a dedicated group of developers, educators, and AI enthusiasts committed to making AI-powered development accessible to everyone.

Our mission is to create comprehensive, beginner-friendly learning resources that help developers of all skill levels harness the power of Claude Code for their projects. From setting up your development environment to building complex applications, we provide step-by-step guidance every step of the way.

We believe that AI coding assistants like Claude Code represent a fundamental shift in how software is developed, and we're here to help you navigate this exciting new landscape.`,
    expertise: [
      'Claude Code',
      'VS Code',
      'Git & GitHub',
      'Python',
      'R Programming',
      'Data Analysis',
      'Web Development',
      'Automation',
      'AI Agents',
      'MCP Servers',
    ],
    links: [
      { name: 'GitHub', url: 'https://github.com/anthropics/claude-code' },
      {
        name: 'Documentation',
        url: 'https://docs.claude.com/en/docs/claude-code/overview',
      },
      { name: 'Anthropic', url: 'https://anthropic.com' },
    ],
  },
}

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const author = authorsData[params.id]
  if (!author) {
    return {}
  }

  return {
    title: `${author.name} - Author`,
    description: author.bio,
    openGraph: {
      title: `${author.name} | Claude Code Learning Hub`,
      description: author.bio,
      url: `${siteConfig.url}/authors/${author.id}`,
      type: 'profile',
    },
  }
}

export function generateStaticParams() {
  return Object.keys(authorsData).map((id) => ({ id }))
}

// Get all articles (simplified - shows content from all tracks)
function getAuthorArticles() {
  const tracks = [
    'start-here',
    'data-analysis',
    'app-builder',
    'automation',
    'git-github',
    'agents',
    'advanced-topics',
  ]

  const articles: {
    track: string
    slug: string
    title: string
    description?: string
  }[] = []

  for (const track of tracks) {
    try {
      const content = getAllContent(track)
      for (const item of content) {
        if (item.slug !== 'index') {
          articles.push({
            track,
            slug: item.slug,
            title: item.frontmatter.title,
            description: item.frontmatter.description,
          })
        }
      }
    } catch {
      // Track may not exist, skip
    }
  }

  return articles.slice(0, 12) // Show first 12 articles
}

// Track display names
const trackNames: Record<string, string> = {
  'start-here': 'Start Here',
  'data-analysis': 'Data Analysis',
  'app-builder': 'App Builder',
  automation: 'Automation',
  'git-github': 'Git & GitHub',
  agents: 'AI Agents',
  'advanced-topics': 'Advanced Topics',
}

export default function AuthorPage({ params }: PageProps) {
  const author = authorsData[params.id]

  if (!author) {
    notFound()
  }

  const articles = getAuthorArticles()

  // Generate Person schema for SEO
  const personSchema = generatePersonSchema(
    author.name,
    `${siteConfig.url}/authors/${author.id}`,
    author.image,
    author.bio,
    author.links.map((l) => l.url)
  )

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Authors', url: `${siteConfig.url}/authors` },
    { name: author.name, url: `${siteConfig.url}/authors/${author.id}` },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/authors"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" />
          All Authors
        </Link>

        {/* Author Header */}
        <header className="mb-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Users className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {author.name}
              </h1>
              <p className="mt-1 text-lg font-medium text-primary-600 dark:text-primary-400">
                {author.role}
              </p>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-4 w-4" />
                  <span>{articles.length}+ articles</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Code className="h-4 w-4" />
                  <span>{author.expertise.length} topics covered</span>
                </div>
              </div>

              {/* Links */}
              <div className="mt-4 flex flex-wrap gap-3">
                {author.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Bio Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            About
          </h2>
          <div className="prose prose-gray max-w-none dark:prose-invert">
            {author.fullBio.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Expertise Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Areas of Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {author.expertise.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Recent Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={`${article.track}/${article.slug}`}
                href={`/${article.track}/${article.slug}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-primary-600"
              >
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                  {trackNames[article.track] || article.track}
                </span>
                <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900 dark:text-white">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {article.description}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {articles.length >= 12 && (
            <div className="mt-6 text-center">
              <Link
                href="/start-here"
                className="inline-flex items-center gap-2 font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                View all content
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
