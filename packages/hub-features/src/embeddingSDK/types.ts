import type { Toast } from "@knime/components";

/**
 * ----------- IMPORTANT NOTES ---------------
 * 1. These messages are considered API. So they **must** remain
 *    backwards compatible
 * 2. Instead of removal of properties from the embedding context payload,
 *    we must use deprecation notes that list which AP version last used the
 *    deprecated property
 * 3. The message variable name can change, but not it's value. This is because
 *    these values are used since AP browser embedding was first implemented, so
 *    they must be retained in order to preserve backwards compatibility
 */

export type EmbeddingContext = {
  /**
   * URI of the WS used by the embedded application.
   * (e.g in case of browser AP, this is the WS url provided by the ws-proxy)
   */
  wsConnectionUri: string;
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
  sessionId: string;
  /**
   * Time in MS after which the user is considered idle if no interactions
   * are being made on the page
   */
  userIdleTimeout?: number;
};

export const MESSAGES = {
  /**
   * Message used to establish a handshake and setup
   * before waiting for embedding context transfer
   */
  AWAITING_EMBEDDING_CONTEXT: "KNIME_UI__AWAITING_CONNECTION_INFO",
  /**
   * Message that contains the embedding context information
   */
  EMBEDDING_CONTEXT: "KNIME_UI__CONNECTION_INFO",
  /**
   * Message used for when embedding failed
   */
  EMBEDDING_FAILED: "KNIME_UI__CONNECTION_FAIL",
  /**
   * Message to report user activity events
   */
  USER_ACTIVITY: "KNIME_UI__USER_ACTIVITY",
  /**
   * General purpose event to transfer data between host application and embedded
   * application.
   */
  GENERIC_EVENT: "KNIME_UI__GENERIC_EVENT",
} as const;

type ShowNotificationEvent = {
  kind: "showNotification";
  payload: Toast;
};

type ClearNotificationCommand = {
  kind: "clearNotification";
  payload: { id: string } | { deduplicationKey: string };
};

export type GenericEvent = ShowNotificationEvent | ClearNotificationCommand;

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
