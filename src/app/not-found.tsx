import Link from 'next/link'
import { Metadata } from 'next'
import { Home, Search, BookOpen, ArrowRight, Rocket } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found | Claude Code Learning Hub',
  description:
    'The page you are looking for could not be found. Explore our learning tracks, tools, and resources to master AI-powered development with Claude Code.',
  robots: {
    index: false,
    follow: true,
  },
}

const popularPages = [
  {
    title: 'Getting Started',
    description: 'Set up Claude Code and VS Code',
    href: '/start-here',
    icon: Rocket,
  },
  {
    title: 'Data Analysis',
    description: 'Learn Python and R for data science',
    href: '/data-analysis',
    icon: BookOpen,
  },
  {
    title: 'For Researchers',
    description: 'AI-powered coding for academics',
    href: '/start-here/claude-code-for-researchers',
    icon: Search,
  },
]

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-9xl font-bold text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h2>
        <p className="mx-auto mb-8 max-w-md text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track with your learning journey.
        </p>

        {/* Primary CTA */}
        <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Link>
          <Link
            href="/start-here"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-600 px-6 py-3 text-base font-semibold text-primary-600 transition-all hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30"
          >
            Start Learning
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="border-t border-gray-200 pt-8 dark:border-gray-700">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
            Popular Pages
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {popularPages.map((page) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group rounded-xl border border-gray-200 p-4 transition-all hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:hover:border-primary-500"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/50 dark:text-primary-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                      {page.title}
                    </h4>
                  </div>
                  <p className="text-left text-sm text-gray-600 dark:text-gray-400">
                    {page.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Need help?{' '}
          <a
            href={`https://github.com/anthropics/claude-code/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            Report an issue
          </a>{' '}
          or{' '}
          <Link
            href="/resources"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            browse resources
          </Link>
        </p>
      </div>
    </main>
  )
}
