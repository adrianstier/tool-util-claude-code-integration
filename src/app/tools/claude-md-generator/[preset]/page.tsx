import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FileText, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/lib/metadata'
import { PRESETS, getPreset, fullPreset } from '@/lib/claude-md-presets'
import CopyButton from '@/components/CopyButton'

export function generateStaticParams() {
  return PRESETS.map((p) => ({ preset: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ preset: string }>
}): Promise<Metadata> {
  const { preset: slug } = await params
  const preset = getPreset(slug)
  if (!preset) return {}

  const title = `CLAUDE.md for ${preset.name} — Ready-Made Template`
  const description = `A complete CLAUDE.md starting point for a ${preset.name} project: commands, architecture, conventions and a playbook routing table. Copy it, fill in the placeholders, commit it.`

  return {
    title,
    description,
    keywords: [
      `CLAUDE.md ${preset.name}`,
      `CLAUDE.md template ${preset.name}`,
      'CLAUDE.md example',
      'Claude Code project instructions',
      ...preset.stack,
    ],
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tools/claude-md-generator/${preset.slug}`,
      siteName: siteConfig.name,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${siteConfig.url}/tools/claude-md-generator/${preset.slug}`,
    },
  }
}

export default async function PresetPage({
  params,
}: {
  params: Promise<{ preset: string }>
}) {
  const { preset: slug } = await params
  const preset = getPreset(slug)
  if (!preset) notFound()

  const file = fullPreset(preset)
  const others = PRESETS.filter((p) => p.slug !== preset.slug)

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950">
      <div className="border-b border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/tools/claude-md-generator"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ink-600 hover:text-primary-700 dark:text-ink-300 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" />
            CLAUDE.md generator
          </Link>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
              <FileText className="h-6 w-6 text-primary-700 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-paper-50">
              CLAUDE.md for {preset.name}
            </h1>
          </div>

          <p className="max-w-2xl text-lg text-ink-600 dark:text-ink-300">
            {preset.tagline}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {preset.stack.map((s) => (
              <span
                key={s}
                className="rounded-full bg-paper-100 px-3 py-1 text-xs font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border-l-4 border-primary-500 bg-white p-6 dark:bg-ink-900">
          <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-paper-50">
            How to use this
          </h2>
          <p className="text-ink-600 dark:text-ink-300">
            Save it as <code>CLAUDE.md</code> in your repository root and
            replace the placeholders in angle brackets. Claude reads it before
            every task, so keep it short — the <strong>Playbooks</strong> table
            at the bottom is how you add detail without paying for it on every
            unrelated request.
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-paper-50">
            The file
          </h2>
          <CopyButton text={file} filename="CLAUDE.md" />
        </div>

        <pre
          tabIndex={0}
          role="group"
          aria-label="CLAUDE.md file contents, scrollable"
          className="mb-8 overflow-x-auto rounded-xl bg-ink-950 p-6 text-sm leading-relaxed text-paper-100"
        >
          <code>{file}</code>
        </pre>

        <section className="mb-8 rounded-xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-lg font-bold text-ink-900 dark:text-paper-50">
            The playbooks it expects
          </h2>
          <p className="mb-4 text-ink-600 dark:text-ink-300">
            The routing table points at files that don&apos;t exist yet. Create
            them as you need them — each one holds a procedure too long to sit
            in CLAUDE.md and too rare to justify the context cost.
          </p>
          <ul className="space-y-2">
            {preset.playbooks.map((p) => (
              <li
                key={p.file}
                className="flex flex-wrap items-baseline gap-x-3 text-ink-700 dark:text-ink-200"
              >
                <code className="rounded bg-paper-100 px-2 py-0.5 text-sm dark:bg-ink-800">
                  .claude/playbooks/{p.file}
                </code>
                <span className="text-sm text-ink-600 dark:text-ink-300">
                  {p.when}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/advanced-topics/best-practices"
            className="mt-4 inline-block text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
          >
            Why CLAUDE.md should stay thin →
          </Link>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-ink-900 dark:text-paper-50">
            Other starting points
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/tools/claude-md-generator/${p.slug}`}
                className="rounded-xl border border-ink-100 bg-white p-5 transition-colors hover:border-primary-400 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-primary-600"
              >
                <h3 className="mb-1 font-display font-semibold text-ink-900 dark:text-paper-50">
                  {p.name}
                </h3>
                <p className="text-sm text-ink-600 dark:text-ink-300">
                  {p.tagline}
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-ink-600 dark:text-ink-300">
            Need something else?{' '}
            <Link
              href="/tools/claude-md-generator"
              className="font-medium text-primary-700 hover:underline dark:text-primary-400"
            >
              Build one from scratch with the generator
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
