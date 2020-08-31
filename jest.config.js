module.exports = {
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue'
    ],
    transform: {
        '\\.js$': 'babel-jest',
        '\\.vue$': 'vue-jest',
        '\\.(css|styl|less|sass|scss|ttf|woff|woff2)(\\?|$)': 'jest-transform-stub',
        '\\.svg': '<rootDir>/test/unit/jest-transform-svgs',
        '\\.(jpg|webp)': '<rootDir>/test/unit/jest-file-loader'
    },
    transformIgnorePatterns: [
        '/node_modules/'
    ],
    moduleNameMapper: {
        '\\.(jpg|png)\\?(jpg|webp)': '<rootDir>/test/unit/assets/stub.$2',
        '\\.svg\\?inline$': '<rootDir>/test/unit/assets/stub.svg',
        '\\.svg\\?data$': '<rootDir>/test/unit/assets/stub.data',
        '^vue$': 'vue/dist/vue.common.js',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^~/(.*)$': '<rootDir>/$1'
    },
    reporters: ['default', ['jest-junit', { outputDirectory: './coverage' }]],
    coverageReporters: ['lcov', 'text'],
    // keep in sync with sonar-project.properties!
    collectCoverageFrom: [
        '<rootDir>/**/*.{js,vue}',
        '!config.js',
        '!**/*.config.js',
        '!.eslintrc*.js',
        '!**/.eslintrc*.js',
        '!.stylelintrc.js'
    ],
    coveragePathIgnorePatterns: [
        '^<rootDir>/(coverage|dist|test|target|node_modules|demo)/'
    ],
    testURL: 'http://test.example/',
    testMatch: [
        '**/test/unit/**/*.test.(js|jsx|ts|tsx)'
    ],
    setupFiles: ['<rootDir>/test/unit/jest-setup'],
    globals: {
        'vue-jest': {
            hideStyleWarn: true
        }
    }
};
