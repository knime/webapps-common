module.exports = {
    extends: ['@knime/eslint-config/vue3', '@vue/eslint-config-typescript'],
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
