import { computed } from "vue";

import { getFlowVariableSettingsProvidedByControl } from "../../../composables/components/useFlowVariables";
import { getFlowVariablesMap } from "../../../composables/components/useProvidedFlowVariablesMap";

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
