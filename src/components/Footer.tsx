import Link from 'next/link'
import {
  Rocket,
  BarChart3,
  Hammer,
  Zap,
  Terminal,
  Github,
  BookOpen,
  ExternalLink,
  Bot,
  Plug,
  GraduationCap,
  GitBranch,
} from 'lucide-react'
import NewsletterSignup from './NewsletterSignup'

const footerLinks = {
  learn: [
    { name: 'Start Here', href: '/start-here', icon: Rocket },
    { name: 'Git & GitHub', href: '/git-github', icon: GitBranch },
    { name: 'Data Analysis', href: '/data-analysis', icon: BarChart3 },
    { name: 'App Builder', href: '/app-builder', icon: Hammer },
    { name: 'Automation', href: '/automation', icon: Zap },
    { name: 'AI Agents', href: '/agents', icon: Bot },
    { name: 'MCP Integration', href: '/mcp', icon: Plug },
    { name: 'Advanced Topics', href: '/advanced-topics', icon: GraduationCap },
  ],
  resources: [
    { name: 'Blog & Updates', href: '/blog' },
    { name: 'Glossary', href: '/glossary' },
    { name: 'Tools & Templates', href: '/tools/templates' },
    { name: 'Resources', href: '/resources' },
    {
      name: 'Claude Code Docs',
      href: 'https://docs.claude.com/en/docs/claude-code/overview',
      external: true,
    },
    {
      name: 'VS Code Docs',
      href: 'https://code.visualstudio.com/docs',
      external: true,
    },
  ],
  community: [
    {
      name: 'GitHub',
      href: 'https://github.com/anthropics/claude-code',
      external: true,
    },
    { name: 'Support', href: 'https://support.anthropic.com', external: true },
    { name: 'Anthropic', href: 'https://www.anthropic.com', external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-ink-100 bg-paper-50 dark:border-ink-800 dark:bg-ink-950">
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <NewsletterSignup variant="hero" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="group mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 dark:bg-paper-100">
                <Terminal
                  className="h-5 w-5 text-paper-50 dark:text-ink-900"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <span className="block font-display text-lg font-bold tracking-tight text-ink-900 dark:text-paper-50">
                  Claude Code
                </span>
                <span className="block text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
                  Learning Hub
                </span>
              </div>
            </Link>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Master AI-powered development with Claude Code. Learn to build
              real projects with VS Code, Git/GitHub, Python, and R.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/anthropics/claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-ink-50 text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700 dark:hover:text-paper-50"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://docs.claude.com/en/docs/claude-code/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-ink-50 text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700 dark:hover:text-paper-50"
                aria-label="Documentation"
              >
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Learn Section */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-paper-50">
              Learn
            </h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-ink-600 transition-colors hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400"
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-paper-50">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-sm text-ink-600 transition-colors hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-ink-600 transition-colors hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-paper-50">
              Community
            </h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-ink-600 transition-colors hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-ink-100 pt-8 dark:border-ink-800">
          {/* Disclaimer */}
          <p className="mb-6 text-center text-xs text-ink-600 dark:text-ink-300">
            This is an independent community resource. Not affiliated with or
            endorsed by Anthropic.
          </p>

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-ink-600 dark:text-ink-300">
              &copy; {new Date().getFullYear()} Claude Code Learning.{' '}
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                MIT License
              </a>
            </p>
            <p className="text-xs text-ink-600 dark:text-ink-300">
              Built with Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
