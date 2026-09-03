'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface SlashCommand {
  id: string
  name: string
  category: string
  description: string
  code: string
  example: string
  tags: string[]
}

const commands: SlashCommand[] = [
  {
    id: 'review-pr',
    name: '/review-pr',
    category: 'Git & GitHub',
    description: 'Review a pull request with detailed feedback on code quality, potential bugs, and best practices',
    code: `Review this pull request:
- Check for bugs and edge cases
- Verify code follows best practices
- Suggest performance improvements
- Check test coverage
- Review documentation

Focus on: {describe focus areas}`,
    example: 'Review this pull request focusing on security and error handling',
    tags: ['git', 'code-review', 'pr'],
  },
  {
    id: 'write-tests',
    name: '/write-tests',
    category: 'Testing',
    description: 'Generate comprehensive test cases for a function or component',
    code: `Write comprehensive tests for {file/function name}:
- Unit tests for all functions
- Edge cases and error conditions
- Mock external dependencies
- Aim for 90%+ coverage
- Use {testing framework}

Include both positive and negative test cases.`,
    example: 'Write comprehensive tests for src/utils/auth.ts using Jest',
    tags: ['testing', 'tdd', 'jest', 'unit-tests'],
  },
  {
    id: 'explain-code',
    name: '/explain-code',
    category: 'Documentation',
    description: 'Explain what a piece of code does in plain English',
    code: `Explain this code in simple terms:
- What does it do?
- How does it work?
- What are the key concepts?
- Any potential issues or gotchas?
- Suggestions for improvement

Explain like I'm a {beginner/intermediate/advanced} developer.`,
    example: 'Explain this code like I\'m an intermediate developer',
    tags: ['documentation', 'learning', 'explain'],
  },
  {
    id: 'optimize-performance',
    name: '/optimize-performance',
    category: 'Optimization',
    description: 'Analyze and optimize code for better performance',
    code: `Analyze and optimize this code for performance:
- Identify bottlenecks
- Suggest algorithmic improvements
- Recommend caching strategies
- Check for unnecessary re-renders (React)
- Database query optimization (if applicable)

Provide before/after comparisons.`,
    example: 'Optimize this React component that\'s causing slow renders',
    tags: ['performance', 'optimization', 'refactoring'],
  },
  {
    id: 'refactor-clean',
    name: '/refactor-clean',
    category: 'Refactoring',
    description: 'Refactor code to be cleaner, more maintainable, and follow best practices',
    code: `Refactor this code to improve:
- Readability and maintainability
- Follow SOLID principles
- Extract reusable functions
- Remove code duplication
- Improve naming conventions
- Add proper error handling

Explain each change and why it's better.`,
    example: 'Refactor this messy React component',
    tags: ['refactoring', 'clean-code', 'solid'],
  },
  {
    id: 'debug-issue',
    name: '/debug-issue',
    category: 'Debugging',
    description: 'Debug an issue by analyzing error messages and code context',
    code: `Help debug this issue:

Error: {paste error message}

Code context: {describe where it happens}

What I've tried: {list attempts}

Help me:
- Understand the root cause
- Fix the issue
- Prevent it from happening again
- Add tests to catch similar issues`,
    example: 'Help debug this TypeError: Cannot read property \'map\' of undefined',
    tags: ['debugging', 'errors', 'troubleshooting'],
  },
  {
    id: 'add-typescript',
    name: '/add-typescript',
    category: 'TypeScript',
    description: 'Convert JavaScript code to TypeScript with proper types',
    code: `Convert this JavaScript to TypeScript:
- Add proper type definitions
- Create interfaces for objects
- Use generics where appropriate
- Add JSDoc comments
- Ensure strict type safety

Make types as specific as possible.`,
    example: 'Convert this JavaScript file to TypeScript with strict types',
    tags: ['typescript', 'types', 'migration'],
  },
  {
    id: 'create-api',
    name: '/create-api',
    category: 'API Development',
    description: 'Create a RESTful API endpoint with proper structure',
    code: `Create a REST API endpoint for {resource}:
- Route definition
- Request validation
- Business logic
- Error handling
- Response formatting
- Tests
- Documentation

Framework: {framework name}
Database: {database type}`,
    example: 'Create a REST API endpoint for user registration using Express and MongoDB',
    tags: ['api', 'backend', 'rest'],
  },
  {
    id: 'write-docs',
    name: '/write-docs',
    category: 'Documentation',
    description: 'Generate comprehensive documentation for code',
    code: `Write documentation for {file/module/function}:
- Overview and purpose
- Parameters and return values
- Usage examples
- Edge cases
- Related functions/modules

Format: {JSDoc/README/API docs}`,
    example: 'Write JSDoc documentation for all functions in utils/helpers.ts',
    tags: ['documentation', 'jsdoc', 'comments'],
  },
  {
    id: 'security-audit',
    name: '/security-audit',
    category: 'Security',
    description: 'Audit code for security vulnerabilities',
    code: `Perform security audit on {file/feature}:
- Check for common vulnerabilities (XSS, SQL injection, etc.)
- Validate input sanitization
- Check authentication/authorization
- Review secret management
- Identify potential attack vectors
- Suggest fixes

Follow OWASP Top 10 guidelines.`,
    example: 'Security audit on the user authentication flow',
    tags: ['security', 'audit', 'owasp'],
  },
  {
    id: 'migrate-db',
    name: '/migrate-db',
    category: 'Database',
    description: 'Create a database migration script',
    code: `Create database migration for: {describe changes}

Include:
- Up migration (apply changes)
- Down migration (rollback)
- Data preservation strategy
- Index management
- Validation

Database: {PostgreSQL/MySQL/MongoDB}
ORM: {Prisma/TypeORM/Sequelize}`,
    example: 'Create migration to add email verification to users table in PostgreSQL',
    tags: ['database', 'migration', 'sql'],
  },
  {
    id: 'setup-ci',
    name: '/setup-ci',
    category: 'DevOps',
    description: 'Set up CI/CD pipeline configuration',
    code: `Create CI/CD pipeline for {project}:
- Run tests
- Lint code
- Build project
- Deploy to {environment}
- Run security scans
- Notify on failure

Platform: {GitHub Actions/GitLab CI/Circle CI}`,
    example: 'Set up GitHub Actions to test and deploy Next.js app to Vercel',
    tags: ['ci-cd', 'devops', 'github-actions'],
  },
]

const categories = [...new Set(commands.map((c) => c.category))].sort()

export default function SlashCommandsLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredCommands = commands.filter((cmd) => {
    const matchesSearch =
      cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'All' || cmd.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCopy = async (command: SlashCommand) => {
    await navigator.clipboard.writeText(command.code)
    setCopiedId(command.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Slash Commands Library</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Slash Commands Library
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Ready-to-use slash commands for common development tasks. Copy, customize, and add to your project.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Search Commands
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or tags..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCommands.length} of {commands.length} commands
        </div>
      </div>

      {/* Commands Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredCommands.map((command) => (
          <div
            key={command.id}
            className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md"
          >
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{command.name}</h3>
                  <span className="inline-block mt-1 rounded-full bg-primary-100 dark:bg-primary-900/50 px-3 py-1 text-xs font-medium text-primary-800 dark:text-primary-300">
                    {command.category}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(command)}
                  className="rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {copiedId === command.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{command.description}</p>

            {/* Code */}
            <div className="mb-4">
              <div className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4">
                <pre className="whitespace-pre-wrap font-mono text-xs text-gray-100">
                  {command.code}
                </pre>
              </div>
            </div>

            {/* Example */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Example Usage:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{command.example}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {command.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* How to Use */}
      <div className="mt-12 rounded-2xl bg-primary-50 dark:bg-gray-800 p-8 border border-primary-200 dark:border-gray-700">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">How to Use Slash Commands</h3>
        </div>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-semibold mb-2">1. Create the command file</p>
            <code className="block rounded bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono border border-primary-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
              .claude/commands/command-name.md
            </code>
          </div>
          <div>
            <p className="font-semibold mb-2">2. Copy the command template</p>
            <p className="text-sm">Click "Copy" on any command above and paste it into your .md file</p>
          </div>
          <div>
            <p className="font-semibold mb-2">3. Customize for your project</p>
            <p className="text-sm">Replace placeholders like &#123;framework&#125; with your actual tools</p>
          </div>
          <div>
            <p className="font-semibold mb-2">4. Use in Claude Code</p>
            <p className="text-sm">Type /command-name in Claude Code CLI to run it</p>
          </div>
        </div>
      </div>
    </div>
  )
}
