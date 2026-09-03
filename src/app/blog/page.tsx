import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { getAllBlogPosts } from '@/lib/blog'
import { siteConfig } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog & Updates | Claude Code Learning Hub',
  description:
    'Stay updated with the latest tutorials, feature announcements, and tips for mastering AI-powered development with Claude Code.',
  openGraph: {
    title: 'Blog & Updates | Claude Code Learning Hub',
    description:
      'Latest tutorials, announcements, and tips for AI-powered development',
    url: `${siteConfig.url}/blog`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Blog & Updates
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Latest tutorials, announcements, and tips for AI-powered development
        </p>
      </div>

      {/* Posts */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600"
          >
            <div className="flex flex-col gap-4">
              {/* Date & Tags */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                {post.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {post.description}
                  </p>
                )}
              </div>

              {/* Read More */}
              <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                <span>Read more</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Full card link overlay */}
            <Link href={`/blog/${post.slug}`} className="absolute inset-0">
              <span className="sr-only">Read {post.title}</span>
            </Link>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Back to Home */}
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
