import { getFlowVariableSettingsProvidedByControl } from "@/nodeDialog/composables/components/useFlowVariables";
import { getFlowVariablesMap } from "@/nodeDialog/composables/components/useProvidedFlowVariablesMap";
import { computed } from "vue";

export default () => {
  const { configPaths } = getFlowVariableSettingsProvidedByControl();

  const flowVariablesMap = getFlowVariablesMap();

  const deprecatedConfigPaths = computed(() => {
    return configPaths.value.flatMap(
      ({ deprecatedConfigPaths }) => deprecatedConfigPaths,
    );
  });

  const deprecatedSetConfigPaths = computed(() =>
    deprecatedConfigPaths.value.filter((key) => Boolean(flowVariablesMap[key])),
  );

  return { deprecatedSetConfigPaths };
};
