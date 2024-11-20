import { inject } from "vue";

import type { UIExtensionService } from "@knime/ui-extension-service";

export default () => {
  const getKnimeService = (inject("getKnimeService") ??
    (() => null)) as () => UIExtensionService;
  return getKnimeService();
};
