'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Rocket,
  BookOpen,
  Wrench,
  GraduationCap,
  Menu,
  X,
  ChevronRight,
  Terminal
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SearchModal from './SearchModal'
import type { SearchIndexItem } from '@/lib/search'
import ThemeToggle from './ThemeToggle'

const navigationItems: Array<{ name: string; href: string; icon: LucideIcon; description?: string }> = [
  { name: 'Start Here', href: '/start-here', icon: Rocket, description: 'Begin your journey' },
  { name: 'Learning Tracks', href: '/#tracks', icon: GraduationCap, description: 'Structured paths' },
  { name: 'Tools', href: '/tools/templates', icon: Wrench, description: 'Boost productivity' },
  { name: 'Resources', href: '/resources', icon: BookOpen, description: 'Guides & references' },
]

export default function Navigation({
  searchItems = [],
}: {
  searchItems?: SearchIndexItem[]
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`sticky top-0 z-sticky transition-all duration-300 ${
        scrolled
          ? 'bg-paper-50/95 dark:bg-ink-950/95 backdrop-blur-xl shadow-nav border-b border-ink-100 dark:border-ink-800'
          : 'bg-transparent'
      }`}
    >
      <SearchModal contentItems={searchItems} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ink-900 to-ink-800 dark:from-paper-100 dark:to-paper-200 shadow-sm transition-transform group-hover:scale-105">
              <Terminal className="h-5 w-5 text-paper-50 dark:text-ink-900" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-ink-900 dark:text-paper-50 tracking-tight">
                Claude Code
              </span>
              <span className="block text-xs font-medium text-ink-500 dark:text-ink-400 tracking-wide uppercase">
                Learning Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                      : 'text-ink-600 dark:text-ink-300 font-medium hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-paper-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-200 ${!active && 'group-hover:scale-110'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right section */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {/* External docs link */}
            <a
              href="https://docs.claude.com/en/docs/claude-code/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-paper-50 transition-colors"
            >
              Docs
            </a>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* CTA Button */}
            <Link
              href="/start-here"
              className="inline-flex items-center gap-2 rounded-xl bg-ink-900 dark:bg-paper-50 px-5 py-2.5 text-sm font-semibold text-paper-50 dark:text-ink-900 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-ink-600 dark:text-ink-300 transition-colors hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-snappy overflow-hidden ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-ink-100 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 px-4 pb-6 pt-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                      : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    {item.description && (
                      <span className={`block text-xs mt-0.5 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-ink-500 dark:text-ink-400'}`}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Mobile CTAs */}
          <div className="mt-6 space-y-3 border-t border-ink-100 dark:border-ink-800 pt-6">
            <Link
              href="/start-here"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-ink-900 dark:bg-paper-50 px-4 py-3 text-sm font-semibold text-paper-50 dark:text-ink-900 shadow-md"
            >
              <span>Get Started</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <a
              href="https://docs.claude.com/en/docs/claude-code/overview"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-ink-100 dark:bg-ink-800 px-4 py-3 text-sm font-medium text-ink-700 dark:text-ink-200"
            >
              <span>Official Docs</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
