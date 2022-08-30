module.exports = {
    extends: './base.js',
    overrides: [{
        // it is assumed that all js files on root denote an eslint config
        files: ['*.js'],
        env: {
            browser: false,
            node: true
        },
        rules: {
            'no-magic-numbers': 'off'
        }
    }]
};
