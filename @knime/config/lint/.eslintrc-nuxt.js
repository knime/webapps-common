const parentRules = require('./.eslintrc-vue').rules;

module.exports = {
    extends: ['./.eslintrc-vue.js'],
    rules: {
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            ignores: [
                ...parentRules['vue/component-name-in-template-casing'][2].ignores,
                'nuxt',
                'nuxt-link',
                'nuxt-child',
                'client-only'
            ]
        }],
        'vue/order-in-components': ['error', {
            order: [
                'el',
                'name',
                'parent',
                'functional',
                'validate',
                'layout',
                ['delimiters', 'comments'],
                ['components', 'directives', 'filters'],
                'extends',
                'mixins',
                'middleware',
                'inheritAttrs',
                'loading',
                'scrollToTop',
                'transition',
                'model',
                ['inject', 'provide'],
                ['props', 'propsData'],
                'data',
                'asyncData',
                'fetch',
                'computed',
                'head',
                'watch',
                'watchQuery',
                'LIFECYCLE_HOOKS',
                'methods',
                ['template', 'render'],
                'renderError'
            ]
        }]
    },
    env: {
        node: true
    }
};
