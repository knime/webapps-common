// Development app launcher. Not included in production build.
import { createApp } from "vue";
import { createStore } from "vuex";
import consola from "consola";
import DevApp from "./DevApp.vue";

window.consola = consola.create({
  level:
    import.meta.env.KNIME_LOG_TO_CONSOLE === "true"
      ? import.meta.env.KNIME_LOG_LEVEL
      : -1,
});

const pagebuilderStoreMock = {
  "pagebuilder/dialog": {
    namespaced: true,
    actions: {
      setApplySettings: () => {},
      dirtySettings: () => {},
      cleanSettings: () => {},
      callApplySettings: () => {},
    },
  },
};
const store = createStore({ modules: pagebuilderStoreMock });

const app = createApp(DevApp);
app.use(store);
app.mount("#app");
