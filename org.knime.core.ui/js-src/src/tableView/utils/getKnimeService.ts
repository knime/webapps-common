import type { UIExtensionService } from "@knime/ui-extension-service";
import { inject } from "vue";

export default () => {
  const getKnimeService = (inject("getKnimeService") ??
    (() => null)) as () => UIExtensionService;
  return getKnimeService();
};
