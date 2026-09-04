import type { Metadata, Viewport } from 'next'
import {
  Plus_Jakarta_Sans,
  Space_Grotesk,
  JetBrains_Mono,
} from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navigation from '@/components/Navigation'
import { getContentSearchItems } from '@/lib/search'
import Footer from '@/components/Footer'
import { ProgressProvider } from '@/components/ProgressTracker'
import { ThemeProvider } from '@/components/ThemeProvider'
import ScrollTracker from '@/components/ScrollTracker'
import {
  getBaseMetadata,
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateLearningResourceSchema,
  generateSoftwareApplicationSchema,
  siteConfig,
} from '@/lib/metadata'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Primary body font - clean, modern, friendly
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

// Display font for headings - geometric, distinctive
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
})

// Monospace font for code - developer-focused
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
})

// Comprehensive SEO metadata
export const metadata: Metadata = {
  ...getBaseMetadata(),
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  other: {
    'google-site-verification': 'CQhdFkuB-aPgF3irSWBz5UwZEe7kHb3BxpSfAR0h0WA',
    'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
  },
}

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fefdfb' },
    { media: '(prefers-color-scheme: dark)', color: '#22272f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate JSON-LD structured data for the entire site
  const websiteSchema = generateWebsiteSchema()
  const organizationSchema = generateOrganizationSchema()
  const learningResourceSchema = generateLearningResourceSchema()
  const softwareApplicationSchema = generateSoftwareApplicationSchema()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* JSON-LD Structured Data for AI and Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(learningResourceSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} RSS Feed`}
          href={`${siteConfig.url}/blog/feed.xml`}
        />

        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ProgressProvider>
            <ScrollTracker />
            <a href="#main-content" className="skip-to-main">
              Skip to main content
            </a>
            <div className="flex min-h-screen flex-col">
              <Navigation searchItems={getContentSearchItems()} />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
