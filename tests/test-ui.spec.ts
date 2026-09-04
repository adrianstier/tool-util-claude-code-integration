import { test, expect } from '@playwright/test'

const baseURL = 'http://localhost:3001'

const pages = [
  '/',
  '/start-here',
  '/data-analysis',
  '/app-builder',
  '/automation',
  '/git-github',
  '/agents',
  '/mcp',
  '/advanced-topics',
  '/start-here/mac-setup',
  '/start-here/windows-setup',
  '/data-analysis/python-intro',
  '/data-analysis/r-intro',
]

test.describe('UI/UX Analysis', () => {
  for (const pagePath of pages) {
    test(`Check ${pagePath}`, async ({ page }) => {
      await page.goto(`${baseURL}${pagePath}`)

      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Take screenshot
      await page.screenshot({
        path: `screenshots${pagePath === '/' ? '/home' : pagePath}.png`,
        fullPage: true,
      })

      // Check for basic accessibility
      await expect(page).toHaveTitle(/.+/)

      // Log any console errors
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          console.log(`Console error on ${pagePath}:`, msg.text())
        }
      })

      console.log(`✓ Checked ${pagePath}`)
    })
  }
})
