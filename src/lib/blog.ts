import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getReadingTime } from './utils'

export interface BlogPost {
  slug: string
  title: string
  description?: string
  date: string
  author?: string
  tags?: string[]
  content: string
  readingTime: number
}

const blogDirectory = path.join(process.cwd(), 'content', 'blog')

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const files = fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, '')
      const filePath = path.join(blogDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        description: data.description,
        date: data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString(),
        author: data.author,
        tags: data.tags || [],
        content,
        readingTime: getReadingTime(content),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts()
  return posts.find((post) => post.slug === slug) || null
}
