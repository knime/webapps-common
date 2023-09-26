import type { FlowSettings, PossibleFlowVariable } from "./types";

type GetAvailableFlowVariables = (params: {
  method: "getAvailableFlowVariables";
  options: [
    /**
     * The current stringified data
     */
    string,
    /**
     * The path to the component including "view" or "model" and the config key
     */
    string[],
  ];
}) => Promise<Record<string, PossibleFlowVariable[]>>;

export const getAvailableFlowVariables = (
  dataService: GetAvailableFlowVariables,
  persistPath: string,
  currentData: object,
) => {
  return dataService({
    method: "getAvailableFlowVariables",
    options: [JSON.stringify(currentData), persistPath.split(".")],
  });
};

type GetFlowVariableOverrideValue = (params: {
  method: "getFlowVariableOverrideValue";
  options: [
    /**
     * The stringified current data of the dialog as it is sent on apply
     */
    string,
    /**
     * The path to the component including "view" or "model".
     * This is the path under which the setting is stored in the
     * frontend data, so this does not contain the custom config keys.
     */
    string[],
  ];
}) => Promise<any>;

export const getFlowVariableOverrideValue = (
  dataService: GetFlowVariableOverrideValue,
  dataPath: string,
  currentData: object,
) => {
  return dataService({
    method: "getFlowVariableOverrideValue",
    options: [JSON.stringify(currentData), dataPath.split(".")],
  });
};

export const setControllingFlowVariable = (
  flowVariableMap: Record<string, FlowSettings>,
  { path, flowVariableName }: { path: string; flowVariableName: string },
) => {
  const flowVarAtPath = flowVariableMap[path] || {};
  flowVarAtPath.controllingFlowVariableName = flowVariableName;
  flowVarAtPath.controllingFlowVariableAvailable = true;
  flowVariableMap[path] = flowVarAtPath;
};

export const unsetControllingFlowVariable = (
  flowVariableMap: Record<string, FlowSettings>,
  { path }: { path: string },
) => {
  if (flowVariableMap[path]) {
    delete flowVariableMap[path].controllingFlowVariableFlawed;
    flowVariableMap[path].controllingFlowVariableAvailable = false;
    flowVariableMap[path].controllingFlowVariableName = null;
  }
};
