const parentRules = require('./.eslintrc-base').rules;

module.exports = {
    plugins: ['vue', 'import'],
    extends: ['./.eslintrc-base.js', 'plugin:vue/recommended', 'plugin:jsonc/recommended-with-json'],
    parserOptions: { 
        "ecmaFeatures": {
            "jsx": true
        }
    },
    rules: {
        'max-lines': ['warn', Object.assign(parentRules['max-lines'][1], {
            max: 500
        })],
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            // Workaround for https://github.com/vuejs/eslint-plugin-vue/issues/580
            ignores: [
                'a', 'animate', 'animateMotion', 'animateTransform', 'audio', 'canvas', 'circle', 'clipPath', 'defs',
                'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
                'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow',
                'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge',
                'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight',
                'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'iframe', 'image', 'line', 'linearGradient',
                'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient',
                'rect', 'script', 'set', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title',
                'tspan', 'unknown', 'use', 'video', 'view'
            ]
        }],
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
        'import/extensions': ['error', { vue: 'always' }]
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
    }, {
        // this needs to be done here as the max-lines rule above overrides stuff from eslintrc-base
        files: ['*.json'],
        rules: {
            'max-lines': 'off'
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
