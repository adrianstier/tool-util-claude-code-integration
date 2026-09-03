import { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/metadata'
import { Users, BookOpen, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authors & Contributors',
  description:
    'Meet the team behind Claude Code Learning Hub. Expert developers and educators creating comprehensive tutorials for AI-powered development.',
  openGraph: {
    title: 'Authors & Contributors | Claude Code Learning Hub',
    description:
      'Meet the team behind Claude Code Learning Hub. Expert developers and educators creating comprehensive tutorials.',
    url: `${siteConfig.url}/authors`,
  },
}

// Author data - can be expanded or moved to a data file
const authors = [
  {
    id: 'team',
    name: 'Claude Code Learning Hub Team',
    role: 'Editorial Team',
    bio: 'A dedicated team of developers, educators, and AI enthusiasts creating comprehensive learning resources for Claude Code, VS Code, Git, Python, and more.',
    expertise: [
      'Claude Code',
      'VS Code',
      'Git & GitHub',
      'Python',
      'Data Analysis',
      'Web Development',
    ],
    articleCount: 50,
    image: '/team-avatar.png',
  },
]

export default function AuthorsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 p-3">
          <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Authors & Contributors
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Meet the team creating comprehensive learning resources for AI-powered development
        </p>
      </header>

      {/* Authors Grid */}
      <div className="space-y-8">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.id}`}
            className="block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {author.name}
                </h2>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {author.role}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{author.bio}</p>

                {/* Stats */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    <span>{author.articleCount}+ articles</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Code className="h-4 w-4" />
                    <span>{author.expertise.length} topics</span>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {author.expertise.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200"
                    >
                      {topic}
                    </span>
                  ))}
                  {author.expertise.length > 4 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                      +{author.expertise.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950/50 dark:to-blue-950/50 border border-primary-200 dark:border-primary-800 p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Want to Contribute?
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          We welcome contributions from the community. Help others learn Claude Code by
          sharing your knowledge.
        </p>
        <a
          href="https://github.com/anthropics/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          Contribute on GitHub
        </a>
      </div>
    </div>
  )
}
