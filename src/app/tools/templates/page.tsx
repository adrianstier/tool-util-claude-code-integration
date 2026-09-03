'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Globe,
  BarChart3,
  Zap,
  Terminal,
  FileCode,
  Layout,
  Server,
  Bot,
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  files: TemplateFile[]
  tags: string[]
}

interface TemplateFile {
  name: string
  path: string
  content: string
}

const templates: Template[] = [
  {
    id: 'nextjs-starter',
    name: 'Next.js Starter',
    description: 'A modern Next.js starter template with TypeScript, Tailwind CSS, and Claude Code configuration',
    category: 'Web App',
    icon: <Globe className="h-5 w-5" />,
    difficulty: 'Beginner',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    files: [
      {
        name: 'CLAUDE.md',
        path: '/CLAUDE.md',
        content: `# Project Context

This is a Next.js application built with TypeScript and Tailwind CSS.

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- ESLint + Prettier

## Project Structure
- \`src/app/\` - App router pages
- \`src/components/\` - React components
- \`src/lib/\` - Utilities

## Commands
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run lint\` - Run linting

## Code Style
- Use functional components with hooks
- Prefer TypeScript strict mode
- Follow Tailwind CSS conventions
- Keep components small and focused`,
      },
      {
        name: '.claudeignore',
        path: '/.claudeignore',
        content: `# Dependencies
node_modules/

# Build output
.next/
out/
dist/

# Environment
.env*.local

# IDE
.vscode/
.idea/

# Misc
*.log
.DS_Store`,
      },
    ],
  },
  {
    id: 'python-data-analysis',
    name: 'Python Data Analysis',
    description: 'Data analysis project template with pandas, matplotlib, and Jupyter notebook setup',
    category: 'Data Science',
    icon: <BarChart3 className="h-5 w-5" />,
    difficulty: 'Intermediate',
    tags: ['Python', 'Pandas', 'Jupyter'],
    files: [
      {
        name: 'CLAUDE.md',
        path: '/CLAUDE.md',
        content: `# Data Analysis Project

## Project Overview
This is a Python data analysis project using pandas and matplotlib.

## Environment Setup
\`\`\`bash
python -m venv venv
source venv/bin/activate  # or venv\\Scripts\\activate on Windows
pip install -r requirements.txt
\`\`\`

## Project Structure
- \`data/\` - Raw and processed data files
- \`notebooks/\` - Jupyter notebooks for analysis
- \`src/\` - Python source code
- \`reports/\` - Generated reports and visualizations

## Key Libraries
- pandas for data manipulation
- matplotlib/seaborn for visualization
- scikit-learn for modeling

## Data Handling
- Use \`data/raw/\` for original data
- Use \`data/processed/\` for cleaned data
- Never commit sensitive data

## Analysis Guidelines
- Document all data transformations
- Use meaningful variable names
- Create reproducible workflows`,
      },
      {
        name: 'requirements.txt',
        path: '/requirements.txt',
        content: `pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
scikit-learn>=1.3.0
jupyter>=1.0.0
openpyxl>=3.1.0`,
      },
    ],
  },
  {
    id: 'automation-scripts',
    name: 'Automation Scripts',
    description: 'Collection of automation scripts with proper structure and error handling',
    category: 'Automation',
    icon: <Zap className="h-5 w-5" />,
    difficulty: 'Intermediate',
    tags: ['Node.js', 'Automation', 'CLI'],
    files: [
      {
        name: 'CLAUDE.md',
        path: '/CLAUDE.md',
        content: `# Automation Scripts

## Purpose
Collection of scripts for automating common tasks.

## Structure
- \`scripts/\` - Individual automation scripts
- \`lib/\` - Shared utilities
- \`config/\` - Configuration files

## Running Scripts
\`\`\`bash
node scripts/script-name.js
\`\`\`

## Adding New Scripts
1. Create script in \`scripts/\`
2. Add any shared utilities to \`lib/\`
3. Document usage in script header
4. Add to README

## Error Handling
- Always use try/catch
- Log errors clearly
- Exit with appropriate codes
- Clean up resources on failure

## Best Practices
- Idempotent operations
- Dry-run mode support
- Progress logging
- Configuration via env vars`,
      },
      {
        name: '.claudeignore',
        path: '/.claudeignore',
        content: `node_modules/
.env
logs/
output/
*.log`,
      },
    ],
  },
  {
    id: 'cli-tool',
    name: 'CLI Tool',
    description: 'Build command-line tools with argument parsing and interactive prompts',
    category: 'CLI',
    icon: <Terminal className="h-5 w-5" />,
    difficulty: 'Advanced',
    tags: ['Node.js', 'CLI', 'Commander'],
    files: [
      {
        name: 'CLAUDE.md',
        path: '/CLAUDE.md',
        content: `# CLI Tool Project

## Overview
This is a CLI tool built with Node.js using Commander.js and Inquirer.js.

## Installation
\`\`\`bash
npm install
npm link  # Makes command available globally
\`\`\`

## Usage
\`\`\`bash
my-cli --help
my-cli command [options]
\`\`\`

## Architecture
- \`src/index.ts\` - Entry point
- \`src/commands/\` - Individual commands
- \`src/lib/\` - Shared utilities
- \`src/types/\` - TypeScript types

## Adding Commands
1. Create command in \`src/commands/\`
2. Register in main program
3. Add tests
4. Update help text

## Testing
\`\`\`bash
npm test
npm run test:e2e
\`\`\`

## Guidelines
- Provide helpful error messages
- Support both flags and prompts
- Use colors for better UX
- Write comprehensive help text`,
      },
      {
        name: 'package.json',
        path: '/package.json',
        content: `{
  "name": "my-cli",
  "version": "1.0.0",
  "bin": {
    "my-cli": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "test": "jest"
  },
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.0.0",
    "chalk": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}`,
      },
    ],
  },
  {
    id: 'react-component-library',
    name: 'React Component Library',
    description: 'Build and document reusable React components with Storybook',
    category: 'Library',
    icon: <Layout className="h-5 w-5" />,
    difficulty: 'Advanced',
    tags: ['React', 'Storybook', 'TypeScript'],
    files: [
      {
        name: 'CLAUDE.md',
        path: '/CLAUDE.md',
        content: `# React Component Library

## Overview
A reusable component library built with React and documented with Storybook.

## Development
\`\`\`bash
npm install
npm run storybook  # View components
npm run build      # Build library
\`\`\`

## Structure
- \`src/components/\` - Component source
- \`src/stories/\` - Storybook stories
- \`src/hooks/\` - Custom hooks
- \`src/utils/\` - Utilities

## Creating Components
1. Create component in \`src/components/\`
2. Export from \`src/index.ts\`
3. Add story in \`src/stories/\`
4. Write tests

## Component Guidelines
- Use TypeScript for all components
- Include prop types with JSDoc
- Support theming via CSS variables
- Ensure accessibility (ARIA)
- Mobile-first responsive design

## Testing
\`\`\`bash
npm test
npm run test:a11y
\`\`\``,
      },
    ],
  },
  {
    id: 'express-api',
    name: 'Express API',
    description: 'RESTful API template with authentication, validation, and database setup',
    category: 'Backend',
    icon: <Server className="h-5 w-5" />,
    difficulty: 'Intermediate',
    tags: ['Node.js', 'Express', 'REST'],
    files: [
      {
        name: 'CLAUDE.md',
        path: '/CLAUDE.md',
        content: `# Express API

## Overview
RESTful API built with Express.js and TypeScript.

## Setup
\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\`

## Structure
- \`src/routes/\` - API routes
- \`src/controllers/\` - Route handlers
- \`src/services/\` - Business logic
- \`src/models/\` - Database models
- \`src/middleware/\` - Custom middleware

## API Conventions
- REST naming conventions
- JSON responses
- Proper HTTP status codes
- Input validation

## Authentication
- JWT-based auth
- Refresh tokens
- Role-based access

## Database
- Migrations in \`migrations/\`
- Seeds in \`seeds/\`

## Testing
\`\`\`bash
npm test
npm run test:integration
\`\`\``,
      },
    ],
  },
]

const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [copiedFile, setCopiedFile] = useState<string | null>(null)

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === selectedCategory)

  const handleCopy = async (content: string, fileId: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedFile(fileId)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const handleDownloadAll = (template: Template) => {
    template.files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
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
            Project Templates Gallery
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Ready-to-use project templates with CLAUDE.md and configuration files
          </p>
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

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(
                      template.difficulty
                    )}`}
                  >
                    {template.difficulty}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setExpandedTemplate(
                        expandedTemplate === template.id ? null : template.id
                      )
                    }
                    className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {expandedTemplate === template.id ? 'Hide Files' : 'View Files'}
                  </button>
                  <button
                    onClick={() => handleDownloadAll(template)}
                    className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Expanded Files Section */}
              {expandedTemplate === template.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Included Files
                  </h4>
                  <div className="space-y-3">
                    {template.files.map((file) => (
                      <div
                        key={file.path}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                              {file.name}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleCopy(file.content, `${template.id}-${file.path}`)
                            }
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {copiedFile === `${template.id}-${file.path}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <pre className="p-3 text-xs overflow-x-auto max-h-48 text-gray-700 dark:text-gray-300">
                          <code>{file.content}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback Note */}
        <div className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Have a template idea?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                We're always looking to add useful templates. Share your ideas and we may include them in a future update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
