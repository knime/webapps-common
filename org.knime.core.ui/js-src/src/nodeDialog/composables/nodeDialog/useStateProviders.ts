interface Key {
  id: string;
  indexIds: string[];
}

const isInvokedBy = (invocationKey: Key) => (otherKey: Key) => {
  if (invocationKey.id !== otherKey.id) {
    return false;
  }
  if (invocationKey.indexIds.length > otherKey.indexIds.length) {
    return false;
  }
  return invocationKey.indexIds.every(
    (value, index) => otherKey.indexIds[index] === value,
  );
};

const invokes = (otherKey: Key) => (invocationKey: Key) =>
  isInvokedBy(invocationKey)(otherKey);

const getValuesFromPredicate =
  <T>(map: Map<Key, T>) =>
  (predicate: (key: Key) => boolean) =>
    Array.from(map.entries())
      .filter(([key]) => predicate(key))
      .map(([, value]) => value);

const toMapKey = ({ id, indexIds }: { id: string; indexIds?: string[] }) => ({
  id,
  indexIds: indexIds ?? [],
});

export default () => {
  const stateProviderListeners = new Map<Key, ((value: unknown) => void)[]>();

  /**
   * States remembered for yet to be registered listeners
   */
  const states = new Map<Key, unknown>();

  const getListenersInvokedBy = (key: Key) =>
    getValuesFromPredicate(stateProviderListeners)(isInvokedBy(key));

  const getStatesInvoking = (key: Key) =>
    getValuesFromPredicate(states)(invokes(key));

  const addStateProviderListener = (
    location: { id: string; indexIds?: string[] },
    callback: (value: any) => void,
  ) => {
    const key = toMapKey(location);
    if (stateProviderListeners.has(key)) {
      stateProviderListeners.get(key)!.push(callback);
    } else {
      stateProviderListeners.set(key, [callback]);
    }
    getStatesInvoking(key).forEach(callback);
  };

  const callStateProviderListener = (
    location: { id: string; indexIds?: string[] },
    value: unknown,
  ) => {
    const key = toMapKey(location);
    states.set(key, value);
    getListenersInvokedBy(key)
      .flatMap((callbacks) => callbacks)
      .forEach((callback) => callback(value));
  };

  return { addStateProviderListener, callStateProviderListener };
};
