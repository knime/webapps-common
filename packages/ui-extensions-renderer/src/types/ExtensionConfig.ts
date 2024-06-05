import { type UIExtensionServiceConfig } from "@knime/ui-extension-service";
import { type ResourceInfo } from "./ResourceInfo";

/**
 * The base configuration of any UI Extension which contains all of the relevant information about the UI Extension
 * node it references. This information allows the framework to coordinate communication between the frontend
 * application and the target node in the workflow.
 */
export type ExtensionConfig = UIExtensionServiceConfig & {
  resourceInfo: ResourceInfo;
};
