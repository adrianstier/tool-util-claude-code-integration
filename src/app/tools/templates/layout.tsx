import { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Project Templates - Starter Configurations for Claude Code',
  description:
    'Browse starter templates for Claude Code projects. Get pre-configured CLAUDE.md files, project structures, and development setups for web apps, CLI tools, and data projects.',
  keywords: [
    'Claude Code templates',
    'project templates',
    'starter configurations',
    'CLAUDE.md templates',
  ],
  alternates: { canonical: `${siteConfig.url}/tools/templates` },
  openGraph: {
    title: 'Project Templates | Claude Code Learning Hub',
    description:
      'Browse starter templates for Claude Code projects. Get pre-configured CLAUDE.md files, project structures, and development setups.',
    url: `${siteConfig.url}/tools/templates`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Templates | Claude Code Learning Hub',
    description:
      'Starter templates for Claude Code projects.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
