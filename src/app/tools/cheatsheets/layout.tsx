import { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Cheat Sheets - Quick Reference Guides for Development',
  description:
    'Printable cheat sheets for Claude Code, Git, terminal commands, Python, npm, and R. Quick reference guides you can print or bookmark.',
  keywords: [
    'cheat sheets',
    'quick reference',
    'Claude Code cheatsheet',
    'Git cheatsheet',
    'developer reference',
  ],
  alternates: { canonical: `${siteConfig.url}/tools/cheatsheets` },
  openGraph: {
    title: 'Cheat Sheets | Claude Code Learning Hub',
    description:
      'Printable cheat sheets for Claude Code, Git, terminal commands, Python, npm, and R. Quick reference guides you can print or bookmark.',
    url: `${siteConfig.url}/tools/cheatsheets`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cheat Sheets | Claude Code Learning Hub',
    description:
      'Printable cheat sheets for Claude Code, Git, terminal, Python, npm, and R.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
