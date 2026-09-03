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
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Page not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track with your learning journey.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Link>
          <Link
            href="/start-here"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-600 px-6 py-3 text-base font-semibold text-primary-600 dark:text-primary-400 transition-all hover:bg-primary-50 dark:hover:bg-primary-900/30"
          >
            Start Learning
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-6">
            Popular Pages
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {popularPages.map((page) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {page.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
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
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Report an issue
          </a>{' '}
          or{' '}
          <Link
            href="/resources"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            browse resources
          </Link>
        </p>
      </div>
    </main>
  )
}
