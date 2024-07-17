/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.[jt]s?(x)'],
  /*
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  */
  verbose: true,
};
