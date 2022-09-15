module.exports = {
    plugins: ['vue', 'import'],
    extends: ['./base.js', 'plugin:vue/vue3-recommended', 'plugin:jsonc/recommended-with-json'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'always'
        }],
        'vue/html-closing-bracket-spacing': 'error',
        'vue/multiline-html-element-content-newline': 'error',
        'vue/padding-line-between-blocks': 'error',
        'vue/no-spaces-around-equal-signs-in-attribute': 'error',
        'vue/require-v-for-key': 'warn',
        'vue/singleline-html-element-content-newline': 'off',
        'import/extensions': ['error', { vue: 'always', json: 'always', mjs: 'always', svg: 'always' }],
        'vue/multi-word-component-names': 'off', // TODO enable?
        'vue/no-reserved-component-names': 'off' // TODO enable?
    },
    settings: {
        'import/resolver': {
            alias: {
                extensions: ['.js', '.mjs', '.config.js', '.vue', '.json', '.svg']
            }
        }
    }
};
