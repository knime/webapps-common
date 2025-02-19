import { createConfigForNuxt } from "@nuxt/eslint-config";

import tempDisable from "./temporary-disable.js";
import vue3Config from "./vue3.js";

// nuxt provides factory function for config customization
export default await createConfigForNuxt(...vue3Config, {
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
}).append(...tempDisable);
