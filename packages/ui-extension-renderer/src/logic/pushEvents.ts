import type {
  AddPushEventListener,
  DispatchPushEvent,
  EventType,
  PushEvent,
  PushEventListenerCallback,
} from "../api";

class MapOfArrays<K, V> {
  private readonly map = new Map<K, V[]>();

  add(key: K, value: V) {
    const currentValues = this.get(key);
    this.map.set(key, currentValues.concat(value));
  }

  removeFrom(key: K, value: V) {
    const currentValues = this.get(key);
    this.map.set(
      key,
      currentValues.filter((val) => val !== value),
    );
  }

  get(key: K) {
    return this.map.get(key) ?? [];
  }
}

/**
 * This handler is used for non-iframe push event communication.
 * The embedder dispatches events triggering listeners registered by the client.
 */
export class DefaultEventHandler
  implements AddPushEventListener, DispatchPushEvent
{
  private readonly callbacksMap = new MapOfArrays<
    EventType,
    PushEventListenerCallback<EventType>
  >();

  addPushEventListener<T extends EventType>(
    eventType: EventType,
    callback: PushEventListenerCallback<T>,
  ): () => void {
    this.callbacksMap.add(
      eventType,
      callback as PushEventListenerCallback<EventType>,
    );
    return () =>
      this.callbacksMap.removeFrom(
        eventType,
        callback as PushEventListenerCallback<EventType>,
      );
  }

  dispatchPushEvent<T extends EventType>(event: PushEvent<T>) {
    this.callbacksMap
      .get(event.eventType)
      .forEach((callback) => callback(event.payload));
  }
}
