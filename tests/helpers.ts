import { expect, type Page } from '@playwright/test'

/**
 * Open the Cmd/Ctrl+K search modal.
 *
 * The keydown listener is attached in a `useEffect`, so a shortcut pressed
 * before hydration completes is silently dropped. Under full parallelism that
 * happens often enough to flake the suite, so retry the shortcut until the
 * modal actually appears.
 */
export async function openSearch(page: Page) {
  const searchInput = page.locator(
    'input[placeholder="Search documentation..."]'
  )

  await expect(async () => {
    if (!(await searchInput.isVisible())) {
      await page.keyboard.press('Control+k')
    }
    await expect(searchInput).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 20_000 })

  return searchInput
}
