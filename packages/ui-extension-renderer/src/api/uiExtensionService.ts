import type { UIExtensionPushEvents } from "./pushEvents";
import type { ColorModel } from "./services/ColorModel";
import type { DataServiceType } from "./services/DataServiceType";
import type { ExtensionType } from "./services/ExtensionTypes";
import type { RenderingConfig } from "./services/RenderingConfig";
import type { Alert } from "./services/alert";
import type { SelectionParams } from "./services/selection";

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
  extensionType: ExtensionType;
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

export type ApplyState =
  /**
   * Settings are clean, so they do not need to be applied.
   */
  | "clean"
  /**
   *Settings are dirty, i.e. can be applied, but if the node is currently executed,
   *applying the settings does not reset the node.
   */
  | "executed"
  /**
   * Settings are dirty, i.e. can be applied. If they are applied the node will have to be
   * reset and requires re-execution
   */
  | "configured"
  /**
   * The settings are dirty and invalid, leaving the node in an idle state when applied.
   * We sometimes do want to allow applying such settings when they could become valid
   * at a later point without changing the dialog (e.g. when the value of a flow variable
   *  changes)
   */
  | "idle";

export type ViewState =
  /**
   * Settings are clean.
   */
  | "clean"
  /**
   * The settings are dirty but previewing these settings in the view is still possible without a re-execution.
   */
  | "executed"
  /**
   * The settings are dirty and require re-execution to show the resulting view.
   */
  | "configured"
  /**
   * The settings are dirty and invalid, i.e. it is not even possible to execute the node with these settings.
   */
  | "idle";

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

  updateDataPointSelection: (params: SelectionParams) => Promise<any>;

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
