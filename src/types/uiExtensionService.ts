import { ExtensionTypes } from "@/types/ExtensionTypes";
import { DataServiceType } from "@/types/DataServiceType";
import { Alert, AlertConfig } from "@/types/alert";
import { ColorModel } from "./ColorModel";
import { UIExtensionPushEvents } from "./pushEvents";

export type Identifiers = {
  /**
   * the id of the node in the workflow.
   */
  projectId: string;
  /**
   * the project id of the workflow.
   */
  workflowId: string;
  /**
   * the workflow id.
   */
  nodeId: string;
};

/**
 * The configuration of the client-side UIExtension implementation
 */
export type UIExtensionServiceConfig = AlertConfig &
  Identifiers & {
    /**
     * the type of the extension (effects the api behavior).
     */
    extensionType: ExtensionTypes;
    /**
     * optional initial data to provide directly to the UI Extension.
     */
    initialData?: any;
    /**
     * optional initial selection to provide directly to the UI Extension.
     */
    initialSelection?: any;
    /**
     * optional initial state supplying the UI Extension with the shared state of
     * already existing other UI Extensions.
     */
    initialSharedData?: any;
    /**
     * optional action-id to communicate the generated image back to Java.
     *  TODO UIEXT-1031: We are also (mis)using this prop for communicating the report back to Java. The two concerns
     *  should either be unified or separated.
     */
    generatedImageActionId?: string | null;
    hasNodeView: boolean;
    writeProtected?: boolean;
    /**
     * optional color model per column used to map data cell values
     * (numeric xor nominal) of a column to hexadecimal color codes
     */
    colorModels?: Record<string, ColorModel>;
    /**
     * optional color model used to map column names to hexadecimal color
     * codes
     */
    columnNamesColorModel?: ColorModel;
  };

export enum ApplyState {
  CLEAN,
  EXEC,
  CONFIG,
  IDLE,
}

export enum ViewState {
  CLEAN,
  EXEC,
  CONFIG,
  IDLE,
}

export type APILayerDirtyState = { apply: ApplyState; view: ViewState };

type SomeKnimeUiApiResponse = {
  isSome: true;
  result: any;
};

type NoneKnimeUiApiResponse = {
  isSome: false;
};

type KnimeUiApiResponse = SomeKnimeUiApiResponse | NoneKnimeUiApiResponse;

/**
 * API layer definition for the UIExtension service. This contract
 * represents the method implementations that the embedder of Extensions
 * needs to supply in order to make the communication with Extensions work properly
 */
export type UIExtensionServiceAPILayer = {
  getResourceLocation: (path: string) => Promise<string>;

  // TODO rename - UIEXT-1697
  callNodeDataService: (
    params: Identifiers & {
      extensionType: string;
      serviceType: DataServiceType;
      dataServiceRequest: string;
    },
  ) => Promise<any>;

  // TODO get rid of this method - This is for providing data for an input-port-view in the scripting editor
  callKnimeUiApi?: (
    method: string,
    params: object | readonly unknown[] | undefined,
  ) => Promise<KnimeUiApiResponse>;

  updateDataPointSelection: (
    params: Identifiers & { mode: string; selection: string[] },
  ) => Promise<any>;

  setReportingContent: (content: string | false) => void;

  imageGenerated: (image: string) => void;

  /**
   * TODO Rename with UIEXT-1791
   */
  publishData: (data: any) => void;

  onDirtyStateChange: (newDirtyState: APILayerDirtyState) => void;

  setControlsVisibility: (param: { shouldBeVisible: boolean }) => void;

  onApplied: (payload: {
    /**
     * Whether applying has been successful
     */
    isApplied: boolean;
  }) => void;

  sendAlert: (alert: Alert) => void;

  getConfig: () => UIExtensionServiceConfig;
};

export type UIExtensionService<APILayer = UIExtensionServiceAPILayer> =
  APILayer & UIExtensionPushEvents.AddPushEventListener;
