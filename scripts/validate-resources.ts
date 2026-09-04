#!/usr/bin/env npx tsx
/**
 * Resource Data Validation Script
 * Run with: npx tsx scripts/validate-resources.ts
 *           or: npm run validate:resources
 *
 * Validates:
 * - All required fields present
 * - ID uniqueness and format
 * - URL format consistency
 * - Icon name validity
 * - Category and skill level values
 * - Date format
 */

import { RESOURCES } from '../src/data/resources'
import { validateAllResources } from '../src/lib/resources'
import type { Resource } from '../src/types/resources'

console.log('Validating resources...\n')

const validation = validateAllResources(
  RESOURCES as unknown as readonly Resource[]
)

if (validation.valid) {
  console.log('All resources valid!')
  console.log(`   Total: ${validation.totalResources}`)

  if (validation.warningCount > 0) {
    console.log(`\nWarnings (${validation.warningCount}):`)
    validation.summary.warnings.forEach((w: string) => console.log(`   ${w}`))
  }

  console.log('\nResource counts by category:')
  const categories = ['our-tools', 'learning', 'official', 'community'] as const
  categories.forEach((cat) => {
    const count = (RESOURCES as unknown as readonly Resource[]).filter(
      (r: Resource) => r.category === cat
    ).length
    console.log(`   ${cat}: ${count}`)
  })

  process.exit(0)
} else {
  console.log('Validation failed!')
  console.log(
    `   Invalid: ${validation.invalidCount}/${validation.totalResources}`
  )

  console.log('\nErrors:')
  validation.summary.errors.forEach((e: string) => console.log(`   ${e}`))

  if (validation.warningCount > 0) {
    console.log(`\nWarnings:`)
    validation.summary.warnings.forEach((w: string) => console.log(`   ${w}`))
  }

  process.exit(1)
}
