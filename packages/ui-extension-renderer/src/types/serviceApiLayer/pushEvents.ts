import type { SelectionEventPayload } from "./selection";

export namespace UIExtensionPushEvents {
  export type KnownEventType =
    /**
     * TODO: Rename DataEvent with UIEXT-1791
     */
    | "DataEvent"
    | "SelectionEvent"
    | "ApplyDataEvent"
    | "DisplayModeEvent"
    | "DataValueViewShownEvent";

  export interface DisplayModeEventPayload {
    mode: "small" | "large";
  }

  type KnownPushEvents = {
    SelectionEvent: SelectionEventPayload;
    DisplayModeEvent: DisplayModeEventPayload;
    DataEvent: any;
    ApplyDataEvent: never;
    DataValueViewShownEvent: boolean;
  };

  /**
   * For autocompletion
   */
  export type EventType = KnownEventType | Omit<string, KnownEventType>;

  export type PushEvent<N extends EventType = any, P = any> = {
    eventType: N;
    payload?: N extends keyof KnownPushEvents ? KnownPushEvents[N] : P;
  };

  export type SelectionEvent = PushEvent<"SelectionEvent">;
  export type DataEvent = PushEvent<"DataEvent">;
  export type DisplayModeEvent = PushEvent<"DisplayModeEvent">;

  export type PushEventListenerCallback<T extends EventType> = (
    payload: PushEvent<T>["payload"],
  ) => void;

  export interface AddPushEventListener {
    /**
     * This method is to be used by the client ui extension to listen
     * for events dispatched by an embedder
     * @returns a method to remove the added listener
     */
    addPushEventListener<T extends EventType>(
      eventType: T,
      callback: PushEventListenerCallback<T>,
    ): () => void;
  }

  export interface DispatchPushEvent {
    /**
     * This method is to be used by the embedder of a ui extension to
     * trigger registered client event listeners.
     */
    dispatchPushEvent<T extends EventType>(event: PushEvent<T>): void;
  }
}
