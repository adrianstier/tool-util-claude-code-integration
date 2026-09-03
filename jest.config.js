/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)'],
  // Playwright specs live in /tests and must not be run by Jest (they import
  // @playwright/test, which needs a Node runtime Jest's jsdom env doesn't provide).
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '<rootDir>/tests/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}

module.exports = config
