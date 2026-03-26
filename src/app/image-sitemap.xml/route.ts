import { getAllTracks, getAllContent } from '@/lib/mdx'
import { siteConfig } from '@/lib/metadata'

export async function GET() {
  const baseUrl = siteConfig.url
  const tracks = getAllTracks()

  // Collect all page URLs with their associated images
  const pages: { url: string; images: { loc: string; title: string }[] }[] = []

  // Homepage
  pages.push({
    url: baseUrl,
    images: [
      {
        loc: `${baseUrl}/og-image.png`,
        title: 'Claude Code Learning Hub - Master AI-Powered Development',
      },
    ],
  })

  // Track pages
  for (const track of tracks) {
    pages.push({
      url: `${baseUrl}/${track}`,
      images: [
        {
          loc: `${baseUrl}/og-image.png`,
          title: `${track.replace(/-/g, ' ')} - Claude Code Learning Hub`,
        },
      ],
    })

    // Content pages
    const content = getAllContent(track)
    for (const item of content) {
      if (item.slug !== 'index') {
        pages.push({
          url: `${baseUrl}/${track}/${item.slug}`,
          images: [
            {
              loc: `${baseUrl}/og-image.png`,
              title: item.frontmatter.title,
            },
          ],
        })
      }
    }
  }

  // Tool pages with their own images
  const toolPages = [
    { path: '/tools/claude-md-generator', title: 'CLAUDE.md Generator' },
    { path: '/tools/slash-commands', title: 'Slash Commands Library' },
    { path: '/tools/mcp-explorer', title: 'MCP Server Explorer' },
    { path: '/tools/templates', title: 'Project Templates' },
    { path: '/tools/cheatsheets', title: 'Cheatsheets' },
    { path: '/tools/snippets', title: 'Code Snippets' },
  ]

  for (const tool of toolPages) {
    pages.push({
      url: `${baseUrl}${tool.path}`,
      images: [
        {
          loc: `${baseUrl}/og-image.png`,
          title: tool.title,
        },
      ],
    })
  }

  // Additional static pages
  const additionalPages = [
    { path: '/glossary', title: 'Glossary - Programming & AI Development Terms' },
    { path: '/blog', title: 'Blog & Updates - Claude Code Learning Hub' },
    { path: '/authors', title: 'Authors & Contributors - Claude Code Learning Hub' },
  ]

  for (const page of additionalPages) {
    pages.push({
      url: `${baseUrl}${page.path}`,
      images: [
        {
          loc: `${baseUrl}/og-image.png`,
          title: page.title,
        },
      ],
    })
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.url)}</loc>
${page.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
    </image:image>`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
