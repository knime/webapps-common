module.exports = {
    extends: ['@nuxt/eslint-config', './vue3', 'prettier'],
    globals: {
        createError: true,
        defineNuxtConfig: true,
        defineNuxtPlugin: true,
        defineNuxtRouteMiddleware: true,
        markRaw: true,
        navigateTo: true,
        useAsyncData: true,
        useNuxtApp: true,
        useRoute: true
    }
};
