import { test, expect } from '@playwright/test'

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu

test('Find emojis on data-analysis page', async ({ page }) => {
  await page.goto('http://localhost:3001/data-analysis')

  // Get all text content from the page
  const bodyText = await page.locator('body').innerText()

  // Find all emojis
  const emojis = bodyText.match(emojiRegex) || []

  console.log('\n=== EMOJIS FOUND ON /data-analysis ===')
  console.log('Total emojis found:', emojis.length)

  if (emojis.length > 0) {
    console.log('Emojis:', [...new Set(emojis)].join(', '))

    // Get the context around each emoji
    const lines = bodyText.split('\n')
    const emojiLines: string[] = []

    lines.forEach((line, index) => {
      if (emojiRegex.test(line)) {
        emojiLines.push(`Line ${index + 1}: ${line.trim()}`)
      }
    })

    console.log('\nLines with emojis:')
    emojiLines.forEach((line) => console.log(line))
  } else {
    console.log('No emojis found! ✨')
  }

  // Take a screenshot
  await page.screenshot({
    path: 'tests/screenshots/data-analysis-emojis.png',
    fullPage: true,
  })
  console.log(
    '\nScreenshot saved to: tests/screenshots/data-analysis-emojis.png'
  )
})

test('Find emojis in page HTML', async ({ page }) => {
  await page.goto('http://localhost:3001/data-analysis')

  // Get the full HTML
  const html = await page.content()

  // Find emojis in HTML
  const emojis = html.match(emojiRegex) || []

  console.log('\n=== EMOJIS IN HTML ===')
  console.log('Total emojis in HTML:', emojis.length)

  if (emojis.length > 0) {
    console.log('Unique emojis:', [...new Set(emojis)].join(', '))

    // Find the HTML snippets containing emojis
    const snippets: string[] = []
    const htmlLines = html.split('\n')

    htmlLines.forEach((line, index) => {
      if (emojiRegex.test(line)) {
        snippets.push(`Line ${index + 1}: ${line.trim().substring(0, 100)}...`)
      }
    })

    console.log('\nHTML snippets with emojis (first 100 chars):')
    snippets.slice(0, 10).forEach((snippet) => console.log(snippet))
  }
})
