'use client'

import { useState } from 'react'
import { Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { trackNewsletterSignup } from '@/lib/analytics'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'hero'
  className?: string
}

export default function NewsletterSignup({
  variant = 'default',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.status === 409) {
        setStatus('error')
        setMessage('You are already subscribed!')
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed')
      }

      setStatus('success')
      setMessage('Thanks for subscribing!')
      setEmail('')
      trackNewsletterSignup(variant)
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="newsletter-email-compact" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="newsletter-email-compact"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                disabled={status === 'loading'}
                aria-invalid={status === 'error'}
                aria-describedby={
                  status === 'error' ? 'newsletter-error-compact' : undefined
                }
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p
            id="newsletter-error-compact"
            role="alert"
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {message}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-orange-500 p-8 md:p-12 ${className}`}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative">
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Stay Updated with Claude Code
          </h3>
          <p className="mt-3 max-w-xl text-primary-100">
            Get weekly tips, new tutorials, and Claude Code updates delivered to
            your inbox. No spam, unsubscribe anytime.
          </p>

          {status === 'success' ? (
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-white/20 p-4 backdrop-blur">
              <CheckCircle2 className="h-6 w-6 text-white" />
              <span className="font-medium text-white">{message}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email-hero" className="sr-only">
                Email address
              </label>
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="newsletter-email-hero"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border-0 bg-white py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={status === 'loading'}
                  aria-invalid={status === 'error'}
                  aria-describedby={
                    status === 'error' ? 'newsletter-error-hero' : undefined
                  }
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-800 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p
              id="newsletter-error-hero"
              role="alert"
              className="mt-3 text-sm text-red-200"
            >
              {message}
            </p>
          )}

          <p className="mt-4 text-sm text-primary-200">
            Join developers learning with Claude Code
          </p>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/50">
          <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Subscribe to Updates
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            New tutorials & tips weekly
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="newsletter-email-default" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <input
              id="newsletter-email-default"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              disabled={status === 'loading'}
              aria-invalid={status === 'error'}
              aria-describedby={
                status === 'error' ? 'newsletter-error-default' : undefined
              }
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p
          id="newsletter-error-default"
          role="alert"
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {message}
        </p>
      )}

      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  )
}
