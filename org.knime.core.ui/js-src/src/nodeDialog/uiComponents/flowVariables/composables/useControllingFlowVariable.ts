import { computed } from "vue";
import {
  getFlowVariablesMap,
  getFlowVariableSettingsProvidedByControl,
} from "../../../composables/useFlowVariables";

export default () => {
  const flowVariablesMap = getFlowVariablesMap();

  const { flowSettings } = getFlowVariableSettingsProvidedByControl();
  const controllingFlowVariableName = computed(
    () => flowSettings.value?.controllingFlowVariableName ?? "",
  );

  const setControllingFlowVariable = ({
    path,
    flowVariableName,
  }: {
    path: string;
    flowVariableName: string;
  }) => {
    const flowVarAtPath = flowVariablesMap[path] || {};
    flowVarAtPath.controllingFlowVariableName = flowVariableName;
    flowVarAtPath.controllingFlowVariableAvailable = true;
    flowVariablesMap[path] = flowVarAtPath;
  };

  const unsetControllingFlowVariable = ({ path }: { path: string }) => {
    if (flowVariablesMap[path]) {
      delete flowVariablesMap[path].controllingFlowVariableFlawed;
      flowVariablesMap[path].controllingFlowVariableAvailable = false;
      flowVariablesMap[path].controllingFlowVariableName = null;
    }
  };
  return {
    controllingFlowVariableName,
    setControllingFlowVariable,
    unsetControllingFlowVariable,
  };
};
