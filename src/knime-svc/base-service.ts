import type {
  CreateUIExtensionService,
  UIExtensionAPILayer,
  UIExtensionEvents,
} from "./types";

const useEventHandling = (eventNamespace: string) => {
  const callbacksMap = new Map<string, UIExtensionEvents.EventCallback[]>();

  const getNamespacedEventName = (eventName: string) =>
    `${eventNamespace}__${eventName}`;

  const removeEventListener = (
    eventName: string,
    callback: UIExtensionEvents.EventCallback,
  ) => {
    const namespacedEvent = getNamespacedEventName(eventName);

    const currentListeners = callbacksMap.get(namespacedEvent) ?? [];
    callbacksMap.set(
      namespacedEvent,
      currentListeners.filter((cb) => cb !== callback),
    );
  };

  const addEventListener = (
    eventName: string,
    callback: UIExtensionEvents.EventCallback,
  ) => {
    const namespacedEvent = getNamespacedEventName(eventName);
    const currentListeners = callbacksMap.get(namespacedEvent) ?? [];
    callbacksMap.set(namespacedEvent, currentListeners.concat(callback));

    return () => removeEventListener(namespacedEvent, callback);
  };

  const dispatchEvent = <T = unknown>(event: UIExtensionEvents.Event<T>) => {
    const namespacedEvent = getNamespacedEventName(event.name);

    const callbacks = callbacksMap.get(namespacedEvent) ?? [];
    callbacks.forEach((cb) => cb(event));
  };

  return { addEventListener, removeEventListener, dispatchEvent };
};

/**
 * Service used to communicate with KNIME's internal extensions.
 * @param apiLayer
 * @returns
 */
export const useBaseService = (
  apiLayer: UIExtensionAPILayer,
): CreateUIExtensionService => {
  return <T>(config: T) => {
    const eventNamespace = window.crypto.randomUUID();
    const { addEventListener, dispatchEvent } =
      useEventHandling(eventNamespace);

    return {
      ...apiLayer,

      getConfig: () => config,

      addPushEventListener: addEventListener,
      dispatchPushEvent: dispatchEvent,
    };
  };
};
