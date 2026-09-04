import { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'MCP Server Explorer - Browse Model Context Protocol Servers',
  description:
    'Explore and discover MCP servers for Claude Code. Search, filter, and find the right Model Context Protocol servers for your development workflow.',
  keywords: [
    'MCP servers',
    'Model Context Protocol',
    'MCP explorer',
    'Claude Code plugins',
  ],
  alternates: { canonical: `${siteConfig.url}/tools/mcp-explorer` },
  openGraph: {
    title: 'MCP Server Explorer | Claude Code Learning Hub',
    description:
      'Explore and discover MCP servers for Claude Code. Search, filter, and find the right Model Context Protocol servers for your development workflow.',
    url: `${siteConfig.url}/tools/mcp-explorer`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Server Explorer | Claude Code Learning Hub',
    description: 'Explore and discover MCP servers for Claude Code.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
