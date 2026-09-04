import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const baseURL = 'http://localhost:3001'

// Complete list of all pages on the site
const allPages = [
  '/',
  '/start-here',
  '/start-here/mac-setup',
  '/start-here/windows-setup',
  '/start-here/claude-code-vs-web',
  '/start-here/claude-code-for-researchers',
  '/start-here/research-case-studies',
  '/start-here/collaboration-workflows',
  '/start-here/research-limitations',
  '/start-here/academic-pipeline',
  '/start-here/quick-start-exercise',
  '/data-analysis',
  '/data-analysis/python-intro',
  '/git-github',
  '/app-builder',
  '/automation',
  '/agents',
  '/agents/building-agents',
  '/agents/using-agents',
  '/agents/agent-products',
  '/agents/multi-agent-architectures',
  '/mcp',
  '/mcp/mcp-fundamentals',
  '/mcp/essential-servers',
  '/mcp/building-custom-mcps',
  '/mcp/workflows-and-troubleshooting',
  '/advanced-topics',
  '/advanced-topics/best-practices',
  '/advanced-topics/skills',
  '/glossary',
  '/resources',
  '/tools/templates',
  '/tools/snippets',
  '/tools/cheatsheets',
  '/tools/mcp-explorer',
  '/tools/claude-md-generator',
  '/tools/slash-commands',
]

// Track index pages and homepage for console error checks
const keyPages = [
  '/',
  '/start-here',
  '/data-analysis',
  '/git-github',
  '/app-builder',
  '/automation',
  '/agents',
  '/mcp',
  '/advanced-topics',
  '/glossary',
  '/resources',
]

test.describe('Link Checker & Page Health', () => {
  // =========================================================================
  // 1. All Pages Load (200 status)
  // =========================================================================
  test.describe('All Pages Load with 200 Status', () => {
    for (const pagePath of allPages) {
      test(`Page loads: ${pagePath}`, async ({ page }) => {
        const response = await page.goto(`${baseURL}${pagePath}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
        expect(response).not.toBeNull()
        expect(response?.status()).toBe(200)
      })
    }
  })

  // =========================================================================
  // 2. Homepage Link Crawler
  // =========================================================================
  test.describe('Homepage Link Crawler', () => {
    test('All internal links found on homepage return 200', async ({
      page,
    }) => {
      await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })

      // Collect all unique internal links from the homepage
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => {
        const uniqueHrefs = new Set<string>()
        links.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            // Strip any hash fragments or query params for the page-level check
            const cleanHref = href.split('#')[0].split('?')[0]
            if (cleanHref) {
              uniqueHrefs.add(cleanHref)
            }
          }
        })
        return Array.from(uniqueHrefs).sort()
      })

      expect(hrefs.length).toBeGreaterThan(0)
      console.log(`Found ${hrefs.length} unique internal links on homepage`)

      const brokenLinks: { href: string; status: number | null }[] = []

      for (const href of hrefs) {
        const response = await page.goto(`${baseURL}${href}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
        const status = response?.status() ?? null
        if (status !== 200) {
          brokenLinks.push({ href, status })
        }
      }

      if (brokenLinks.length > 0) {
        console.log('Broken links found on homepage:')
        for (const broken of brokenLinks) {
          console.log(`  ${broken.href} -> ${broken.status}`)
        }
      }

      expect(brokenLinks).toHaveLength(0)
    })

    test('Deep crawl: all internal links across all pages return 200', async ({
      page,
    }) => {
      const visited = new Set<string>()
      const toVisit = new Set<string>(allPages)
      const brokenLinks: {
        source: string
        href: string
        status: number | null
      }[] = []

      // Crawl every known page and collect internal links
      for (const pagePath of allPages) {
        const response = await page.goto(`${baseURL}${pagePath}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })

        if (!response || response.status() !== 200) {
          continue
        }

        // Collect all internal links on this page
        const hrefs = await page
          .locator('a[href^="/"]')
          .evaluateAll((links) => {
            const uniqueHrefs = new Set<string>()
            links.forEach((link) => {
              const href = link.getAttribute('href')
              if (href) {
                const cleanHref = href.split('#')[0].split('?')[0]
                if (cleanHref) {
                  uniqueHrefs.add(cleanHref)
                }
              }
            })
            return Array.from(uniqueHrefs)
          })

        for (const href of hrefs) {
          toVisit.add(href)
        }
      }

      // Now visit every discovered link that has not already been tested
      const allKnownSet = new Set(allPages)
      const additionalLinks = Array.from(toVisit).filter(
        (href) => !allKnownSet.has(href)
      )

      console.log(
        `Discovered ${additionalLinks.length} additional internal links beyond the known page list`
      )

      for (const href of additionalLinks) {
        if (visited.has(href)) continue
        visited.add(href)

        const response = await page.goto(`${baseURL}${href}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
        const status = response?.status() ?? null
        if (status !== 200) {
          brokenLinks.push({ source: 'crawl', href, status })
        }
      }

      if (brokenLinks.length > 0) {
        console.log('Broken links found during deep crawl:')
        for (const broken of brokenLinks) {
          console.log(`  ${broken.href} -> ${broken.status}`)
        }
      }

      expect(brokenLinks).toHaveLength(0)
    })
  })

  // =========================================================================
  // 3. No Console Errors on Key Pages
  // =========================================================================
  test.describe('No Console Errors on Key Pages', () => {
    for (const pagePath of keyPages) {
      test(`No critical console errors: ${pagePath}`, async ({ page }) => {
        const errors: string[] = []

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            errors.push(msg.text())
          }
        })

        page.on('pageerror', (error) => {
          errors.push(error.message)
        })

        await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' })

        // Filter out known benign errors
        const criticalErrors = errors.filter((err) => {
          // Ignore favicon-related errors
          if (err.includes('favicon')) return false
          // Ignore common Next.js development warnings
          if (err.includes('Warning:')) return false
          // Ignore hydration warnings in development mode
          if (err.includes('Hydration')) return false
          // Ignore lighthouse-related noise
          if (err.includes('lighthouse')) return false
          // Ignore browser extension noise
          if (err.includes('chrome-extension://')) return false
          return true
        })

        if (criticalErrors.length > 0) {
          console.log(`Console errors on ${pagePath}:`)
          for (const err of criticalErrors) {
            console.log(`  ${err}`)
          }
        }

        expect(criticalErrors).toHaveLength(0)
      })
    }
  })

  // =========================================================================
  // 4. All Pages Have Metadata (non-empty title)
  // =========================================================================
  test.describe('All Pages Have Metadata', () => {
    for (const pagePath of allPages) {
      test(`Has non-empty title: ${pagePath}`, async ({ page }) => {
        await page.goto(`${baseURL}${pagePath}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })

        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.trim().length).toBeGreaterThan(0)

        console.log(`  ${pagePath} -> "${title}"`)
      })
    }
  })

  // =========================================================================
  // 5. No Broken Images
  // =========================================================================
  test.describe('No Broken Images', () => {
    for (const pagePath of allPages) {
      test(`No broken images: ${pagePath}`, async ({ page }) => {
        const brokenImages: string[] = []

        // Listen for failed image requests
        page.on('requestfailed', (request) => {
          const resourceType = request.resourceType()
          if (resourceType === 'image') {
            brokenImages.push(request.url())
          }
        })

        // Track 404 responses for images
        const image404s: string[] = []
        page.on('response', (response) => {
          const request = response.request()
          if (request.resourceType() === 'image' && response.status() === 404) {
            image404s.push(response.url())
          }
        })

        await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' })

        // Also check img elements in the DOM for naturalWidth === 0 (broken)
        const domBrokenImages = await page
          .locator('img')
          .evaluateAll((images) => {
            const broken: string[] = []
            for (const img of images) {
              const htmlImg = img as HTMLImageElement
              // An image with naturalWidth 0 failed to load (unless it has no src)
              if (
                htmlImg.src &&
                htmlImg.complete &&
                htmlImg.naturalWidth === 0
              ) {
                broken.push(htmlImg.src)
              }
            }
            return broken
          })

        const allBroken = [...brokenImages, ...image404s, ...domBrokenImages]
        // Deduplicate
        const uniqueBroken = [...new Set(allBroken)]

        if (uniqueBroken.length > 0) {
          console.log(`Broken images on ${pagePath}:`)
          for (const url of uniqueBroken) {
            console.log(`  ${url}`)
          }
        }

        expect(uniqueBroken).toHaveLength(0)
      })
    }
  })

  // =========================================================================
  // 6. No Failed Network Requests on Any Page
  // =========================================================================
  test.describe('No Failed Network Requests', () => {
    for (const pagePath of allPages) {
      test(`No failed network requests: ${pagePath}`, async ({ page }) => {
        const failedRequests: { url: string; failure: string }[] = []

        page.on('requestfailed', (request) => {
          // Ignore external requests that may fail due to network conditions
          const url = request.url()
          if (url.startsWith(baseURL) || url.startsWith('/')) {
            failedRequests.push({
              url,
              failure: request.failure()?.errorText ?? 'unknown error',
            })
          }
        })

        await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' })

        if (failedRequests.length > 0) {
          console.log(`Failed network requests on ${pagePath}:`)
          for (const req of failedRequests) {
            console.log(`  ${req.url} -> ${req.failure}`)
          }
        }

        expect(failedRequests).toHaveLength(0)
      })
    }
  })

  // =========================================================================
  // 7. Navigation Structure Integrity
  // =========================================================================
  test.describe('Navigation Structure Integrity', () => {
    test('All nav links point to valid pages', async ({ page }) => {
      await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })

      const navHrefs = await page
        .locator('nav a[href^="/"]')
        .evaluateAll((links) => {
          const hrefs: string[] = []
          links.forEach((link) => {
            const href = link.getAttribute('href')
            if (href) {
              const cleanHref = href.split('#')[0].split('?')[0]
              if (cleanHref) hrefs.push(cleanHref)
            }
          })
          return [...new Set(hrefs)]
        })

      expect(navHrefs.length).toBeGreaterThan(0)
      console.log(`Found ${navHrefs.length} navigation links`)

      const brokenNavLinks: { href: string; status: number | null }[] = []

      for (const href of navHrefs) {
        const response = await page.goto(`${baseURL}${href}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
        const status = response?.status() ?? null
        if (status !== 200) {
          brokenNavLinks.push({ href, status })
        }
      }

      if (brokenNavLinks.length > 0) {
        console.log('Broken navigation links:')
        for (const broken of brokenNavLinks) {
          console.log(`  ${broken.href} -> ${broken.status}`)
        }
      }

      expect(brokenNavLinks).toHaveLength(0)
    })

    test('Footer links all resolve to 200', async ({ page }) => {
      await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })

      const footerHrefs = await page
        .locator('footer a[href^="/"]')
        .evaluateAll((links) => {
          const hrefs: string[] = []
          links.forEach((link) => {
            const href = link.getAttribute('href')
            if (href) {
              const cleanHref = href.split('#')[0].split('?')[0]
              if (cleanHref) hrefs.push(cleanHref)
            }
          })
          return [...new Set(hrefs)]
        })

      console.log(`Found ${footerHrefs.length} footer links`)

      const brokenFooterLinks: { href: string; status: number | null }[] = []

      for (const href of footerHrefs) {
        const response = await page.goto(`${baseURL}${href}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
        const status = response?.status() ?? null
        if (status !== 200) {
          brokenFooterLinks.push({ href, status })
        }
      }

      if (brokenFooterLinks.length > 0) {
        console.log('Broken footer links:')
        for (const broken of brokenFooterLinks) {
          console.log(`  ${broken.href} -> ${broken.status}`)
        }
      }

      expect(brokenFooterLinks).toHaveLength(0)
    })
  })

  // =========================================================================
  // 8. Cross-Page Link Consistency
  // =========================================================================
  test.describe('Cross-Page Link Consistency', () => {
    test('Every page with internal links only links to pages that return 200', async ({
      page,
    }) => {
      // This test visits every internal link found on a dozen content pages. On a
      // compile-on-demand dev server that is far more work than a normal test, so
      // it gets its own budget and checks link targets over HTTP rather than
      // rendering each one.
      test.setTimeout(300_000)

      const allBrokenLinks: {
        source: string
        href: string
        status: number | null
      }[] = []
      const statusCache = new Map<string, number | null>()

      // Sample a subset of content-heavy pages for deeper link checking
      const contentPages = [
        '/start-here',
        '/start-here/mac-setup',
        '/start-here/windows-setup',
        '/git-github',
        '/agents',
        '/agents/building-agents',
        '/mcp',
        '/mcp/mcp-fundamentals',
        '/advanced-topics',
        '/advanced-topics/best-practices',
        '/glossary',
        '/resources',
      ]

      for (const pagePath of contentPages) {
        await page.goto(`${baseURL}${pagePath}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })

        // Collect all internal links on this page (from main content, not just nav)
        const hrefs = await page
          .locator('a[href^="/"]')
          .evaluateAll((links) => {
            const uniqueHrefs = new Set<string>()
            links.forEach((link) => {
              const href = link.getAttribute('href')
              if (href) {
                const cleanHref = href.split('#')[0].split('?')[0]
                if (cleanHref) uniqueHrefs.add(cleanHref)
              }
            })
            return Array.from(uniqueHrefs)
          })

        for (const href of hrefs) {
          let status = statusCache.get(href)
          if (status === undefined) {
            const response = await page.request.get(`${baseURL}${href}`, {
              timeout: 60000,
            })
            status = response.status()
            statusCache.set(href, status)
          }
          if (status !== 200) {
            allBrokenLinks.push({ source: pagePath, href, status })
          }
        }
      }

      if (allBrokenLinks.length > 0) {
        console.log('Broken cross-page links:')
        for (const broken of allBrokenLinks) {
          console.log(
            `  [${broken.source}] -> ${broken.href} (${broken.status})`
          )
        }
      }

      expect(allBrokenLinks).toHaveLength(0)
    })
  })
})
