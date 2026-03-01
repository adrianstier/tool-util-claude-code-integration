# Getting Started

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

That's it! The site should be running.

## What Just Happened?

- Next.js development server started on port 3000
- Hot reload is enabled (changes update instantly)
- All MDX content is being processed
- Components are ready to use

## Project Structure Overview

```
claude-code-integration/
├── src/
│   ├── app/                   # Pages and routing
│   │   ├── [track]/          # Dynamic content routes
│   │   ├── layout.tsx        # Root layout (Nav + Footer)
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   └── lib/                  # Utilities and MDX processing
│
├── content/                  # Learning content (MDX)
│   ├── start-here/          # Setup guides
│   ├── data-analysis/       # Python & R tutorials
│   ├── app-builder/         # App building guides
│   ├── automation/          # Automation scripts
│   └── git-github/          # Git & GitHub basics
│
├── CLAUDE.md                # How to work with Claude
├── README.md                # Project overview
└── package.json             # Dependencies and scripts
```

## Available Commands

### Development
```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Check for errors
npm run format       # Format code with Prettier
npm run typecheck    # Check TypeScript
```

### Database (Optional)
```bash
npm run db:setup          # Initialize database
npm run migrate:up        # Apply migrations
npm run migrate:down      # Rollback migration
npm run migrate:create -- name  # Create migration
```

## Adding Content

### Create a New Module

1. Create an MDX file in the appropriate track folder:
   ```bash
   touch content/data-analysis/new-lesson.mdx
   ```

2. Add frontmatter:
   ```mdx
   ---
   title: 'Your Lesson Title'
   description: 'Brief description'
   order: 3
   duration: '60 minutes'
   ---

   # Your Content Here
   ```

3. The page will automatically be available at:
   `/data-analysis/new-lesson`

### Create a New Track

1. Create a folder in `content/`:
   ```bash
   mkdir content/new-track
   ```

2. Create an index.mdx:
   ```bash
   touch content/new-track/index.mdx
   ```

3. Add to navigation in `src/components/Navigation.tsx`

## Working with Components

### Use in MDX

Components are available in MDX files:

```mdx
---
title: 'My Page'
---

# Hello World

<Card
  title="Important Note"
  description="This is a callout"
/>

<CodeBlock
  code="console.log('Hello')"
  language="javascript"
  title="Example"
/>
```

### Create New Components

1. Add to `src/components/`:
   ```bash
   touch src/components/MyComponent.tsx
   ```

2. Export and make available in MDX:
   ```typescript
   // In [track]/[slug]/page.tsx
   import MyComponent from '@/components/MyComponent'

   const components = {
     MyComponent,
     // ... other components
   }
   ```

## Common Tasks

### Update Site Metadata

Edit `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your description',
}
```

### Add Navigation Link

Edit `src/components/Navigation.tsx`:
```typescript
const navigationItems = [
  { name: 'New Track', href: '/new-track' },
  // ... existing items
]
```

### Style Customization

Edit `tailwind.config.ts` for colors, fonts, etc.

Global styles in `src/app/globals.css`.

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Next.js
5. Click "Deploy"

Done! Your site is live.

### Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Deploy!

### Static Export (Optional)

For static hosting (GitHub Pages, etc.):

1. Add to `next.config.js`:
   ```javascript
   module.exports = {
     output: 'export',
   }
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy the `out/` folder

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### TypeScript Errors

```bash
# Check what's wrong
npm run typecheck

# Common fix: update types
npm update @types/react @types/node
```

### MDX Not Rendering

- Check frontmatter format (YAML)
- Ensure file is `.mdx` not `.md`
- Check for syntax errors in MDX
- Restart dev server

## Next Steps

1. **Explore the Code**
   - Read [CLAUDE.md](CLAUDE.md) for project context
   - Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

2. **Add Content**
   - Start with your own tutorials
   - Copy the MDX template structure

3. **Customize**
   - Update colors in Tailwind config
   - Add your own components
   - Modify layouts

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Share with the world!

## Getting Help

- **Claude**: Ask Claude for help! This project is designed to be extended with Claude's assistance.
- **Documentation**: Check CLAUDE.md for common patterns
- **Issues**: Report bugs on GitHub

## Example: Adding a New Lesson

```bash
# 1. Create file
touch content/data-analysis/advanced-pandas.mdx

# 2. Add content
cat > content/data-analysis/advanced-pandas.mdx << 'CONTENT'
---
title: 'Advanced Pandas Techniques'
description: 'Learn advanced data manipulation with pandas'
order: 4
duration: '90 minutes'
---

# Advanced Pandas Techniques

Your content here...
CONTENT

# 3. File is automatically available at:
# http://localhost:3000/data-analysis/advanced-pandas

# 4. Commit
git add content/data-analysis/advanced-pandas.mdx
git commit -m "feat: add advanced pandas lesson"
```

---

**You're ready to go!** Start the dev server and begin creating content.
