import Link from 'next/link'
import { Metadata } from 'next'
import { getTrackStats } from '@/lib/tracks'
import {
  Rocket,
  BarChart3,
  Hammer,
  Zap,
  Brain,
  ArrowRight,
  CheckCircle2,
  Terminal,
  BookOpen,
  Code2,
  GitBranch,
  Settings,
  Keyboard,
  Play,
  Users,
  Server,
} from 'lucide-react'
import { siteConfig, generateFAQSchema } from '@/lib/metadata'

const staticOgImageUrl = `${siteConfig.url}/og-image.png`
const twitterImageUrl = `${siteConfig.url}/twitter-image`

export const metadata: Metadata = {
  title: 'Claude Code Learning Hub - Master AI-Powered Development',
  description:
    'Learn Claude Code, VS Code, Git/GitHub, Python, and R with hands-on tutorials. Build real-world projects with AI assistance. Free comprehensive guides for beginners to advanced developers.',
  keywords: [
    'Claude Code tutorial',
    'learn Claude Code',
    'AI coding assistant',
    'VS Code setup',
    'Git tutorial',
    'GitHub for beginners',
    'Python tutorial',
    'R programming',
    'AI development',
    'coding with AI',
    'Anthropic Claude',
    'free programming course',
  ],
  openGraph: {
    title: 'Claude Code Learning Hub - Master AI-Powered Development',
    description:
      'Learn Claude Code, VS Code, Git/GitHub, Python, and R with hands-on tutorials. Build real-world projects with AI assistance.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: staticOgImageUrl,
        secureUrl: staticOgImageUrl,
        width: 1200,
        height: 630,
        alt: 'Claude Code Learning Hub - Master AI-Powered Development',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: 'Claude Code Learning Hub - Master AI-Powered Development',
    description:
      'Learn Claude Code, VS Code, Git/GitHub, Python, and R with hands-on tutorials. Build real-world projects with AI assistance.',
    images: {
      url: twitterImageUrl,
      alt: 'Claude Code Learning Hub',
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

const faqs = [
  {
    question: 'What is Claude Code?',
    answer:
      'Claude Code is an AI-powered coding assistant by Anthropic that helps you write, debug, and understand code directly in your terminal or IDE. It can assist with various programming languages and frameworks.',
  },
  {
    question: 'Is Claude Code Learning Hub free?',
    answer:
      'Yes, all tutorials and learning materials on Claude Code Learning Hub are completely free. We provide comprehensive guides for Claude Code, VS Code, Git/GitHub, Python, and R.',
  },
  {
    question: 'Do I need programming experience to start?',
    answer:
      'No prior programming experience is required. Our Start Here track guides you through setting up your development environment from scratch, including VS Code, Claude Code, and Git.',
  },
  {
    question: 'What can I build with Claude Code?',
    answer:
      'With Claude Code, you can build web applications, automate repetitive tasks, analyze data with Python or R, create AI agents, and much more. Our learning tracks cover practical projects you can add to your portfolio.',
  },
  {
    question: 'Does Claude Code work on Mac and Windows?',
    answer:
      'Yes, Claude Code works on both Mac and Windows. Our tutorials include platform-specific setup guides to ensure a smooth installation regardless of your operating system.',
  },
]

// Learning track data with enhanced styling
const learningTracks = [
  {
    title: 'Start Here',
    description:
      'Install and configure Claude Code, VS Code, and Git/GitHub on Mac or Windows',
    slug: 'start-here',
    href: '/start-here',
    icon: Rocket,
    gradient: 'from-primary-500 to-amber-500',
    bgColor: 'bg-primary-50 dark:bg-primary-950/30',
    borderColor: 'border-primary-200 dark:border-primary-800',
    iconBg: 'bg-primary-100 dark:bg-primary-900/50',
    tag: 'Essential',
    tagColor:
      'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300',
  },
  {
    title: 'Data Analysis',
    description:
      'Learn Python or R for data cleaning, visualization, and modeling with Claude',
    slug: 'data-analysis',
    href: '/data-analysis',
    icon: BarChart3,
    gradient: 'from-cobalt-500 to-plum-500',
    bgColor: 'bg-cobalt-50 dark:bg-cobalt-950/30',
    borderColor: 'border-cobalt-200 dark:border-cobalt-800',
    iconBg: 'bg-cobalt-100 dark:bg-cobalt-900/50',
    tag: 'Popular',
    tagColor:
      'bg-cobalt-100 dark:bg-cobalt-900/40 text-cobalt-700 dark:text-cobalt-300',
  },
  {
    title: 'Git & GitHub',
    description: 'Learn version control with Git and collaboration with GitHub',
    slug: 'git-github',
    href: '/git-github',
    icon: GitBranch,
    gradient: 'from-cobalt-500 to-sage-500',
    bgColor: 'bg-cobalt-50 dark:bg-cobalt-950/30',
    borderColor: 'border-cobalt-200 dark:border-cobalt-800',
    iconBg: 'bg-cobalt-100 dark:bg-cobalt-900/50',
    tag: 'Essential',
    tagColor:
      'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300',
  },
  {
    title: 'App Builder',
    description:
      'Build and deploy small web apps and APIs with Claude as your co-developer',
    slug: 'app-builder',
    href: '/app-builder',
    icon: Hammer,
    gradient: 'from-plum-500 to-primary-500',
    bgColor: 'bg-plum-50 dark:bg-plum-950/30',
    borderColor: 'border-plum-200 dark:border-plum-800',
    iconBg: 'bg-plum-100 dark:bg-plum-900/50',
    tag: 'Hands-On',
    tagColor:
      'bg-plum-100 dark:bg-plum-900/40 text-plum-700 dark:text-plum-300',
  },
  {
    title: 'Automation',
    description:
      'Create scripts and workflows to automate repetitive tasks with Claude',
    slug: 'automation',
    href: '/automation',
    icon: Zap,
    gradient: 'from-amber-500 to-primary-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    tag: 'Practical',
    tagColor:
      'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  {
    title: 'AI Agents',
    description:
      'Build autonomous agents that can reason, plan, and take actions',
    slug: 'agents',
    href: '/agents',
    icon: Brain,
    gradient: 'from-sage-500 to-cobalt-500',
    bgColor: 'bg-sage-50 dark:bg-sage-950/30',
    borderColor: 'border-sage-200 dark:border-sage-800',
    iconBg: 'bg-sage-100 dark:bg-sage-900/50',
    tag: 'Advanced',
    tagColor:
      'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300',
  },
  {
    title: 'MCP Integration',
    description:
      'Connect Claude to databases, APIs, and external tools with Model Context Protocol',
    slug: 'mcp',
    href: '/mcp',
    icon: Server,
    gradient: 'from-plum-500 to-cobalt-500',
    bgColor: 'bg-plum-50 dark:bg-plum-950/30',
    borderColor: 'border-plum-200 dark:border-plum-800',
    iconBg: 'bg-plum-100 dark:bg-plum-900/50',
    tag: 'New',
    tagColor:
      'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300',
  },
  {
    title: 'Advanced Topics',
    description:
      'Best practices, skills, plugins and hooks, and power features for daily use',
    slug: 'advanced-topics',
    href: '/advanced-topics',
    icon: Settings,
    gradient: 'from-ink-500 to-cobalt-500',
    bgColor: 'bg-ink-50 dark:bg-ink-950/30',
    borderColor: 'border-ink-200 dark:border-ink-800',
    iconBg: 'bg-ink-100 dark:bg-ink-800',
    tag: 'Advanced',
    tagColor:
      'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300',
  },
]

const tools = [
  {
    title: 'CLAUDE.md Generator',
    description:
      'Create customized CLAUDE.md files for your projects with our interactive form.',
    href: '/tools/claude-md-generator',
    icon: Settings,
    features: [
      'Project type templates',
      'Framework-specific configs',
      'One-click copy',
    ],
  },
  {
    title: 'Slash Commands Library',
    description:
      'Browse and copy ready-to-use slash commands for common development tasks.',
    href: '/tools/slash-commands',
    icon: Keyboard,
    features: ['12+ production commands', 'Search & filter', 'Usage examples'],
  },
  {
    title: 'MCP Explorer',
    description:
      'Discover and browse MCP servers to extend Claude Code with external tools and data.',
    href: '/tools/mcp-explorer',
    icon: Server,
    features: ['Server catalog', 'Install commands', 'Use case guides'],
  },
  {
    title: 'Cheatsheets',
    description:
      'Quick-reference cheatsheets for Claude Code, Git, Python, and more.',
    href: '/tools/cheatsheets',
    icon: Code2,
    features: ['Copy-paste commands', 'Organized by topic', 'Print-friendly'],
  },
]

export default function Home() {
  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 h-[800px] w-[800px] -translate-y-1/3 translate-x-1/3 rounded-full bg-gradient-to-bl from-primary-200/30 via-transparent to-transparent blur-3xl dark:from-primary-900/20" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-32 lg:pt-32">
            <div className="mx-auto max-w-4xl text-center">
              {/* Announcement badge */}
              <Link
                href="/start-here"
                className="group mb-8 inline-flex items-center gap-2.5 rounded-full bg-paper-100 px-4 py-2 text-sm font-medium text-ink-700 ring-1 ring-inset ring-ink-200 transition-all hover:bg-paper-200 hover:ring-primary-300 dark:bg-ink-900 dark:text-ink-200 dark:ring-ink-700 dark:hover:bg-ink-800 dark:hover:ring-primary-700"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
                </span>
                <span>New to Claude Code? Start here</span>
                <ArrowRight className="h-3.5 w-3.5 text-ink-400 transition-transform group-hover:translate-x-0.5" />
              </Link>

              {/* Main headline */}
              <h1 className="mb-6 font-display text-5xl font-bold tracking-tight text-ink-900 dark:text-paper-50 sm:text-6xl lg:text-7xl">
                Learn{' '}
                <span className="text-gradient dark:text-gradient-dark">
                  Claude Code
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-ink-600 dark:text-ink-300 sm:text-2xl">
                Step-by-step tutorials for VS Code, Git/GitHub, Python, and R.{' '}
                <span className="font-medium text-ink-900 dark:text-paper-50">
                  No experience required.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/start-here"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-8 py-4 text-base font-semibold text-paper-50 shadow-lg transition-all hover:shadow-xl active:scale-[0.98] dark:bg-paper-50 dark:text-ink-900"
                >
                  <Play className="h-5 w-5" />
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/git-github"
                  className="group inline-flex items-center gap-2 rounded-xl border-2 border-ink-200 bg-white px-8 py-4 text-base font-semibold text-ink-900 transition-all hover:border-ink-300 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-50 dark:hover:border-ink-600 dark:hover:bg-ink-800"
                >
                  <GitBranch className="h-5 w-5" />
                  <span>Learn Git & GitHub</span>
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-ink-500 dark:text-ink-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-ink-400" />
                  <span>Free</span>
                </div>
                <div className="hidden h-4 w-px bg-ink-200 dark:bg-ink-700 sm:block" />
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-ink-400" />
                  <span>Step-by-Step</span>
                </div>
                <div className="hidden h-4 w-px bg-ink-200 dark:bg-ink-700 sm:block" />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-ink-400" />
                  <span>Beginner Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Tracks Section */}
        <section id="tracks" className="relative scroll-mt-20 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                <BookOpen className="h-4 w-4" />
                <span>Learning Tracks</span>
              </div>
              <h2 className="mb-4 font-display text-3xl font-bold text-ink-900 dark:text-paper-50 sm:text-4xl">
                Choose Your Learning Path
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-ink-600 dark:text-ink-300">
                Start with any track that matches your goals. All paths include
                hands-on projects and Claude Code integration.
              </p>
            </div>

            {/* Track cards grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {learningTracks.map((track) => {
                const Icon = track.icon
                // Duration and readiness come from the MDX content, so a card can
                // never advertise a track that has not been written yet.
                const stats = getTrackStats(track.slug)
                const tag = stats.available ? track.tag : 'Coming Soon'
                const tagColor = stats.available
                  ? track.tagColor
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
                return (
                  <Link
                    key={track.title}
                    href={track.href}
                    className="group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-lg dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700"
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${track.iconBg} mb-4`}
                    >
                      <Icon className="h-6 w-6 text-ink-900 dark:text-paper-50" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-paper-50">
                      {track.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                      {track.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-4 dark:border-ink-800">
                      <span className="text-xs text-ink-500 dark:text-ink-400">
                        {stats.durationLabel}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColor}`}
                      >
                        {tag}
                      </span>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute right-6 top-6 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4 text-ink-500 dark:text-ink-400" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ink-100 px-4 py-1.5 text-sm font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                <Terminal className="h-4 w-4" />
                <span>Interactive Tools</span>
              </div>
              <h2 className="mb-4 font-display text-3xl font-bold text-ink-900 dark:text-paper-50 sm:text-4xl">
                Boost Your Productivity
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-ink-600 dark:text-ink-300">
                Use our free tools to supercharge your Claude Code workflow
              </p>
            </div>

            {/* Tools grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-8 transition-all duration-200 hover:border-primary-300 hover:shadow-lg dark:border-ink-800 dark:bg-ink-900 dark:hover:border-primary-700"
                  >
                    {/* Icon */}
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-amber-500 shadow-lg">
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 font-display text-xl font-bold text-ink-900 dark:text-paper-50">
                      {tool.title}
                    </h3>
                    <p className="mb-6 text-ink-600 dark:text-ink-300">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <ul className="mb-6 space-y-2">
                      {tool.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300"
                        >
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                      <span>Try it now</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Link to all resources */}
            <div className="mt-10 text-center">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition-colors hover:text-primary-600 dark:text-ink-300 dark:hover:text-primary-400"
              >
                <span>Browse all resources</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: BookOpen,
                  title: 'Guided Learning',
                  description:
                    'Step-by-step tutorials designed for beginners and experienced developers alike. No prior experience required.',
                },
                {
                  icon: Code2,
                  title: 'AI-Powered',
                  description:
                    'Learn how to effectively partner with Claude for real coding tasks. Write better code, faster.',
                },
                {
                  icon: Hammer,
                  title: 'Practical Projects',
                  description:
                    'Build real projects you can use and share, not just toy examples. Portfolio-ready work.',
                },
              ].map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="text-center lg:text-left">
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-800 lg:mx-0">
                      <Icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="mb-3 font-display text-xl font-bold text-ink-900 dark:text-paper-50">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-ink-600 dark:text-ink-300">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-16 dark:bg-ink-800 sm:px-16 sm:py-20">
              {/* Background decorations */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary-600/20 to-transparent blur-3xl" />
              </div>

              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="mb-6 font-display text-3xl font-bold text-white sm:text-4xl">
                  Ready to Start Building?
                </h2>
                <p className="mb-10 text-lg text-ink-300">
                  Join developers learning to build better software with AI
                  assistance. Get started in less than 10 minutes.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/start-here"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-ink-900 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/#tracks"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-ink-600 px-8 py-4 text-base font-semibold text-white transition-all hover:border-ink-500 hover:bg-ink-800"
                  >
                    View All Tracks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
