import { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'CLAUDE.md Generator - Create Project Instructions for Claude Code',
  description:
    'Interactive tool to generate CLAUDE.md files for your projects. Configure Claude Code with custom instructions, coding conventions, and project context.',
  keywords: [
    'CLAUDE.md',
    'Claude Code configuration',
    'project instructions',
    'AI coding setup',
  ],
  alternates: { canonical: `${siteConfig.url}/tools/claude-md-generator` },
  openGraph: {
    title: 'CLAUDE.md Generator | Claude Code Learning Hub',
    description:
      'Interactive tool to generate CLAUDE.md files for your projects. Configure Claude Code with custom instructions, coding conventions, and project context.',
    url: `${siteConfig.url}/tools/claude-md-generator`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLAUDE.md Generator | Claude Code Learning Hub',
    description:
      'Interactive tool to generate CLAUDE.md files for your projects.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
