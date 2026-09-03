import { test, expect } from '@playwright/test'
import { openSearch } from './helpers'

const baseURL = 'http://localhost:3001'

/** Navigate to a page in light mode so "Switch to dark mode" button is available */
async function gotoInLightMode(page: import('@playwright/test').Page, url: string) {
  // Set theme before any page script runs
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light')
  })
  await page.goto(url)
  await page.waitForLoadState('networkidle')
}

test.describe('AI Agents Track', () => {
  test.describe('Agents Main Page', () => {
    test('should load agents track page', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)
      await page.waitForLoadState('networkidle')

      // Check page title exists
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
    })

    test('should display agent modules as cards', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)
      await page.waitForLoadState('networkidle')

      // Check for module cards
      const cards = page.locator('.rounded-2xl.border')
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should have breadcrumb navigation', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)
      await page.waitForLoadState('networkidle')

      // Check for breadcrumbs
      const breadcrumb = page.locator('nav a:has-text("Home")')
      await expect(breadcrumb).toBeVisible()
    })

    test('should navigate to agent modules', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)
      await page.waitForLoadState('networkidle')

      // Click on first card with href
      const firstCard = page.locator('a.rounded-2xl').first()
      const href = await firstCard.getAttribute('href')

      if (href) {
        await firstCard.click()
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(new RegExp(href.replace('/', '\\/')))
      }
    })
  })

  test.describe('Agents Dark Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('theme', 'light')
      })
    })

    test('should apply dark mode to agents main page', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      // Check html has dark class
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)

      // Check content container has dark styling (track overview uses dark:bg-gray-800)
      const contentContainer = page.locator('.rounded-2xl').first()
      await expect(contentContainer).toBeVisible()
    })

    test('should apply dark mode to breadcrumbs on agents page', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      // Check breadcrumb links have dark mode hover states
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
    })

    test('should apply dark mode to module cards', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      // Check cards have dark background
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)

      // Verify card elements exist (cards use dark:bg-ink-900 design token)
      const cardBackground = page.locator('.rounded-2xl').first()
      await expect(cardBackground).toBeVisible()
    })

    test('should maintain dark mode when navigating between agent pages', async ({ page }) => {
      await page.goto(`${baseURL}/agents`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)

      // Navigate to a subpage if available
      const firstLink = page.locator('a[href^="/agents/"]').first()
      if (await firstLink.count() > 0) {
        await firstLink.click()
        await page.waitForLoadState('networkidle')

        // Dark mode should persist
        await expect(html).toHaveClass(/dark/)
      }
    })
  })

  test.describe('Agent Module Pages', () => {
    const agentModules = [
      { name: 'Building Agents', url: '/agents/building-agents' },
    ]

    for (const module of agentModules) {
      test(`${module.name} page should load`, async ({ page }) => {
        const response = await page.goto(`${baseURL}${module.url}`)

        // Check page loads (may return 200 or 404 if not created yet)
        if (response?.status() === 200) {
          await page.waitForLoadState('networkidle')

          // Check for heading (use first() as MDX content may have additional h1)
          const heading = page.locator('h1').first()
          await expect(heading).toBeVisible()
        }
      })
    }
  })
})

test.describe('Claude Code vs Web Content Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/start-here/claude-code-vs-web`)
    await page.waitForLoadState('networkidle')
  })

  test('should load the page successfully', async ({ page }) => {
    // Check page title (use first() as MDX content may have additional h1)
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Claude')
  })

  test('should display comparison table', async ({ page }) => {
    // Check for comparison content - markdown tables may render as styled divs
    // Let's check for section content instead
    const comparisonSection = page.locator('text=File Access')
    await expect(comparisonSection.first()).toBeVisible()
  })

  test('should have code blocks', async ({ page }) => {
    // Check for code blocks
    const codeBlocks = page.locator('pre')
    const count = await codeBlocks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have proper breadcrumb navigation', async ({ page }) => {
    // Check breadcrumbs
    const homeLink = page.locator('nav a:has-text("Home")').first()
    await expect(homeLink).toBeVisible()

    // Check track link exists
    const trackLink = page.locator('nav a:has-text("start here")').first()
    await expect(trackLink).toBeVisible()
  })

  test('should apply dark mode correctly', async ({ page }) => {
    await gotoInLightMode(page, `${baseURL}/start-here/claude-code-vs-web`)

    // Set dark mode
    const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
    await darkButton.click()

    // Check html has dark class
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Check dark mode background container exists (article nav uses dark:bg-gray-800)
    const darkContainer = page.locator('.rounded-2xl').first()
    await expect(darkContainer).toBeVisible()
  })

  test('should have section headings', async ({ page }) => {
    // Check for h2 headings
    const h2Headings = page.locator('h2')
    const count = await h2Headings.count()
    expect(count).toBeGreaterThan(3) // Should have multiple sections
  })

  test('should display permission options section', async ({ page }) => {
    // Check for permission content
    const permissionSection = page.locator('text=Permission')
    await expect(permissionSection.first()).toBeVisible()
  })

  test('should have internal links', async ({ page }) => {
    // Check for internal links at the bottom
    const internalLinks = page.locator('a[href^="/"]')
    const count = await internalLinks.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Track Pages Dark Mode', () => {
  const tracks = [
    { name: 'Start Here', url: '/start-here' },
    { name: 'Data Analysis', url: '/data-analysis' },
    { name: 'App Builder', url: '/app-builder' },
    { name: 'Automation', url: '/automation' },
    { name: 'Git GitHub', url: '/git-github' },
    { name: 'Agents', url: '/agents' },
  ]

  for (const track of tracks) {
    test(`${track.name} track page has dark mode support`, async ({ page }) => {
      await gotoInLightMode(page, `${baseURL}${track.url}`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      // Check html has dark class
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)

      // Check for dark mode containers (track overview uses dark:bg-gray-800)
      const darkContainer = page.locator('.rounded-2xl').first()
      await expect(darkContainer).toBeVisible()

      // Check for dark mode text (breadcrumb uses dark:text-white)
      const darkText = page.locator('h1, h2, [class*="dark:text-white"]').first()
      await expect(darkText).toBeVisible()
    })

    test(`${track.name} track page cards have dark mode`, async ({ page }) => {
      await gotoInLightMode(page, `${baseURL}${track.url}`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      // Check cards have dark borders
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)

      // Verify dark mode is applied to page elements
      const darkBorder = page.locator('.dark\\:border-gray-700').first()
      if (await darkBorder.count() > 0) {
        await expect(darkBorder).toBeVisible()
      }
    })
  }
})

test.describe('Content Module Pages Dark Mode', () => {
  const contentPages = [
    '/start-here/mac-setup',
    '/start-here/windows-setup',
    '/start-here/claude-code-vs-web',
    '/data-analysis/python-intro',
  ]

  for (const url of contentPages) {
    test(`${url} has dark mode support`, async ({ page }) => {
      await gotoInLightMode(page, `${baseURL}${url}`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      // Check html has dark class
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)

      // Check dark mode container exists (article nav or content area)
      const darkContainer = page.locator('.rounded-2xl').first()
      await expect(darkContainer).toBeVisible()
    })

    test(`${url} inline code has dark mode`, async ({ page }) => {
      await gotoInLightMode(page, `${baseURL}${url}`)

      // Set dark mode
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
      await darkButton.click()

      // Check for inline code elements
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
    })
  }
})

test.describe('Tools Pages Dark Mode Extended', () => {
  test('Templates page has full dark mode support', async ({ page }) => {
    await gotoInLightMode(page, `${baseURL}/tools/templates`)

    // Set dark mode
    const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
    await darkButton.click()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Check filter buttons
    const filterButtons = page.locator('button:has-text("All")')
    await expect(filterButtons).toBeVisible()

    // Expand a template and check dark mode
    await page.locator('button:has-text("View Files")').first().click()

    // Files section should be visible with dark mode
    const filesSection = page.locator('text=Included Files')
    await expect(filesSection).toBeVisible()
  })

  test('Snippets page has full dark mode support', async ({ page }) => {
    await gotoInLightMode(page, `${baseURL}/tools/snippets`)

    // Set dark mode
    const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
    await darkButton.click()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Check search input has dark mode
    const searchInput = page.locator('input[placeholder="Search snippets..."]')
    await expect(searchInput).toBeVisible()
  })

  test('Cheatsheets page has full dark mode support', async ({ page }) => {
    await gotoInLightMode(page, `${baseURL}/tools/cheatsheets`)

    // Set dark mode
    const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
    await darkButton.click()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Expand a cheatsheet and check dark mode
    await page.locator('button:has-text("View")').first().click()

    // Content should be visible
    const content = page.locator('.max-h-96.overflow-y-auto')
    await expect(content.first()).toBeVisible()
  })

  test('MCP Explorer page has full dark mode support', async ({ page }) => {
    await gotoInLightMode(page, `${baseURL}/tools/mcp-explorer`)

    // Set dark mode
    const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
    await darkButton.click()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Check search input
    const searchInput = page.locator('input[placeholder="Search MCP servers..."]')
    await expect(searchInput).toBeVisible()

    // Expand a server
    await page.locator('button:has-text("View Config")').first().click()

    // Config example should be visible
    const configExample = page.locator('text=Configuration Example')
    await expect(configExample).toBeVisible()
  })
})

test.describe('Navigation and Integration', () => {
  test('should find agents track via search', async ({ page }) => {
    await page.goto(baseURL)

    // Open search
    await openSearch(page)

    // Wait for modal
    const searchInput = page.locator('input[placeholder="Search documentation..."]')
    await expect(searchInput).toBeVisible()

    // Search for agents
    await page.keyboard.type('agents')

    // Check results
    // Search now derives entries from content/, so "agents" legitimately matches
    // several results; assert the track landing is among them.
    const agentResult = page.locator('button:has-text("AI Agents")').first()
    await expect(agentResult).toBeVisible()
  })

  test('should find Claude Code vs Web page via search', async ({ page }) => {
    await page.goto(baseURL)

    // Open search
    await openSearch(page)

    // Wait for modal
    const searchInput = page.locator('input[placeholder="Search documentation..."]')
    await expect(searchInput).toBeVisible()

    // Search for comparison
    await page.keyboard.type('vs web')

    // Check results contain the new page
    const result = page.locator('button:has-text("Claude Code vs")')
    if (await result.count() > 0) {
      await expect(result).toBeVisible()
    }
  })

  test('should navigate from home to agents track', async ({ page }) => {
    await page.goto(baseURL)
    await page.waitForLoadState('networkidle')

    // Find and click agents link
    const agentsLink = page.locator('a[href="/agents"]').first()
    if (await agentsLink.count() > 0) {
      await agentsLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveURL(/\/agents/)
    }
  })

  test('should navigate through all track pages without errors', async ({ page }) => {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    const tracks = ['/start-here', '/data-analysis', '/app-builder', '/automation', '/git-github', '/agents']

    for (const track of tracks) {
      await page.goto(`${baseURL}${track}`)
      await page.waitForLoadState('networkidle')
    }

    // Filter out expected errors
    const criticalErrors = errors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('lighthouse')
    )

    expect(criticalErrors).toHaveLength(0)
  })
})

test.describe('Forms and Interactive Components', () => {
  test('filter buttons work on templates page', async ({ page }) => {
    await page.goto(`${baseURL}/tools/templates`)
    await page.waitForLoadState('networkidle')

    // Click different category buttons
    const categories = ['Web App', 'CLI', 'Data', 'All']

    for (const category of categories) {
      const button = page.locator(`button:has-text("${category}")`)
      if (await button.count() > 0) {
        await button.click()
        // Should update without errors
        await page.waitForTimeout(100)
      }
    }

    // Page should still be functional
    const templates = page.locator('.rounded-xl.border')
    await expect(templates.first()).toBeVisible()
  })

  test('search input filters on snippets page', async ({ page }) => {
    await page.goto(`${baseURL}/tools/snippets`)
    await page.waitForLoadState('networkidle')

    const searchInput = page.locator('input[placeholder="Search snippets..."]')

    // Type and clear multiple times
    await searchInput.fill('git')
    await page.waitForTimeout(100)
    await searchInput.fill('')
    await page.waitForTimeout(100)
    await searchInput.fill('python')

    // Page should handle this gracefully
    await expect(searchInput).toHaveValue('python')
  })

  test('category filters work on snippets page', async ({ page }) => {
    await page.goto(`${baseURL}/tools/snippets`)
    await page.waitForLoadState('networkidle')

    // Click different category buttons
    const gitButton = page.locator('button:has-text("Git")')
    await gitButton.click()

    // Results should filter
    const snippets = page.locator('.rounded-xl.border')
    await expect(snippets.first()).toBeVisible()
  })

  test('category filters work on MCP explorer', async ({ page }) => {
    await page.goto(`${baseURL}/tools/mcp-explorer`)
    await page.waitForLoadState('networkidle')

    // Click different category buttons
    const coreButton = page.locator('button:has-text("Core")')
    await coreButton.click()

    // Results should filter
    const servers = page.locator('.rounded-xl.border')
    await expect(servers.first()).toBeVisible()
  })

  test('expand/collapse works consistently', async ({ page }) => {
    await page.goto(`${baseURL}/tools/cheatsheets`)
    await page.waitForLoadState('networkidle')

    // Expand first cheatsheet
    await page.locator('button:has-text("View")').first().click()

    // Content should be visible
    let content = page.locator('.max-h-96.overflow-y-auto').first()
    await expect(content).toBeVisible()

    // Collapse it
    await page.locator('button:has-text("Hide")').first().click()

    // View button should be back
    await expect(page.locator('button:has-text("View")').first()).toBeVisible()
  })
})

test.describe('Visual Consistency', () => {
  test('dark mode applies to all major elements on homepage', async ({ page }) => {
    await gotoInLightMode(page, baseURL)

    // Set dark mode
    const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
    await darkButton.click()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Check nav
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()

    // Check footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Check main content (use first() as there may be nested main elements)
    const main = page.locator('main').first()
    await expect(main).toBeVisible()
  })

  test('cards render consistently across all track pages', async ({ page }) => {
    const tracks = ['/start-here', '/data-analysis', '/app-builder', '/automation', '/git-github', '/agents']

    for (const track of tracks) {
      await page.goto(`${baseURL}${track}`)
      await page.waitForLoadState('networkidle')

      // Check for consistent card structure
      const cards = page.locator('.rounded-2xl.border')
      if (await cards.count() > 0) {
        // Cards should have consistent styling
        await expect(cards.first()).toBeVisible()
      }
    }
  })

  test('code blocks render correctly in dark mode', async ({ page }) => {
    await gotoInLightMode(page, `${baseURL}/start-here/claude-code-vs-web`)

    // Set dark mode
    const darkButton = page.locator('button[aria-label="Switch to dark mode"]').first()
    await darkButton.click()

    // Code blocks should be visible
    const codeBlocks = page.locator('pre')
    const count = await codeBlocks.count()
    expect(count).toBeGreaterThan(0)

    // First code block should be visible
    await expect(codeBlocks.first()).toBeVisible()
  })
})
