const toMapKey = ({ id, indices }: { id: string; indices?: number[] }) =>
  JSON.stringify({ id, indices: indices ?? [] });

export default () => {
  const stateProviderListeners = new Map<
    string,
    ((value: unknown) => void)[]
  >();
  /**
   * States remembered for yet to be registered listeners
   */
  const states = new Map<string, unknown>();
  const addStateProviderListener = (
    location: { id: string; indices?: number[] },
    callback: (value: any) => void,
  ) => {
    const key = toMapKey(location);
    if (stateProviderListeners.has(key)) {
      stateProviderListeners.get(key)!.push(callback);
    } else {
      stateProviderListeners.set(key, [callback]);
    }
    if (states.has(key)) {
      callback(states.get(key));
    }
  };

  const callStateProviderListener = (
    location: { id: string; indices?: number[] },
    value: unknown,
  ) => {
    const key = toMapKey(location);
    states.set(key, value);
    stateProviderListeners.get(key)?.forEach((callback) => callback(value));
  };

  return { addStateProviderListener, callStateProviderListener };
};
