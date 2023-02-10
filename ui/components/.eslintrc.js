module.exports = {
    extends: ['@knime/eslint-config/vue3-typescript', '@knime/eslint-config/vitest'],
    globals: {
        consola: true
    },
    env: {
        node: true,
        browser: true
    }
};
