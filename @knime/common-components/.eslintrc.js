module.exports = {
    extends: 'knime/nuxt',
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
