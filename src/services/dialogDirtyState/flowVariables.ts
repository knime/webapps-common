const createControllingFlowVariable =
  (onChange: () => void) => (flowVarName: string | null) => {
    let clean = flowVarName;
    let current = flowVarName;
    let isFlawed = false;
    let isModified = false;

    const updateState = () => {
      isModified = current !== clean;
    };

    const set = (
      flowVar: string,
      options: { isFlawed: boolean } = { isFlawed: false },
    ) => {
      current = flowVar;
      isFlawed = options.isFlawed;
      updateState();
      onChange();
    };

    const unset = () => {
      current = null;
      isFlawed = false;
      updateState();
      onChange();
    };

    const onApply = () => {
      clean = current;
      updateState();
    };

    return {
      public: {
        set,
        unset,
      },
      internals: {
        onApply,
        isFlawed: () => isFlawed,
        isModified: () => isModified,
      },
    };
  };

const createExposedFlowVariable =
  (onChange: () => void) => (flowVarName: string | null) => {
    let clean = flowVarName;
    let current = flowVarName;
    let isModified = false;
    let isSet = flowVarName !== null;

    const updateState = () => {
      isModified = current !== clean;
      isSet = current !== null;
    };

    const set = (flowVar: string) => {
      current = flowVar;
      updateState();
      onChange();
    };

    const unset = () => {
      current = null;
      updateState();
      onChange();
    };

    const onApply = () => {
      clean = current;
      updateState();
    };

    return {
      public: {
        set,
        unset,
      },
      internals: {
        onApply,
        isSet: () => isSet,
        isModified: () => isModified,
      },
    };
  };

/**
 * Combining multiple controlling flow variables
 */
export const useControllingFlowVariables = (onChange: () => void) => {
  const controllingFlowVariableStateHolders: {
    onApply(): void;
    isFlawed: () => boolean;
    isModified: () => boolean;
  }[] = [];
  const isFlawed = () =>
    controllingFlowVariableStateHolders.filter(({ isFlawed }) => isFlawed())
      .length > 0;

  const isModified = () =>
    controllingFlowVariableStateHolders.filter(({ isModified }) => isModified())
      .length > 0;
  const createControlling = createControllingFlowVariable(onChange);

  const addControlling = (flowVarName: string | null) => {
    const controlling = createControlling(flowVarName);
    controllingFlowVariableStateHolders.push(controlling.internals);
    onChange();
    return controlling.public;
  };

  const onApply = () => {
    controllingFlowVariableStateHolders.forEach(({ onApply }) => onApply());
  };

  return {
    add: addControlling,
    isFlawed,
    isModified,
    onApply,
  };
};

/**
 * Combining multiple exposed flow variables
 */
export const useExposedFlowVariables = (onChange: () => void) => {
  const exposedFlowVariableStateHolders: {
    onApply(): void;
    isSet: () => boolean;
    isModified: () => boolean;
  }[] = [];
  const isSet = () =>
    exposedFlowVariableStateHolders.filter(({ isSet }) => isSet()).length > 0;

  const isModified = () =>
    exposedFlowVariableStateHolders.filter(({ isModified }) => isModified())
      .length > 0;

  const createExposed = createExposedFlowVariable(onChange);

  const addExposed = (flowVarName: string | null) => {
    const exposed = createExposed(flowVarName);
    exposedFlowVariableStateHolders.push(exposed.internals);
    onChange();
    return exposed.public;
  };
  const onApply = () => {
    exposedFlowVariableStateHolders.forEach(({ onApply }) => onApply());
  };

  return {
    isSet,
    isModified,
    add: addExposed,
    onApply,
  };
};
