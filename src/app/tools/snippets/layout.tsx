import { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Code Snippets - Copy-Paste Examples for Claude Code',
  description:
    'Ready-to-use code snippets for Claude Code workflows. Copy and paste examples for Git operations, Python scripts, data analysis, and more.',
  keywords: [
    'code snippets',
    'Claude Code examples',
    'copy paste code',
    'developer snippets',
  ],
  alternates: { canonical: `${siteConfig.url}/tools/snippets` },
  openGraph: {
    title: 'Code Snippets | Claude Code Learning Hub',
    description:
      'Ready-to-use code snippets for Claude Code workflows. Copy and paste examples for Git operations, Python scripts, data analysis, and more.',
    url: `${siteConfig.url}/tools/snippets`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Snippets | Claude Code Learning Hub',
    description:
      'Ready-to-use code snippets for Claude Code workflows.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
