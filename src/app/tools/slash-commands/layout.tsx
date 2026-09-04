import { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Slash Commands Reference - Claude Code Quick Commands',
  description:
    'Complete reference for Claude Code slash commands. Find and learn all available commands for file operations, code generation, and workflow automation.',
  keywords: [
    'Claude Code slash commands',
    'Claude Code commands',
    'slash command reference',
    'AI coding commands',
  ],
  alternates: { canonical: `${siteConfig.url}/tools/slash-commands` },
  openGraph: {
    title: 'Slash Commands Reference | Claude Code Learning Hub',
    description:
      'Complete reference for Claude Code slash commands. Find and learn all available commands for file operations, code generation, and workflow automation.',
    url: `${siteConfig.url}/tools/slash-commands`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slash Commands Reference | Claude Code Learning Hub',
    description: 'Complete reference for Claude Code slash commands.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
