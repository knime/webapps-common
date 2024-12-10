import { inject } from "vue";

import type { Provided, ProvidedForFlowVariables } from "../types/provided";

const typedInject = <T, K extends keyof T & string>(key: K) => {
  return inject<T[K]>(key)!;
};

// A typescript wrapper to ease injecting common functionality provided by NodeDialog.vue into the dialog components
export default <K extends keyof Provided>(key: K) => {
  return typedInject<Provided, K>(key)!;
};

export const injectForFlowVariables = <
  K extends keyof ProvidedForFlowVariables,
>(
  key: K,
) => {
  return typedInject<ProvidedForFlowVariables, K>(key)!;
};
