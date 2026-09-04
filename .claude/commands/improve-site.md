---
description: Analyze and implement site improvements
---

# Site Improvement Workflow

Analyze the current state of the website and implement improvements based on verification results.

## Analysis Areas

1. **Performance Optimization**
   - Optimize images (convert to WebP, add lazy loading)
   - Minimize bundle sizes (code splitting, tree shaking)
   - Implement caching strategies
   - Optimize fonts and CSS
   - Add prefetching for critical routes

2. **UX Enhancements**
   - Improve navigation clarity
   - Add loading states
   - Enhance mobile experience
   - Add breadcrumbs for deep pages
   - Implement search functionality
   - Add progress indicators for learning tracks

3. **Accessibility Improvements**
   - Add missing ARIA labels
   - Improve focus management
   - Enhance keyboard navigation
   - Improve color contrast where needed
   - Add skip-to-content links
   - Ensure all images have alt text

4. **Content Quality**
   - Fix any broken links
   - Improve code example formatting
   - Add more inline tips and warnings
   - Enhance troubleshooting sections
   - Add visual diagrams where helpful

5. **SEO Optimization**
   - Add meta descriptions to all pages
   - Implement structured data
   - Optimize heading hierarchy
   - Add Open Graph tags
   - Create sitemap.xml
   - Implement robots.txt

6. **Developer Experience**
   - Improve error messages
   - Add better TypeScript types
   - Enhance documentation
   - Add more example prompts
   - Improve CLAUDE.md guidance

7. **Visual Polish**
   - Consistent spacing and typography
   - Smooth animations and transitions
   - Better hover states
   - Improved mobile responsiveness
   - Dark mode support (future)

## Implementation Process

1. Run `/verify-frontend` first to identify issues
2. Prioritize improvements by impact
3. Implement changes incrementally
4. Test each change
5. Re-run verification to confirm improvements
6. Document changes in CHANGELOG.md

## Success Metrics

- Lighthouse score > 90 (all categories)
- 100% accessibility score
- No console errors
- All Playwright tests passing
- Mobile performance optimized
- All internal links working

## Usage

Run: `/improve-site`

This will:

1. Analyze current state
2. Identify improvement opportunities
3. Implement high-priority fixes
4. Re-run tests to verify improvements
5. Generate summary of changes made
