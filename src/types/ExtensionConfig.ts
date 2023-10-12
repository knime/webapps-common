import { ColorModel } from "./ColorModel";
import { DialogSettings } from "./DialogSettings";
import { ExtensionTypes } from "./ExtensionTypes";
import { FlowVariableSettings } from "./FlowVariableSettings";
import { NodeInfo } from "./NodeInfo";
import { ResourceInfo } from "./ResourceInfo";

/**
 * The base configuration of any UI Extension which contains all of the relevant information about the UI Extension
 * node it references. This information allows the framework to coordinate communication between the frontend
 * application and the target node in the workflow.
 *
 * Optionally, it may also contain the initial data to provide directly to the client-side UI Extension implementation.
 *
 * @property {string} nodeId - the id of the node in the workflow.
 * @property {string} projectId - the project id of the workflow.
 * @property {string} workflowId - the workflow id.
 * @property {ResourceInfo} resourceInfo - information regarding the client-side resources for this extension.
 * @property {NodeInfo} nodeInfo - additional information regarding the node itself.
 * @property {ExtensionTypes} extensionType - the type of the extension (effects the api behavior).
 * @property {T} [initialData] - optional initial data to provide directly to the UI Extension.
 * @property {T} [initialSelection] - optional initial selection to provide directly to the UI Extension.
 * @property {DialogSettings} dialogSettings - optional initial dialog state supplying the UI Extension with the state of a dialog if present.
 * @property {FlowVariableSettings} [flowVariableSettings]
 * @property {boolean} hasNodeView
 * @property {string} generatedImageActionId - optional action-id to communicate the generated image back to Java.
 *  TODO UIEXT-1031: We are also (mis)using this prop for cpmmunicating the report back to Java. The two concerns
 *  should either be unified or separated.
 * @property {Record<string, ColorModel>} colorModels - optional color model per column used to map data cell values
 * (numeric xor nominal) of a column to hexadecimal color codes
 * @template T
 */
export type ExtensionConfig<T = any> = {
  nodeId: string;
  projectId: string;
  workflowId: string;
  resourceInfo: ResourceInfo;
  nodeInfo: NodeInfo;
  extensionType: ExtensionTypes;
  initialData?: T;
  initialSelection?: T;
  dialogSettings?: DialogSettings;
  flowVariableSettings?: FlowVariableSettings;
  hasNodeView: boolean;
  generatedImageActionId?: string;
  colorModels?: Record<string, ColorModel>;
  writeProtected?: boolean;
};
