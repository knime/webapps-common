import type { Component } from "vue";

export const getAsyncSetupMethod = (component: Component) => async () => {
  if (component.name === "AsyncComponentWrapper") {
    await (component as any).setup();
  }
};
