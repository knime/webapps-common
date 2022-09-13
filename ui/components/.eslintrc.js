module.exports = {
    extends: ['@knime/eslint-config/vue3', '@knime/eslint-config/typescript'],
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
