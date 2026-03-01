#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

const MIGRATIONS_DIR = path.join(__dirname, '../migrations')
const DB_PATH = path.join(__dirname, '../data/app.db')
const APPLIED_DIR = path.join(MIGRATIONS_DIR, 'applied')

// Ensure directories exist
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
}

if (!fs.existsSync(APPLIED_DIR)) {
  fs.mkdirSync(APPLIED_DIR, { recursive: true })
}

// Initialize database
const db = new Database(DB_PATH)

// Create migrations tracking table
db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

function getMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql') && !f.startsWith('.'))
    .sort()
}

function getAppliedMigrations() {
  const rows = db.prepare('SELECT name FROM migrations ORDER BY id').all()
  return rows.map((r) => r.name)
}

function applyMigration(filename) {
  const filePath = path.join(MIGRATIONS_DIR, filename)
  const sql = fs.readFileSync(filePath, 'utf8')

  console.log(`Applying migration: ${filename}`)

  try {
    db.exec(sql)
    db.prepare('INSERT INTO migrations (name) VALUES (?)').run(filename)

    // Move to applied folder
    const appliedPath = path.join(APPLIED_DIR, filename)
    fs.renameSync(filePath, appliedPath)

    console.log(` Migration applied: ${filename}`)
  } catch (error) {
    console.error(` Error applying migration ${filename}:`, error.message)
    throw error
  }
}

function rollbackMigration(filename) {
  const appliedPath = path.join(APPLIED_DIR, filename)

  if (!fs.existsSync(appliedPath)) {
    console.error(`Migration file not found: ${filename}`)
    return
  }

  const sql = fs.readFileSync(appliedPath, 'utf8')

  // Extract rollback section
  const rollbackMatch = sql.match(/-- ROLLBACK\n([\s\S]*?)(?:-- |$)/)

  if (!rollbackMatch) {
    console.error(`No rollback section found in ${filename}`)
    return
  }

  const rollbackSql = rollbackMatch[1].trim()

  console.log(`Rolling back migration: ${filename}`)

  try {
    db.exec(rollbackSql)
    db.prepare('DELETE FROM migrations WHERE name = ?').run(filename)

    // Move back to migrations folder
    const migrationPath = path.join(MIGRATIONS_DIR, filename)
    fs.renameSync(appliedPath, migrationPath)

    console.log(` Migration rolled back: ${filename}`)
  } catch (error) {
    console.error(` Error rolling back ${filename}:`, error.message)
    throw error
  }
}

function migrateUp() {
  const allMigrations = getMigrationFiles()
  const appliedMigrations = getAppliedMigrations()

  const pendingMigrations = allMigrations.filter(
    (m) => !appliedMigrations.includes(m)
  )

  if (pendingMigrations.length === 0) {
    console.log('No pending migrations.')
    return
  }

  console.log(`Found ${pendingMigrations.length} pending migration(s).\n`)

  for (const migration of pendingMigrations) {
    applyMigration(migration)
  }

  console.log('\n All migrations applied successfully!')
}

function migrateDown() {
  const appliedMigrations = getAppliedMigrations()

  if (appliedMigrations.length === 0) {
    console.log('No migrations to roll back.')
    return
  }

  const lastMigration = appliedMigrations[appliedMigrations.length - 1]
  rollbackMigration(lastMigration)
}

function createMigration(name) {
  if (!name) {
    console.error('Please provide a migration name.')
    console.log('Usage: npm run migrate:create -- <migration-name>')
    process.exit(1)
  }

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
  const filename = `${timestamp}_${name}.sql`
  const filePath = path.join(MIGRATIONS_DIR, filename)

  const template = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- UP
CREATE TABLE example (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ROLLBACK
DROP TABLE example;
`

  fs.writeFileSync(filePath, template)
  console.log(` Created migration: ${filename}`)
}

// Main CLI
const command = process.argv[2]
const args = process.argv.slice(3)

switch (command) {
  case 'up':
    migrateUp()
    break
  case 'down':
    migrateDown()
    break
  case 'create':
    createMigration(args.join('-'))
    break
  default:
    console.log(`
Usage:
  npm run migrate:up              Apply pending migrations
  npm run migrate:down            Rollback last migration
  npm run migrate:create -- name  Create new migration
`)
    process.exit(1)
}

db.close()
