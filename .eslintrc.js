module.exports = {
    extends: ['./webapps-common/lint/.eslintrc-vue.js'],
    env: {
        node: true,
        browser: true
    },
    globals: {
        consola: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        sourceType: 'module',
        project: ['./packages/*/tsconfig.json']
    },
    plugins: ['@typescript-eslint', 'jest'],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error'
    }
};
