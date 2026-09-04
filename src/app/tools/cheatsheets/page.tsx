'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Terminal,
  GitBranch,
  Code,
  Database,
  Zap,
  Printer,
  FlaskConical,
  BarChart3,
} from 'lucide-react'

interface CheatSheet {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  sections: CheatSheetSection[]
}

interface CheatSheetSection {
  title: string
  items: CheatSheetItem[]
}

interface CheatSheetItem {
  command: string
  description: string
}

const cheatsheets: CheatSheet[] = [
  {
    id: 'claude-code',
    title: 'Claude Code',
    description: 'Essential Claude Code commands and workflows',
    icon: <Zap className="h-5 w-5" />,
    sections: [
      {
        title: 'Getting Started',
        items: [
          {
            command: 'claude',
            description: 'Start Claude Code in current directory',
          },
          {
            command: 'claude -p "prompt"',
            description: 'Start with an initial prompt',
          },
          {
            command: 'claude --help',
            description: 'Show all available options',
          },
          { command: '/help', description: 'Show help within Claude Code' },
        ],
      },
      {
        title: 'Session Control',
        items: [
          { command: '/clear', description: 'Clear conversation history' },
          {
            command: '/compact',
            description: 'Compact context to save tokens',
          },
          { command: '/exit', description: 'Exit Claude Code' },
          { command: 'Ctrl+C', description: 'Cancel current operation' },
        ],
      },
      {
        title: 'File Operations',
        items: [
          {
            command: '@filename',
            description: 'Reference a file in your prompt',
          },
          { command: '/add file.txt', description: 'Add file to context' },
          {
            command: '/remove file.txt',
            description: 'Remove file from context',
          },
        ],
      },
      {
        title: 'Prompts & Workflows',
        items: [
          { command: '/commit', description: 'Generate commit message' },
          { command: '/review', description: 'Review code changes' },
          { command: '/explain', description: 'Explain selected code' },
          { command: '/refactor', description: 'Suggest refactoring' },
        ],
      },
    ],
  },
  {
    id: 'git',
    title: 'Git Commands',
    description: 'Essential Git commands for version control',
    icon: <GitBranch className="h-5 w-5" />,
    sections: [
      {
        title: 'Setup & Config',
        items: [
          { command: 'git init', description: 'Initialize new repository' },
          {
            command: 'git clone <url>',
            description: 'Clone remote repository',
          },
          {
            command: 'git config user.name "name"',
            description: 'Set username',
          },
          {
            command: 'git config user.email "email"',
            description: 'Set email',
          },
        ],
      },
      {
        title: 'Basic Workflow',
        items: [
          {
            command: 'git status',
            description: 'Check working directory status',
          },
          { command: 'git add .', description: 'Stage all changes' },
          {
            command: 'git commit -m "msg"',
            description: 'Commit with message',
          },
          { command: 'git push', description: 'Push to remote' },
          { command: 'git pull', description: 'Pull from remote' },
        ],
      },
      {
        title: 'Branching',
        items: [
          { command: 'git branch', description: 'List branches' },
          { command: 'git branch <name>', description: 'Create branch' },
          { command: 'git checkout <name>', description: 'Switch branch' },
          {
            command: 'git checkout -b <name>',
            description: 'Create and switch',
          },
          { command: 'git merge <branch>', description: 'Merge branch' },
        ],
      },
      {
        title: 'Inspection',
        items: [
          { command: 'git log --oneline', description: 'View commit history' },
          { command: 'git diff', description: 'Show unstaged changes' },
          { command: 'git diff --staged', description: 'Show staged changes' },
          { command: 'git show <commit>', description: 'Show commit details' },
        ],
      },
      {
        title: 'Undo Changes',
        items: [
          { command: 'git restore <file>', description: 'Discard changes' },
          {
            command: 'git restore --staged <file>',
            description: 'Unstage file',
          },
          {
            command: 'git reset HEAD~1',
            description: 'Undo last commit (keep changes)',
          },
          {
            command: 'git reset --hard HEAD~1',
            description: 'Undo last commit (delete changes)',
          },
        ],
      },
    ],
  },
  {
    id: 'terminal',
    title: 'Terminal / Bash',
    description: 'Common terminal commands for navigation and file management',
    icon: <Terminal className="h-5 w-5" />,
    sections: [
      {
        title: 'Navigation',
        items: [
          { command: 'pwd', description: 'Print working directory' },
          { command: 'ls -la', description: 'List files with details' },
          { command: 'cd <dir>', description: 'Change directory' },
          { command: 'cd ..', description: 'Go up one directory' },
          { command: 'cd ~', description: 'Go to home directory' },
        ],
      },
      {
        title: 'File Operations',
        items: [
          { command: 'touch <file>', description: 'Create empty file' },
          { command: 'mkdir <dir>', description: 'Create directory' },
          { command: 'cp <src> <dst>', description: 'Copy file' },
          { command: 'mv <src> <dst>', description: 'Move/rename file' },
          { command: 'rm <file>', description: 'Delete file' },
          { command: 'rm -rf <dir>', description: 'Delete directory' },
        ],
      },
      {
        title: 'Viewing Files',
        items: [
          { command: 'cat <file>', description: 'Display file contents' },
          { command: 'head -n 10 <file>', description: 'Show first 10 lines' },
          { command: 'tail -n 10 <file>', description: 'Show last 10 lines' },
          { command: 'less <file>', description: 'View file with pagination' },
        ],
      },
      {
        title: 'Search',
        items: [
          { command: 'grep "text" <file>', description: 'Search in file' },
          { command: 'grep -r "text" .', description: 'Search recursively' },
          {
            command: 'find . -name "*.js"',
            description: 'Find files by pattern',
          },
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python / Pandas',
    description: 'Python and pandas quick reference for data analysis',
    icon: <Code className="h-5 w-5" />,
    sections: [
      {
        title: 'Virtual Environment',
        items: [
          {
            command: 'python -m venv venv',
            description: 'Create virtual environment',
          },
          {
            command: 'source venv/bin/activate',
            description: 'Activate (Mac/Linux)',
          },
          {
            command: 'venv\\Scripts\\activate',
            description: 'Activate (Windows)',
          },
          { command: 'deactivate', description: 'Deactivate environment' },
          {
            command: 'pip install -r requirements.txt',
            description: 'Install dependencies',
          },
        ],
      },
      {
        title: 'Pandas Basics',
        items: [
          { command: 'pd.read_csv("file.csv")', description: 'Read CSV file' },
          { command: 'df.head()', description: 'Show first 5 rows' },
          { command: 'df.info()', description: 'Show data types and memory' },
          { command: 'df.describe()', description: 'Summary statistics' },
          { command: 'df.shape', description: 'Get dimensions' },
        ],
      },
      {
        title: 'Data Manipulation',
        items: [
          { command: 'df["col"]', description: 'Select column' },
          {
            command: 'df[["col1", "col2"]]',
            description: 'Select multiple columns',
          },
          { command: 'df.loc[row, col]', description: 'Select by label' },
          { command: 'df.iloc[0:5]', description: 'Select by position' },
          { command: 'df.query("col > 5")', description: 'Filter rows' },
        ],
      },
      {
        title: 'Aggregation',
        items: [
          {
            command: 'df.groupby("col").mean()',
            description: 'Group and aggregate',
          },
          { command: 'df.pivot_table()', description: 'Create pivot table' },
          { command: 'df.value_counts()', description: 'Count unique values' },
        ],
      },
    ],
  },
  {
    id: 'npm',
    title: 'npm / Node.js',
    description: 'npm commands for package management',
    icon: <Database className="h-5 w-5" />,
    sections: [
      {
        title: 'Project Setup',
        items: [
          { command: 'npm init -y', description: 'Initialize new project' },
          { command: 'npm install', description: 'Install all dependencies' },
          { command: 'npm install <pkg>', description: 'Install package' },
          {
            command: 'npm install -D <pkg>',
            description: 'Install dev dependency',
          },
          { command: 'npm uninstall <pkg>', description: 'Remove package' },
        ],
      },
      {
        title: 'Running Scripts',
        items: [
          { command: 'npm start', description: 'Run start script' },
          { command: 'npm run dev', description: 'Run dev script' },
          { command: 'npm run build', description: 'Run build script' },
          { command: 'npm test', description: 'Run tests' },
        ],
      },
      {
        title: 'Package Info',
        items: [
          { command: 'npm list', description: 'List installed packages' },
          { command: 'npm outdated', description: 'Check for updates' },
          { command: 'npm update', description: 'Update packages' },
          { command: 'npm audit', description: 'Check for vulnerabilities' },
        ],
      },
    ],
  },
  {
    id: 'research',
    title: 'Research Workflows',
    description: 'Claude Code prompts for academic research and data analysis',
    icon: <FlaskConical className="h-5 w-5" />,
    sections: [
      {
        title: 'Data Quality',
        items: [
          {
            command: '"Give me a data quality report for [file]"',
            description: 'Assess missing values, outliers, types',
          },
          {
            command: '"Check date format consistency"',
            description: 'Find date formatting issues',
          },
          {
            command: '"Flag potential data entry errors"',
            description: 'Identify anomalies',
          },
          {
            command: '"Create a cleaning log"',
            description: 'Document all data changes',
          },
        ],
      },
      {
        title: 'Analysis',
        items: [
          {
            command: '"Run descriptive statistics by [group]"',
            description: 'Grouped summaries',
          },
          {
            command: '"Check assumptions for [test]"',
            description: 'Verify test requirements',
          },
          {
            command: '"Show me the formula you used"',
            description: 'Verify calculations',
          },
          {
            command: '"Compare to [software] output"',
            description: 'Cross-validate results',
          },
        ],
      },
      {
        title: 'Publication',
        items: [
          {
            command: '"Create publication-ready figure"',
            description: 'Journal-quality output',
          },
          {
            command: '"Format for [journal] style"',
            description: 'Match specific guidelines',
          },
          {
            command: '"Export as LaTeX table"',
            description: 'Manuscript-ready tables',
          },
          {
            command: '"Write figure caption"',
            description: 'Generate proper captions',
          },
        ],
      },
    ],
  },
  {
    id: 'r-tidyverse',
    title: 'R / Tidyverse',
    description: 'R and tidyverse commands for data analysis',
    icon: <BarChart3 className="h-5 w-5" />,
    sections: [
      {
        title: 'Data Import',
        items: [
          { command: 'read_csv("file.csv")', description: 'Read CSV file' },
          {
            command: 'read_excel("file.xlsx")',
            description: 'Read Excel file',
          },
          { command: 'read_rds("file.rds")', description: 'Read R data file' },
          { command: 'glimpse(df)', description: 'Quick data overview' },
        ],
      },
      {
        title: 'Data Wrangling',
        items: [
          { command: 'df %>% filter(col > 5)', description: 'Filter rows' },
          {
            command: 'df %>% select(col1, col2)',
            description: 'Select columns',
          },
          {
            command: 'df %>% mutate(new = col * 2)',
            description: 'Create new column',
          },
          { command: 'df %>% arrange(desc(col))', description: 'Sort data' },
          { command: 'df %>% rename(new = old)', description: 'Rename column' },
        ],
      },
      {
        title: 'Summarization',
        items: [
          {
            command: 'df %>% group_by(cat) %>% summarise(m = mean(x))',
            description: 'Group and summarize',
          },
          { command: 'df %>% count(category)', description: 'Count by group' },
          {
            command: 'df %>% summarise(across(everything(), mean))',
            description: 'Summarize all columns',
          },
        ],
      },
      {
        title: 'ggplot2 Basics',
        items: [
          {
            command: 'ggplot(df, aes(x, y)) + geom_point()',
            description: 'Scatter plot',
          },
          {
            command: 'ggplot(df, aes(x)) + geom_histogram()',
            description: 'Histogram',
          },
          {
            command: 'ggplot(df, aes(cat, y)) + geom_boxplot()',
            description: 'Box plot',
          },
          { command: '+ theme_minimal()', description: 'Clean theme' },
          {
            command: 'ggsave("plot.png", dpi = 300)',
            description: 'Save high-res',
          },
        ],
      },
    ],
  },
]

export default function CheatsheetsPage() {
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)

  const handlePrint = (sheet: CheatSheet) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${sheet.title} Cheat Sheet</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 { font-size: 24px; margin-bottom: 10px; }
            h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            td { padding: 6px; border-bottom: 1px solid #eee; }
            td:first-child { font-family: monospace; font-size: 13px; background: #f5f5f5; width: 40%; }
            td:last-child { font-size: 13px; color: #666; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${sheet.title} Cheat Sheet</h1>
          ${sheet.sections
            .map(
              (section) => `
            <h2>${section.title}</h2>
            <table>
              ${section.items
                .map(
                  (item) => `
                <tr>
                  <td><code>${item.command}</code></td>
                  <td>${item.description}</td>
                </tr>
              `
                )
                .join('')}
            </table>
          `
            )
            .join('')}
        </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Cheat Sheets
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Printable quick reference guides for common commands and workflows
          </p>
        </div>

        {/* Cheat Sheet Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cheatsheets.map((sheet) => (
            <div
              key={sheet.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {sheet.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {sheet.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sheet.sections.length} sections
                    </p>
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {sheet.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedSheet(
                        selectedSheet === sheet.id ? null : sheet.id
                      )
                    }
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {selectedSheet === sheet.id ? 'Hide' : 'View'}
                  </button>
                  <button
                    onClick={() => handlePrint(sheet)}
                    className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {selectedSheet === sheet.id && (
                <div className="max-h-96 overflow-y-auto border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                  {sheet.sections.map((section, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {section.title}
                      </h4>
                      <div className="space-y-1">
                        {section.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <code className="flex-shrink-0 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {item.command}
                            </code>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
