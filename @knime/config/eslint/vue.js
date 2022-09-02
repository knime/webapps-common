const parentRules = require('./base').rules;

module.exports = {
    plugins: ['vue', 'import'],
    extends: ['./base.js', 'plugin:vue/recommended', 'plugin:jsonc/recommended-with-json'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        'max-lines': ['warn', Object.assign(parentRules['max-lines'][1], {
            max: 500
        })],
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'always'
        }],
        'vue/html-closing-bracket-spacing': 'error',
        'vue/multiline-html-element-content-newline': 'error',
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off',
        'vue/no-spaces-around-equal-signs-in-attribute': 'error',
        'vue/padding-line-between-blocks': 'error',
        'vue/require-v-for-key': 'warn',
        'vue/singleline-html-element-content-newline': 'off',
        'import/extensions': ['error', { vue: 'always', json: 'always', mjs: 'always', svg: 'always' }]
    },
    overrides: [{
        // this needs to be done here as the max-lines rule above overrides stuff from eslintrc-base
        files: ['*.json'],
        rules: {
            'max-lines': 'off'
        }
    }],
    settings: {
        'import/resolver': {
            alias: {
                extensions: ['.js', '.mjs', '.config.js', '.vue', '.json', '.svg']
            }
        }
    }
};
