import { SelectionEventPayload } from "src/services/SelectionService";

export type Foo = "";

export namespace UIExtensionPushEvents {
  export enum EventTypes {
    DataEvent = "DataEvent",
    SelectionEvent = "SelectionEvent",
  }

  type KnownPushEvents = {
    [EventTypes.SelectionEvent]: SelectionEventPayload;
    [EventTypes.DataEvent]: any;
  };

  type KnownPushEventName = keyof KnownPushEvents;

  /**
   * For autocompletion
   */
  export type Name = KnownPushEventName | Omit<string, KnownPushEventName>;

  export type PushEvent<N extends Name = any, P = any> = {
    name: N;
    payload?: N extends keyof KnownPushEvents ? KnownPushEvents[N] : P;
  };

  export type SelectionEvent = PushEvent<EventTypes.SelectionEvent>;
  export type DataEvent = PushEvent<EventTypes.DataEvent>;

  export type PushEventListenerCallback<T extends Name> = (
    payload: PushEvent<T>["payload"],
  ) => void;

  export interface AddPushEventListener {
    /**
     * This method is to be used by the client ui extension to listen
     * for events dispatched by an embedder
     * @returns a method to remove the added listener
     */
    addPushEventListener<T extends Name>(
      eventName: T,
      callback: PushEventListenerCallback<T>,
    ): () => void;
  }

  export interface DispatchPushEvent {
    /**
     * This method is to be used by the embedder of a ui extension to
     * trigger registered client event listeners.
     */
    dispatchPushEvent<T extends Name>(event: PushEvent<T>);
  }
}
