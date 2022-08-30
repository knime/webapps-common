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
        'import/extensions': ['error', { vue: 'always', json: 'always' }]
    },
    overrides: [{
        files: ['server/**/*.js', '{vue,nuxt}.config.js', 'nightwatch.conf.js'],
        env: {
            node: true
        }
    }, {
        files: ['config.js', '*.config.js', '*.conf.js', 'config.mjs', '*.config.mjs', '*.conf.mjs', 'config/**'],
        rules: {
            camelcase: 'off',
            'no-magic-numbers': 'off',
            'no-process-env': 'off'
        }
    }],
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['~', '.'],
                    ['@', '.'],
                    ['~~', '.'],
                    ['@@', '.']
                ],
                extensions: ['.vue', '.config.js', '.ttl-patch.js']
            }
        }
    }
};
