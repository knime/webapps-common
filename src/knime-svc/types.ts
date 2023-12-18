import { DataServiceType } from "src/types";
import { Alert } from "src/types/Alert";

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
  getResourceLocation(baseUrl: string, path: string): string;

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

  publishData(data: any): void;

  sendAlert(alert: Alert): void;
}

export namespace UIExtensionMessageExchange {
  export type GenericEvent<T = string> = {
    type: T;
    requestId: string;
  };

  export type Request = GenericEvent<"UIExtensionRequest"> & {
    payload: {
      method: keyof UIExtensionAPILayer;
      params: any[];
    };
  };

  export type Response<T = any> = GenericEvent<"UIExtensionResponse"> & {
    payload: T;
  };
}

export namespace UIExtensionEvents {
  export type Event<T> = {
    name: string;
    data?: T;
  };

  type GetWrappedEvent<T extends string, TPayload = unknown> = {
    type: T;
    payload: Event<TPayload>;
  };

  export type PushEvent<T> = GetWrappedEvent<"UIExtensionPushEvent", T>;

  export type EventCallback = <T>(event: Event<T>) => void;
}

export type GetConfig<T = any> = {
  getConfig(): T;
};

type KnownEvents = "data-change";

type PushEventHandling = {
  addPushEventListener: (
    eventName: KnownEvents | Omit<string, KnownEvents>,
    callback: UIExtensionEvents.EventCallback,
  ) => () => void;
  dispatchPushEvent: <T>(event: UIExtensionEvents.Event<T>) => void;
};

export type UIExtensionService<T = any> = UIExtensionAPILayer &
  PushEventHandling &
  GetConfig<T>;

export type UIExtensionIframeService<T = any> = UIExtensionService<T> & {
  setIframe(iframe: HTMLIFrameElement): void;
};

export type CreateUIExtensionService<T = any> = (
  config: T,
) => UIExtensionService<T>;

export type CreateUIExtensionIframeService<T = any> = (
  config: T,
) => UIExtensionIframeService<T>;
