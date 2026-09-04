import { Metadata } from 'next'

// Site Configuration - Central source of truth for SEO
export const siteConfig = {
  name: 'Claude Code Learning Hub',
  title: 'Claude Code Learning Hub - Master AI-Powered Development',
  description:
    'Learn Claude Code, VS Code, Git/GitHub, Python, and R with hands-on tutorials. Build real-world projects with AI assistance. Free comprehensive guides for beginners to advanced developers.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://codewithclaude.net',
  // Static OG image in public directory
  ogImage: '/og-image.png',
  twitterHandle: '@anthropic',
  keywords: [
    'Claude Code',
    'Claude AI',
    'AI coding assistant',
    'VS Code tutorial',
    'Git tutorial',
    'GitHub for beginners',
    'Python tutorial',
    'R programming',
    'data analysis',
    'AI development',
    'coding with AI',
    'Anthropic Claude',
    'AI pair programming',
    'learn to code',
    'programming tutorials',
    'developer tools',
    'automation scripts',
    'MCP servers',
    'AI agents',
  ],
  author: {
    name: 'Claude Code Learning Hub',
    url: 'https://codewithclaude.net',
  },
  creator: 'Claude Code Learning Hub',
  publisher: 'Claude Code Learning Hub',
}

// Track metadata for SEO
export const trackMetadata: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  'start-here': {
    title: 'Getting Started with Claude Code',
    description:
      'Complete beginner guide to Claude Code setup. Learn to install Claude Code, configure VS Code, and start your first AI-assisted coding project in minutes.',
    keywords: [
      'Claude Code setup',
      'install Claude Code',
      'VS Code setup',
      'getting started programming',
      'beginner coding',
      'AI coding setup',
    ],
  },
  'data-analysis': {
    title: 'Data Analysis with Claude Code',
    description:
      'Learn Python and R for data analysis with AI assistance. Clean, analyze, and visualize data using Claude Code as your coding partner.',
    keywords: [
      'Python data analysis',
      'R programming',
      'data science tutorial',
      'pandas tutorial',
      'data visualization',
      'AI data analysis',
    ],
  },
  'app-builder': {
    title: 'Build Web Apps with Claude Code',
    description:
      'Create modern web applications with AI-powered development. Learn React, Next.js, and full-stack development using Claude Code.',
    keywords: [
      'web development',
      'React tutorial',
      'Next.js tutorial',
      'build web apps',
      'AI web development',
      'full-stack development',
    ],
  },
  automation: {
    title: 'Automation & Scripting with Claude Code',
    description:
      'Automate repetitive tasks and build powerful scripts with Claude Code. Learn shell scripting, Python automation, and workflow optimization.',
    keywords: [
      'automation scripts',
      'Python automation',
      'shell scripting',
      'workflow automation',
      'task automation',
      'scripting tutorial',
    ],
  },
  'git-github': {
    title: 'Git & GitHub Mastery with Claude Code',
    description:
      'Master version control with Git and GitHub. Learn branching, merging, pull requests, and collaboration workflows with AI guidance.',
    keywords: [
      'Git tutorial',
      'GitHub tutorial',
      'version control',
      'Git branching',
      'pull requests',
      'Git for beginners',
    ],
  },
  agents: {
    title: 'Build AI Agents with Claude Code',
    description:
      'Learn to create powerful AI agents using Claude Code. Build autonomous systems, MCP servers, and intelligent automation.',
    keywords: [
      'AI agents',
      'Claude agents',
      'MCP servers',
      'autonomous AI',
      'AI automation',
      'intelligent agents',
    ],
  },
  mcp: {
    title: 'MCP Integration Guide',
    description:
      'Master the Model Context Protocol (MCP) to connect Claude Code to databases, APIs, GitHub, and external services. Install, configure, and build custom MCP servers.',
    keywords: [
      'MCP servers',
      'Model Context Protocol',
      'Claude Code MCP',
      'MCP integration',
      'custom MCP server',
      'Claude Code plugins',
      'MCP tutorial',
    ],
  },
  'advanced-topics': {
    title: 'Advanced Claude Code Techniques',
    description:
      'Master advanced Claude Code features including best practices, custom configurations, MCP integration, and professional workflows.',
    keywords: [
      'advanced Claude Code',
      'MCP integration',
      'best practices',
      'professional workflows',
      'Claude configuration',
      'expert tips',
    ],
  },
}

// Generate base metadata that all pages share
export function getBaseMetadata(): Metadata {
  // Absolute URL for OG image (required by Facebook, LinkedIn, Twitter)
  const ogImageUrl = `${siteConfig.url}${siteConfig.ogImage}`
  const twitterImageUrl = `${siteConfig.url}/og-image.png`

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [siteConfig.author],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Open Graph - Used by Facebook, LinkedIn, Discord, Slack, etc.
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
          type: 'image/png',
        },
      ],
    },
    // Twitter Card - Used by Twitter/X
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: siteConfig.title,
      description: siteConfig.description,
      images: {
        url: twitterImageUrl,
        alt: siteConfig.name,
      },
    },
    alternates: {
      canonical: siteConfig.url,
    },
    category: 'technology',
    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  }
}

// Generate metadata for track pages
export function getTrackPageMetadata(track: string): Metadata {
  const trackMeta = trackMetadata[track]
  const title =
    trackMeta?.title || `${track.replace(/-/g, ' ')} | Claude Code Learning`
  const description = trackMeta?.description || siteConfig.description
  const keywords = trackMeta?.keywords || []
  const url = `${siteConfig.url}/${track}`
  const ogImageUrl = `${siteConfig.url}${siteConfig.ogImage}`

  return {
    title,
    description,
    keywords: [...siteConfig.keywords.slice(0, 5), ...keywords],
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title,
      description,
      images: {
        url: `${siteConfig.url}/og-image.png`,
        alt: title,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

// Generate metadata for content/article pages
export function getContentPageMetadata(
  track: string,
  slug: string,
  frontmatter: {
    title: string
    description?: string
    platform?: string
    duration?: string
  }
): Metadata {
  const trackMeta = trackMetadata[track]
  const title = frontmatter.title
  const description =
    frontmatter.description || trackMeta?.description || siteConfig.description
  const url = `${siteConfig.url}/${track}/${slug}`
  const ogImageUrl = `${siteConfig.url}${siteConfig.ogImage}`

  // Build keywords from track + content specifics
  const keywords = [
    ...(trackMeta?.keywords || []),
    frontmatter.title.toLowerCase(),
    `${track} tutorial`,
    'Claude Code',
  ]

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      publishedTime: new Date().toISOString(),
      authors: [siteConfig.author.name],
      section: trackMeta?.title || track,
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title,
      description,
      images: {
        url: `${siteConfig.url}/og-image.png`,
        alt: title,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

// JSON-LD Structured Data generators
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      'https://github.com/anthropics/claude-code',
      'https://twitter.com/anthropic',
    ],
  }
}

export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  datePublished?: string,
  dateModified?: string,
  options?: {
    wordCount?: number
    readingTime?: number
    keywords?: string[]
    author?: string
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/og-image.png`,
      width: 1200,
      height: 630,
    },
    inLanguage: 'en-US',
    ...(options?.wordCount && { wordCount: options.wordCount }),
    ...(options?.readingTime && { timeRequired: `PT${options.readingTime}M` }),
    ...(options?.keywords && { keywords: options.keywords.join(', ') }),
  }
}

// Video schema for future video content
export function generateVideoSchema(
  name: string,
  description: string,
  thumbnailUrl: string,
  uploadDate: string,
  duration: string,
  contentUrl?: string,
  embedUrl?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
  }
}

// Person schema for author pages
export function generatePersonSchema(
  name: string,
  url: string,
  image?: string,
  description?: string,
  sameAs?: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    ...(image && { image }),
    ...(description && { description }),
    ...(sameAs && { sameAs }),
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateCourseSchema(
  name: string,
  description: string,
  url: string,
  modules: { name: string; description: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT10H',
    },
    syllabusSections: modules.map((module) => ({
      '@type': 'Syllabus',
      name: module.name,
      description: module.description,
    })),
  }
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string }[],
  totalTime?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime: totalTime || 'PT30M',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateLearningResourceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    provider: {
      '@type': 'Organization',
      name: 'Claude Code Learning Hub',
      url: siteConfig.url,
    },
    educationalLevel: 'Beginner to Advanced',
    learningResourceType: ['Tutorial', 'Guide', 'Course'],
    teaches: [
      'Claude Code',
      'VS Code',
      'Git',
      'GitHub',
      'Python',
      'R',
      'Data Analysis',
      'Web Development',
      'Automation',
      'AI Agents',
    ],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    license: 'https://opensource.org/licenses/MIT',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: ['student', 'researcher', 'developer'],
    },
  }
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Claude Code',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: ['Windows', 'macOS', 'Linux'],
    description:
      'AI-powered coding assistant that helps you write, debug, and understand code directly in your terminal or IDE.',
    url: 'https://docs.claude.com/en/docs/claude-code/overview',
    author: {
      '@type': 'Organization',
      name: 'Anthropic',
      url: 'https://anthropic.com',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to use with Claude subscription',
    },
    featureList: [
      'Code generation',
      'Code debugging',
      'Code explanation',
      'File system access',
      'Git integration',
      'Multi-language support',
    ],
  }
}
