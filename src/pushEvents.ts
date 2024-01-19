import type { UIExtensionPushEvents as Events } from "./types";

class MapOfArrays<K, V> {
  private map = new Map<K, V[]>();

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
  private callbacksMap = new MapOfArrays<
    Events.Name,
    Events.PushEventListenerCallback<any>
  >();

  addPushEventListener<T extends Events.Name>(
    eventName: Events.Name,
    callback: Events.PushEventListenerCallback<T>,
  ): () => void {
    this.callbacksMap.add(eventName, callback);
    return () => this.callbacksMap.removeFrom(eventName, callback);
  }

  dispatchPushEvent<T extends Events.Name>(event: Events.PushEvent<T>) {
    this.callbacksMap
      .get(event.name)
      .forEach((callback) => callback(event.payload));
  }
}
