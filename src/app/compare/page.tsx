import { Metadata } from 'next'
import Link from 'next/link'
import { GitCompare, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Claude Code vs Cursor, Copilot & Codex — Which to Use When',
  description:
    'An honest comparison of Claude Code, Cursor, GitHub Copilot and Codex: how each one is shaped, what it is genuinely best at, and when to use more than one.',
  keywords: [
    'Claude Code vs Cursor',
    'Claude Code vs Copilot',
    'Claude Code vs Codex',
    'best AI coding tool',
    'AI coding assistant comparison',
    'Cursor alternative',
  ],
  openGraph: {
    title: 'Claude Code vs Cursor, Copilot & Codex | Claude Code Learning Hub',
    description:
      'How each AI coding tool is shaped, what it is best at, and when to use more than one.',
    url: `${siteConfig.url}/compare`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Code vs Cursor, Copilot & Codex',
    description: 'Which AI coding tool to use, and when.',
  },
  alternates: { canonical: `${siteConfig.url}/compare` },
}

interface Tool {
  id: string
  name: string
  shape: string
  bestAt: string[]
  weakAt: string[]
  reachFor: string
}

const TOOLS: Tool[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    shape:
      'A terminal agent. It runs commands, reads and writes files, and works through multi-step tasks on its own, with your approval at each risky step. The editor integration is a surface on top of that, not the core.',
    bestAt: [
      'Multi-file changes where the work spans a whole repository',
      'Tasks that need to run something — tests, scripts, migrations, git',
      'Long tasks you describe once and check afterwards',
      'Work outside a codebase entirely: data pipelines, documents, system setup',
    ],
    weakAt: [
      'Inline autocomplete as you type — that is not what it is for',
      'Anything where you want to stay in a GUI and never see a terminal',
    ],
    reachFor:
      'You can describe the outcome and would rather review a result than drive each step.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    shape:
      'An editor, forked from VS Code, with AI built into the editing surface. The centre of gravity is the file you are looking at.',
    bestAt: [
      'Staying in a visual editing loop with AI close at hand',
      'Fast inline edits with immediate visible diffs',
      'People who want an IDE first and an agent second',
    ],
    weakAt: [
      'Long autonomous runs that touch many files and run commands',
      'Work that is not editing code in an editor',
    ],
    reachFor:
      'You are actively writing code and want help at the cursor rather than a delegate.',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    shape:
      'Primarily a completion engine that lives inside your existing editor, with chat and agent features layered on. It predicts what you were about to write.',
    bestAt: [
      'Autocomplete that removes typing without breaking your flow',
      'Working inside an editor setup you already have and do not want to replace',
      'Teams already standardised on GitHub tooling',
    ],
    weakAt: [
      'Reasoning across a repository before making a decision',
      'Running and verifying its own work end to end',
    ],
    reachFor:
      'You know exactly what to write and want to write it faster.',
  },
  {
    id: 'codex',
    name: 'Codex',
    shape:
      "OpenAI's coding agent, available as a CLI and in their cloud surfaces. Architecturally it is the closest of these to Claude Code: describe a task, let it work.",
    bestAt: [
      'Delegated coding tasks, much like Claude Code',
      'Teams already invested in the OpenAI ecosystem',
      'A useful second opinion on the same problem',
    ],
    weakAt: [
      'Differences here are mostly about ecosystem and model behaviour rather than shape',
    ],
    reachFor:
      'You want an agent and your tooling, billing or models already sit with OpenAI.',
  },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950">
      <div className="border-b border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ink-600 hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
              <GitCompare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-paper-50">
              Claude Code vs Cursor, Copilot &amp; Codex
            </h1>
          </div>

          <p className="max-w-2xl text-lg text-ink-600 dark:text-ink-300">
            These tools are shaped differently, and the shape matters more than
            any feature list. Feature parity changes month to month; how a tool
            expects you to work changes rarely.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-xl border-l-4 border-primary-500 bg-white p-6 dark:bg-ink-900">
          <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-paper-50">
            The short answer
          </h2>
          <p className="text-ink-600 dark:text-ink-300">
            The real split is <strong>completion versus delegation</strong>.
            Copilot and Cursor are strongest when you are the one writing and
            want help at the cursor. Claude Code and Codex are strongest when
            you can describe an outcome and would rather review the result.
            Plenty of people run one of each, and that is a reasonable answer
            rather than a fence-sit.
          </p>
        </div>

        <div className="space-y-8">
          {TOOLS.map((tool) => (
            <article
              key={tool.id}
              id={tool.id}
              className="scroll-mt-24 rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900"
            >
              <h2 className="mb-3 font-display text-xl font-bold text-ink-900 dark:text-paper-50">
                {tool.name}
              </h2>

              <p className="mb-5 text-ink-600 dark:text-ink-300">
                {tool.shape}
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sage-700 dark:text-sage-400">
                    Strongest at
                  </h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-600 dark:text-ink-300">
                    {tool.bestAt.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    Not what it is for
                  </h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-600 dark:text-ink-300">
                    {tool.weakAt.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-5 border-l-2 border-primary-400 pl-4 text-ink-700 dark:text-ink-200">
                <strong className="font-semibold">Reach for it when: </strong>
                {tool.reachFor}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-lg font-bold text-ink-900 dark:text-paper-50">
            A note on fairness
          </h2>
          <p className="mb-4 text-ink-600 dark:text-ink-300">
            This site teaches Claude Code, so treat the framing accordingly. We
            have tried to describe each tool as its makers intend it rather than
            setting up easy contrasts. Specific capabilities move fast, so
            anything stated here as a limitation is worth re-checking before you
            make a decision on it.
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <Link
              href="/advanced-topics/mcp-and-cursor"
              className="text-primary-600 underline underline-offset-2 dark:text-primary-400"
            >
              Using Claude Code alongside Cursor →
            </Link>
            <Link
              href="/start-here/claude-code-vs-web"
              className="text-primary-600 underline underline-offset-2 dark:text-primary-400"
            >
              Claude Code vs Claude on the web →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
