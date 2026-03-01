#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '../data')
const MIGRATIONS_DIR = path.join(__dirname, '../migrations')
const APPLIED_DIR = path.join(MIGRATIONS_DIR, 'applied')

console.log('Setting up database directories...')

// Create data directory
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  console.log(' Created data/ directory')
} else {
  console.log(' data/ directory already exists')
}

// Create migrations directory
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true })
  console.log(' Created migrations/ directory')
} else {
  console.log(' migrations/ directory already exists')
}

// Create applied migrations directory
if (!fs.existsSync(APPLIED_DIR)) {
  fs.mkdirSync(APPLIED_DIR, { recursive: true })
  console.log(' Created migrations/applied/ directory')
} else {
  console.log(' migrations/applied/ directory already exists')
}

// Create initial migration if it doesn't exist
const initialMigrationPath = path.join(
  MIGRATIONS_DIR,
  '00000000000000_initial.sql'
)

if (!fs.existsSync(initialMigrationPath)) {
  const initialMigration = `-- Initial migration
-- Created: ${new Date().toISOString()}

-- UP
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  platform TEXT CHECK(platform IN ('mac', 'windows')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  completed_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, module_id)
);

CREATE TABLE saved_prompts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_module_id ON progress(module_id);
CREATE INDEX idx_saved_prompts_user_id ON saved_prompts(user_id);
CREATE INDEX idx_saved_prompts_category ON saved_prompts(category);

-- ROLLBACK
DROP INDEX IF EXISTS idx_saved_prompts_category;
DROP INDEX IF EXISTS idx_saved_prompts_user_id;
DROP INDEX IF EXISTS idx_progress_module_id;
DROP INDEX IF EXISTS idx_progress_user_id;
DROP TABLE saved_prompts;
DROP TABLE progress;
DROP TABLE users;
`

  fs.writeFileSync(initialMigrationPath, initialMigration)
  console.log(' Created initial migration')
} else {
  console.log(' Initial migration already exists')
}

console.log('\n Database setup complete!')
console.log('\nNext steps:')
console.log('  npm run migrate:up    - Apply migrations')
console.log('  npm run dev           - Start development server')
