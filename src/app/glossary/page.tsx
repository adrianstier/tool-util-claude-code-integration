import { Metadata } from 'next'
import Link from 'next/link'
import { Book, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Glossary - Programming & AI Development Terms',
  description:
    'Comprehensive glossary of programming, AI development, and Claude Code terms. Beginner-friendly definitions for technical concepts.',
  keywords: [
    'programming glossary',
    'coding terms',
    'Claude Code glossary',
    'Git terminology',
    'developer definitions',
    'AI development terms',
  ],
  openGraph: {
    title: 'Glossary | Claude Code Learning Hub',
    description:
      'Comprehensive glossary of programming, AI development, and Claude Code terms. Beginner-friendly definitions for technical concepts.',
    url: `${siteConfig.url}/glossary`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glossary | Claude Code Learning Hub',
    description:
      'Beginner-friendly definitions for programming, AI development, and Claude Code terms.',
  },
  alternates: {
    canonical: `${siteConfig.url}/glossary`,
  },
}

interface Term {
  term: string
  definition: string
  related?: string[]
  category: 'claude' | 'git' | 'vscode' | 'programming' | 'terminal'
}

const glossaryTerms: Term[] = [
  // Claude Code terms
  {
    term: 'Claude Code',
    definition:
      'A VS Code extension that integrates Claude AI directly into your development workflow, allowing you to ask questions, generate code, and get help without leaving your editor.',
    category: 'claude',
    related: ['VS Code', 'Extension'],
  },
  {
    term: 'CLAUDE.md',
    definition:
      'A markdown file placed in your project root that gives Claude context about your project, including coding standards, architecture decisions, and specific instructions.',
    category: 'claude',
  },
  {
    term: 'MCP (Model Context Protocol)',
    definition:
      'A protocol that allows Claude to connect to external tools and data sources, extending its capabilities beyond the default features.',
    category: 'claude',
  },
  {
    term: 'Context Window',
    definition:
      'The amount of text (code, conversation, files) that Claude can "see" and consider at once. Larger context windows allow Claude to understand more of your project.',
    category: 'claude',
  },
  {
    term: 'Slash Commands',
    definition:
      'Special commands in Claude Code that start with "/" and perform specific actions, like /help, /clear, or /compact.',
    category: 'claude',
  },

  // Git terms
  {
    term: 'Repository (Repo)',
    definition:
      'A folder that Git tracks for changes. Contains all your project files plus hidden Git data that records the history of changes.',
    category: 'git',
    related: ['Clone', 'Remote'],
  },
  {
    term: 'Commit',
    definition:
      'A saved snapshot of your project at a point in time. Like a save point in a video game - you can always go back to it.',
    category: 'git',
  },
  {
    term: 'Branch',
    definition:
      "A parallel version of your code. You can work on new features in a branch without affecting the main code until you're ready.",
    category: 'git',
    related: ['Main', 'Merge'],
  },
  {
    term: 'Clone',
    definition:
      'To download a copy of a repository from GitHub (or another remote) to your local computer.',
    category: 'git',
  },
  {
    term: 'Push',
    definition:
      'To upload your local commits to a remote repository like GitHub.',
    category: 'git',
    related: ['Pull', 'Remote'],
  },
  {
    term: 'Pull',
    definition:
      'To download and integrate changes from a remote repository into your local repository.',
    category: 'git',
    related: ['Push', 'Fetch'],
  },
  {
    term: 'Merge',
    definition:
      'To combine changes from one branch into another. Often used to add new features into the main branch.',
    category: 'git',
    related: ['Branch', 'Pull Request'],
  },
  {
    term: 'Pull Request (PR)',
    definition:
      'A way to propose changes on GitHub. Others can review your code before it gets merged into the main branch.',
    category: 'git',
  },
  {
    term: 'Remote',
    definition:
      'A version of your repository hosted somewhere else, usually on GitHub. "Origin" is the default name for your main remote.',
    category: 'git',
  },
  {
    term: 'SSH Key',
    definition:
      'A secure way to authenticate with GitHub without typing your password every time. Consists of a public and private key pair.',
    category: 'git',
  },

  // VS Code terms
  {
    term: 'VS Code',
    definition:
      "Visual Studio Code - a free, popular code editor from Microsoft. It's where you'll write and edit your code.",
    category: 'vscode',
  },
  {
    term: 'Extension',
    definition:
      'An add-on that adds features to VS Code. Claude Code is an extension. You install them from the VS Code marketplace.',
    category: 'vscode',
  },
  {
    term: 'Workspace',
    definition:
      'The folder (or folders) you have open in VS Code. Your project\'s "home base" in the editor.',
    category: 'vscode',
  },
  {
    term: 'Command Palette',
    definition:
      'VS Code\'s "search for anything" feature. Open it with Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows) to find any command.',
    category: 'vscode',
  },
  {
    term: 'Integrated Terminal',
    definition:
      'A terminal/command line built into VS Code. You can run commands without leaving the editor.',
    category: 'vscode',
    related: ['Terminal'],
  },

  // Terminal terms
  {
    term: 'Terminal',
    definition:
      'A text-based interface for running commands on your computer. Also called command line, shell, or console.',
    category: 'terminal',
    related: ['CLI', 'Shell'],
  },
  {
    term: 'CLI (Command Line Interface)',
    definition:
      'A way to interact with software by typing commands instead of clicking buttons. Git and many developer tools use CLIs.',
    category: 'terminal',
  },
  {
    term: 'Shell',
    definition:
      'The program that interprets your terminal commands. Common shells include Bash (Mac/Linux) and PowerShell (Windows).',
    category: 'terminal',
  },
  {
    term: 'Path',
    definition:
      'The location of a file or folder on your computer. Like an address. Example: /Users/you/projects/my-app',
    category: 'terminal',
  },
  {
    term: 'Environment Variable',
    definition:
      'A named value that programs can read. Often used for configuration like API keys. Set differently on Mac vs Windows.',
    category: 'terminal',
  },

  // Programming terms
  {
    term: 'API',
    definition:
      'Application Programming Interface - a way for programs to talk to each other. Claude Code uses the Anthropic API to communicate with Claude.',
    category: 'programming',
  },
  {
    term: 'JSON',
    definition:
      "JavaScript Object Notation - a common format for storing and exchanging data. You'll see it in config files and API responses.",
    category: 'programming',
  },
  {
    term: 'Markdown',
    definition:
      'A simple way to format text using symbols. # for headings, **bold**, *italic*. Used in README files and CLAUDE.md.',
    category: 'programming',
  },
  {
    term: 'Dependency',
    definition:
      'A package or library that your project needs to run. Listed in files like package.json (JavaScript) or requirements.txt (Python).',
    category: 'programming',
  },
  {
    term: 'Package Manager',
    definition:
      'A tool that installs and manages dependencies. npm/yarn for JavaScript, pip for Python, Homebrew for Mac system tools.',
    category: 'programming',
  },
]

const categoryLabels: Record<Term['category'], string> = {
  claude: 'Claude Code',
  git: 'Git & GitHub',
  vscode: 'VS Code',
  terminal: 'Terminal & CLI',
  programming: 'Programming',
}

const categoryColors: Record<Term['category'], string> = {
  claude:
    'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  git: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  vscode: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  terminal: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  programming:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
}

export default function GlossaryPage() {
  // Sort terms alphabetically
  const sortedTerms = [...glossaryTerms].sort((a, b) =>
    a.term.toLowerCase().localeCompare(b.term.toLowerCase())
  )

  // Group by first letter
  const groupedTerms = sortedTerms.reduce(
    (acc, term) => {
      const letter = term.term[0].toUpperCase()
      if (!acc[letter]) acc[letter] = []
      acc[letter].push(term)
      return acc
    },
    {} as Record<string, Term[]>
  )

  const letters = Object.keys(groupedTerms).sort()

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950">
      {/* Header */}
      <div className="border-b border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ink-600 hover:text-primary-600 dark:text-ink-400 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
              <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-paper-50">
              Glossary
            </h1>
          </div>

          <p className="max-w-2xl text-lg text-ink-600 dark:text-ink-300">
            Common terms you&apos;ll encounter when learning Claude Code, Git,
            VS Code, and programming in general.
          </p>

          {/* Quick jump */}
          <div className="mt-6 flex flex-wrap gap-2">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-ink-600 transition-colors hover:bg-primary-100 hover:text-primary-700 dark:text-ink-400 dark:hover:bg-primary-900/50 dark:hover:text-primary-300"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {letters.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="mb-12">
            <h2 className="mb-6 border-b border-ink-200 pb-2 text-2xl font-bold text-ink-900 dark:border-ink-700 dark:text-paper-50">
              {letter}
            </h2>

            <div className="space-y-6">
              {groupedTerms[letter].map((item) => (
                <div
                  key={item.term}
                  className="rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900"
                >
                  <div className="mb-3 flex flex-wrap items-start gap-3">
                    <h3 className="text-lg font-semibold text-ink-900 dark:text-paper-50">
                      {item.term}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[item.category]}`}
                    >
                      {categoryLabels[item.category]}
                    </span>
                  </div>

                  <p className="leading-relaxed text-ink-600 dark:text-ink-300">
                    {item.definition}
                  </p>

                  {item.related && item.related.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <span className="text-ink-500 dark:text-ink-400">
                        Related:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.related.map((rel) => (
                          <span
                            key={rel}
                            className="rounded bg-ink-100 px-2 py-0.5 text-ink-600 dark:bg-ink-800 dark:text-ink-300"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Back to top */}
        <div className="border-t border-ink-200 pt-8 text-center dark:border-ink-700">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-primary-600 dark:text-ink-400 dark:hover:text-primary-400"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </div>
  )
}
