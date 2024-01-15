import { DataServiceType, ExtensionTypes } from "src/types";
import { Alert, AlertConfig } from "src/types/Alert";
import { DialogSettings } from "./types/DialogSettings";
import { ColorModel } from "./types/ColorModel";

export type Identifiers = {
  projectId: string;
  workflowId: string;
  nodeId: string;
};

/**
 * API layer definition for the UIExtension service. This contract
 * represents the method implementations that the embedded of Extensions
 * needs to supply in order to make the communication with Extensions work properly
 */
export interface UIExtensionAPILayer {
  getResourceLocation(baseUrl: string, path: string): Promise<string>;

  callNodeDataService(
    params: Identifiers & {
      extensionType: string;
      serviceType: DataServiceType;
      request: string;
    },
  ): Promise<any>;

  callPortDataService(
    params: Identifiers & {
      portIdx: number;
      viewIdx: number;
      serviceType: DataServiceType;
      request: string;
    },
  ): Promise<any>;

  updateDataPointSelection(
    params: Identifiers & { mode: string; selection: string[] },
  ): Promise<any>;

  setReportingContent(content: string | false): void;

  publishData(data: any): Promise<void>;

  sendAlert(alert: Alert): Promise<void>;

  getConfig(): AlertConfig &
    Identifiers & {
      extensionType: ExtensionTypes;
      initialData?: any;
      dialogSettings?: DialogSettings;
      generatedImageActionId?: string | null;
      resourceInfo?: {
        baseUrl: string;
      };
      hasNodeView: boolean;
      writeProtected?: boolean;
      colorModels?: Record<string, ColorModel>;
      columnNamesColorModel?: ColorModel;
    };
}

export namespace UIExtensionMessageExchange {
  export type GenericEvent<T = string> = {
    type: T;
    requestId: string;
  };

  export type Request = GenericEvent<"UIExtensionRequest"> & {
    source: Window;
    payload: {
      method: keyof UIExtensionAPILayer;
      params: any[];
    };
  };

  export type Response<T = any> = GenericEvent<"UIExtensionResponse"> & {
    payload: T;
  };
}

export namespace UIExtensionPushEvents {
  type KnownPushEventName = "data-change";
  export type PushEventName =
    | KnownPushEventName
    | Omit<string, KnownPushEventName>;

  export type PushEvent<T> = {
    name: PushEventName;
    payload?: T;
  };

  export type PushEventListenerCallback<T> = (event: T) => void;

  export interface AddPushEventListener {
    /**
     * This method is to be used by the client ui extension to listen
     * for events dispatched by an embedder
     * @returns a method to remove the added listener
     */
    addPushEventListener<T>(
      eventName: PushEventName,
      callback: UIExtensionPushEvents.PushEventListenerCallback<T>,
    ): () => void;
  }

  export interface DispatchPushEvent {
    /**
     * This method is to be used by the embedder of a ui extension to
     * trigger registered client event listeners.
     */
    dispatchPushEvent<T>(event: UIExtensionPushEvents.PushEvent<T>);
  }
}

export type CustomUIExtensionService<APILayer> = APILayer &
  UIExtensionPushEvents.AddPushEventListener;

export type UIExtensionService = CustomUIExtensionService<UIExtensionAPILayer>;
