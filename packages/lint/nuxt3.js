import createKnimeVueTSConfig from "./vue3-typescript.js";

const createKnimeNuxtConfig = (tsconfig) => {
  const vue3TsConfig = createKnimeVueTSConfig(tsconfig);

  return [
    ...vue3TsConfig,
    {
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
    },
  ];
};

export default createKnimeNuxtConfig;
