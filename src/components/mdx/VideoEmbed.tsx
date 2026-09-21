'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Play, ExternalLink } from 'lucide-react'

interface VideoEmbedProps {
  /** YouTube video ID, e.g. "rfDvkSkelhg" */
  id: string
  /** Video title, shown before load and used as the iframe title */
  title: string
  /** Uploading channel, credited under the title */
  channel?: string
  /** Start offset. Accepts seconds (125) or "mm:ss" / "hh:mm:ss" ("2:05") */
  start?: string | number
  /** One line on why this clip is here, shown under the player */
  caption?: string
  className?: string
}

/**
 * Parses "mm:ss" / "hh:mm:ss" / plain seconds into a second count.
 * Returns 0 for anything unparseable so a bad prop never breaks the embed.
 */
function toSeconds(start?: string | number): number {
  if (start === undefined) return 0
  if (typeof start === 'number') return Number.isFinite(start) && start > 0 ? Math.floor(start) : 0

  const parts = start.split(':').map((p) => Number(p.trim()))
  if (parts.some((p) => !Number.isFinite(p) || p < 0)) return 0

  const seconds = parts.reduce((total, part) => total * 60 + part, 0)
  return Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
}

function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

/**
 * A click-to-load YouTube embed.
 *
 * Nothing from YouTube loads until the reader presses play: until then this is
 * a single thumbnail image. That keeps ~1MB of third-party player JS off the
 * critical path, which matters because these sit inside article bodies that we
 * measure for Core Web Vitals. The iframe uses youtube-nocookie.com so no
 * tracking cookie is set for readers who never press play.
 */
export default function VideoEmbed({
  id,
  title,
  channel,
  start,
  caption,
  className,
}: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  const startSeconds = toSeconds(start)
  const params = new URLSearchParams({ autoplay: '1', rel: '0' })
  if (startSeconds > 0) params.set('start', String(startSeconds))

  const embedSrc = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
  const watchUrl = `https://www.youtube.com/watch?v=${id}${
    startSeconds > 0 ? `&t=${startSeconds}` : ''
  }`
  const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  return (
    <figure className={cn('not-prose my-8', className)}>
      <div className="overflow-hidden rounded-xl border border-ink-200 bg-ink-950 dark:border-ink-800">
        <div className="relative aspect-video">
          {loaded ? (
            <iframe
              src={embedSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setLoaded(true)}
              aria-label={`Play video: ${title}${
                startSeconds > 0 ? `, starting at ${formatTimestamp(startSeconds)}` : ''
              }`}
              className="group absolute inset-0 h-full w-full cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-80"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />

              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 shadow-lg transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110">
                <Play className="ml-1 h-7 w-7 fill-white text-white" />
              </span>

              <span className="absolute inset-x-0 bottom-0 p-4 text-left">
                <span className="block font-display text-sm font-semibold leading-snug text-white sm:text-base">
                  {title}
                </span>
                {(channel || startSeconds > 0) && (
                  <span className="mt-1 block text-xs text-ink-300">
                    {channel}
                    {channel && startSeconds > 0 && ' · '}
                    {startSeconds > 0 && `starts at ${formatTimestamp(startSeconds)}`}
                  </span>
                )}
              </span>
            </button>
          )}
        </div>
      </div>

      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-ink-600 dark:text-ink-300">
        {caption ? <span className="max-w-prose">{caption}</span> : <span />}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-ink-600 underline underline-offset-2 hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400"
        >
          Watch on YouTube
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  )
}
