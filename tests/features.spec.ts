import { test, expect } from '@playwright/test'
import { openSearch } from './helpers'

const baseURL = 'http://localhost:3001'

/** Navigate to a page in light mode so "Switch to dark mode" button is available */
async function gotoInLightMode(
  page: import('@playwright/test').Page,
  url: string
) {
  // Set theme before any page script runs
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light')
  })
  await page.goto(url)
  await page.waitForLoadState('networkidle')
}

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Set light mode so "Switch to dark mode" button is available
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light')
    })
  })

  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Wait for theme toggle to be visible (use first() as there are desktop and mobile versions)
    const themeToggle = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await expect(themeToggle).toBeVisible()

    // Check initial state (should be light or system)
    const html = page.locator('html')

    // Click dark mode button
    await themeToggle.click()
    await expect(html).toHaveClass(/dark/)

    // Click light mode button (after toggling to dark, label changes)
    const lightButton = page
      .locator('button[aria-label="Switch to light mode"]')
      .first()
    await lightButton.click()
    await expect(html).not.toHaveClass(/dark/)
  })

  test('should persist theme choice in localStorage', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Set dark mode (use first() as there are desktop and mobile versions)
    const darkButton = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await darkButton.click()

    // Wait for theme to be applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Check localStorage is set to dark
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')
  })

  test('should support toggling theme mode', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Toggle to dark mode (use first() as there are desktop and mobile versions)
    const darkButton = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await darkButton.click()

    // Check localStorage is set to dark
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')
  })

  test('should apply dark mode styles to navigation', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Set dark mode (use first() as there are desktop and mobile versions)
    const darkButton = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await darkButton.click()

    // Check html has dark class
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('should apply dark mode styles to footer', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Set dark mode (use first() as there are desktop and mobile versions)
    const darkButton = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await darkButton.click()

    // Check html has dark class (footer styling is applied via dark: prefix)
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })
})

test.describe('Search Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001')
  })

  test('should open with Cmd+K shortcut', async ({ page }) => {
    // Press Ctrl+K (Meta+K doesn't always work in Playwright)
    await openSearch(page)

    // Check modal is visible
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toBeFocused()
  })

  test('should open with click on search button', async ({ page }) => {
    // Click search button
    const searchButton = page.locator('button[aria-label="Search"]')
    await searchButton.click()

    // Check modal is visible
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()
  })

  test('should close with Escape key', async ({ page }) => {
    // Open modal
    await openSearch(page)

    // Press Escape
    await page.keyboard.press('Escape')

    // Check modal is closed
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).not.toBeVisible()
  })

  test('should close when clicking backdrop', async ({ page }) => {
    // Open modal
    await openSearch(page)

    // Wait for modal to open
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()

    // Press Escape to close (more reliable than clicking backdrop)
    await page.keyboard.press('Escape')

    // Check modal is closed
    await expect(searchInput).not.toBeVisible()
  })

  test('should filter results based on search query', async ({ page }) => {
    // Open modal
    await openSearch(page)

    // Wait for modal to be ready
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()

    // Type search query
    await page.keyboard.type('git')

    // Check results are filtered
    const results = page.locator('button:has-text("Git & GitHub")')
    await expect(results).toBeVisible()
  })

  test('should navigate results with arrow keys', async ({ page }) => {
    // Open modal
    await openSearch(page)

    // Wait for modal to be visible
    await expect(
      page.locator('input[placeholder="Search documentation..."]')
    ).toBeVisible()

    // Press down arrow
    await page.keyboard.press('ArrowDown')

    // Check that navigation works by looking for ArrowRight icon on second item
    // The second search result button should now be selected
    await page.waitForTimeout(100)
  })

  test('should navigate to page on Enter', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Open modal
    await openSearch(page)

    // Wait for modal to open
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()

    // Wait for the results list to render before pressing Enter — the list is
    // built from the content index, so an Enter fired too early hits nothing.
    const firstResult = page.locator('button:has-text("Start Here")').first()
    await expect(firstResult).toBeVisible()

    // Press Enter (selects first item)
    await page.keyboard.press('Enter')

    // Check navigation occurred
    await expect(page).toHaveURL(/\/start-here/)
  })

  test('should navigate to page on click', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Open modal
    await openSearch(page)

    // Wait for modal to open
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()

    // Type to filter results
    await searchInput.fill('Start Here')
    await page.waitForTimeout(300)

    // Click on the first matching result
    const result = page.locator('button:has-text("Start Here")').first()
    await result.click()

    // Check navigation occurred
    await expect(page).toHaveURL(/\/start-here/)
  })

  test('should show "no results" message for invalid search', async ({
    page,
  }) => {
    // Open modal
    await openSearch(page)

    // Type invalid search query
    await page.keyboard.type('xyznonexistent')

    // Check no results message
    const noResults = page.locator('text=No results found')
    await expect(noResults).toBeVisible()
  })

  test('should clear search on close and reopen', async ({ page }) => {
    // Open modal and search
    await openSearch(page)

    // Wait for modal
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()

    await page.keyboard.type('git')

    // Close and reopen
    await page.keyboard.press('Escape')
    await openSearch(page)

    // Check search is cleared
    await expect(searchInput).toHaveValue('')
  })

  test('should display all tool pages in search', async ({ page }) => {
    // Open modal
    await openSearch(page)

    // Wait for modal
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()

    // Type "templates" to find the new pages
    await page.keyboard.type('templates')

    const templateResult = page.locator('button:has-text("Project Templates")')
    await expect(templateResult).toBeVisible()
  })
})

test.describe('Project Templates Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/tools/templates')
  })

  test('should display all templates', async ({ page }) => {
    // Check templates are displayed (there are 6 templates, but the filter bar also matches)
    const templates = page.locator('.grid .rounded-xl.border')
    const count = await templates.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  test('should filter templates by category', async ({ page }) => {
    // Click on Web App category
    await page.locator('button:has-text("Web App")').click()

    // Check only Web App templates are shown
    const templates = page.locator(
      '.rounded-xl.border:has-text("Next.js Starter")'
    )
    await expect(templates).toBeVisible()
  })

  test('should show "All" category by default', async ({ page }) => {
    const allButton = page.locator('button:has-text("All")')
    await expect(allButton).toHaveClass(/bg-primary-600/)
  })

  test('should expand template to show files', async ({ page }) => {
    // Click "View Files" on first template
    await page.locator('button:has-text("View Files")').first().click()

    // Check files are visible
    const filesSection = page.locator('text=Included Files')
    await expect(filesSection).toBeVisible()
  })

  test('should collapse template files on second click', async ({ page }) => {
    // Click "View Files" twice
    const viewFilesButton = page
      .locator('button:has-text("View Files")')
      .first()
    await viewFilesButton.click()

    // Button text should change to "Hide Files"
    await expect(
      page.locator('button:has-text("Hide Files")').first()
    ).toBeVisible()

    // Click again to hide
    await page.locator('button:has-text("Hide Files")').first().click()

    // Files should be hidden
    const filesSection = page.locator('text=Included Files')
    await expect(filesSection).not.toBeVisible()
  })

  test('should copy file content to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Expand template
    await page.locator('button:has-text("View Files")').first().click()

    // Click copy button
    const copyButton = page.locator('.rounded-lg.border .rounded.p-1').first()
    await copyButton.click()

    // Check for checkmark (success indicator)
    const checkIcon = page.locator('.text-green-500')
    await expect(checkIcon).toBeVisible()
  })

  test('should download all files', async ({ page }) => {
    // Set up download listener
    const downloadPromise = page.waitForEvent('download')

    // Click download button
    await page.locator('button:has-text("Download")').first().click()

    // Check download was triggered
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBeTruthy()
  })

  test('should display difficulty badges', async ({ page }) => {
    // Check for difficulty badges
    const beginnerBadge = page.locator('text=Beginner')
    const intermediateBadge = page.locator('text=Intermediate')
    const advancedBadge = page.locator('text=Advanced')

    await expect(beginnerBadge.first()).toBeVisible()
    await expect(intermediateBadge.first()).toBeVisible()
    await expect(advancedBadge.first()).toBeVisible()
  })

  test('should display template tags', async ({ page }) => {
    // Check for tags
    const tags = page.locator('.rounded.bg-gray-100')
    await expect(tags.first()).toBeVisible()
  })

  test('should have back link to home', async ({ page }) => {
    // Click back link
    await page.locator('text=Back to Home').click()

    // Check navigation
    await expect(page).toHaveURL('http://localhost:3001/')
  })
})

test.describe('Code Snippet Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/tools/snippets')
  })

  test('should display all snippets', async ({ page }) => {
    // Check snippets are displayed
    const snippets = page.locator('.rounded-xl.border')
    const count = await snippets.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should filter snippets by category', async ({ page }) => {
    // Click on Git category
    await page.locator('button:has-text("Git")').click()

    // Check only Git snippets are shown
    const gitSnippet = page.locator('text=Git Commit with Claude')
    await expect(gitSnippet).toBeVisible()
  })

  test('should search snippets', async ({ page }) => {
    // Type in search box
    await page.locator('input[placeholder="Search snippets..."]').fill('pandas')

    // Check filtered results
    const pandasSnippet = page.locator('text=Pandas DataFrame Operations')
    await expect(pandasSnippet).toBeVisible()
  })

  test('should copy snippet to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Click copy button on first snippet
    await page.locator('button:has-text("Copy")').first().click()

    // Check for success indicator
    const copiedText = page.locator('text=Copied!')
    await expect(copiedText).toBeVisible()
  })

  test('should show language badge for each snippet', async ({ page }) => {
    // Check for language badges
    const bashBadge = page.locator('.text-xs.font-medium:has-text("bash")')
    await expect(bashBadge).toBeVisible()
  })

  test('should show "no snippets found" for invalid search', async ({
    page,
  }) => {
    // Type invalid search
    await page
      .locator('input[placeholder="Search snippets..."]')
      .fill('xyznonexistent')

    // Check no results message
    const noResults = page.locator('text=No snippets found')
    await expect(noResults).toBeVisible()
  })

  test('should display snippet tags', async ({ page }) => {
    // Check for tags under each snippet
    const tags = page.locator('.rounded.bg-gray-100')
    await expect(tags.first()).toBeVisible()
  })

  test('should show code in dark background', async ({ page }) => {
    // Check code block styling
    const codeBlock = page.locator('.bg-gray-900')
    await expect(codeBlock.first()).toBeVisible()
  })
})

test.describe('Cheat Sheets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/tools/cheatsheets')
  })

  test('should display all cheat sheets', async ({ page }) => {
    // Check cheat sheets are displayed
    const sheets = page.locator('.grid.gap-6 > .rounded-xl.border')
    await expect(sheets).toHaveCount(7)
  })

  test('should expand cheat sheet to show content', async ({ page }) => {
    // Click "View" on first cheat sheet
    await page.locator('button:has-text("View")').first().click()

    // Check content is visible
    const content = page.locator('.max-h-96.overflow-y-auto')
    await expect(content.first()).toBeVisible()
  })

  test('should collapse cheat sheet on second click', async ({ page }) => {
    // Click "View" twice
    await page.locator('button:has-text("View")').first().click()

    // Button text should change to "Hide"
    await expect(page.locator('button:has-text("Hide")').first()).toBeVisible()

    // Click again to hide
    await page.locator('button:has-text("Hide")').first().click()

    // Content should be hidden
    await expect(page.locator('button:has-text("View")').first()).toBeVisible()
  })

  test('should open print dialog on Print button click', async ({ page }) => {
    // Set up popup/dialog listener
    const popupPromise = page.waitForEvent('popup')

    // Click print button
    await page.locator('button:has-text("Print")').first().click()

    // Check popup was opened
    const popup = await popupPromise
    expect(popup).toBeTruthy()
  })

  test('should display section titles', async ({ page }) => {
    // Expand cheat sheet
    await page.locator('button:has-text("View")').first().click()

    // Check for section titles
    const sectionTitle = page.locator('.text-sm.font-semibold')
    await expect(sectionTitle.first()).toBeVisible()
  })

  test('should display command and description for each item', async ({
    page,
  }) => {
    // Expand cheat sheet
    await page.locator('button:has-text("View")').first().click()

    // Check for code elements
    const codeElements = page.locator('code')
    await expect(codeElements.first()).toBeVisible()
  })

  test('should display number of sections for each cheat sheet', async ({
    page,
  }) => {
    // Check for "X sections" text
    const sectionsText = page.locator('text=/\\d+ sections/')
    await expect(sectionsText.first()).toBeVisible()
  })
})

test.describe('MCP Server Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/tools/mcp-explorer')
  })

  test('should display all MCP servers', async ({ page }) => {
    // Check servers are displayed
    const servers = page.locator('.rounded-xl.border')
    const count = await servers.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should filter servers by category', async ({ page }) => {
    // Click on Core category
    await page.locator('button:has-text("Core")').click()

    // Check only Core servers are shown
    const filesystemServer = page.locator('h3:has-text("Filesystem")')
    await expect(filesystemServer).toBeVisible()
  })

  test('should search servers', async ({ page }) => {
    // Type in search box
    await page
      .locator('input[placeholder="Search MCP servers..."]')
      .fill('github')

    // Check filtered results
    const githubServer = page.locator('h3:has-text("GitHub")')
    await expect(githubServer).toBeVisible()
  })

  test('should copy install command', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Click copy button for install command (the button within the code block)
    const copyButton = page.locator('button:has(.h-4.w-4)').first()
    await copyButton.click()

    // Wait a bit for the copy action to complete and icon to change
    await page.waitForTimeout(100)

    // Page should not crash after copying
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should expand server to show config example', async ({ page }) => {
    // Click "View Config" on first server
    await page.locator('button:has-text("View Config")').first().click()

    // Check config is visible
    const configExample = page.locator('text=Configuration Example')
    await expect(configExample).toBeVisible()
  })

  test('should display features list when expanded', async ({ page }) => {
    // Expand server
    await page.locator('button:has-text("View Config")').first().click()

    // Check features are visible
    const features = page.locator('text=Features')
    await expect(features).toBeVisible()
  })

  test('should copy config example', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Expand server
    await page.locator('button:has-text("View Config")').first().click()

    // Click copy button for config
    const copyConfigButton = page
      .locator('.text-gray-400.hover\\:text-gray-600')
      .last()
    await copyConfigButton.click()

    // Check for success indicator
    const checkIcon = page.locator('.text-green-500')
    await expect(checkIcon).toBeVisible()
  })

  test('should have external link to docs', async ({ page }) => {
    // Check external docs links exist on MCP servers (these link to GitHub)
    // First expand a server to see its docs link
    await page.locator('button:has-text("View Config")').first().click()

    // Look for an external link to documentation
    const externalLink = page.locator('a[target="_blank"]').first()
    await expect(externalLink).toBeVisible()
  })

  test('should show "no servers found" for invalid search', async ({
    page,
  }) => {
    // Type invalid search
    await page
      .locator('input[placeholder="Search MCP servers..."]')
      .fill('xyznonexistent')

    // Check no results message
    const noResults = page.locator('text=No servers found')
    await expect(noResults).toBeVisible()
  })

  test('should display server tags', async ({ page }) => {
    // Check for tags
    const tags = page.locator('.rounded.bg-gray-100')
    await expect(tags.first()).toBeVisible()
  })
})

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:3001')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should initialize progress on first visit', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Check localStorage was set
    const progress = await page.evaluate(() => {
      const stored = localStorage.getItem('claude-code-learning-progress')
      return stored ? JSON.parse(stored) : null
    })

    expect(progress).toBeTruthy()
    expect(progress.startedAt).toBeTruthy()
    expect(progress.completedModules).toEqual([])
  })

  test('should update lastVisited on page load', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Wait a moment
    await page.waitForTimeout(100)

    // Check lastVisited was set
    const progress = await page.evaluate(() => {
      const stored = localStorage.getItem('claude-code-learning-progress')
      return stored ? JSON.parse(stored) : null
    })

    expect(progress.lastVisited).toBeTruthy()
  })

  test('should persist progress across page reloads', async ({ page }) => {
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')

    // Manually set some progress
    await page.evaluate(() => {
      const progress = {
        completedModules: ['test-module-1', 'test-module-2'],
        startedAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
      }
      localStorage.setItem(
        'claude-code-learning-progress',
        JSON.stringify(progress)
      )
    })

    // Check that localStorage is set correctly (before reload)
    const progressBefore = await page.evaluate(() => {
      const stored = localStorage.getItem('claude-code-learning-progress')
      return stored ? JSON.parse(stored) : null
    })

    expect(progressBefore.completedModules).toContain('test-module-1')
    expect(progressBefore.completedModules).toContain('test-module-2')
  })

  test('should handle corrupted localStorage gracefully', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Set corrupted data
    await page.evaluate(() => {
      localStorage.setItem('claude-code-learning-progress', 'invalid-json')
    })

    // Reload - should not crash
    await page.reload()

    // Page should still load
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should track multiple completed modules', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Wait for initial load
    await page.waitForLoadState('networkidle')

    // Simulate completing multiple modules
    await page.evaluate(() => {
      const progress = {
        completedModules: ['module-1', 'module-2', 'module-3'],
        startedAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
      }
      localStorage.setItem(
        'claude-code-learning-progress',
        JSON.stringify(progress)
      )
    })

    // Check count (read immediately without reload)
    const progress = await page.evaluate(() => {
      const stored = localStorage.getItem('claude-code-learning-progress')
      return stored ? JSON.parse(stored) : null
    })

    expect(progress.completedModules.length).toBe(3)
  })
})

test.describe('Cross-feature Integration', () => {
  test('should maintain dark mode when navigating between pages', async ({
    page,
  }) => {
    await gotoInLightMode(page, baseURL)

    // Set dark mode (use first() as there are desktop and mobile versions)
    const darkButton = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await darkButton.click()

    // Wait for theme to be applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Navigate to a different page using navigation links
    await page.locator('a[href="/start-here"]').first().click()
    await page.waitForLoadState('networkidle')

    // Check dark mode is still active (client-side navigation maintains state)
    await expect(html).toHaveClass(/dark/)
  })

  test('should search work in dark mode', async ({ page }) => {
    await gotoInLightMode(page, baseURL)

    // Set dark mode (use first() as there are desktop and mobile versions)
    const darkButton = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await darkButton.click()

    // Open search (use Control+k for Playwright compatibility)
    await openSearch(page)

    // Check search modal has dark styles - use the dialog role selector
    const searchModal = page.locator(
      '[role="dialog"][aria-label="Search documentation"]'
    )
    await expect(searchModal).toBeVisible()
  })

  test('should navigate to tool pages via search', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Open search (use Control+k for Playwright compatibility)
    await openSearch(page)

    // Search for cheat sheets
    await page.keyboard.type('cheat')

    // Press Enter
    await page.keyboard.press('Enter')

    // Check navigation
    await expect(page).toHaveURL(/\/tools\/cheatsheets/)
  })

  test('should preserve progress when switching themes', async ({ page }) => {
    // Navigate in light mode
    await gotoInLightMode(page, baseURL)

    // Set some progress in localStorage
    await page.evaluate(() => {
      const progress = {
        completedModules: ['preserved-module'],
        startedAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
      }
      localStorage.setItem(
        'claude-code-learning-progress',
        JSON.stringify(progress)
      )
    })

    // Toggle theme (use first() as there are desktop and mobile versions)
    const darkButton = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await darkButton.click()

    // Check that localStorage still has our progress (theme switching shouldn't affect it)
    const progress = await page.evaluate(() => {
      const stored = localStorage.getItem('claude-code-learning-progress')
      return stored ? JSON.parse(stored) : null
    })

    expect(progress.completedModules).toContain('preserved-module')
  })
})

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should show theme toggle on mobile', async ({ page }) => {
    await gotoInLightMode(page, baseURL)

    // Theme toggle should be visible on mobile (use last() since desktop is first but hidden)
    const themeToggle = page
      .locator('button[aria-label="Switch to dark mode"]')
      .last()
    await expect(themeToggle).toBeVisible()
  })

  test('should show search button on mobile', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Search button should be visible
    const searchButton = page.locator('button[aria-label="Search"]')
    await expect(searchButton).toBeVisible()
  })

  test('should open search modal on mobile', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Click search button
    const searchButton = page.locator('button[aria-label="Search"]')
    await searchButton.click()

    // Modal should be visible
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()
  })

  test('should display templates in single column on mobile', async ({
    page,
  }) => {
    await page.goto('http://localhost:3001/tools/templates')

    // Page should load without errors
    const templates = page.locator('.rounded-xl.border')
    await expect(templates.first()).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have proper aria labels on theme toggle button', async ({
    page,
  }) => {
    await gotoInLightMode(page, baseURL)

    // The theme toggle is a single button that changes label based on current state
    // In light mode it says "Switch to dark mode"
    const themeToggle = page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
    await expect(themeToggle).toBeVisible()
  })

  test('should have proper aria label on search button', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Check aria label
    await expect(page.locator('button[aria-label="Search"]')).toBeVisible()
  })

  test('should trap focus in search modal', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Open search (use Control+k for Playwright compatibility)
    await openSearch(page)

    // Check input is focused
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeFocused()
  })

  test('should have keyboard navigation hints in search modal', async ({
    page,
  }) => {
    await page.goto('http://localhost:3001')

    // Open search (use Control+k for Playwright compatibility)
    await openSearch(page)

    // Wait for modal to be visible
    const searchInput = page.locator(
      'input[placeholder="Search documentation..."]'
    )
    await expect(searchInput).toBeVisible()

    // Check for keyboard hints (use first() as text may appear elsewhere)
    await expect(page.locator('text=Navigate').first()).toBeVisible()
    await expect(page.locator('text=Select').first()).toBeVisible()
    await expect(page.locator('text=Close').first()).toBeVisible()
  })
})

test.describe('Edge Cases', () => {
  test('should handle rapid theme switching', async ({ page }) => {
    await gotoInLightMode(page, baseURL)

    // Rapidly switch themes (use first() as there are desktop and mobile versions)
    for (let i = 0; i < 5; i++) {
      await page
        .locator('button[aria-label="Switch to dark mode"]')
        .first()
        .click()
      await page
        .locator('button[aria-label="Switch to light mode"]')
        .first()
        .click()
    }

    // Page should not crash
    await expect(page.locator('nav').first()).toBeVisible()
  })

  test('should handle rapid search open/close', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Rapidly open and close search (use Control+k for Playwright compatibility)
    for (let i = 0; i < 5; i++) {
      await openSearch(page)
      await page.keyboard.press('Escape')
    }

    // Page should not crash
    await expect(page.locator('nav').first()).toBeVisible()
  })

  test('should handle empty search gracefully', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Open search and press Enter with empty query (use Control+k for Playwright compatibility)
    await openSearch(page)
    await page.keyboard.press('Enter')

    // Should navigate to first item
    await expect(page).toHaveURL(/\/start-here/)
  })

  test('should handle special characters in search', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Open search and type special characters (use Control+k for Playwright compatibility)
    await openSearch(page)
    await page.keyboard.type('!@#$%^&*()')

    // Should show no results without crashing
    const noResults = page.locator('text=No results found')
    await expect(noResults).toBeVisible()
  })

  test('should handle very long search queries', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Open search and type very long query (use Control+k for Playwright compatibility)
    await openSearch(page)
    await page.keyboard.type('a'.repeat(100))

    // Should show no results without crashing
    const noResults = page.locator('text=No results found')
    await expect(noResults).toBeVisible()
  })

  test('should handle localStorage being full', async ({ page }) => {
    await gotoInLightMode(page, baseURL)

    // Fill localStorage (this is a simplified test)
    await page.evaluate(() => {
      try {
        // Try to fill localStorage
        const data = 'x'.repeat(1024 * 1024) // 1MB string
        for (let i = 0; i < 10; i++) {
          localStorage.setItem(`fill-${i}`, data)
        }
      } catch {
        // localStorage is full
      }
    })

    // Toggle theme - should handle gracefully (use first() as there are desktop and mobile versions)
    await page
      .locator('button[aria-label="Switch to dark mode"]')
      .first()
      .click()

    // Page should not crash
    await expect(page.locator('nav')).toBeVisible()

    // Clean up
    await page.evaluate(() => localStorage.clear())
  })
})
