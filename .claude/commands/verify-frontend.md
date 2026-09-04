---
description: Run comprehensive frontend verification checks
---

# Frontend Verification Workflow

Run comprehensive automated checks on the Claude Code Onboarding website:

## Verification Steps

1. **Build Verification**
   - Run `npm run build` to ensure production build succeeds
   - Check for any TypeScript errors
   - Verify all routes compile correctly

2. **Visual Testing**
   - Run Playwright tests: `npx playwright test`
   - Capture screenshots for all pages (desktop + mobile)
   - Compare against baseline screenshots
   - Check for visual regressions

3. **Functionality Tests**
   - Test navigation across all pages
   - Verify mobile menu functionality
   - Test all internal links
   - Verify MDX content renders correctly
   - Check code block copy functionality

4. **Performance Audit**
   - Check page load times
   - Verify image optimization
   - Check bundle sizes
   - Test Time to Interactive (TTI)
   - Lighthouse performance scores

5. **Accessibility Checks**
   - Run axe accessibility tests
   - Verify ARIA labels
   - Check keyboard navigation
   - Test screen reader compatibility
   - Verify color contrast ratios

6. **Content Validation**
   - Verify all MDX files parse correctly
   - Check frontmatter metadata
   - Validate internal links
   - Check for broken external links
   - Verify code examples are complete

7. **Responsive Design**
   - Test on multiple viewport sizes (mobile, tablet, desktop)
   - Verify touch targets are adequate size
   - Check horizontal scrolling issues
   - Test mobile menu behavior

8. **Error Detection**
   - Check browser console for errors
   - Verify no 404s on internal routes
   - Check for hydration errors
   - Verify no CORS issues

## Output

Generate a comprehensive report with:

- Test pass/fail status
- Screenshots of all pages
- Performance metrics
- Accessibility scores
- List of issues found with severity
- Recommended improvements

## Usage

Simply run: `/verify-frontend`

This will execute all checks and provide a detailed report.
