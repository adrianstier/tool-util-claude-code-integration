import { getAllContent, getContentBySlug } from './mdx'
import { ALL_TRACK_SLUGS, TRACK_NAMES } from './constants'

/**
 * A search entry as it crosses the server/client boundary.
 *
 * Icons cannot be serialized, so entries carry an `iconKey` that SearchModal
 * maps to a Lucide component. Content entries are derived from the MDX files
 * at build time, so new articles appear in search automatically.
 */
export interface SearchIndexItem {
  title: string
  description: string
  href: string
  category: string
  iconKey: string
}

/** Track slug -> icon key used by SearchModal. */
const TRACK_ICONS: Record<string, string> = {
  'start-here': 'rocket',
  'data-analysis': 'chart',
  'app-builder': 'hammer',
  automation: 'zap',
  'git-github': 'code',
  agents: 'brain',
  mcp: 'server',
  'advanced-topics': 'file',
}

/**
 * Build the content half of the search index from content/*.
 * Includes each track landing page plus every article in it.
 */
export function getContentSearchItems(): SearchIndexItem[] {
  const items: SearchIndexItem[] = []

  for (const track of ALL_TRACK_SLUGS) {
    const iconKey = TRACK_ICONS[track] ?? 'file'
    const index = getContentBySlug(track, 'index')

    items.push({
      title: index?.frontmatter.title || TRACK_NAMES[track] || track,
      description: index?.frontmatter.description || '',
      href: `/${track}`,
      category: 'Learning Tracks',
      iconKey,
    })

    for (const article of getAllContent(track)) {
      if (article.slug === 'index') continue
      items.push({
        title: article.frontmatter.title,
        description: article.frontmatter.description || '',
        href: `/${track}/${article.slug}`,
        category: 'Learning Tracks',
        iconKey,
      })
    }
  }

  return items
}
