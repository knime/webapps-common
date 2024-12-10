// Development app launcher. Not included in production build.
import { createApp } from "vue";
import consola from "consola";

import DevApp from "./DevApp.vue";

window.consola = consola.create({
  level:
    import.meta.env.KNIME_LOG_TO_CONSOLE === "true"
      ? import.meta.env.KNIME_LOG_LEVEL
      : -1,
});

const app = createApp(DevApp);
app.mount("#app");
