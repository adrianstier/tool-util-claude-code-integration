# Design: Integrate New Claude Features (Dec 2025 - Mar 2026)

**Date:** 2026-03-28
**Approach:** New articles in existing tracks (Approach 2)
**Scope:** 6 new MDX articles + 2 updates to existing articles

## Background

Google Search Console flagged indexing issues that led to an SEO audit. During that audit, we discovered the site is missing coverage of ~18 major Claude features released between December 2025 and March 2026. This spec defines the content to fill those gaps.

## New Articles

### 1. `content/start-here/platforms.mdx`

- **Title:** Where to Use Claude Code — Desktop, Web, Terminal, and IDE
- **Order:** 3 | **Duration:** 15 minutes
- **Covers:** Terminal CLI, Desktop App (Mac/Windows), Web App (claude.ai/code), VS Code extension, JetBrains plugin, Mobile via Remote Control
- **Key deliverable:** Decision table — "If you want X, use Y"

### 2. `content/start-here/voice-and-remote.mdx`

- **Title:** Voice Mode and Remote Control — Use Claude Anywhere
- **Order:** 8 | **Duration:** 20 minutes
- **Covers:** /voice command, push-to-talk, 20+ languages, Remote Control bridge, phone-to-desktop workflow
- **Key deliverable:** Step-by-step setup for both features

### 3. `content/advanced-topics/productivity-features.mdx`

- **Title:** Power Features — Auto-Memory, /loop, Fast Mode, and Session Control
- **Order:** 2 | **Duration:** 30 minutes
- **Covers:** Auto-memory (/memory), /loop scheduled tasks, fast mode, /effort, session management (naming/resume/forking), /context, background agents, worktree isolation
- **Key deliverable:** Each feature gets: what it does, how to use it, when to use it

### 4. `content/advanced-topics/plugins-and-hooks.mdx`

- **Title:** Plugins and Hooks — Extend and Customize Claude Code
- **Order:** 4 | **Duration:** 35 minutes
- **Covers:** Plugin ecosystem (400+ plugins), finding/installing plugins, hook types (PreToolUse, PostToolUse, HTTP hooks, conditional hooks), creating plugins
- **Key deliverable:** Install a popular plugin + create a custom hook walkthrough

### 5. `content/agents/agent-sdk.mdx`

- **Title:** Claude Agent SDK — Build Production AI Agents
- **Order:** 5 | **Duration:** 40 minutes
- **Covers:** Python and TypeScript SDKs, agent loop, tools, hooks in SDK, deploying agents
- **Key deliverable:** End-to-end "Build a Code Review Agent" example

### 6. `content/app-builder/computer-use-and-dispatch.mdx`

- **Title:** Computer Use and Dispatch — Let Claude Control Your Screen
- **Order:** 2 | **Duration:** 25 minutes
- **Covers:** Computer Use (screen control), Dispatch (phone-to-desktop tasks), tool priority chain, safety/permissions
- **Key deliverable:** Practical examples of multi-app automation

## Updates to Existing Articles

### 7. `content/agents/multi-agent-architectures.mdx`

- Add background agents with worktree isolation
- Add --worktree flag and sparse checkout details
- Update Agent Teams from "research preview" to current stable status

### 8. `content/mcp/essential-servers.mdx`

- Add MCP elicitation (mid-task structured input)
- Add new popular servers from 2026 marketplace
- Note MCP OAuth improvements

## Cross-Linking Strategy

Every new article links to:

- Its track index page
- Related articles in other tracks
- Start Here setup guides where relevant

Track index pages get new cards for their new articles.

## Creation Order (Parallelizable)

Articles 1-6 are independent and can be written simultaneously.
Updates 7-8 should happen after articles exist (for cross-linking).

## Content Conventions

- MDX with standard frontmatter (title, description, order, track, duration, lastUpdated)
- Use existing MDX components: Callout, Steps, Tabs, FileTree, Diagram, InfoTable, CodeBlock
- Beginner-first tone per CLAUDE.md
- Mac and Windows coverage where applicable
- No emojis
