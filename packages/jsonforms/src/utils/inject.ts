import { inject } from "vue";

import type { Provided } from "../types/provided";

const typedInject = <T, K extends keyof T & string>(key: K) => {
  return inject<T[K]>(key)!;
};

// A typescript wrapper to ease injecting common functionality provided by JsonFormsDialog.vue into the dialog components
export default <K extends keyof Provided>(key: K) => {
  return typedInject<Provided, K>(key)!;
};
