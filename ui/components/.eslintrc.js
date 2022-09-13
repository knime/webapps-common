module.exports = {
    extends: ['@knime/eslint-config/vue3'],
    globals: {
        consola: true
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@', './src'],
                    ['@@', '.']
                ]
            }
        }
    }
};
