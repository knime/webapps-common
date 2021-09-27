module.exports = {
    extends: ['./webapps-common/lint/.eslintrc-base.js'],
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
        ecmaVersion: 11,
        sourceType: 'module',
        project: ['./packages/*/tsconfig.json']
    },
    plugins: ['@typescript-eslint', 'jest']
};
