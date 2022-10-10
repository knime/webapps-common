module.exports = {
    extends: ['./base.js'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        'no-duplicate-imports': 'off',
        'import/no-duplicates': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-extra-parens': 'off',
        '@typescript-eslint/no-extra-parens': 'error',
        'prefer-const': 'error'
    },
    overrides: [{
        files: ['*.json'],
        parser: 'jsonc-eslint-parser'
    }]
};
