'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Copy,
  Check,
  Database,
  Globe,
  FileText,
  GitBranch,
  Folder,
  Bot,
  Code,
  Server,
} from 'lucide-react'

interface MCPServer {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
  author: string
  repo: string
  installCommand: string
  configExample: string
  features: string[]
  tags: string[]
}

const mcpServers: MCPServer[] = [
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: 'Read and write files on your local filesystem with full path support',
    category: 'Core',
    icon: <Folder className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-filesystem',
    configExample: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}`,
    features: [
      'Read file contents',
      'Write and create files',
      'List directory contents',
      'Search files by pattern',
      'Move and copy files',
    ],
    tags: ['files', 'local', 'core'],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Interact with GitHub repositories, issues, pull requests, and more',
    category: 'Development',
    icon: <GitBranch className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-github',
    configExample: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}`,
    features: [
      'List repositories',
      'Create and manage issues',
      'Create pull requests',
      'Search code',
      'Manage branches',
    ],
    tags: ['github', 'git', 'vcs'],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Query and manage PostgreSQL databases with full SQL support',
    category: 'Database',
    icon: <Database className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-postgres',
    configExample: `{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@host:5432/db"
      }
    }
  }
}`,
    features: [
      'Execute SQL queries',
      'List tables and schemas',
      'Inspect table structure',
      'Run transactions',
      'Parameterized queries',
    ],
    tags: ['database', 'sql', 'postgres'],
  },
  {
    id: 'fetch',
    name: 'Fetch',
    description: 'Fetch and process content from URLs with markdown conversion',
    category: 'Web',
    icon: <Globe className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-fetch',
    configExample: `{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-fetch"]
    }
  }
}`,
    features: [
      'Fetch web pages',
      'Convert HTML to markdown',
      'Handle different content types',
      'Follow redirects',
      'Extract text content',
    ],
    tags: ['web', 'http', 'scraping'],
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Persistent memory storage for storing and retrieving information',
    category: 'Core',
    icon: <Bot className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-memory',
    configExample: `{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-memory"]
    }
  }
}`,
    features: [
      'Store key-value pairs',
      'Persistent across sessions',
      'Search stored memories',
      'Organize by categories',
      'Export and import',
    ],
    tags: ['memory', 'storage', 'persistence'],
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: 'Browser automation for web scraping and testing',
    category: 'Web',
    icon: <Code className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-puppeteer',
    configExample: `{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-puppeteer"]
    }
  }
}`,
    features: [
      'Navigate to URLs',
      'Screenshot pages',
      'Click elements',
      'Fill forms',
      'Execute JavaScript',
    ],
    tags: ['browser', 'automation', 'scraping'],
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'Lightweight SQLite database operations',
    category: 'Database',
    icon: <Database className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-sqlite',
    configExample: `{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-sqlite",
        "/path/to/database.db"
      ]
    }
  }
}`,
    features: [
      'Execute SQL queries',
      'Create tables',
      'In-memory databases',
      'Database inspection',
      'Backup and restore',
    ],
    tags: ['database', 'sql', 'sqlite'],
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: 'Web search using Brave Search API',
    category: 'Web',
    icon: <Search className="h-5 w-5" />,
    author: 'Anthropic',
    repo: 'https://github.com/modelcontextprotocol/servers',
    installCommand: 'npx @modelcontextprotocol/server-brave-search',
    configExample: `{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-api-key"
      }
    }
  }
}`,
    features: [
      'Web search',
      'Local search',
      'News search',
      'Result filtering',
      'Safe search',
    ],
    tags: ['search', 'web', 'api'],
  },
]

const categories = ['All', ...Array.from(new Set(mcpServers.map((s) => s.category)))]

export default function MCPExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedServer, setExpandedServer] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredServers = mcpServers.filter((server) => {
    const matchesCategory =
      selectedCategory === 'All' || server.category === selectedCategory
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesCategory && matchesSearch
  })

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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
            MCP Server Explorer
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browse and install Model Context Protocol servers to extend Claude Code capabilities
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
              placeholder="Search MCP servers..."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-10 pr-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Server Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredServers.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Server className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No servers found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredServers.map((server) => (
              <div
                key={server.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        {server.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {server.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          by {server.author}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {server.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {server.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {server.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Install Command */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Install Command</span>
                      <button
                        onClick={() =>
                          handleCopy(server.installCommand, `${server.id}-install`)
                        }
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {copiedId === `${server.id}-install` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <code className="block rounded bg-gray-100 dark:bg-gray-900 px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                      {server.installCommand}
                    </code>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setExpandedServer(
                          expandedServer === server.id ? null : server.id
                        )
                      }
                      className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {expandedServer === server.id ? 'Hide Config' : 'View Config'}
                    </button>
                    <a
                      href={server.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Docs
                    </a>
                  </div>
                </div>

                {/* Expanded Config */}
                {expandedServer === server.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Features
                      </h4>
                      <ul className="space-y-1">
                        {server.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <div className="h-1 w-1 rounded-full bg-primary-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <span>Configuration Example</span>
                        <button
                          onClick={() =>
                            handleCopy(server.configExample, `${server.id}-config`)
                          }
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {copiedId === `${server.id}-config` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <pre className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 text-xs text-gray-100 overflow-x-auto">
                        <code>{server.configExample}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                How to use MCP Servers
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add server configurations to your <code className="rounded bg-gray-100 dark:bg-gray-700 px-1 py-0.5 text-xs">~/.claude/claude_desktop_config.json</code> file,
                then restart Claude Desktop to enable the new capabilities.
              </p>
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Learn more about MCP
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
