import UIExtension from "./UIExtension.vue";
import UIExtensionAlerts from "./UIExtensionAlerts.vue";
import type { ExtensionConfig } from "./types/ExtensionConfig";
import type { NodeInfo } from "./types/NodeInfo";
import type { ResourceInfo } from "./types/ResourceInfo";
import { ResourceTypes } from "./types/ResourceTypes";
import type { UIExtensionAPILayer } from "./types/UIExtensionAPILayer";

export * from "./types/serviceApiLayer";

export * from "./logic";

// For tests only
export { setUpCustomEmbedderService } from "./logic/embedder";
export { setUpIframeEmbedderService } from "./logic/iframe/embedder";

export {
  UIExtension,
  UIExtensionAlerts,
  type UIExtensionAPILayer,
  type ExtensionConfig,
  ResourceTypes,
  type ResourceInfo,
  type NodeInfo,
};
