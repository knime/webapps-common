import { Component, createApp } from "vue";
import { KnimeService } from "@knime/ui-extension-service";

export default (component: Component, withInitialData = false) => {
  return (
    shadowRoot: ShadowRoot,
    knimeService: KnimeService,
    initialData: any,
    getImageUrl: (resourceInfo: { baseUrl: string; path: string }) => string,
  ) => {
    // create a app holder in the shadow root
    const holder = document.createElement("div");
    // the table requires all wrappers to have height 100%;
    holder.setAttribute("style", "height: 100%");

    // inject styles in the shadow root
    const style = document.createElement("style");
    // @ts-ignore - will be replaced by the build tool see vite.config.ts
    style.innerHTML = __INLINE_CSS_CODE__;

    // elements attach to the shadow root
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(holder);

    const rootProps = withInitialData ? { initialData } : null;

    const app = createApp(component, rootProps);
    app.provide("getKnimeService", () => knimeService);
    app.provide("shadowRoot", shadowRoot);
    app.provide("getImageUrl", getImageUrl);
    app.mount(holder);

    return {
      teardown: () => {
        app.unmount();
        shadowRoot.replaceChildren();
      },
    };
  };
};
