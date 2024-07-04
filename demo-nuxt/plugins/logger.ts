import { createConsola, LogLevels } from "consola";

export default defineNuxtPlugin((nuxtApp) => {
  const { $config } = nuxtApp;
  const level = LogLevels[$config.public.logLevel];

  window.consola = createConsola({
    level: $config.public.logToConsole ? level : -1,
  });
});
