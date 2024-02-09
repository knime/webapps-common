import type {
  Alert,
  UIExtensionServiceAPILayer,
} from "@knime/ui-extension-service";
import type { UIExtensionAPILayer } from "./types/UIExtensionAPILayer";
import type { ExtensionConfig } from "./types/ExtensionConfig";
import { toRaw } from "vue";

export const toServiceAPILayer = (
  apiLayer: UIExtensionAPILayer,
  {
    config,
    setAlert,
  }: {
    config: ExtensionConfig;
    setAlert: (alert: Alert) => void;
  },
): UIExtensionServiceAPILayer => {
  return {
    ...apiLayer,
    sendAlert: setAlert,
    getConfig: () => {
      return toRaw(config);
    },
  };
};
