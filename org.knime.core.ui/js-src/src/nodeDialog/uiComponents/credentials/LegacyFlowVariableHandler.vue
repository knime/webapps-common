<script setup lang="ts">
/** This component does not have a template, yes, but it needs to be a
 * subcomponent instead of a composable because it relies on injected data from
 * the parent component.
 */
import { onMounted } from "vue";
import useControllingFlowVariable from "../flowVariables/composables/useControllingFlowVariable";
import { getFlowVariableSettingsProvidedByControl } from "@/nodeDialog/composables/components/useFlowVariables";
import { injectForFlowVariables } from "@/nodeDialog/utils/inject";
import type Credentials from "./types/Credentials";

const { setControllingFlowVariable } = useControllingFlowVariable();
const { dataPaths, configPaths } = getFlowVariableSettingsProvidedByControl();
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
    const persistPath = configPaths.value[0].configPath;
    const dataPath = dataPaths.value[0];
    setControllingFlowVariable({
      path: configPaths.value[0].configPath,
      flowVariableName,
    });
    const value = (await getFlowVariableOverrideValue(
      persistPath,
      dataPath,
    )) satisfies Credentials | undefined;
    emit("flowVariableSet", value);
  }
});
</script>
