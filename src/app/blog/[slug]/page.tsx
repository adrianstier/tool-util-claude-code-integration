import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog'
import {
  siteConfig,
  generateArticleSchema,
  generateBreadcrumbSchema,
} from '@/lib/metadata'
import { formatDate } from '@/lib/utils'
import CodeBlock from '@/components/CodeBlock'
import {
  Callout,
  Steps,
  Step,
  Checklist,
  ChecklistItem,
  Diagram,
} from '@/components/mdx'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  if (!post) {
    return {}
  }

  const url = `${siteConfig.url}/blog/${params.slug}`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author || siteConfig.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

const components = {
  CodeBlock,
  Callout,
  Steps,
  Step,
  Checklist,
  ChecklistItem,
  Diagram,
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
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <Link
      href={href || '#'}
      className="text-primary-600 hover:underline dark:text-primary-400"
    >
      {children}
    </Link>
  ),
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const url = `${siteConfig.url}/blog/${params.slug}`

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Blog', url: `${siteConfig.url}/blog` },
    { name: post.title, url },
  ])

  const articleSchema = generateArticleSchema(
    post.title,
    post.description || '',
    url,
    post.date,
    post.date
  )

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
          __html: JSON.stringify(articleSchema),
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {post.description}
            </p>
          )}

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <div className="flex gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium dark:bg-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50 sm:p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MDXRemote source={post.content} components={components} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-700">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to all posts
          </Link>
        </div>
      </article>
    </>
  )
}
