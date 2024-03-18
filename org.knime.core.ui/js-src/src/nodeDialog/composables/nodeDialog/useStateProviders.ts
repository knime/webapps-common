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
    id: string,
    callback: (value: any) => void,
  ) => {
    if (stateProviderListeners.has(id)) {
      stateProviderListeners.get(id)!.push(callback);
    } else {
      stateProviderListeners.set(id, [callback]);
    }
    if (states.has(id)) {
      callback(states.get(id));
    }
  };

  const callStateProviderListener = (id: string, value: unknown) => {
    states.set(id, value);
    stateProviderListeners.get(id)?.forEach((callback) => callback(value));
  };

  return { addStateProviderListener, callStateProviderListener };
};
