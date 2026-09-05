/**
 * Mermaid theming for the site's diagrams.
 *
 * Kept out of the component so the values are testable and so the quality
 * checker (`tests/diagram-quality.spec.ts`) can assert against the same source
 * of truth the renderer uses.
 *
 * Colours are the Tailwind design tokens from `tailwind.config.ts`. Mermaid
 * cannot read CSS variables at render time, so they are duplicated here as
 * literals; if a scale changes in the Tailwind config, change it here too.
 */

/** Semantic roles a node can take. Colour carries meaning, not decoration. */
export type NodeRole = 'actor' | 'process' | 'data' | 'result' | 'muted'

interface RoleColours {
  fill: string
  stroke: string
  text: string
}

const ROLES_LIGHT: Record<NodeRole, RoleColours> = {
  // Who or what initiates — the human, the CLI, the model
  actor: { fill: '#f9ede7', stroke: '#c45a3a', text: '#6e3428' },
  // A step, an action, a transformation
  process: { fill: '#eff6ff', stroke: '#2563eb', text: '#1e3a8a' },
  // Stored or persisted things — files, databases, config
  data: { fill: '#faf5ff', stroke: '#9333ea', text: '#581c87' },
  // A terminal state or successful outcome
  result: { fill: '#f0fdf4', stroke: '#16a34a', text: '#14532d' },
  // Context that should recede
  muted: { fill: '#f6f7f9', stroke: '#8595ab', text: '#434f62' },
}

const ROLES_DARK: Record<NodeRole, RoleColours> = {
  actor: { fill: '#4a2a20', stroke: '#d47352', text: '#f4d9cd' },
  process: { fill: '#1e3a8a', stroke: '#3b82f6', text: '#dbeafe' },
  data: { fill: '#581c87', stroke: '#a855f7', text: '#f3e8ff' },
  result: { fill: '#14532d', stroke: '#22c55e', text: '#dcfce7' },
  muted: { fill: '#3a4353', stroke: '#8595ab', text: '#eceef2' },
}

export const ROLE_COLOURS = { light: ROLES_LIGHT, dark: ROLES_DARK }

/**
 * Mermaid `themeVariables`. The unclassed default is deliberately quiet: a
 * neutral surface with a warm border, so that a node given a semantic role
 * stands out rather than competing with everything else on the canvas.
 */
export function themeVariables(isDark: boolean) {
  const surface = isDark ? '#333a47' : '#ffffff'
  const text = isDark ? '#eceef2' : '#434f62'

  return {
    // Default node
    primaryColor: isDark ? '#3a4353' : '#f6f7f9',
    primaryTextColor: text,
    primaryBorderColor: isDark ? '#516078' : '#b0bac9',
    secondaryColor: isDark ? '#4a2a20' : '#f9ede7',
    secondaryTextColor: text,
    tertiaryColor: isDark ? '#1e3a8a' : '#eff6ff',
    tertiaryTextColor: text,

    // Edges. Deliberately darker and higher contrast than mermaid's default —
    // the previous #6B7280 / #9CA3AF pair read as scratches rather than
    // relationships.
    lineColor: isDark ? '#b0bac9' : '#516078',
    textColor: text,

    // Surfaces
    mainBkg: isDark ? '#3a4353' : '#f6f7f9',
    background: surface,
    nodeBorder: isDark ? '#516078' : '#b0bac9',
    nodeTextColor: text,

    // Subgraph containers
    clusterBkg: isDark ? '#2b313c' : '#fcf9f5',
    clusterBorder: isDark ? '#516078' : '#d5dae2',
    titleColor: isDark ? '#f6f7f9' : '#333a47',

    // Edge labels sit ON the edge, so they need an opaque plate the same
    // colour as the surface behind them.
    edgeLabelBackground: surface,

    // Sequence diagrams
    actorBkg: isDark ? '#4a2a20' : '#f9ede7',
    actorBorder: isDark ? '#d47352' : '#c45a3a',
    actorTextColor: text,
    signalColor: isDark ? '#b0bac9' : '#516078',
    signalTextColor: text,
    noteBkgColor: isDark ? '#3a4353' : '#fffbeb',
    noteTextColor: text,
    noteBorderColor: isDark ? '#516078' : '#fde68a',

    fontSize: '15px',
  }
}

/**
 * `classDef` preamble appended to flowchart sources so authors can write
 * `class Foo actor` and get consistent, meaningful colour. Only valid for
 * flowchart/graph diagrams — mermaid rejects classDef in sequence, pie and
 * mindmap sources, so `withClassDefs()` guards on the diagram header.
 */
export function classDefs(isDark: boolean): string {
  const roles = isDark ? ROLES_DARK : ROLES_LIGHT
  return (
    '\n' +
    (Object.keys(roles) as NodeRole[])
      .map((role) => {
        const c = roles[role]
        return `classDef ${role} fill:${c.fill},stroke:${c.stroke},color:${c.text},stroke-width:2px`
      })
      .join('\n')
  )
}

/** Diagram kinds that accept `classDef`. */
const SUPPORTS_CLASS_DEFS = /^\s*(flowchart|graph)\b/

/**
 * Append the semantic classDefs to a flowchart source. A diagram that never
 * uses `class X role` is unaffected; one that does gets the shared palette
 * without repeating hex values in every MDX file.
 */
export function withClassDefs(source: string, isDark: boolean): string {
  const trimmed = source.trim()
  if (!SUPPORTS_CLASS_DEFS.test(trimmed)) return trimmed
  if (/^\s*classDef\s/m.test(trimmed)) return trimmed // author defined their own
  return trimmed + '\n' + classDefs(isDark)
}
