import { Metadata } from 'next'
import Link from 'next/link'
import { LifeBuoy, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Claude Code Troubleshooting — Fixes for Common Errors',
  description:
    'Fixes for the errors people actually hit in Claude Code: MCP servers failing to connect, configured servers not loading, Shift+Enter submitting early, command not found after install, and context filling up.',
  keywords: [
    'Claude Code troubleshooting',
    'Claude Code MCP server failed to connect',
    'CONNECTION_CLOSED MCP',
    'claude command not found',
    'Claude Code MCP server not showing',
    'Claude Code errors',
    'Claude Code shift enter',
  ],
  openGraph: {
    title: 'Claude Code Troubleshooting | Claude Code Learning Hub',
    description:
      'Fixes for the errors people actually hit in Claude Code, with the diagnosis that leads to each one.',
    url: `${siteConfig.url}/troubleshooting`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Code Troubleshooting',
    description: 'Fixes for the errors people actually hit in Claude Code.',
  },
  alternates: { canonical: `${siteConfig.url}/troubleshooting` },
}

interface Issue {
  id: string
  symptom: string
  error?: string
  area: 'MCP' | 'Install' | 'Terminal' | 'Context' | 'Permissions'
  diagnose: string[]
  fix: string
  code?: string
  note?: string
  href?: string
  hrefLabel?: string
}

const ISSUES: Issue[] = [
  {
    id: 'mcp-connection-closed',
    area: 'MCP',
    symptom: 'An MCP server fails to connect with CONNECTION_CLOSED',
    error: 'Failed to connect — CONNECTION_CLOSED: Connection closed',
    diagnose: [
      'This almost always means the server process started and then exited before completing the MCP handshake. It is rarely a network problem, even though the message sounds like one.',
      'Run the server command yourself in a terminal. If it prints a usage or help message, the command in your config is missing a required subcommand.',
      'If it starts but does slow work before serving — building an index, syncing a database — it may be exceeding the startup timeout.',
    ],
    fix: 'Run the exact command from your config by hand and watch what it does. Pipe an initialize request into it to confirm it answers.',
    code: `echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' | your-mcp-command`,
    note: 'If the server answers here but not in Claude Code, the difference is usually environment variables or a slow startup task rather than the command itself.',
  },
  {
    id: 'mcp-server-not-loading',
    area: 'MCP',
    symptom: 'A configured MCP server never appears, with no error at all',
    diagnose: [
      'Silence, rather than a failure, usually means the config file you edited is not one Claude Code reads.',
      'Claude Code reads MCP servers from ~/.claude.json (user scope) and .mcp.json (project scope).',
      'An mcpServers block placed in ~/.claude/settings.json is ignored — settings.json has no such key, so it fails silently rather than erroring.',
    ],
    fix: 'List what is actually registered, then add the server through the CLI so it lands in the right file.',
    code: `claude mcp list
claude mcp add --scope user <name> <command>
claude mcp add-json --scope user <name> '{"type":"stdio","command":"...","args":[]}'`,
    note: 'This one is worth checking first whenever a server "should" be configured but no tools appear. A file that is never read produces no diagnostics.',
    href: '/mcp/workflows-and-troubleshooting',
    hrefLabel: 'More MCP workflows and fixes',
  },
  {
    id: 'mcp-needs-authentication',
    area: 'MCP',
    symptom: 'A remote MCP server reports "Needs authentication"',
    error: 'Needs authentication',
    diagnose: [
      'HTTP-based MCP servers use OAuth, and the sign-in happens inside an interactive session rather than at config time.',
      'Adding the server to your config is only half the setup.',
    ],
    fix: 'Start Claude Code and run /mcp, then complete the sign-in for the server listed as needing authentication.',
    code: '/mcp',
  },
  {
    id: 'shift-enter-submits',
    area: 'Terminal',
    symptom: 'Pressing Enter for a new line submits a half-written prompt',
    diagnose: [
      'By default your terminal sends Enter straight through, so there is no way to type a second line.',
      'This is the single most common reason a first session feels broken.',
    ],
    fix: 'Run /terminal-setup once. It rebinds Shift+Enter to insert a newline.',
    code: '/terminal-setup',
    href: '/start-here/mac-setup',
    hrefLabel: 'Full setup walkthrough',
  },
  {
    id: 'claude-command-not-found',
    area: 'Install',
    symptom: 'claude: command not found, right after a successful install',
    error: 'zsh: command not found: claude',
    diagnose: [
      'The install succeeded but the directory it installed into is not on your PATH.',
      'A shell that was already open will not pick up a PATH change made during install.',
    ],
    fix: 'Open a new terminal window first. If it still fails, find the binary and add its directory to your PATH.',
    code: `# find it
ls ~/.local/bin/claude /usr/local/bin/claude 2>/dev/null

# add to PATH (zsh)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc`,
  },
  {
    id: 'context-window-full',
    area: 'Context',
    symptom:
      'Answers get vague, or the session warns that context is nearly full',
    diagnose: [
      'Every file read and command output stays in the conversation, so long sessions accumulate material that is no longer relevant.',
      'A session that has drifted across several unrelated tasks is usually carrying all of them at once.',
    ],
    fix: 'Check utilisation with /context, and reset between unrelated tasks with /clear. Keep CLAUDE.md thin, since it is re-read on every task.',
    code: `/context
/clear`,
    href: '/advanced-topics/best-practices',
    hrefLabel: 'Keeping CLAUDE.md thin with playbooks',
  },
  {
    id: 'repeated-permission-prompts',
    area: 'Permissions',
    symptom: 'The same safe command asks for approval over and over',
    diagnose: [
      'Approvals are per-action, so a command you run constantly will keep prompting unless it is allowlisted.',
      'Permission behaviour also depends on your account type — some accounts decide this server-side, so a local workaround may no longer apply.',
    ],
    fix: 'Add the commands you trust to the permissions allowlist in your project settings, rather than disabling permission checks globally.',
    note: 'Prefer narrowing the rule to the specific command over turning the check off. A blanket bypass removes the confirmation on genuinely destructive actions too.',
    href: '/advanced-topics/best-practices',
    hrefLabel: 'Configuring permissions',
  },
  {
    id: 'cdp-cannot-attach',
    area: 'Install',
    symptom: 'Browser automation cannot attach to your already-running Chrome',
    diagnose: [
      'Chrome only accepts the remote debugging port as a launch flag. There is no way to attach to a browser that is already open.',
      'Chrome also refuses the debugging port when pointed at the default profile directory.',
    ],
    fix: 'Launch a second Chrome instance with a debugging port and a separate profile directory. Your normal windows stay untouched.',
    code: `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\
  --remote-debugging-port=9222 \\
  --user-data-dir="$HOME/.chrome-debug-profile"

# verify
curl -s http://127.0.0.1:9222/json/version`,
    note: 'Because the profile is separate, any site you need to be logged into must be signed in again inside that window.',
  },
]

const AREA_STYLE: Record<Issue['area'], string> = {
  MCP: 'bg-cobalt-100 text-cobalt-800 dark:bg-cobalt-900/50 dark:text-cobalt-200',
  Install: 'bg-sage-100 text-sage-800 dark:bg-sage-900/50 dark:text-sage-200',
  Terminal:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  Context: 'bg-plum-100 text-plum-800 dark:bg-plum-900/50 dark:text-plum-200',
  Permissions:
    'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200',
}

export default function TroubleshootingPage() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950">
      <div className="border-b border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ink-600 hover:text-primary-700 dark:text-ink-300 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
              <LifeBuoy className="h-6 w-6 text-primary-700 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-paper-50">
              Troubleshooting
            </h1>
          </div>

          <p className="max-w-2xl text-lg text-ink-600 dark:text-ink-300">
            Errors people actually hit, each with the reasoning that gets you to
            the cause. Most of these look like one kind of problem and turn out
            to be another.
          </p>

          <nav className="mt-6 flex flex-wrap gap-2">
            {ISSUES.map((i) => (
              <a
                key={i.id}
                href={`#${i.id}`}
                className="rounded-lg bg-paper-100 px-3 py-1.5 text-sm text-ink-700 transition-colors hover:bg-primary-100 hover:text-primary-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-primary-900/50 dark:hover:text-primary-300"
              >
                {i.symptom.length > 46
                  ? i.symptom.slice(0, 44) + '…'
                  : i.symptom}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {ISSUES.map((issue) => (
            <article
              key={issue.id}
              id={issue.id}
              className="scroll-mt-24 rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 className="font-display text-xl font-bold text-ink-900 dark:text-paper-50">
                  {issue.symptom}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${AREA_STYLE[issue.area]}`}
                >
                  {issue.area}
                </span>
              </div>

              {issue.error && (
                <pre
                  tabIndex={0}
                  role="group"
                  aria-label="Error message, scrollable"
                  className="mb-4 overflow-x-auto rounded-lg bg-ink-950 p-4 text-sm text-red-300"
                >
                  <code>{issue.error}</code>
                </pre>
              )}

              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-300">
                What is actually going on
              </h3>
              <ul className="mb-4 list-disc space-y-1.5 pl-5 text-ink-600 dark:text-ink-300">
                {issue.diagnose.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>

              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-300">
                The fix
              </h3>
              <p className="mb-3 text-ink-700 dark:text-ink-200">{issue.fix}</p>

              {issue.code && (
                <pre
                  tabIndex={0}
                  role="group"
                  aria-label="Commands, scrollable"
                  className="mb-3 overflow-x-auto rounded-lg bg-ink-950 p-4 text-sm text-paper-100"
                >
                  <code>{issue.code}</code>
                </pre>
              )}

              {issue.note && (
                <p className="border-l-2 border-amber-400 pl-4 text-sm text-ink-600 dark:text-ink-300">
                  {issue.note}
                </p>
              )}

              {issue.href && (
                <Link
                  href={issue.href}
                  className="mt-4 inline-block text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
                >
                  {issue.hrefLabel} →
                </Link>
              )}
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-paper-50">
            Still stuck?
          </h2>
          <p className="text-ink-600 dark:text-ink-300">
            The MCP track has a longer troubleshooting section covering server
            configuration in depth, and{' '}
            <Link
              href="/whats-new"
              className="text-primary-700 underline underline-offset-2 dark:text-primary-400"
            >
              What&apos;s New
            </Link>{' '}
            is worth checking — behaviour you are working around may have
            changed in a recent release.
          </p>
          <Link
            href="/mcp/workflows-and-troubleshooting"
            className="mt-4 inline-block text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
          >
            MCP workflows and troubleshooting →
          </Link>
        </div>
      </div>
    </div>
  )
}
