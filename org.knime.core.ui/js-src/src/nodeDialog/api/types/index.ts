export type PossibleFlowVariable = {
  name: string;
  value: string;
  abbreviated: boolean;
};

export type FlowSettings = {
  controllingFlowVariableName: string | null;
  exposedFlowVariableName: string | null;
  controllingFlowVariableAvailable: boolean;
};

export type ProvidedFlowVariablesApi = {
  getAvailableFlowVariables: (
    persistPath: string,
  ) => Promise<Record<string, PossibleFlowVariable[]>>;
  getFlowVariableOverrideValue: (dataPath: string) => Promise<any>;
};
