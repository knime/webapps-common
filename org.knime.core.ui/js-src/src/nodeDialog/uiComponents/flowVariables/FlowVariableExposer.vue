<script setup lang="ts">
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { computed } from "vue";
import { setExposedFlowVariable } from "@/nodeDialog/api/flowVariables";
import type FlowVariableExposerProps from "./types/FlowVariableExposerProps";

const props = defineProps<FlowVariableExposerProps>();

const exposedVariableName = computed(
  () => props.flowSettings?.exposedFlowVariableName ?? "",
);

const onUpdate = (value: string) => {
  setExposedFlowVariable(props.flowVariablesMap, {
    path: props.persistPath,
    flowVariableName: value,
  });
};

const ariaLabel = computed(
  () => `outputted-flow-variable-${props.persistPath}`,
);
</script>

<!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
<template>
  <InputField
    :ariaLabel="ariaLabel"
    :model-value="exposedVariableName"
    placeholder="No flow variable set"
    @update:model-value="onUpdate"
  />
</template>
