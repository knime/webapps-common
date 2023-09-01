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
