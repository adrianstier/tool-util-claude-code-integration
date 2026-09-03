import { getAllContent, getContentBySlug } from './mdx'

export interface TrackStats {
  /**
   * Number of published lessons. Normally the sub-articles, but for tracks whose
   * index.mdx is flagged `selfContained` (git-github, automation, app-builder)
   * the landing page is itself a full tutorial and counts as one.
   */
  articles: number
  /** Sum of the `duration` frontmatter, in minutes. */
  minutes: number
  /** Human-readable duration, or "In development" when the track is empty. */
  durationLabel: string
  /** False when the track has no articles yet — only a landing page. */
  available: boolean
}

/**
 * Parse a `duration` frontmatter value into minutes.
 * Handles "45 minutes", "1 hour", "60 min" and ranges like "3-4 hours" or
 * "45-60 min" — a range resolves to its midpoint rather than its upper bound,
 * so a track of ranged estimates is not systematically overstated.
 */
function parseDuration(value?: string): number {
  if (!value) return 0
  const match = value.match(
    /(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?\s*(h|hour|hr|m|min|minute)/i
  )
  if (!match) return 0
  const low = parseFloat(match[1])
  const high = match[2] ? parseFloat(match[2]) : low
  const amount = (low + high) / 2
  return /^h/i.test(match[3]) ? amount * 60 : amount
}

function formatDuration(minutes: number): string {
  if (minutes < 120) return `${Math.round(minutes)} min`
  const hours = minutes / 60
  return `${hours < 10 ? hours.toFixed(1).replace(/\.0$/, '') : Math.round(hours)} hours`
}

/**
 * Derive per-track stats from the MDX files so the homepage cannot advertise
 * a duration or readiness the content does not actually have.
 */
export function getTrackStats(track: string): TrackStats {
  const articles = getAllContent(track).filter((item) => item.slug !== 'index')
  const index = getContentBySlug(track, 'index')
  const indexIsLesson = index?.frontmatter.selfContained === true

  let minutes = articles.reduce(
    (sum, item) => sum + parseDuration(item.frontmatter.duration),
    0
  )
  if (indexIsLesson) minutes += parseDuration(index?.frontmatter.duration)

  const lessons = articles.length + (indexIsLesson ? 1 : 0)

  return {
    articles: lessons,
    minutes,
    durationLabel: lessons === 0 ? 'In development' : formatDuration(minutes),
    available: lessons > 0,
  }
}
