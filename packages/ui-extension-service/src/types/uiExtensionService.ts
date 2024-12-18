import type { ColorModel } from "./ColorModel";
import { DataServiceType } from "./DataServiceType";
import { ExtensionTypes } from "./ExtensionTypes";
import type { RenderingConfig } from "./RenderingConfig";
import type { Alert } from "./alert";
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
export type UIExtensionServiceConfig = Identifiers & {
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
   * rendering config to determine in which context the ui extension is rendered
   */
  renderingConfig?: RenderingConfig;
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
  /**
   * whether the ui-extension (dialog) should initially be opened in large mode
   */
  startEnlarged?: boolean;
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

export interface DataValueViewConfig {
  rowIndex: number;
  colIndex: number;
  anchor: {
    x: number;
    y: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
  };
}

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

  showDataValueView: (config: DataValueViewConfig) => void;

  closeDataValueView: () => void;
};

export type UIExtensionService<APILayer = UIExtensionServiceAPILayer> =
  APILayer & UIExtensionPushEvents.AddPushEventListener;
