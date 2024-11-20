<script setup lang="ts">
/** This component does not have a template, yes, but it needs to be a
 * subcomponent instead of a composable because it relies on injected data from
 * the parent component.
 */
import { onMounted } from "vue";

import { getFlowVariableSettingsProvidedByControl } from "@/nodeDialog/composables/components/useFlowVariables";
import { injectForFlowVariables } from "@/nodeDialog/utils/inject";
import useControllingFlowVariable from "../flowVariables/composables/useControllingFlowVariable";

import type { Credentials } from "./types/Credentials";

const { configPaths } = getFlowVariableSettingsProvidedByControl();
const { setControllingFlowVariable, invalidateSetFlowVariable } =
  useControllingFlowVariable(configPaths.value[0].configPath);
const { getFlowVariableOverrideValue } =
  injectForFlowVariables("flowVariablesApi");

const props = defineProps<{
  flowVariableName: string | null | undefined;
}>();
const emit = defineEmits<{
  flowVariableSet: [Credentials?];
}>();

onMounted(async () => {
  const flowVariableName = props.flowVariableName;
  if (flowVariableName) {
    const { configPath: persistPath, dataPath } = configPaths.value[0];
    const setControllingVariableProps = {
      path: configPaths.value[0].configPath,
      flowVariableName,
    };
    setControllingFlowVariable(setControllingVariableProps);
    const value = (await getFlowVariableOverrideValue(
      persistPath,
      dataPath,
    )) satisfies Credentials | undefined;
    if (typeof value === "undefined") {
      invalidateSetFlowVariable(setControllingVariableProps);
    }
    emit("flowVariableSet", value);
  }
});
</script>
