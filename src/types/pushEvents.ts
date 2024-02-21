import { SelectionEventPayload } from "src/services/SelectionService";

export type Foo = "";

export namespace UIExtensionPushEvents {
  export enum EventTypes {
    DataEvent = "DataEvent",
    SelectionEvent = "SelectionEvent",
    ApplyDataEvent = "ApplyDataEvent",
  }

  type KnownPushEvents = {
    [EventTypes.SelectionEvent]: SelectionEventPayload;
    [EventTypes.DataEvent]: any;
    [EventTypes.ApplyDataEvent]: never;
  };

  type KnownPushEventType = keyof KnownPushEvents;

  /**
   * For autocompletion
   */
  export type EventType = KnownPushEventType | Omit<string, KnownPushEventType>;

  export type PushEvent<N extends EventType = any, P = any> = {
    eventType: N;
    payload?: N extends keyof KnownPushEvents ? KnownPushEvents[N] : P;
  };

  export type SelectionEvent = PushEvent<EventTypes.SelectionEvent>;
  export type DataEvent = PushEvent<EventTypes.DataEvent>;

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
    dispatchPushEvent<T extends EventType>(event: PushEvent<T>);
  }
}
