module.exports = {
    extends: ['./.eslintrc-base.js'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-extra-parens': 'off',
        '@typescript-eslint/no-extra-parens': 'error'
    },
    overrides: [{
        files: ['*.json'],
        parser: 'jsonc-eslint-parser'
    }]
};
