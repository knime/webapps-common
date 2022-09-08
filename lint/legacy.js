module.exports = {
    extends: ['./base.js'],
    parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script'
    },
    env: {
        browser: true,
        es6: false
    },
    rules: {
        'arrow-body-style': 'off',
        'arrow-spacing': 'off',
        'implicit-arrow-linebreak': 'off',
        'no-magic-numbers': ['warn', {
            ignore: [-1, 0, 1, 1000],
            ignoreArrayIndexes: true,
            enforceConst: false
        }],
        'no-useless-rename': 'off',
        'no-var': 'off',
        'object-shorthand': 'off',
        'prefer-arrow-callback': 'off',
        'prefer-rest-params': 'off',
        'prefer-spread': 'off',
        'prefer-template': 'off',
        'require-await': 'off',
        'rest-spread-spacing': 'off'
    }
};
