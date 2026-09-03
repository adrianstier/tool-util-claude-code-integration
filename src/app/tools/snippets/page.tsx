'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Copy,
  Check,
  Search,
  Code,
  GitBranch,
  Database,
  FileText,
  Terminal,
  Zap,
  Server,
  Shield,
} from 'lucide-react'

interface Snippet {
  id: string
  title: string
  description: string
  category: string
  language: string
  code: string
  tags: string[]
}

const snippets: Snippet[] = [
  {
    id: 'git-commit',
    title: 'Git Commit with Claude',
    description: 'Commit changes with a well-formatted message following conventional commits',
    category: 'Git',
    language: 'bash',
    code: `# Stage all changes
git add .

# Commit with conventional format
git commit -m "feat: add user authentication

- Implement JWT token generation
- Add password hashing with bcrypt
- Create login/logout endpoints

Co-authored-by: Claude <claude@anthropic.com>"`,
    tags: ['git', 'commit', 'conventional'],
  },
  {
    id: 'python-dataframe',
    title: 'Pandas DataFrame Operations',
    description: 'Common pandas operations for data cleaning and transformation',
    category: 'Data Analysis',
    language: 'python',
    code: `import pandas as pd

# Read data
df = pd.read_csv('data.csv')

# Basic cleaning
df = (df
    .dropna(subset=['important_column'])
    .drop_duplicates()
    .rename(columns={'old_name': 'new_name'})
    .assign(
        new_column=lambda x: x['col1'] + x['col2'],
        date=lambda x: pd.to_datetime(x['date_string'])
    )
    .query('value > 0')
)

# Group and aggregate
summary = (df
    .groupby('category')
    .agg({
        'value': ['sum', 'mean', 'count'],
        'date': 'max'
    })
    .reset_index()
)`,
    tags: ['python', 'pandas', 'data'],
  },
  {
    id: 'react-hook',
    title: 'Custom React Hook',
    description: 'Template for creating a custom React hook with TypeScript',
    category: 'React',
    language: 'typescript',
    code: `import { useState, useEffect, useCallback } from 'react'

interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFunction()
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [asyncFunction, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, execute }
}

export default useAsync`,
    tags: ['react', 'typescript', 'hooks'],
  },
  {
    id: 'express-middleware',
    title: 'Express Error Middleware',
    description: 'Global error handling middleware for Express.js',
    category: 'Backend',
    language: 'typescript',
    code: `import { Request, Response, NextFunction } from 'express'

// Custom error class
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

// Error handler middleware
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  // Log unexpected errors
  console.error('Unexpected error:', err)

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message

  return res.status(500).json({
    status: 'error',
    message,
  })
}

export { AppError, errorHandler }`,
    tags: ['express', 'typescript', 'error-handling'],
  },
  {
    id: 'sql-query',
    title: 'SQL Query Patterns',
    description: 'Common SQL query patterns for database operations',
    category: 'Database',
    language: 'sql',
    code: `-- Get aggregated data with window functions
SELECT
  user_id,
  order_date,
  amount,
  SUM(amount) OVER (
    PARTITION BY user_id
    ORDER BY order_date
  ) as running_total,
  AVG(amount) OVER (
    PARTITION BY user_id
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as moving_avg_7d
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days';

-- Upsert pattern
INSERT INTO users (email, name, updated_at)
VALUES ('user@example.com', 'John', NOW())
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- CTE for complex queries
WITH active_users AS (
  SELECT user_id, COUNT(*) as session_count
  FROM sessions
  WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY user_id
  HAVING COUNT(*) >= 3
)
SELECT u.*, a.session_count
FROM users u
JOIN active_users a ON u.id = a.user_id;`,
    tags: ['sql', 'postgres', 'database'],
  },
  {
    id: 'typescript-utility',
    title: 'TypeScript Utility Types',
    description: 'Useful TypeScript utility types for better type safety',
    category: 'TypeScript',
    language: 'typescript',
    code: `// Make specific keys required
type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// Make specific keys optional
type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Extract function return type
type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : never

// Type-safe object keys
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

// Type guard example
function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

// Usage
const items = [1, null, 2, undefined, 3].filter(isNotNull)
// items is number[]`,
    tags: ['typescript', 'types', 'utility'],
  },
  {
    id: 'api-fetch',
    title: 'Type-Safe API Fetch',
    description: 'A type-safe fetch wrapper with error handling',
    category: 'API',
    language: 'typescript',
    code: `interface ApiResponse<T> {
  data: T
  status: number
}

interface ApiError {
  message: string
  status: number
}

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error: ApiError = {
      message: data.message || 'Request failed',
      status: response.status,
    }
    throw error
  }

  return {
    data,
    status: response.status,
  }
}

// Usage
interface User {
  id: number
  name: string
  email: string
}

const { data: user } = await apiFetch<User>('/api/users/1')
// user is typed as User`,
    tags: ['typescript', 'fetch', 'api'],
  },
  {
    id: 'env-validation',
    title: 'Environment Variable Validation',
    description: 'Type-safe environment variable validation with Zod',
    category: 'Configuration',
    language: 'typescript',
    code: `import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  ENABLE_CACHE: z.string().transform(v => v === 'true').default('false'),
})

// Parse and validate
const env = envSchema.parse(process.env)

// Export typed environment
export type Env = z.infer<typeof envSchema>
export { env }

// Usage
console.log(env.PORT) // number
console.log(env.ENABLE_CACHE) // boolean`,
    tags: ['typescript', 'zod', 'env'],
  },
]

const categories = [
  { name: 'All', icon: Code },
  { name: 'Git', icon: GitBranch },
  { name: 'Data Analysis', icon: Database },
  { name: 'React', icon: Zap },
  { name: 'Backend', icon: Server },
  { name: 'Database', icon: Database },
  { name: 'TypeScript', icon: FileText },
  { name: 'API', icon: Terminal },
  { name: 'Configuration', icon: Shield },
]

export default function SnippetsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesCategory =
      selectedCategory === 'All' || snippet.category === selectedCategory
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesCategory && matchesSearch
  })

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      bash: 'bg-gray-700 text-gray-100',
      python: 'bg-blue-600 text-white',
      typescript: 'bg-blue-500 text-white',
      sql: 'bg-orange-500 text-white',
    }
    return colors[language] || 'bg-gray-500 text-white'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Code Snippet Library
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Copy-paste code snippets for common patterns and tasks
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snippets..."
              aria-label="Search code snippets"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-10 pr-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            )
          })}
        </div>

        {/* Snippets */}
        <div className="space-y-6">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-12" role="status" aria-live="polite">
              <Code className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No snippets found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {snippet.title}
                        </h3>
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${getLanguageColor(
                            snippet.language
                          )}`}
                        >
                          {snippet.language}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {snippet.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(snippet.code, snippet.id)}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copiedId === snippet.id ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {snippet.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
