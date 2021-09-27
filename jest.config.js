module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'ts', 'json'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    transformIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/test/$1',
        '^~/(.*)$': '<rootDir>/$1'
    },
    reporters: ['default', ['jest-junit', { outputDirectory: './coverage' }]],
    coverageReporters: ['lcov', 'text'],
    // keep in sync with sonar-project.properties!
    collectCoverageFrom: [
        '<rootDir>/**/*.{ts}',
        '!config.js',
        '!**/*.config.js',
        '!.eslintrc*.js',
        '!**/.eslintrc*.js',
        '!<rootDir>/test/unit/test-util'
    ],
    coveragePathIgnorePatterns: [
        '^<rootDir>/(coverage|dist|test|target|node_modules|bin|webapps-common|src/dev)/',
        '^<rootDir>/src/(main.ts|dev.ts)'
    ],
    watchPathIgnorePatterns: ['^<rootDir>/(coverage|dist|target|node_modules|bin|webapps-common)/'],
    testURL: 'http://test.example/',
    testMatch: ['<rootDir>/test/unit/suites/**/*.test.ts'],
    watchPlugins: [],
    setupFiles: ['<rootDir>/test/unit/jest-setup']
};
