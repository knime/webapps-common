interface Key {
  id: string;
  indexIds: string[];
}

const keySpecifier = ({ indexIds }: Key) => indexIds;

interface IndicesKey {
  id: string;
  indices: number[];
}

const indicesKeySpecifier = ({ indices }: IndicesKey) => indices;

const isInvokedBy =
  <K extends { id: string }>(getSpecifier: (key: K) => any[]) =>
  (invocationKey: K) =>
  (otherKey: K) => {
    if (invocationKey.id !== otherKey.id) {
      return false;
    }
    if (getSpecifier(invocationKey).length > getSpecifier(otherKey).length) {
      return false;
    }
    return getSpecifier(invocationKey).every(
      (value, index) => getSpecifier(otherKey)[index] === value,
    );
  };

const invokes =
  <K extends { id: string }>(getSpecifier: (key: K) => any[]) =>
  (otherKey: K) =>
  (invocationKey: K) =>
    isInvokedBy(getSpecifier)(invocationKey)(otherKey);

const getValuesFromPredicate =
  <K, T>(map: Map<K, T>) =>
  (predicate: (key: K) => boolean) =>
    Array.from(map.entries())
      .filter(([key]) => predicate(key))
      .map(([, value]) => value);

const toMapKey = ({ id, indexIds }: { id: string; indexIds?: string[] }) => ({
  id,
  indexIds: indexIds ?? [],
});

const toByIndicesKey = ({
  id,
  indices,
}: {
  id: string;
  indices?: number[];
}) => ({
  id,
  indices: indices ?? [],
});

export default () => {
  const stateProviderListeners = new Map<Key, ((value: unknown) => void)[]>();

  const stateProviderListenersByIndices = new Map<
    IndicesKey,
    ((value: unknown) => void)[]
  >();

  /**
   * States remembered for yet to be registered listeners
   */
  const states = new Map<Key, unknown>();

  const statesByIndices = new Map<IndicesKey, unknown>();

  const getListenersInvokedBy = (key: Key) =>
    getValuesFromPredicate(stateProviderListeners)(
      isInvokedBy(keySpecifier)(key),
    );

  const getListenersByIndicesInvokedBy = (key: IndicesKey) =>
    getValuesFromPredicate(stateProviderListenersByIndices)(
      isInvokedBy(indicesKeySpecifier)(key),
    );

  const getStatesInvoking = (key: Key) =>
    getValuesFromPredicate(states)(invokes(keySpecifier)(key));

  const getStatesByIndicesInvoking = (key: IndicesKey) =>
    getValuesFromPredicate(statesByIndices)(invokes(indicesKeySpecifier)(key));

  const addStateProviderListener = (
    location: { id: string; indexIds?: string[]; indices?: number[] },
    callback: (value: any) => void,
  ) => {
    const key = toMapKey(location);
    if (stateProviderListeners.has(key)) {
      stateProviderListeners.get(key)!.push(callback);
    } else {
      stateProviderListeners.set(key, [callback]);
    }
    getStatesInvoking(key).forEach(callback);

    const byIndicesKey = toByIndicesKey(location);
    if (stateProviderListenersByIndices.has(byIndicesKey)) {
      stateProviderListenersByIndices.get(byIndicesKey)!.push(callback);
    } else {
      stateProviderListenersByIndices.set(byIndicesKey, [callback]);
    }
    getStatesByIndicesInvoking(byIndicesKey).forEach(callback);
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

  const callStateProviderListenerByIndices = (
    location: { id: string; indices: number[] },
    value: unknown,
  ) => {
    statesByIndices.set(location, value);
    getListenersByIndicesInvokedBy(location)
      .flatMap((callbacks) => callbacks)
      .forEach((callback) => callback(value));
  };

  return {
    addStateProviderListener,
    callStateProviderListener,
    callStateProviderListenerByIndices,
  };
};
