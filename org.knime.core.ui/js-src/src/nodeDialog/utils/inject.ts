import type { JsonDataService } from "@knime/ui-extension-service";
import { inject } from "vue";
import type Provided from "../types/provided";

// A typescript wrapper to ease injecting common functionality provided by NodeDialog.vue into the dialog components
export default <K extends keyof Provided>(key: K) => {
  return inject<Provided[K]>(key)!;
};

export const injectJsonDataService = () => {
  return inject<() => JsonDataService>("getJsonDataService")!();
};
