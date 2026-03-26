import { MetadataRoute } from 'next'
import { getAllTracks, getAllContent } from '@/lib/mdx'
import { getAllBlogPosts } from '@/lib/blog'
import { siteConfig } from '@/lib/metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/claude-md-generator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/slash-commands`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/mcp-explorer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/templates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/cheatsheets`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/snippets`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Track pages — exclude 'blog' directory (handled separately)
  const tracks = getAllTracks().filter((track) => track !== 'blog')
  const trackPages: MetadataRoute.Sitemap = []
  const contentPages: MetadataRoute.Sitemap = []

  for (const track of tracks) {
    const content = getAllContent(track)
    const subArticles = content.filter((item) => item.slug !== 'index')

    // Tracks with sub-articles get higher priority than single-page tracks
    trackPages.push({
      url: `${baseUrl}/${track}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: subArticles.length > 0 ? 0.9 : 0.7,
    })

    for (const item of subArticles) {
      contentPages.push({
        url: `${baseUrl}/${track}/${item.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // Blog posts
  const blogPosts = await getAllBlogPosts()
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...trackPages, ...contentPages, ...blogPages]
}
