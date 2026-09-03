'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lightbulb, CheckCircle2 } from 'lucide-react'

interface ProjectConfig {
  projectName: string
  projectType: string
  language: string
  framework: string
  description: string
  keyFiles: string
  avoidFiles: string
  codingStyle: string
  testingApproach: string
  specialInstructions: string
}

const projectTypes = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'api', label: 'REST API' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'r-tidyverse', label: 'R/Tidyverse Analysis' },
  { value: 'python-research', label: 'Python Research Project' },
  { value: 'mixed-methods', label: 'Mixed Methods Study' },
  { value: 'ecological-modeling', label: 'Ecological Modeling' },
  { value: 'cli-tool', label: 'CLI Tool' },
  { value: 'library', label: 'Library/Package' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'desktop', label: 'Desktop App' },
]

const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'other', label: 'Other' },
]

const frameworks = {
  typescript: ['Next.js', 'React', 'Express', 'NestJS', 'Remix'],
  javascript: ['Next.js', 'React', 'Vue', 'Express', 'Svelte'],
  python: ['Django', 'FastAPI', 'Flask', 'Pandas/NumPy', 'Streamlit', 'Scikit-learn', 'PyTorch', 'Jupyter', 'None'],
  r: ['Tidyverse', 'Shiny', 'Plumber', 'ggplot2', 'RMarkdown', 'Quarto', 'lme4/Mixed Models', 'sf/Spatial', 'None'],
  go: ['Gin', 'Echo', 'Fiber', 'None'],
  rust: ['Actix', 'Rocket', 'Axum', 'None'],
  java: ['Spring Boot', 'Quarkus', 'Micronaut', 'None'],
  other: ['MATLAB', 'Stata', 'SAS', 'Julia', 'None'],
}

export default function ClaudeMdGenerator() {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: '',
    projectType: 'web-app',
    language: 'typescript',
    framework: '',
    description: '',
    keyFiles: '',
    avoidFiles: '',
    codingStyle: '',
    testingApproach: '',
    specialInstructions: '',
  })

  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  const generateClaudeMd = () => {
    const frameworkText = config.framework ? `${config.framework} ` : ''

    const content = `# ${config.projectName}

${config.description}

## Project Structure

This is a ${projectTypes.find(t => t.value === config.projectType)?.label} built with ${frameworkText}${languages.find(l => l.value === config.language)?.label}.

## Key Files & Directories

${config.keyFiles || 'Please add information about important files and directories.'}

## Development Guidelines

### Coding Style

${config.codingStyle || `- Follow ${config.language} best practices
- Write clear, self-documenting code
- Use meaningful variable and function names
- Keep functions small and focused`}

### Testing Approach

${config.testingApproach || `- Write tests before implementation (TDD)
- Aim for high test coverage
- Test edge cases and error conditions`}

## Files to Avoid

${config.avoidFiles || `- node_modules/
- .env files
- Build artifacts (dist/, build/)
- Log files`}

## Special Instructions

${config.specialInstructions || 'No special instructions.'}

## Working with Claude Code

### Preferred Workflow

1. **Explore**: First understand the codebase
2. **Plan**: Discuss the approach before coding
3. **Code**: Implement with tests
4. **Commit**: Use conventional commits

### Git Workflow

- Use Claude for 90% of git operations
- Create descriptive commit messages
- Branch naming: feature/*, bugfix/*, docs/*

### Communication Style

- Ask clarifying questions before implementing
- Explain technical decisions
- Suggest improvements when relevant
- Point out potential issues proactively

---

*Generated with Claude Code Learning Hub - [https://your-site.com/tools/claude-md-generator](https://your-site.com/tools/claude-md-generator)*
`

    setGenerated(content)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([generated], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CLAUDE.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">CLAUDE.md Generator</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          CLAUDE.md Generator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Create a customized CLAUDE.md file for your project. This file helps Claude Code understand your project structure, preferences, and workflows.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Project Configuration</h2>

          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={config.projectName}
                onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                placeholder="my-awesome-project"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Project Type *
              </label>
              <select
                value={config.projectType}
                onChange={(e) => setConfig({ ...config, projectType: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              >
                {projectTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Primary Language *
              </label>
              <select
                value={config.language}
                onChange={(e) => setConfig({ ...config, language: e.target.value, framework: '' })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Framework */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Framework
              </label>
              <select
                value={config.framework}
                onChange={(e) => setConfig({ ...config, framework: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              >
                <option value="">Select framework...</option>
                {frameworks[config.language as keyof typeof frameworks]?.map((fw) => (
                  <option key={fw} value={fw}>
                    {fw}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Project Description
              </label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="A brief description of what your project does..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              />
            </div>

            {/* Key Files */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Key Files & Directories
              </label>
              <textarea
                value={config.keyFiles}
                onChange={(e) => setConfig({ ...config, keyFiles: e.target.value })}
                placeholder="- src/: Main application code&#10;- tests/: Test files&#10;- config/: Configuration files"
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 font-mono text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              />
            </div>

            {/* Avoid Files */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Files to Avoid
              </label>
              <textarea
                value={config.avoidFiles}
                onChange={(e) => setConfig({ ...config, avoidFiles: e.target.value })}
                placeholder="- node_modules/&#10;- .env&#10;- dist/"
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 font-mono text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              />
            </div>

            {/* Coding Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Coding Style Preferences
              </label>
              <textarea
                value={config.codingStyle}
                onChange={(e) => setConfig({ ...config, codingStyle: e.target.value })}
                placeholder="- Use functional components in React&#10;- Prefer const over let&#10;- Always use TypeScript types"
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 font-mono text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              />
            </div>

            {/* Testing */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Testing Approach
              </label>
              <textarea
                value={config.testingApproach}
                onChange={(e) => setConfig({ ...config, testingApproach: e.target.value })}
                placeholder="- Use Jest for unit tests&#10;- Playwright for E2E tests&#10;- TDD when adding new features"
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 font-mono text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Special Instructions
              </label>
              <textarea
                value={config.specialInstructions}
                onChange={(e) => setConfig({ ...config, specialInstructions: e.target.value })}
                placeholder="Any additional context or instructions for Claude..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateClaudeMd}
              disabled={!config.projectName}
              className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate CLAUDE.md
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preview</h2>
            {generated && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  Download
                </button>
              </div>
            )}
          </div>

          {generated ? (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
                {generated}
              </pre>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400">
                Fill in the form and click Generate to see your CLAUDE.md file
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-12 rounded-2xl bg-primary-50 dark:bg-gray-800 p-8 border border-primary-200 dark:border-gray-700">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tips for a Great CLAUDE.md</h3>
        </div>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mr-2 text-primary-600 dark:text-primary-400" />
            <span>Be specific about your project structure and key files</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mr-2 text-primary-600 dark:text-primary-400" />
            <span>Include coding conventions and style preferences</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mr-2 text-primary-600 dark:text-primary-400" />
            <span>Mention testing approach and requirements</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mr-2 text-primary-600 dark:text-primary-400" />
            <span>List files and directories to avoid modifying</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mr-2 text-primary-600 dark:text-primary-400" />
            <span>Update CLAUDE.md as your project evolves</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
