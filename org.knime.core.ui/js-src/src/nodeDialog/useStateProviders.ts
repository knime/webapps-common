export default () => {
  const stateProviderListeners = new Map<string, (value: unknown) => void>();
  const pendingStates = new Map<string, unknown>();
  const addStateProviderListener = (
    id: string,
    callback: (value: any) => void,
  ) => {
    stateProviderListeners.set(id, callback);
    if (pendingStates.has(id)) {
      callback(pendingStates.get(id));
      pendingStates.delete(id);
    }
  };

  const callStateProviderListener = (id: string, value: unknown) => {
    const listener = stateProviderListeners.get(id);
    if (listener) {
      listener(value);
    } else {
      pendingStates.set(id, value);
    }
  };

  return { addStateProviderListener, callStateProviderListener };
};
