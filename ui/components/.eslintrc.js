module.exports = {
    extends: ['@knime/eslint-config/vue3-typescript'],
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
