import type { Toast } from "@knime/components";

export type EmbeddingContext = {
  /**
   * URI of the WS used by the embedded application.
   * (e.g in case of browser AP, this is the WS url provided by the ws-proxy)
   */
  wsConnectionUri: string;
  /**
   * @deprecated URI of the WS used by the embedded application.
   * Last used in AP 5.8.0
   */
  url?: string;
  /**
   * Base URL of the Hub's REST API. This will be used by the embedded application
   * to make requests to the hub API. It can also be used to fetch resources
   * dynamically at runtime and get assets needed to render UI extensions
   * (e.g port views, node views, etc)
   */
  restApiBaseUrl: string;
  /**
   * Id of the job loaded into the executor that is providing the embedded application
   */
  jobId: string;
  /**
   * @deprecated only needed due to backwards compatibility because it's used
   * by older AP versions. Last used in AP 5.4.0
   */
  sessionId?: string;
  /**
   * Time in MS after which the user is considered idle if no interactions
   * are being made on the page
   */
  userIdleTimeout?: number;
};

type ShowNotificationEvent = {
  kind: "showNotification";
  payload: Toast;
};

type ClearNotificationEvent = {
  kind: "clearNotification";
  payload: { id: string } | { deduplicationKey: string };
};

export type GenericEvent = ShowNotificationEvent | ClearNotificationEvent;

export type GenericEventByKind<K extends GenericEvent["kind"]> = Extract<
  GenericEvent,
  { kind: K }
>;

export type GenericEventHandlers = {
  [K in GenericEvent["kind"]]?: (event: GenericEventByKind<K>) => void;
};

export type UserActivityInfo = {
  idle: boolean;
  lastActive: string;
};
