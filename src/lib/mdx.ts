import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getReadingTime } from './utils'
import logger from './logger'

export interface Frontmatter {
  title: string
  description: string
  order?: number
  track?: string
  duration?: string
  prerequisites?: string[]
  platform?: 'mac' | 'windows' | 'both'
  lastUpdated?: string
  /** True when a track's index.mdx is itself the lesson, with no sub-articles. */
  selfContained?: boolean
}

export interface ContentFile {
  slug: string
  frontmatter: Frontmatter
  content: string
  readingTime: number
  lastModified: string
}

const contentDirectory = path.join(process.cwd(), 'content')

/**
 * Get all MDX files in a directory
 */
export function getContentFiles(directory: string): string[] {
  const fullPath = path.join(contentDirectory, directory)

  if (!fs.existsSync(fullPath)) {
    return []
  }

  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
}

/**
 * Get content from an MDX file
 */
export function getContentBySlug(
  directory: string,
  slug: string
): ContentFile | null {
  try {
    const filePath = path.join(
      contentDirectory,
      directory,
      `${slug}.mdx`
    )

    if (!fs.existsSync(filePath)) {
      // Try .md extension
      const mdPath = path.join(contentDirectory, directory, `${slug}.md`)
      if (!fs.existsSync(mdPath)) {
        return null
      }
      const fileContents = fs.readFileSync(mdPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = fs.statSync(mdPath)

      return {
        slug,
        frontmatter: data as Frontmatter,
        content,
        readingTime: getReadingTime(content),
        lastModified: (data as Frontmatter).lastUpdated || stats.mtime.toISOString(),
      }
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const stats = fs.statSync(filePath)

    return {
      slug,
      frontmatter: data as Frontmatter,
      content,
      readingTime: getReadingTime(content),
      lastModified: (data as Frontmatter).lastUpdated || stats.mtime.toISOString(),
    }
  } catch (error) {
    logger.error(`Error reading file ${directory}/${slug}:`, error)
    return null
  }
}

/**
 * Get all content files for a track
 */
export function getAllContent(directory: string): ContentFile[] {
  const files = getContentFiles(directory)

  const content = files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, '')
      return getContentBySlug(directory, slug)
    })
    .filter((item): item is ContentFile => item !== null)

  // Sort by order if available
  return content.sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999
    const orderB = b.frontmatter.order ?? 999
    return orderA - orderB
  })
}

/**
 * Get all tracks
 */
export function getAllTracks(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs
    .readdirSync(contentDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

/**
 * Get track metadata
 */
export function getTrackMetadata(track: string): ContentFile | null {
  return getContentBySlug(track, 'index')
}
