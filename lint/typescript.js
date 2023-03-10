module.exports = {
    overrides: [
        {
            extends: ['./base.js'],
            files: ['**/*.ts'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint', 'import'],
            rules: {
                'no-duplicate-imports': 'off',
                'import/no-duplicates': 'error',
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                'no-extra-parens': 'off',
                '@typescript-eslint/no-extra-parens': 'error',
                'prefer-const': 'error'
            },
            env: { browser: true, node: true }
        }
    ]
};
