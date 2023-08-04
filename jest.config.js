module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "ts", "json"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/test/$1",
    "^~/(.*)$": "<rootDir>/$1",
  },
  reporters: ["default", ["jest-junit", { outputDirectory: "./test-results" }]],
  coverageReporters: ["lcov", "text"],
  // keep in sync with pom.xml sonar settings!
  collectCoverageFrom: [
    "<rootDir>/**/*.(js|ts)",
    "!config.js",
    "!**/*.config.js",
    "!.eslintrc*.js",
    "!**/.eslintrc*.js",
    "!<rootDir>/test/unit/test-util",
    "!**/types/**",
  ],
  coveragePathIgnorePatterns: [
    "^<rootDir>/(coverage|dist|test|test-results|node_modules|bin|src/dev)/",
    "^<rootDir>/src/(main.ts|dev.ts)",
  ],
  watchPathIgnorePatterns: [
    "^<rootDir>/(coverage|dist|test-results|node_modules|bin)/",
  ],
  testEnvironmentOptions: {
    url: "http://test.example/",
  },
  testMatch: ["<rootDir>/test/unit/suites/**/*.test.ts"],
  watchPlugins: [],
  setupFiles: ["<rootDir>/test/unit/jest-setup"],
};
