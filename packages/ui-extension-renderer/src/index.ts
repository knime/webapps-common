import UIExtension from "./UIExtension.vue";
import UIExtensionAlerts from "./UIExtensionAlerts.vue";
import type { ExtensionConfig } from "./types/ExtensionConfig";
import type { NodeInfo } from "./types/NodeInfo";
import type { ResourceInfo } from "./types/ResourceInfo";
import { ResourceTypes } from "./types/ResourceTypes";
import type { UIExtensionAPILayer } from "./types/UIExtensionAPILayer";

// TODO: UIEXT-2136 Remove this export once the UIExtensionServiceAPILayer is moved to this package
export * from "@knime/ui-extension-service";

export {
  UIExtension,
  UIExtensionAlerts,
  type UIExtensionAPILayer,
  type ExtensionConfig,
  ResourceTypes,
  type ResourceInfo,
  type NodeInfo,
};
