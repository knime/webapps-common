import type { UIExtensionServiceConfig } from "../../api";

import type { NodeInfo } from "./NodeInfo";
import { type ResourceInfo } from "./ResourceInfo";

/**
 * The base configuration of any UI Extension which contains all of the relevant information about the UI Extension
 * node it references. This information allows the framework to coordinate communication between the frontend
 * application and the target node in the workflow.
 */
export type ExtensionConfig = UIExtensionServiceConfig & {
  resourceInfo: ResourceInfo;
  nodeInfo?: NodeInfo;
};
