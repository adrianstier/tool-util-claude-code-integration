import { test, expect, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * WCAG 2.1 A/AA gate.
 *
 * This exists because the violations it now guards against were invisible for
 * months: three unlabelled form controls, text below the contrast floor, links
 * carried by colour alone, and scroll containers a keyboard could not reach.
 * Nothing in typecheck, lint or the build notices any of that.
 *
 * Both themes are exercised on purpose. Dark mode is where the contrast bugs
 * actually lived — ink-400 clears the floor on the page background but fails on
 * a card, so a light-only run reports a clean sheet on a broken page.
 */

const ROUTES = [
  '/',
  '/start-here',
  '/start-here/mac-setup',
  '/start-here/quick-start-exercise',
  '/advanced-topics',
  '/advanced-topics/best-practices',
  '/agents',
  '/mcp',
  '/mcp/mcp-fundamentals',
  '/whats-new',
  '/troubleshooting',
  '/compare',
  '/glossary',
  '/resources',
  '/blog',
  '/tools/claude-md-generator',
  '/tools/claude-md-generator/nextjs-supabase',
  '/tools/agent-or-workflow',
] as const

const THEMES = ['light', 'dark'] as const

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

/** The site reads its theme from localStorage and sets a class on <html>. */
async function useTheme(page: Page, theme: (typeof THEMES)[number]) {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem('theme', t)
    } catch {
      // Private mode or blocked storage; the page falls back to its default.
    }
  }, theme)
}

/** Turns axe output into something a CI log can be read from. */
function describe(
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']
) {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 4)
        .map((n) => {
          const data = n.any[0]?.data as
            | {
                fgColor?: string
                bgColor?: string
                contrastRatio?: number
                expectedContrastRatio?: string
              }
            | undefined
          const contrast = data?.contrastRatio
            ? `  [fg=${data.fgColor} bg=${data.bgColor} ratio=${data.contrastRatio} needs=${data.expectedContrastRatio}]`
            : ''
          return `    - ${n.target.join(' ')}${contrast}\n      ${n.html.slice(0, 160)}`
        })
        .join('\n')
      const extra =
        v.nodes.length > 4 ? `\n    …and ${v.nodes.length - 4} more` : ''
      return `\n  [${v.impact ?? 'unknown'}] ${v.id} — ${v.help}\n${nodes}${extra}\n    ${v.helpUrl}`
    })
    .join('\n')
}

for (const theme of THEMES) {
  test.describe(`accessibility (${theme})`, () => {
    for (const route of ROUTES) {
      test(`${route} has no WCAG A/AA violations`, async ({ page }) => {
        await useTheme(page, theme)
        await page.goto(route, { waitUntil: 'networkidle' })

        const { violations } = await new AxeBuilder({ page })
          .withTags(WCAG_TAGS)
          .analyze()

        expect(
          violations,
          violations.length
            ? `${violations.length} violation(s) on ${route} (${theme}):${describe(violations)}`
            : ''
        ).toEqual([])
      })
    }
  })
}

test.describe('keyboard access', () => {
  test('the skip link is the first tab stop and reaches main content', async ({
    page,
  }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const focused = page.locator(':focus')
    await expect(focused).toHaveText(/skip to main/i)

    await focused.press('Enter')
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('every interactive control shows a visible focus indicator', async ({
    page,
  }) => {
    await page.goto('/')

    // Walk the first stretch of the tab order and confirm focus is never
    // invisible. A control you cannot see focus on is unusable without a mouse.
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      const hasIndicator = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return true
        const s = getComputedStyle(el)
        const outline =
          s.outlineStyle !== 'none' && parseFloat(s.outlineWidth || '0') > 0
        const ring = s.boxShadow !== 'none' && s.boxShadow !== ''
        return outline || ring
      })
      expect(hasIndicator).toBe(true)
    }
  })
})
