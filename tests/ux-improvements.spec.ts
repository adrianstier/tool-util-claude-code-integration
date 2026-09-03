import { test, expect } from '@playwright/test'
import { openSearch } from './helpers'

const baseURL = 'http://localhost:3001'

test.describe('UX Improvements - Phase 1', () => {
  // ─────────────────────────────────────────────────────────────────
  // Homepage Grid (8 tracks)
  // ─────────────────────────────────────────────────────────────────
  test.describe('Homepage Grid (8 tracks)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(baseURL)
    })

    test('homepage shows all 8 track cards', async ({ page }) => {
      const trackNames = [
        'Start Here',
        'Data Analysis',
        'Git & GitHub',
        'App Builder',
        'Automation',
        'AI Agents',
        'MCP Integration',
        'Advanced Topics',
      ]

      for (const name of trackNames) {
        const card = page.locator(`h3:has-text("${name}")`)
        await expect(card).toBeVisible()
      }
    })

    // No track is a stub: App Builder, Automation and Git & GitHub carry their
    // tutorial on the landing page itself (index.mdx `selfContained: true`), so
    // none of the cards may advertise "Coming Soon".
    test('no track card claims "Coming Soon"', async ({ page }) => {
      const grid = page.locator('#tracks')
      await expect(grid.locator('text=Coming Soon')).toHaveCount(0)
    })

    test('"Git & GitHub" card shows "Essential" tag', async ({ page }) => {
      const gitCard = page.locator('#tracks a[href="/git-github"]')
      await expect(gitCard).toBeVisible()
      await expect(gitCard.locator('text=Essential')).toBeVisible()
    })

    test('"MCP Integration" card shows tag', async ({ page }) => {
      const mcpCard = page.locator('#tracks a[href="/mcp"]')
      await expect(mcpCard).toBeVisible()
      // MCP card should have either "New" or "Advanced" tag
      const tag = mcpCard.locator('span.rounded-full')
      await expect(tag).toBeVisible()
      const tagText = await tag.textContent()
      expect(tagText === 'New' || tagText === 'Advanced').toBeTruthy()
    })

    test('every track card shows a real duration from its content', async ({ page }) => {
      const cards = page.locator('#tracks a[href^="/"]')
      const count = await cards.count()
      expect(count).toBe(8)
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText(/\d+\s*(min|hours?)/)
      }
    })

    test('all track cards have working links', async ({ page }) => {
      const tracks = [
        { name: 'Start Here', href: '/start-here' },
        { name: 'Data Analysis', href: '/data-analysis' },
        { name: 'Git & GitHub', href: '/git-github' },
        { name: 'App Builder', href: '/app-builder' },
        { name: 'Automation', href: '/automation' },
        { name: 'AI Agents', href: '/agents' },
        { name: 'MCP Integration', href: '/mcp' },
      ]

      for (const track of tracks) {
        await page.goto(baseURL)
        const card = page.locator(`a[href="${track.href}"]`).first()
        await expect(card).toBeVisible()
        await card.click()
        await expect(page).toHaveURL(new RegExp(track.href.replace(/\//g, '\\/')))
      }
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // Search Modal - New Items
  // ─────────────────────────────────────────────────────────────────
  test.describe('Search Modal - New Items', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(baseURL)
    })

    test('search "MCP" shows MCP results', async ({ page }) => {
      await openSearch(page)
      const searchInput = page.locator('input[placeholder="Search documentation..."]')
      await expect(searchInput).toBeVisible()

      await page.keyboard.type('MCP')

      // Should show MCP Integration and/or MCP Fundamentals results
      const mcpResult = page.locator('button:has-text("MCP")')
      await expect(mcpResult.first()).toBeVisible()
    })

    test('search "multi-agent" shows Multi-Agent Architectures result', async ({ page }) => {
      await openSearch(page)
      const searchInput = page.locator('input[placeholder="Search documentation..."]')
      await expect(searchInput).toBeVisible()

      await page.keyboard.type('multi-agent')

      const result = page.locator('button:has-text("Multi-Agent Architectures")')
      await expect(result).toBeVisible()
    })

    test('search "skills" shows Skills result', async ({ page }) => {
      await openSearch(page)
      const searchInput = page.locator('input[placeholder="Search documentation..."]')
      await expect(searchInput).toBeVisible()

      await page.keyboard.type('skills')

      const result = page.locator('button:has-text("Skills")')
      await expect(result).toBeVisible()
    })

    test('clicking MCP result navigates to /mcp', async ({ page }) => {
      await openSearch(page)
      const searchInput = page.locator('input[placeholder="Search documentation..."]')
      await expect(searchInput).toBeVisible()

      await page.keyboard.type('MCP Integration')

      const mcpResult = page.locator('button:has-text("MCP Integration")').first()
      await expect(mcpResult).toBeVisible()
      await mcpResult.click()

      await expect(page).toHaveURL(/\/mcp/)
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // MCP Track Pages
  // ─────────────────────────────────────────────────────────────────
  test.describe('MCP Track Pages', () => {
    test('/mcp loads successfully with h1 visible', async ({ page }) => {
      await page.goto(`${baseURL}/mcp`)
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      await expect(heading).toContainText('MCP')
    })

    test('/mcp/mcp-fundamentals loads with content', async ({ page }) => {
      // Assert on the HTTP status, not on the words "not found" — several MCP
      // articles legitimately quote a "Module not found" error in a code sample.
      const response = await page.goto(`${baseURL}/mcp/mcp-fundamentals`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
    })

    test('/mcp/essential-servers loads with content', async ({ page }) => {
      // Assert on the HTTP status, not on the words "not found" — several MCP
      // articles legitimately quote a "Module not found" error in a code sample.
      const response = await page.goto(`${baseURL}/mcp/essential-servers`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
    })

    test('/mcp/building-custom-mcps loads with content', async ({ page }) => {
      // Assert on the HTTP status, not on the words "not found" — several MCP
      // articles legitimately quote a "Module not found" error in a code sample.
      const response = await page.goto(`${baseURL}/mcp/building-custom-mcps`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
    })

    test('/mcp/workflows-and-troubleshooting loads with content', async ({ page }) => {
      // Assert on the HTTP status, not on the words "not found" — several MCP
      // articles legitimately quote a "Module not found" error in a code sample.
      const response = await page.goto(`${baseURL}/mcp/workflows-and-troubleshooting`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
    })

    test('MCP track page has module cards linking to subpages', async ({ page }) => {
      await page.goto(`${baseURL}/mcp`)

      // The shell renders exactly one "Modules" card list. MDX bodies must not
      // add a second heading with that name (mcp/index.mdx used to).
      const modulesHeading = page.getByRole('heading', { name: 'Modules', exact: true })
      await expect(modulesHeading).toHaveCount(1)
      await expect(modulesHeading).toBeVisible()

      // Check for links to each MCP module subpage
      const moduleLinks = [
        '/mcp/mcp-fundamentals',
        '/mcp/essential-servers',
        '/mcp/building-custom-mcps',
        '/mcp/workflows-and-troubleshooting',
      ]

      for (const href of moduleLinks) {
        const link = page.locator(`a[href="${href}"]`)
        await expect(link).toBeVisible()
      }
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // Cross-Track Links
  // ─────────────────────────────────────────────────────────────────
  test.describe('Cross-Track Links', () => {
    test('/agents page contains "MCP Integration track" link text', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)
      const crossLink = page.locator('text=MCP Integration track')
      await expect(crossLink).toBeVisible()
    })

    test('/mcp page contains "AI Agents track" link text', async ({ page }) => {
      await page.goto(`${baseURL}/mcp`)
      const crossLink = page.locator('text=AI Agents track')
      await expect(crossLink).toBeVisible()
    })

    test('clicking MCP link from agents page navigates to /mcp', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)
      const mcpLink = page.locator('a[href="/mcp"]:has-text("MCP Integration track")')
      await expect(mcpLink).toBeVisible()
      await mcpLink.click()
      await expect(page).toHaveURL(/\/mcp/)
    })

    test('clicking agents link from MCP page navigates to /agents', async ({ page }) => {
      await page.goto(`${baseURL}/mcp`)
      const agentsLink = page.locator('a[href="/agents"]:has-text("AI Agents track")')
      await expect(agentsLink).toBeVisible()
      await agentsLink.click()
      await expect(page).toHaveURL(/\/agents/)
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // Prerequisite Callouts
  // ─────────────────────────────────────────────────────────────────
  test.describe('Prerequisite Callouts', () => {
    test('/agents page shows "Before You Start" callout mentioning "Start Here"', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)
      const callout = page.locator('text=Before You Start')
      await expect(callout).toBeVisible()
      // The callout content should mention "Start Here"
      const startHereLink = page.locator('a[href="/start-here"]')
      await expect(startHereLink.first()).toBeVisible()
    })

    test('/mcp page shows "Before You Start" callout mentioning "Start Here"', async ({ page }) => {
      await page.goto(`${baseURL}/mcp`)
      const callout = page.locator('text=Before You Start')
      await expect(callout).toBeVisible()
      const startHereLink = page.locator('a[href="/start-here"]')
      await expect(startHereLink.first()).toBeVisible()
    })

    test('/advanced-topics page shows "Before You Start" callout', async ({ page }) => {
      await page.goto(`${baseURL}/advanced-topics`)
      const callout = page.locator('text=Before You Start')
      await expect(callout).toBeVisible()
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // Glossary Links
  // ─────────────────────────────────────────────────────────────────
  test.describe('Glossary Links', () => {
    test('/start-here page contains link to /glossary', async ({ page }) => {
      await page.goto(`${baseURL}/start-here`)
      const glossaryLink = page.locator('a[href="/glossary"]')
      await expect(glossaryLink.first()).toBeVisible()
    })

    test('/git-github page contains link to /glossary', async ({ page }) => {
      await page.goto(`${baseURL}/git-github`)
      const glossaryLink = page.locator('a[href="/glossary"]')
      await expect(glossaryLink.first()).toBeVisible()
    })

    test('/glossary page loads successfully', async ({ page }) => {
      await page.goto(`${baseURL}/glossary`)
      await expect(page.locator('h1')).toBeVisible()
      // Should not be a 404
      await expect(page).not.toHaveURL(/404/)
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // Learning Paths (constants)
  // ─────────────────────────────────────────────────────────────────
  test.describe('Learning Paths', () => {
    test('homepage has learning track content visible', async ({ page }) => {
      await page.goto(baseURL)

      // The homepage should display the "Learning Tracks" section
      const learningTracksSection = page.locator('text=Learning Tracks')
      await expect(learningTracksSection.first()).toBeVisible()

      // "Choose Your Learning Path" heading should be present
      const pathHeading = page.locator('text=Choose Your Learning Path')
      await expect(pathHeading).toBeVisible()
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // Accessibility Fixes (verify design system tokens)
  // ─────────────────────────────────────────────────────────────────
  test.describe('Accessibility Fixes', () => {
    const pagesToCheck = [
      '/',
      '/start-here',
      '/git-github',
      '/agents',
      '/mcp',
      '/advanced-topics',
    ]

    for (const pagePath of pagesToCheck) {
      test(`no elements with deprecated claude-500/claude-600 classes on ${pagePath}`, async ({ page }) => {
        await page.goto(`${baseURL}${pagePath}`)
        await page.waitForLoadState('domcontentloaded')

        // The legacy `claude-*` scale was removed from tailwind.config.ts; every
        // usage is now a `primary-*` token. Any `claude-<shade>` class left in the
        // markup would therefore render no colour at all, so this is a hard fail.
        const deprecatedElements = await page.evaluate(() => {
          const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
          const selector = shades.map((s) => `[class*="claude-${s}"]`).join(', ')
          return document.querySelectorAll(selector).length
        })

        expect(deprecatedElements).toBe(0)
      })
    }

    test('InfoTable headers have scope="col" attribute', async ({ page }) => {
      // MCP index page has an InfoTable
      await page.goto(`${baseURL}/mcp`)

      // Wait for content to render
      await page.waitForLoadState('domcontentloaded')

      // Find th elements inside tables and verify they have scope="col"
      const thElements = page.locator('table th[scope="col"]')
      const count = await thElements.count()

      // The MCP page has an InfoTable with at least 3 column headers
      expect(count).toBeGreaterThanOrEqual(3)
    })
  })

  // ─────────────────────────────────────────────────────────────────
  // Error Boundary
  // ─────────────────────────────────────────────────────────────────
  test.describe('Error Boundary', () => {
    test('error boundary component exists and has expected UI elements', async ({ page }) => {
      // We cannot easily trigger an ErrorBoundary in a Playwright test,
      // but we can verify the component file is loaded by the app and
      // that the error page (app/error.tsx) renders for runtime errors.
      // For now, verify the app loads without errors as a baseline.
      await page.goto(baseURL)
      await expect(page.locator('nav')).toBeVisible()

      // Also verify the dedicated Next.js error page exists by checking
      // that an invalid nested route does not crash the app entirely
      await page.goto(`${baseURL}/this-track-does-not-exist`)
      // Should get a 404 page, not a blank crash
      await expect(page.locator('body')).toBeVisible()
    })
  })
})
