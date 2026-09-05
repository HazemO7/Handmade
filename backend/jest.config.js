module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  testMatch: ['<rootDir>/src/__tests__/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  coverageDirectory: 'coverage',
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/seeds/**',
    '!src/__tests__/**'
  ]
};
