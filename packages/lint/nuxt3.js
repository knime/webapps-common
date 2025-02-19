const nuxtConfig = require("@nuxt/eslint-config");

const vue3 = require("./vue3.js");

module.exports = nuxtConfig.withNuxt(...vue3, {
  name: "nuxt3 lang options",
  languageOptions: {
    globals: {
      createError: true,
      defineNuxtConfig: true,
      defineNuxtPlugin: true,
      defineNuxtRouteMiddleware: true,
      markRaw: true,
      navigateTo: true,
      useAsyncData: true,
      useNuxtApp: true,
      useRoute: true,
    },
  },
});
