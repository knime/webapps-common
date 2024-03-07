import { computed } from "vue";
import {
  getFlowVariablesMap,
  getFlowVariableSettingsProvidedByControl,
} from "../../../composables/components/useFlowVariables";

export default () => {
  const flowVariablesMap = getFlowVariablesMap();

  const {
    flowSettings,
    settingStateFlowVariables: {
      exposed: { get: getDirtyExposedVariable },
    },
  } = getFlowVariableSettingsProvidedByControl();
  const exposedFlowVariableName = computed(
    () => flowSettings.value?.exposedFlowVariableName ?? "",
  );

  const setExposedVariableState = (
    persistPath: string,
    nonEmptyStringOrNull: string | null,
  ) => {
    const exposedVariableState = getDirtyExposedVariable(persistPath);
    if (nonEmptyStringOrNull === null) {
      exposedVariableState?.unset();
    } else {
      exposedVariableState?.set(nonEmptyStringOrNull);
    }
  };

  const setExposedFlowVariable = ({
    path,
    flowVariableName,
  }: {
    path: string;
    flowVariableName: string;
  }) => {
    const nonEmptyStringOrNull = flowVariableName.trim()
      ? flowVariableName
      : null;
    setExposedVariableState(path, nonEmptyStringOrNull);

    const flowVarAtPath = flowVariablesMap[path] || {};
    flowVarAtPath.exposedFlowVariableName = nonEmptyStringOrNull;
    flowVariablesMap[path] = flowVarAtPath;
  };
  return { exposedFlowVariableName, setExposedFlowVariable };
};
