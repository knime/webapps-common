/* eslint-disable vue/one-component-per-file */
import { defineComponent, getCurrentInstance, h, useSlots } from "vue";

const getAppInstance = () => {
  const currentInstance = getCurrentInstance();

  return currentInstance?.appContext.app;
};

export const resolveClientOnlyComponent = () => {
  const app = getAppInstance();

  // only works when ClientOnly is registered globally, which it's not by default
  const clientOnlyComponent = app?.component("ClientOnly");
  if (clientOnlyComponent) {
    return clientOnlyComponent;
  }

  // fallback component when ClientOnly not available
  const fallbackComponent = defineComponent({
    render() {
      return useSlots().default?.();
    },
  });

  return fallbackComponent;
};

export const resolveNuxtLinkComponent = () => {
  const app = getAppInstance();

  // only works when NuxtLink is registered globally, which it's not by default
  const nuxtLinkComponent = app?.component("NuxtLink");
  if (nuxtLinkComponent) {
    return nuxtLinkComponent;
  }

  const routerLinkComponent = app?.component("RouterLink");
  if (routerLinkComponent) {
    return routerLinkComponent;
  }

  // fallback component when neither NuxtLink nor RouterLink are available
  const fallbackComponent = defineComponent({
    props: {
      to: {
        type: String,
        default: "",
      },
    },

    render() {
      return h("a", { href: this.to }, [useSlots().default?.()]);
    },
  });

  return fallbackComponent;
};
