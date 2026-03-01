# Project Structure

This document provides a complete overview of the codebase structure.

## Complete Directory Tree

```
claude-code-integration/
│
├── .vscode/
│   └── settings.json              # VS Code + Claude configuration
│
├── content/                       # Learning content (MDX files)
│   ├── start-here/
│   │   ├── index.mdx              # Setup track overview
│   │   ├── mac-setup.mdx          # macOS setup guide
│   │   └── windows-setup.mdx      # Windows setup guide
│   │
│   ├── data-analysis/
│   │   ├── index.mdx              # Data analysis track overview
│   │   ├── python-intro.mdx       # Python pathway
│   │   └── r-intro.mdx            # R pathway
│   │
│   ├── app-builder/
│   │   └── index.mdx              # App builder track
│   │
│   ├── automation/
│   │   └── index.mdx              # Automation track
│   │
│   └── git-github/
│       └── index.mdx              # Git/GitHub basics
│
├── migrations/                    # Database migrations
│   └── applied/                   # Applied migrations folder
│
├── public/                        # Static assets
│
├── sample-data/                   # Sample datasets for tutorials
│
├── scripts/
│   ├── migrate.js                 # Migration runner (up/down/create)
│   └── setup-db.js                # Database initialization
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout with metadata
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles + Tailwind
│   │
│   ├── components/                # Reusable React components (to be created)
│   ├── lib/                       # Utilities and helpers (to be created)
│   └── styles/                    # Additional styles (to be created)
│
├── templates/
│   └── README.md                  # Template usage guide
│
├── .claudeignore                  # Context management for Claude
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier configuration
├── ARCHITECTURE.md                # Architecture documentation
├── CLAUDE.md                      # Project context for Claude
├── next.config.js                 # Next.js with MDX configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── PROJECT_STRUCTURE.md           # This file
├── README.md                      # Project overview and setup
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

## Files by Purpose

### Configuration Files
- `.vscode/settings.json` - VS Code workspace settings optimized for Claude Code
- `tsconfig.json` - TypeScript compiler configuration
- `tailwind.config.ts` - Tailwind CSS theming and content paths
- `next.config.js` - Next.js and MDX configuration
- `postcss.config.js` - PostCSS plugins
- `.eslintrc.json` - Linting rules
- `.prettierrc` - Code formatting rules
- `.gitignore` - Git exclusions
- `.claudeignore` - Claude context exclusions

### Documentation
- `README.md` - Project overview, setup instructions, and quick start
- `CLAUDE.md` - Detailed context for working with Claude on this project
- `ARCHITECTURE.md` - System architecture and technical decisions
- `PROJECT_STRUCTURE.md` - This file

### Source Code
- `src/app/layout.tsx` - Root layout component
- `src/app/page.tsx` - Landing page
- `src/app/globals.css` - Global styles
- (Additional app routes will be created as needed)

### Content
- `content/**/*.mdx` - Learning modules written in MDX
- Each track has an `index.mdx` overview page
- Platform-specific guides (mac-setup, windows-setup)

### Database
- `scripts/migrate.js` - Migration system (up/down/create commands)
- `scripts/setup-db.js` - Initial database setup
- `migrations/*.sql` - Migration files
- `migrations/applied/` - Applied migration history

### Templates
- Root files (`CLAUDE.md`, `.claudeignore`, `.vscode/settings.json`) serve as templates
- `templates/README.md` - Instructions for using templates

## Key Files to Know

### For Contributors
1. **CLAUDE.md** - Read this first! Contains project context, workflows, and example prompts
2. **ARCHITECTURE.md** - Technical architecture and design decisions
3. **README.md** - Setup and usage instructions
4. **package.json** - Available scripts and dependencies

### For Content Creators
1. `content/**/*.mdx` - Learning content files
2. `src/components/` - Reusable components for MDX
3. Frontmatter schema in ARCHITECTURE.md

### For Developers
1. `src/app/` - Next.js pages and layouts
2. `src/components/` - React components
3. `src/lib/` - Utility functions
4. `scripts/` - Build and database scripts

## File Naming Conventions

- **Components**: PascalCase (e.g., `Navigation.tsx`)
- **Pages**: lowercase with hyphens (e.g., `start-here/`)
- **Content**: lowercase with hyphens (e.g., `mac-setup.mdx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Migrations**: `timestamp_description.sql`

## What's Not Included Yet

These will be created as development progresses:

- `src/components/*` - UI components
- `src/lib/*` - Utility functions
- `public/images/*` - Images and assets
- `public/videos/*` - Tutorial videos
- Additional content modules
- Test files
- API routes (if needed for V2)

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run db:setup` to initialize the database structure
3. Run `npm run dev` to start the development server
4. Visit http://localhost:3000 to see the site

## Questions?

Refer to:
- **CLAUDE.md** for workflow questions
- **ARCHITECTURE.md** for technical questions
- **README.md** for setup questions
