// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // Use jsdom environment for DOM testing (React components)
  testEnvironment: 'jest-environment-jsdom',

  // Setup files to run before each test (e.g., custom matchers)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Handle module path aliases matching tsconfig.json (e.g., "@/components/...")
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Directory pattern matches for tests
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Ignore build and dependency folders
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

module.exports = createJestConfig(customJestConfig);