import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.ts', // Match test files in __tests__ directories
    '**/?(*.)+(spec|test).ts', // Match test files ending with .spec.ts or .test.ts
  ],

  // Module name mapper for module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Example: Map '@/module' to 'src/module'
  },

  // File extensions to consider for module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // TypeScript support
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Code coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts', // Collect coverage from .ts files in src directory
    '!src/**/*.spec.ts', // Exclude test files from coverage
  ],

  // Other options...
};

export default config;
