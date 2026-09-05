import { test, expect } from '@playwright/test'

/**
 * Quality gate for the Mermaid diagrams.
 *
 * Mermaid is easy to author and easy to ship badly: a diagram can render
 * "successfully" while being unreadable on a phone, clipped, or drawn in an
 * orientation that wastes most of its canvas. Nothing in the build catches any
 * of that, so this walks every page that contains a <Diagram> and measures the
 * rendered SVG.
 *
 * Each check corresponds to a defect that was actually shipped, so the
 * thresholds are calibrated against real content rather than invented.
 */

const PAGES = [
  '/advanced-topics',
  '/advanced-topics/best-practices',
  '/advanced-topics/mcp-and-cursor',
  '/advanced-topics/skills',
  '/agents',
  '/agents/agent-products',
  '/agents/agent-sdk',
  '/agents/building-agents',
  '/agents/multi-agent-architectures',
  '/agents/using-agents',
  '/app-builder',
  '/app-builder/computer-use-and-dispatch',
  '/automation',
  '/data-analysis',
  '/data-analysis/python-intro',
  '/data-analysis/r-intro',
  '/git-github',
  '/mcp',
  '/mcp/mcp-fundamentals',
  '/mcp/workflows-and-troubleshooting',
  '/start-here',
  '/start-here/mac-setup',
  '/start-here/platforms',
  '/start-here/voice-and-remote',
  '/start-here/windows-setup',
]

/** Smallest text we are willing to ship in a diagram, in CSS pixels. */
const MIN_FONT_PX = 12

/**
 * A diagram taller than this multiple of its width is a column pretending to
 * be a diagram: it wastes the full width of the container and renders its
 * nodes small. "The Agent Loop" was 6.6x before being redrawn.
 */
const MAX_ASPECT = 3.2

interface DiagramReport {
  page: string
  index: number
  title: string
  errored: boolean
  width: number
  height: number
  aspect: number
  minFont: number
  clippedLabels: number
  scaled: number
}

async function collect(page: import('@playwright/test').Page, path: string) {
  await page.goto(path)
  // Mermaid renders client-side; wait for the SVG rather than a fixed delay.
  await page
    .locator('figure svg[id^="mermaid"], figure:has-text("Diagram Error")')
    .first()
    .waitFor({ timeout: 15000 })
  await page.waitForTimeout(600)

  return page.evaluate(
    ({ minFontPx }) => {
      const reports: Omit<DiagramReport, 'page'>[] = []
      const figures = Array.from(document.querySelectorAll('figure'))

      figures.forEach((fig, index) => {
        const svg = fig.querySelector(
          'svg[id^="mermaid"]'
        ) as SVGSVGElement | null
        const errored = /Diagram Error/.test(fig.textContent || '')
        if (!svg && !errored) return

        const title =
          fig.querySelector('span')?.textContent?.trim() || `#${index}`

        if (!svg) {
          reports.push({
            index,
            title,
            errored: true,
            width: 0,
            height: 0,
            aspect: 0,
            minFont: 0,
            clippedLabels: 0,
            scaled: 1,
          })
          return
        }

        const box = svg.getBoundingClientRect()

        // Smallest rendered text anywhere in the diagram.
        let minFont = Infinity
        svg
          .querySelectorAll('text, .nodeLabel, .edgeLabel, foreignObject div')
          .forEach((n) => {
            const t = (n.textContent || '').trim()
            if (!t) return
            const size = parseFloat(getComputedStyle(n as Element).fontSize)
            if (Number.isFinite(size) && size > 0)
              minFont = Math.min(minFont, size)
          })
        if (!Number.isFinite(minFont)) minFont = minFontPx

        // A label whose content is taller than the box Mermaid reserved for it
        // is being clipped — the failure mode caused by restyling labels in CSS.
        let clippedLabels = 0
        svg.querySelectorAll('foreignObject').forEach((fo) => {
          const reserved = (
            fo as SVGForeignObjectElement
          ).getBoundingClientRect().height
          const inner = fo.firstElementChild as HTMLElement | null
          if (!inner) return
          if (inner.scrollHeight > reserved + 6) clippedLabels++
        })

        // Rendered scale vs the SVG's own coordinate system: <1 means the
        // browser shrank it to fit, which is how text becomes illegible.
        const declared = svg.viewBox?.baseVal?.width || box.width
        const scaled = declared ? box.width / declared : 1

        reports.push({
          index,
          title,
          errored,
          width: Math.round(box.width),
          height: Math.round(box.height),
          aspect: box.width ? +(box.height / box.width).toFixed(2) : 0,
          minFont: +minFont.toFixed(1),
          clippedLabels,
          scaled: +scaled.toFixed(2),
        })
      })

      return reports
    },
    { minFontPx: MIN_FONT_PX }
  )
}

test.describe('Diagram quality', () => {
  test('every diagram renders, is legible, and is not clipped', async ({
    page,
  }) => {
    test.setTimeout(300_000)
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))

    const all: DiagramReport[] = []
    for (const path of PAGES) {
      const reports = await collect(page, path)
      reports.forEach((r) => all.push({ ...r, page: path }))
    }

    expect(
      all.length,
      'no diagrams were found — the selector is wrong'
    ).toBeGreaterThan(50)

    const errored = all.filter((d) => d.errored)
    const illegible = all.filter((d) => !d.errored && d.minFont < MIN_FONT_PX)
    const clipped = all.filter((d) => d.clippedLabels > 0)
    const shrunk = all.filter((d) => d.scaled < 0.95)

    const describe = (d: DiagramReport) =>
      `${d.page} :: ${d.title} (${d.width}x${d.height}, aspect ${d.aspect}, minFont ${d.minFont}px, scale ${d.scaled})`

    if (errored.length)
      console.log('ERRORED:\n  ' + errored.map(describe).join('\n  '))
    if (illegible.length)
      console.log('ILLEGIBLE:\n  ' + illegible.map(describe).join('\n  '))
    if (clipped.length)
      console.log('CLIPPED LABELS:\n  ' + clipped.map(describe).join('\n  '))
    if (shrunk.length)
      console.log('DOWNSCALED:\n  ' + shrunk.map(describe).join('\n  '))

    console.log(`\nchecked ${all.length} diagrams across ${PAGES.length} pages`)

    expect(errored.map(describe), 'diagrams failed to render').toEqual([])
    expect(clipped.map(describe), 'diagram labels are clipped').toEqual([])
    expect(
      illegible.map(describe),
      `diagram text below ${MIN_FONT_PX}px`
    ).toEqual([])
    expect(shrunk.map(describe), 'diagrams are downscaled to fit').toEqual([])
  })

  test('no diagram is a narrow column wasting its canvas', async ({ page }) => {
    test.setTimeout(300_000)
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))

    const tall: string[] = []
    for (const path of PAGES) {
      const reports = await collect(page, path)
      reports
        .filter((d) => !d.errored && d.aspect > MAX_ASPECT)
        .forEach((d) =>
          tall.push(
            `${path} :: ${d.title} (aspect ${d.aspect}, ${d.width}x${d.height})`
          )
        )
    }

    if (tall.length) console.log('TOO TALL:\n  ' + tall.join('\n  '))
    expect(tall, `diagrams taller than ${MAX_ASPECT}x their width`).toEqual([])
  })

  test('diagrams stay legible on a phone', async ({ page }) => {
    test.setTimeout(300_000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))

    const bad: string[] = []
    for (const path of PAGES.slice(0, 8)) {
      const reports = await collect(page, path)
      reports
        .filter(
          (d) => !d.errored && (d.minFont < MIN_FONT_PX || d.scaled < 0.95)
        )
        .forEach((d) =>
          bad.push(
            `${path} :: ${d.title} (minFont ${d.minFont}px, scale ${d.scaled})`
          )
        )
    }

    if (bad.length) console.log('MOBILE PROBLEMS:\n  ' + bad.join('\n  '))
    // A diagram wider than the phone must scroll at full size, never shrink.
    expect(bad, 'diagrams shrink below legibility on a 390px viewport').toEqual(
      []
    )
  })

  test('no diagram spills outside its own container', async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))

    // Deliberately scoped to the figure, not to document.scrollWidth. Whole-page
    // horizontal overflow on these pages is real but is caused by inline <code>
    // tokens and wide tables, not by diagrams; asserting on the page here would
    // make this suite fail for reasons no diagram change can fix.
    const leaking: string[] = []
    for (const path of PAGES.slice(0, 8)) {
      await page.goto(path)
      await page
        .locator('figure svg[id^="mermaid"]')
        .first()
        .waitFor({ timeout: 15000 })
        .catch(() => {})
      await page.waitForTimeout(400)
      const spills = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const bad: string[] = []
        document.querySelectorAll('figure').forEach((fig, i) => {
          if (!fig.querySelector('svg[id^="mermaid"]')) return
          const r = fig.getBoundingClientRect()
          if (r.right > vw + 1 || r.left < -1) {
            bad.push(
              `figure #${i} (${Math.round(r.left)}..${Math.round(r.right)} vs ${vw})`
            )
          }
        })
        return bad
      })
      spills.forEach((s) => leaking.push(`${path} :: ${s}`))
    }

    if (leaking.length) console.log('DIAGRAM SPILL:\n  ' + leaking.join('\n  '))
    expect(leaking, 'a diagram figure is wider than the viewport').toEqual([])
  })
})
