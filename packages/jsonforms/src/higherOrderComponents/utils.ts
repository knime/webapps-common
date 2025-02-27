import type { Component } from "vue";

export const getAsyncSetupMethod = (component: Component) => async () => {
  if (component.name === "AsyncComponentWrapper") {
    // @ts-expect-error : setup doesn't exist on type Component
    await component.setup();
  }
};
