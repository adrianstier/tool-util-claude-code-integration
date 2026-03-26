import { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Resources - Curated Tools & Documentation for Claude Code',
  description:
    'A curated collection of resources to help you master Claude Code and AI-powered development. Official documentation, community tools, tutorials, and reference guides.',
  keywords: [
    'Claude Code resources',
    'Claude Code documentation',
    'AI coding resources',
    'Claude Code tools',
    'developer resources',
    'Claude Code community',
    'AI development guides',
    'programming resources',
  ],
  openGraph: {
    title: 'Resources - Curated Tools & Documentation for Claude Code',
    description:
      'A curated collection of resources to help you master Claude Code and AI-powered development. Official docs, community tools, and reference guides.',
    url: `${siteConfig.url}/resources`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Claude Code Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources - Curated Tools & Documentation for Claude Code',
    description:
      'A curated collection of resources to help you master Claude Code and AI-powered development.',
  },
  alternates: {
    canonical: `${siteConfig.url}/resources`,
  },
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
