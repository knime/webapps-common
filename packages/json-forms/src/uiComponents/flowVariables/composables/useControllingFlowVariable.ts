import { computed } from "vue";

import { getFlowVariableSettingsProvidedByControl } from "../../../composables/components/useFlowVariables";
import { getFlowVariablesMap } from "../../../composables/components/useProvidedFlowVariablesMap";

export default (persistPath: string) => {
  const flowVariablesMap = getFlowVariablesMap();

  const {
    settingStateFlowVariables: {
      controlling: { get: getDirtyControllingFlowVariable },
    },
  } = getFlowVariableSettingsProvidedByControl();
  const flowSettings = computed(() => flowVariablesMap[persistPath]);
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
    getDirtyControllingFlowVariable(path)?.set(flowVariableName);
  };

  const unsetControllingFlowVariable = ({ path }: { path: string }) => {
    if (flowVariablesMap[path]) {
      delete flowVariablesMap[path].controllingFlowVariableFlawed;
      flowVariablesMap[path].controllingFlowVariableAvailable = false;
      flowVariablesMap[path].controllingFlowVariableName = null;
    }

    getDirtyControllingFlowVariable(path)?.unset();
  };

  const invalidateSetFlowVariable = ({
    path,
    flowVariableName,
  }: {
    path: string;
    flowVariableName: string;
  }) => {
    getDirtyControllingFlowVariable(path)?.set(flowVariableName, {
      isFlawed: true,
    });
  };

  return {
    controllingFlowVariableName,
    setControllingFlowVariable,
    unsetControllingFlowVariable,
    invalidateSetFlowVariable,
  };
};
