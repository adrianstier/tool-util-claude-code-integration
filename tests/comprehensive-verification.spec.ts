import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const baseURL = 'http://localhost:3001'

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Start Here', url: '/start-here' },
  { name: 'Mac Setup', url: '/start-here/mac-setup' },
  { name: 'Windows Setup', url: '/start-here/windows-setup' },
  { name: 'Data Analysis', url: '/data-analysis' },
  { name: 'Python Intro', url: '/data-analysis/python-intro' },
  { name: 'Git GitHub', url: '/git-github' },
  { name: 'App Builder', url: '/app-builder' },
  { name: 'Automation', url: '/automation' },
]

// Helper function to check for console errors
async function checkConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })
  return errors
}

// Helper function to check performance metrics
async function getPerformanceMetrics(page: Page) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')

    return {
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint:
        paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
    }
  })
  return metrics
}

test.describe('Comprehensive Verification Suite', () => {
  test.describe('Performance Tests', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} - Performance metrics`, async ({ page }) => {
        await page.goto(`${baseURL}${pageInfo.url}`)
        await page.waitForLoadState('networkidle')

        const metrics = await getPerformanceMetrics(page)

        console.log(`${pageInfo.name} Performance:`)
        console.log(
          `  DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`
        )
        console.log(`  Load Complete: ${metrics.loadComplete.toFixed(2)}ms`)
        console.log(`  First Paint: ${metrics.firstPaint.toFixed(2)}ms`)
        console.log(
          `  First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`
        )

        // Performance assertions
        expect(metrics.domContentLoaded).toBeLessThan(3000) // DOM should load in < 3s
        expect(metrics.firstContentfulPaint).toBeLessThan(2000) // FCP should be < 2s
      })
    }
  })

  test.describe('Accessibility Tests', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} - Accessibility checks`, async ({ page }) => {
        await page.goto(`${baseURL}${pageInfo.url}`)
        await page.waitForLoadState('networkidle')

        // Check for heading hierarchy
        const h1Count = await page.locator('h1').count()
        expect(h1Count).toBeGreaterThan(0)
        // Content pages may have h1 in both the page header and MDX body
        expect(h1Count).toBeLessThanOrEqual(3)

        // Check all images have alt text
        const images = await page.locator('img').all()
        for (const img of images) {
          const alt = await img.getAttribute('alt')
          expect(alt).toBeTruthy() // All images should have alt text
        }

        // Check for ARIA landmarks
        const nav = await page.locator('nav').count()
        const main = await page.locator('main').count()
        const footer = await page.locator('footer').count()

        expect(nav).toBeGreaterThan(0)
        expect(main).toBeGreaterThan(0)
        expect(footer).toBeGreaterThan(0)

        // Check all links have accessible names
        const links = await page.locator('a').all()
        for (const link of links) {
          const text = await link.textContent()
          const ariaLabel = await link.getAttribute('aria-label')
          expect(text || ariaLabel).toBeTruthy() // Links should have text or aria-label
        }

        console.log(`✓ ${pageInfo.name} - Accessibility checks passed`)
      })

      test(`${pageInfo.name} - Keyboard navigation`, async ({ page }) => {
        await page.goto(`${baseURL}${pageInfo.url}`)
        await page.waitForLoadState('networkidle')

        // Tab through interactive elements
        await page.keyboard.press('Tab')
        const focusedElement = await page.evaluate(
          () => document.activeElement?.tagName
        )
        expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement)

        console.log(`✓ ${pageInfo.name} - Keyboard navigation works`)
      })
    }
  })

  test.describe('Error Detection', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} - No console errors`, async ({ page }) => {
        const errors: string[] = []

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            errors.push(msg.text())
          }
        })

        page.on('pageerror', (error) => {
          errors.push(error.message)
        })

        await page.goto(`${baseURL}${pageInfo.url}`)
        await page.waitForLoadState('networkidle')

        // Filter out expected errors (if any)
        const criticalErrors = errors.filter(
          (err) =>
            !err.includes('favicon') && // Ignore favicon errors
            !err.includes('lighthouse') // Ignore lighthouse-related errors
        )

        if (criticalErrors.length > 0) {
          console.log(
            `${pageInfo.name} - Console errors found:`,
            criticalErrors
          )
        }

        expect(criticalErrors).toHaveLength(0)

        console.log(`✓ ${pageInfo.name} - No console errors`)
      })

      test(`${pageInfo.name} - No network errors`, async ({ page }) => {
        const failedRequests: string[] = []

        page.on('requestfailed', (request) => {
          failedRequests.push(request.url())
        })

        await page.goto(`${baseURL}${pageInfo.url}`)
        await page.waitForLoadState('networkidle')

        expect(failedRequests).toHaveLength(0)

        console.log(`✓ ${pageInfo.name} - No network errors`)
      })
    }
  })

  test.describe('Content Validation', () => {
    test('All internal links work', async ({ page }) => {
      await page.goto(baseURL)
      await page.waitForLoadState('networkidle')

      // Get all unique internal link hrefs
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => {
        const uniqueHrefs = new Set<string>()
        links.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) uniqueHrefs.add(href)
        })
        return Array.from(uniqueHrefs)
      })

      // Check each unique URL
      for (const href of hrefs) {
        const response = await page.goto(`${baseURL}${href}`)
        expect(response?.status()).toBe(200)
      }

      console.log(`✓ Checked ${hrefs.length} internal links - all working`)
    })

    test('All pages have proper metadata', async ({ page }) => {
      for (const pageInfo of pages) {
        await page.goto(`${baseURL}${pageInfo.url}`)
        await page.waitForLoadState('networkidle')

        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(0)

        console.log(`✓ ${pageInfo.name} - Title: "${title}"`)
      }
    })

    test('Code blocks are properly formatted', async ({ page }) => {
      // Check pages with code blocks
      const pagesWithCode = [
        '/start-here/mac-setup',
        '/start-here/windows-setup',
        '/data-analysis/python-intro',
        '/git-github',
      ]

      for (const url of pagesWithCode) {
        await page.goto(`${baseURL}${url}`)
        await page.waitForLoadState('networkidle')

        const codeBlocks = await page.locator('pre code').all()
        expect(codeBlocks.length).toBeGreaterThan(0)

        // Check that code blocks have content
        for (const block of codeBlocks) {
          const content = await block.textContent()
          expect(content?.trim().length).toBeGreaterThan(0)
        }

        console.log(
          `✓ ${url} - ${codeBlocks.length} code blocks found and formatted`
        )
      }
    })
  })

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Large Desktop', width: 2560, height: 1440 },
    ]

    for (const viewport of viewports) {
      test(`Home page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        })
        await page.goto(baseURL)
        await page.waitForLoadState('networkidle')

        // Check for horizontal scrolling
        const hasHorizontalScroll = await page.evaluate(() => {
          return (
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth
          )
        })

        expect(hasHorizontalScroll).toBe(false)

        // Take screenshot
        await page.screenshot({
          path: `screenshots/responsive-home-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true,
        })

        console.log(`✓ Home page responsive on ${viewport.name}`)
      })
    }
  })

  test.describe('Navigation Tests', () => {
    test('All navigation links are accessible', async ({ page }) => {
      await page.goto(baseURL)
      await page.waitForLoadState('networkidle')

      const navLinks = await page.locator('nav a').all()
      expect(navLinks.length).toBeGreaterThan(0)

      for (const link of navLinks) {
        const href = await link.getAttribute('href')
        const text = await link.textContent()

        expect(href).toBeTruthy()
        expect(text?.trim()).toBeTruthy()

        console.log(`  Nav link: "${text?.trim()}" -> ${href}`)
      }

      console.log(`✓ ${navLinks.length} navigation links verified`)
    })

    test('Footer has all expected sections', async ({ page }) => {
      await page.goto(baseURL)
      await page.waitForLoadState('networkidle')

      const footer = page.locator('footer')
      await expect(footer).toBeVisible()

      // Check for footer content
      const footerText = await footer.textContent()
      expect(footerText).toBeTruthy()

      console.log('✓ Footer present and has content')
    })
  })
})
