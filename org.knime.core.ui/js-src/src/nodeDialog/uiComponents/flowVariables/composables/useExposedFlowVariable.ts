import { computed } from "vue";
import {
  getFlowVariablesMap,
  getFlowVariableSettingsProvidedByControl,
} from "../../../composables/useFlowVariables";

export default () => {
  const flowVariablesMap = getFlowVariablesMap();

  const { flowSettings } = getFlowVariableSettingsProvidedByControl();
  const exposedFlowVariableName = computed(
    () => flowSettings.value?.exposedFlowVariableName ?? "",
  );

  const setExposedFlowVariable = ({
    path,
    flowVariableName,
  }: {
    path: string;
    flowVariableName: string;
  }) => {
    const flowVarAtPath = flowVariablesMap[path] || {};
    flowVarAtPath.exposedFlowVariableName = flowVariableName.trim()
      ? flowVariableName
      : null;
    flowVariablesMap[path] = flowVarAtPath;
  };
  return { exposedFlowVariableName, setExposedFlowVariable };
};
