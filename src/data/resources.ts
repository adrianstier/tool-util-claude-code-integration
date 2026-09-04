/**
 * Resources Data
 * Static data layer for the Resources page
 */

import type {
  Resource,
  ResourceSectionConfig,
  CategoryFilterOption,
  ResourceCategory,
} from '@/types/resources'

// =============================================================================
// Section Configuration
// =============================================================================

/**
 * Section Configuration
 * Visual configuration for each resource category section
 */
export const SECTION_CONFIG: Record<ResourceCategory, ResourceSectionConfig> = {
  'our-tools': {
    id: 'our-tools',
    title: 'Our Tools',
    description: 'Interactive tools and references we built for you',
    icon: 'Wrench',
    colorClass:
      'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  },
  learning: {
    id: 'learning',
    title: 'Learning Paths',
    description: 'Structured courses and tracks to build your skills',
    icon: 'GraduationCap',
    colorClass:
      'bg-cobalt-100 text-cobalt-700 dark:bg-cobalt-900/50 dark:text-cobalt-300',
  },
  official: {
    id: 'official',
    title: 'Official Resources',
    description: 'Documentation and tools from Anthropic',
    icon: 'BookOpen',
    colorClass:
      'bg-sage-100 text-sage-700 dark:bg-sage-900/50 dark:text-sage-300',
  },
  community: {
    id: 'community',
    title: 'Community & External',
    description: 'Connect with others and explore third-party tools',
    icon: 'Users',
    colorClass:
      'bg-plum-100 text-plum-700 dark:bg-plum-900/50 dark:text-plum-300',
  },
} as const

/**
 * Category Filter Options
 * Options for the category filter UI
 */
export const CATEGORY_FILTERS: CategoryFilterOption[] = [
  { id: 'all', name: 'All', icon: 'Layers' },
  { id: 'our-tools', name: 'Our Tools', icon: 'Wrench' },
  { id: 'learning', name: 'Learning', icon: 'GraduationCap' },
  { id: 'official', name: 'Official', icon: 'BookOpen' },
  { id: 'community', name: 'Community', icon: 'Users' },
] as const

/**
 * Category display order
 * Defines the order sections appear on the page
 */
export const CATEGORY_ORDER: ResourceCategory[] = [
  'our-tools',
  'learning',
  'official',
  'community',
] as const

// =============================================================================
// Resource Data
// =============================================================================

/**
 * All Resources
 * Complete resource dataset for the Resources page
 *
 * Data Integrity Rules:
 * - id: lowercase, hyphenated, unique across all resources
 * - url: relative paths for internal=true, absolute URLs for external
 * - icon: must match a key in ICON_MAP (src/lib/resources.ts)
 * - tags: lowercase, no duplicates within a resource
 * - dateAdded: ISO 8601 format (YYYY-MM-DD)
 */
export const RESOURCES: Resource[] = [
  // ==========================================================================
  // Our Tools - Internal reference materials and interactive tools
  // ==========================================================================
  {
    id: 'cheatsheets',
    title: 'Cheatsheets',
    description:
      '7 quick reference guides for Claude Code, Git, Terminal, Python, and more',
    url: '/tools/cheatsheets',
    internal: true,
    icon: 'FileText',
    category: 'our-tools',
    tags: ['reference', 'guide', 'quick', 'commands'],
    dateAdded: '2024-01-01',
    sortOrder: 1,
  },
  {
    id: 'code-snippets',
    title: 'Code Snippets',
    description: 'Copy-paste code patterns for common tasks',
    url: '/tools/snippets',
    internal: true,
    icon: 'Code2',
    category: 'our-tools',
    tags: ['code', 'patterns', 'copy', 'examples'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'slash-commands',
    title: 'Slash Commands',
    description: 'Built-in commands to speed up your workflow',
    url: '/tools/slash-commands',
    internal: true,
    icon: 'Terminal',
    category: 'our-tools',
    tags: ['commands', 'workflow', 'productivity'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'project-templates',
    title: 'Project Templates',
    description:
      '6 starter templates for web apps, data science, automation, and more',
    url: '/tools/templates',
    internal: true,
    icon: 'FolderOpen',
    category: 'our-tools',
    tags: ['templates', 'starter', 'projects', 'boilerplate'],
    dateAdded: '2024-01-01',
    sortOrder: 4,
  },
  {
    id: 'claude-md-generator',
    title: 'CLAUDE.md Generator',
    description: 'Create a CLAUDE.md file for your project',
    url: '/tools/claude-md-generator',
    internal: true,
    icon: 'PenTool',
    category: 'our-tools',
    isNew: true,
    tags: ['claude', 'config', 'generator', 'setup'],
    dateAdded: '2024-12-01',
    sortOrder: 5,
  },
  {
    id: 'mcp-explorer',
    title: 'MCP Server Explorer',
    description: 'Browse and configure MCP servers',
    url: '/tools/mcp-explorer',
    internal: true,
    icon: 'Server',
    category: 'our-tools',
    tags: ['mcp', 'servers', 'configuration', 'explore'],
    dateAdded: '2024-06-01',
    sortOrder: 6,
  },

  // ==========================================================================
  // Learning - Structured educational content
  // ==========================================================================
  {
    id: 'start-here-guide',
    title: 'Start Here Guide',
    description:
      'Complete setup guide for beginners - install Claude Code, VS Code, and Git',
    url: '/start-here',
    internal: true,
    icon: 'GraduationCap',
    category: 'learning',
    skillLevel: 'beginner',
    tags: ['setup', 'installation', 'getting started', 'beginner'],
    dateAdded: '2024-01-01',
    sortOrder: 1,
  },
  {
    id: 'data-analysis-track',
    title: 'Data Analysis Track',
    description: 'Learn Python and R for data science with Claude',
    url: '/data-analysis',
    internal: true,
    icon: 'FileText',
    category: 'learning',
    skillLevel: 'intermediate',
    tags: ['python', 'r', 'data', 'analysis', 'science'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'git-github-guide',
    title: 'Git & GitHub Guide',
    description: 'Master version control from scratch',
    url: '/git-github',
    internal: true,
    icon: 'GitBranch',
    category: 'learning',
    skillLevel: 'beginner',
    tags: ['git', 'github', 'version control', 'collaboration'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'ai-agents-track',
    title: 'AI Agents Track',
    description:
      'Build autonomous AI agents that can reason, plan, and take actions',
    url: '/agents',
    internal: true,
    icon: 'Lightbulb',
    category: 'learning',
    skillLevel: 'advanced',
    tags: ['agents', 'ai', 'autonomous', 'advanced'],
    dateAdded: '2024-03-01',
    sortOrder: 4,
  },
  {
    id: 'best-practices-guide',
    title: 'Best Practices Guide',
    description: 'Tips and techniques for working effectively with Claude Code',
    url: '/advanced-topics/best-practices',
    internal: true,
    icon: 'Lightbulb',
    category: 'learning',
    skillLevel: 'intermediate',
    tags: ['tips', 'techniques', 'best practices', 'effective'],
    dateAdded: '2024-02-01',
    sortOrder: 5,
  },

  // ==========================================================================
  // Official - Anthropic documentation and resources
  // ==========================================================================
  {
    id: 'claude-code-docs',
    title: 'Claude Code Documentation',
    description: 'Official documentation for Claude Code by Anthropic',
    url: 'https://docs.anthropic.com/en/docs/claude-code/overview',
    icon: 'BookOpen',
    category: 'official',
    tags: ['docs', 'documentation', 'official', 'anthropic'],
    dateAdded: '2024-01-01',
    sortOrder: 1,
  },
  {
    id: 'claude-code-github',
    title: 'Claude Code GitHub',
    description: 'Official Claude Code repository with examples and issues',
    url: 'https://github.com/anthropics/claude-code',
    icon: 'GitBranch',
    category: 'official',
    tags: ['github', 'source', 'issues', 'examples'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'anthropic-api-docs',
    title: 'Anthropic API Documentation',
    description: 'Full API reference for building with Claude',
    url: 'https://docs.anthropic.com/en/api/getting-started',
    icon: 'Code2',
    category: 'official',
    tags: ['api', 'reference', 'documentation', 'sdk'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'prompt-engineering',
    title: 'Claude Prompt Engineering',
    description: 'Best practices for writing effective prompts',
    url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
    icon: 'Lightbulb',
    category: 'official',
    tags: ['prompts', 'engineering', 'best practices'],
    dateAdded: '2024-01-01',
    sortOrder: 4,
  },

  // ==========================================================================
  // Community - External tools and community resources
  // ==========================================================================
  {
    id: 'vscode',
    title: 'VS Code',
    description: 'The recommended code editor for Claude Code',
    url: 'https://code.visualstudio.com/',
    icon: 'Code2',
    category: 'community',
    tags: ['editor', 'vscode', 'ide', 'tool'],
    dateAdded: '2024-01-01',
    sortOrder: 1,
  },
  {
    id: 'git',
    title: 'Git',
    description: 'Version control system - essential for any project',
    url: 'https://git-scm.com/',
    icon: 'GitBranch',
    category: 'community',
    tags: ['git', 'version control', 'tool'],
    dateAdded: '2024-01-01',
    sortOrder: 2,
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    description: 'JavaScript runtime for running scripts and servers',
    url: 'https://nodejs.org/',
    icon: 'Wrench',
    category: 'community',
    tags: ['nodejs', 'javascript', 'runtime', 'server'],
    dateAdded: '2024-01-01',
    sortOrder: 3,
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Popular language for data analysis and automation',
    url: 'https://www.python.org/',
    icon: 'Code2',
    category: 'community',
    tags: ['python', 'language', 'data', 'automation'],
    dateAdded: '2024-01-01',
    sortOrder: 4,
  },
  {
    id: 'anthropic-support',
    title: 'Anthropic Support',
    description: 'Official support channel for Claude products',
    url: 'https://support.anthropic.com/',
    icon: 'Users',
    category: 'community',
    tags: ['support', 'help', 'anthropic'],
    dateAdded: '2024-01-01',
    sortOrder: 5,
  },
  {
    id: 'reddit-claudeai',
    title: 'r/ClaudeAI Subreddit',
    description: 'Reddit community discussing Claude',
    url: 'https://reddit.com/r/ClaudeAI',
    icon: 'Users',
    category: 'community',
    tags: ['reddit', 'community', 'discussion'],
    dateAdded: '2024-01-01',
    sortOrder: 6,
  },
  {
    id: 'discord-anthropic',
    title: 'Claude Discord',
    description: 'Community Discord for Claude users',
    url: 'https://discord.gg/anthropic',
    icon: 'Users',
    category: 'community',
    tags: ['discord', 'community', 'chat'],
    dateAdded: '2024-01-01',
    sortOrder: 7,
  },
  {
    id: 'youtube-anthropic',
    title: 'Anthropic YouTube Channel',
    description: 'Official videos from Anthropic about Claude',
    url: 'https://www.youtube.com/@anthropic-ai',
    icon: 'Video',
    category: 'community',
    tags: ['youtube', 'videos', 'tutorials', 'anthropic'],
    dateAdded: '2024-01-01',
    sortOrder: 8,
  },
] as const

// =============================================================================
// Computed Values
// =============================================================================

/**
 * Total resource count (for display and validation)
 */
export const RESOURCE_COUNT = RESOURCES.length

/**
 * Resource counts by category
 */
export const RESOURCE_COUNTS_BY_CATEGORY: Record<ResourceCategory, number> = {
  'our-tools': RESOURCES.filter((r) => r.category === 'our-tools').length,
  learning: RESOURCES.filter((r) => r.category === 'learning').length,
  official: RESOURCES.filter((r) => r.category === 'official').length,
  community: RESOURCES.filter((r) => r.category === 'community').length,
}
