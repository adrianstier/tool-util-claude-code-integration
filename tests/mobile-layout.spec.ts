import { test, expect } from '@playwright/test'

/**
 * Horizontal-overflow regression test.
 *
 * A page that scrolls sideways on a phone is one of the few layout bugs that is
 * both very visible to a reader and completely invisible in a desktop review,
 * so nothing in this repo caught it. Two real causes were found on 2026-09-05:
 *
 *   1. `CodeBlock` sized each line with `flex-1`, so a long line overflowed the
 *      element instead of scrolling the <pre> it sits in.
 *   2. A long unbreakable token — a URL inside inline <code> — set the
 *      min-content width of its table, forcing the table wider than the
 *      viewport. `overflow-x-auto` on the wrapper cannot contain that.
 *
 * The check is deliberately blunt: for a reader, any sideways scroll is a bug,
 * whatever produced it.
 */

const PAGES = [
  '/',
  '/start-here',
  '/start-here/mac-setup',
  '/start-here/windows-setup',
  '/start-here/platforms',
  '/start-here/voice-and-remote',
  '/git-github',
  '/agents',
  '/agents/agent-sdk',
  '/agents/multi-agent-architectures',
  '/mcp',
  '/mcp/mcp-fundamentals',
  '/mcp/essential-servers',
  '/advanced-topics',
  '/advanced-topics/skills',
  '/advanced-topics/plugins-and-hooks',
  '/advanced-topics/productivity-features',
  '/data-analysis',
  '/data-analysis/python-intro',
  '/automation',
  '/app-builder',
  '/glossary',
  '/resources',
  '/blog',
  '/tools/cheatsheets',
  '/tools/snippets',
]

/** iPhone-class width; the narrowest we claim to support. */
const VIEWPORT = { width: 390, height: 844 }

test.describe('Mobile layout', () => {
  test('no page scrolls sideways at 390px', async ({ page }) => {
    test.setTimeout(300_000)
    await page.setViewportSize(VIEWPORT)
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))

    const offenders: string[] = []

    for (const path of PAGES) {
      await page.goto(path)
      // Diagrams and code blocks render client-side and can change width.
      await page.waitForTimeout(1200)

      const result = await page.evaluate(() => {
        const de = document.documentElement
        const vw = de.clientWidth
        if (de.scrollWidth <= vw + 1) return null

        // Report the leaf elements that stick out — the innermost offender is
        // almost always the actual cause, and naming it saves the next person
        // the bisection this test cost to write.
        const leaves: string[] = []
        document.querySelectorAll('body *').forEach((el) => {
          if (!(el instanceof HTMLElement)) return
          if (el.children.length > 0) return
          const box = el.getBoundingClientRect()
          if (box.right > vw + 1) {
            const cls = el.className.toString().slice(0, 50)
            const text = (el.textContent || '').trim().slice(0, 30)
            leaves.push(
              `${el.tagName}.${cls} right=${Math.round(box.right)} "${text}"`
            )
          }
        })

        return { scrollWidth: de.scrollWidth, vw, leaves: leaves.slice(0, 3) }
      })

      if (result) {
        offenders.push(
          `${path} — ${result.scrollWidth}px wide in a ${result.vw}px viewport\n` +
            result.leaves.map((l) => `      ${l}`).join('\n')
        )
      }
    }

    if (offenders.length) console.log('OVERFLOWING:\n' + offenders.join('\n'))
    expect(offenders, 'pages scroll horizontally on a phone').toEqual([])
  })

  test('long unbreakable tokens wrap instead of widening the page', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORT)
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))
    await page.goto('/advanced-topics/plugins-and-hooks')
    await page.waitForTimeout(1000)

    // The specific regression: a URL in inline <code> inside a table cell.
    const widest = await page.evaluate(() => {
      let max = 0
      document
        .querySelectorAll('table code, .prose :not(pre) > code')
        .forEach((el) => {
          max = Math.max(max, el.getBoundingClientRect().width)
        })
      return Math.round(max)
    })

    expect(
      widest,
      'inline code is wider than the viewport'
    ).toBeLessThanOrEqual(390)
  })
})
