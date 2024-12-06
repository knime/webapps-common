import type { UIExtensionPushEvents as Events } from "../api";

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
  implements Events.AddPushEventListener, Events.DispatchPushEvent
{
  private readonly callbacksMap = new MapOfArrays<
    Events.EventType,
    Events.PushEventListenerCallback<any>
  >();

  addPushEventListener<T extends Events.EventType>(
    eventType: Events.EventType,
    callback: Events.PushEventListenerCallback<T>,
  ): () => void {
    this.callbacksMap.add(eventType, callback);
    return () => this.callbacksMap.removeFrom(eventType, callback);
  }

  dispatchPushEvent<T extends Events.EventType>(event: Events.PushEvent<T>) {
    this.callbacksMap
      .get(event.eventType)
      .forEach((callback) => callback(event.payload));
  }
}
