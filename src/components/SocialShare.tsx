'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Link2, Check, MessageCircle } from 'lucide-react'
import { trackSocialShare } from '@/lib/analytics'
import { TIMING } from '@/lib/constants'
import logger from '@/lib/logger'

interface SocialShareProps {
  title: string
  url: string
  description?: string
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
  }

  const handleShare = (
    platform: 'twitter' | 'linkedin' | 'reddit' | 'hackernews'
  ) => {
    trackSocialShare(platform, title, url)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      trackSocialShare('copy_link', title, url)
      setTimeout(() => setCopied(false), TIMING.COPY_FEEDBACK)
    } catch (err) {
      logger.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Share this article
      </span>
      <div className="flex items-center gap-2">
        {/* Twitter/X */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('twitter')}
          className="group flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-[#1DA1F2] hover:text-white dark:bg-gray-800 dark:text-gray-400"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-5 w-5" aria-hidden="true" />
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('linkedin')}
          className="group flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-[#0A66C2] hover:text-white dark:bg-gray-800 dark:text-gray-400"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-5 w-5" aria-hidden="true" />
        </a>

        {/* Reddit */}
        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('reddit')}
          className="group flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-[#FF4500] hover:text-white dark:bg-gray-800 dark:text-gray-400"
          aria-label="Share on Reddit"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </a>

        {/* Hacker News */}
        <a
          href={shareLinks.hackernews}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('hackernews')}
          className="group flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-[#FF6600] hover:text-white dark:bg-gray-800 dark:text-gray-400"
          aria-label="Share on Hacker News"
        >
          <span className="text-sm font-bold" aria-hidden="true">
            Y
          </span>
        </a>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className={`group flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white dark:bg-gray-800 dark:text-gray-400'
          }`}
          aria-label={copied ? 'Link copied!' : 'Copy link'}
        >
          {copied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Link2 className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  )
}

// Floating share bar for mobile
export function FloatingShareBar({
  title,
  url,
}: {
  title: string
  url: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), TIMING.COPY_FEEDBACK)
    } catch (err) {
      logger.error('Failed to copy:', err)
    }
  }

  // Use native share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch {
        // User cancelled or error
        setIsOpen(!isOpen)
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      {/* Share options */}
      {isOpen && (
        <div className="animate-in slide-in-from-bottom-2 absolute bottom-16 right-0 flex flex-col gap-2">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DA1F2] text-white shadow-lg"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={shareLinks.reddit}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4500] text-white shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            onClick={copyToClipboard}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${
              copied ? 'bg-green-500' : 'bg-gray-700'
            } text-white`}
          >
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Link2 className="h-5 w-5" />
            )}
          </button>
        </div>
      )}

      {/* Main share button */}
      <button
        onClick={handleNativeShare}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl transition-transform hover:scale-110"
        aria-label="Share this article"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>
    </div>
  )
}
