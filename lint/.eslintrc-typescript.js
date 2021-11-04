module.exports = {
    extends: ['./.eslintrc-base.js'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'comma-dangle': ['warn', 'always-multiline']
    }
};
