module.exports = {
    extends: 'knime/vue',
    globals: {
        browser: true,
        consola: true
    },
    overrides: [{
        files: ['*.config.js'],
        env: {
            node: true
        }
    }]
};
