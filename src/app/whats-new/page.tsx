import { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowLeft, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/lib/metadata'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: "What's New in Claude Code — Changes That Matter",
  description:
    "A plain-English digest of recent Claude Code releases: what changed, and what it actually means for how you work. Updated as new versions ship.",
  keywords: [
    'Claude Code changelog',
    "Claude Code what's new",
    'Claude Code updates',
    'Claude Code new features',
    'Claude Code release notes',
    'Claude Code version history',
  ],
  openGraph: {
    title: "What's New in Claude Code | Claude Code Learning Hub",
    description:
      'A plain-English digest of recent Claude Code releases and what they mean for your workflow.',
    url: `${siteConfig.url}/whats-new`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "What's New in Claude Code",
    description:
      'What changed in recent Claude Code releases, and what it means for how you work.',
  },
  alternates: { canonical: `${siteConfig.url}/whats-new` },
}

/**
 * Each entry is our own summary of a change plus, more importantly, what it
 * changes about the way you work. Anthropic's changelog says what shipped;
 * this says whether you should care.
 */
interface Change {
  title: string
  category: 'config' | 'workflow' | 'safety' | 'extend' | 'models'
  what: string
  meaning: string
  href?: string
  hrefLabel?: string
}

const CATEGORY_LABEL: Record<Change['category'], string> = {
  config: 'Configuration',
  workflow: 'Everyday workflow',
  safety: 'Permissions & safety',
  extend: 'Extending Claude Code',
  models: 'Models & effort',
}

const CATEGORY_STYLE: Record<Change['category'], string> = {
  config:
    'bg-cobalt-100 text-cobalt-800 dark:bg-cobalt-900/50 dark:text-cobalt-200',
  workflow:
    'bg-sage-100 text-sage-800 dark:bg-sage-900/50 dark:text-sage-200',
  safety:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  extend: 'bg-plum-100 text-plum-800 dark:bg-plum-900/50 dark:text-plum-200',
  models:
    'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200',
}

const CHANGES: Change[] = [
  {
    title: 'AGENTS.md now works without a CLAUDE.md',
    category: 'config',
    what: 'Projects that use the cross-tool AGENTS.md convention are read directly, rather than needing a CLAUDE.md to exist first.',
    meaning:
      'If you work in a repo shared with people on other AI coding tools, you can keep one instructions file instead of maintaining two that drift apart. If your project already has a CLAUDE.md, nothing changes for you.',
    href: '/advanced-topics/best-practices',
    hrefLabel: 'How project instructions are read',
  },
  {
    title: 'Auto mode moved to a server-side classifier',
    category: 'safety',
    what: 'For Claude API and Enterprise accounts, the decision about which actions need approval is now made server-side, and /status shows where that classifier is running.',
    meaning:
      'Permission prompts get more consistent between machines, because the decision no longer depends on your local build. If you have been tuning permission rules by hand, re-check them — the behaviour you were working around may be gone.',
    href: '/advanced-topics/best-practices',
    hrefLabel: 'Configuring permissions',
  },
  {
    title: 'Per-command allowed domains for sandboxed runs',
    category: 'safety',
    what: 'A sandboxed command can be granted its own list of reachable domains instead of inheriting one blanket network policy.',
    meaning:
      'The practical win is letting a build step reach your package registry without opening the whole network for everything else. This is the setting to reach for instead of disabling the sandbox.',
  },
  {
    title: 'Bash results now include a file diff',
    category: 'workflow',
    what: 'When a command changes files, the result shows what changed rather than only the command output.',
    meaning:
      'You can see the effect of a script without running git diff yourself, which matters most when a command does more than you expected and you want to catch it immediately.',
  },
  {
    title: 'Ctrl+Enter sends the current turn',
    category: 'workflow',
    what: 'A dedicated send key interrupts and submits, separate from Enter.',
    meaning:
      'Useful once you have run /terminal-setup and rebound Shift+Enter to newline — you get an explicit send that does not depend on where the cursor sits.',
    href: '/start-here/mac-setup',
    hrefLabel: 'Run /terminal-setup first',
  },
  {
    title: '/output-style switches how responses are written',
    category: 'workflow',
    what: 'A command for changing output style without editing configuration files.',
    meaning:
      'Worth knowing if you switch between exploratory work and writing that goes into a document, where you want different verbosity from the same session.',
  },
  {
    title: 'maxEffortLevel caps reasoning across providers',
    category: 'models',
    what: 'A setting that bounds how much reasoning effort any request may use, for every provider.',
    meaning:
      'This is a cost and latency control. If you have people on a shared plan running long agentic sessions, this is the lever that stops a single task spending far more than intended.',
    href: '/advanced-topics/productivity-features',
    hrefLabel: 'Effort control and thinking modes',
  },
  {
    title: 'claude plugin eval scores a plugin',
    category: 'extend',
    what: 'A command that runs an evaluation suite against a plugin and reports how it performed.',
    meaning:
      'Plugins have been testable only by using them. If you maintain one, this is the difference between "it seemed fine" and a result you can check before publishing.',
    href: '/advanced-topics/plugins-and-hooks',
    hrefLabel: 'Plugins and hooks',
  },
  {
    title: 'Skills and plugins sync from your claude.ai account',
    category: 'extend',
    what: 'Skills and plugins associated with your account are pulled down rather than installed separately on each machine.',
    meaning:
      'Setting up a second machine, or a remote box, stops being a manual re-install of everything you built. Worth checking what syncs before you assume a machine is configured.',
    href: '/advanced-topics/skills',
    hrefLabel: 'Working with skills',
  },
  {
    title: 'Fast mode reaches Remote Control sessions',
    category: 'models',
    what: 'Fast mode, which speeds up output without dropping to a smaller model, now works in Remote Control.',
    meaning:
      'Relevant if you drive Claude Code from your phone or another machine — the remote session no longer feels slower than the one on your desk.',
    href: '/start-here/voice-and-remote',
    hrefLabel: 'Voice and remote control',
  },
  {
    title: 'A warning when memory runs critically low',
    category: 'workflow',
    what: 'Sessions now warn before memory exhaustion rather than failing without explanation.',
    meaning:
      'Long agentic runs on large repositories were the usual way to hit this. The warning gives you a chance to clear context before losing the session.',
  },
]

export default function WhatsNewPage() {
  const byCategory = CHANGES.reduce(
    (acc, c) => {
      ;(acc[c.category] ||= []).push(c)
      return acc
    },
    {} as Record<Change['category'], Change[]>
  )
  const categories = Object.keys(byCategory) as Change['category'][]

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950">
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
              <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-paper-50">
              What&apos;s New in Claude Code
            </h1>
          </div>

          <p className="max-w-2xl text-lg text-ink-600 dark:text-ink-300">
            Claude Code ships constantly, and the official release notes are
            written for people who already know what every line refers to. This
            page covers the changes worth knowing about and, for each one, what
            it changes about the way you work.
          </p>

          <p className="mt-4 text-sm text-ink-500 dark:text-ink-400">
            Covering releases through <strong>2.1.278</strong> · last reviewed{' '}
            <time dateTime="2026-09-21">21 September 2026</time> ·{' '}
            <a
              href="https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-400"
            >
              official changelog
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {categories.map((cat) => (
          <section key={cat} className="mb-12">
            <h2
              id={cat}
              className="mb-6 scroll-mt-24 text-xl font-bold text-ink-900 dark:text-paper-50"
            >
              {CATEGORY_LABEL[cat]}
            </h2>

            <div className="space-y-4">
              {byCategory[cat].map((c) => (
                <article
                  key={c.title}
                  className="rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-paper-50">
                      {c.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLE[c.category]}`}
                    >
                      {CATEGORY_LABEL[c.category]}
                    </span>
                  </div>

                  <p className="mb-3 text-ink-600 dark:text-ink-300">
                    {c.what}
                  </p>

                  <p className="border-l-2 border-primary-400 pl-4 text-ink-700 dark:text-ink-200">
                    <strong className="font-semibold">What it means: </strong>
                    {c.meaning}
                  </p>

                  {c.href && (
                    <Link
                      href={c.href}
                      className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {c.hrefLabel} →
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-xl border border-ink-100 bg-white p-8 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-2 font-display text-xl font-bold text-ink-900 dark:text-paper-50">
            Get this as it happens
          </h2>
          <p className="mb-6 text-ink-600 dark:text-ink-300">
            We read the release notes so you don&apos;t have to, and send a
            short digest when something actually changes how you work. No
            release-note dumps.
          </p>
          <NewsletterSignup />
        </div>
      </div>
    </div>
  )
}
