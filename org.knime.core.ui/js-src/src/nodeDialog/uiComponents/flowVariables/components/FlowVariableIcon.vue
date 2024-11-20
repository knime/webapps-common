<script setup lang="ts">
import { computed, watch } from "vue";

import BothFlowVariables from "@knime/styles/img/icons/both-flow-variables.svg";
import ExposeFlowVariable from "@knime/styles/img/icons/expose-flow-variables.svg";
import OnlyFlowVariable from "@knime/styles/img/icons/only-flow-variables.svg";

import { getFlowVariableSettingsProvidedByControl } from "../../../composables/components/useFlowVariables";
import type { FlowVariableIconProps } from "../types/FlowVariableIconProps";

const { flowSettings } = getFlowVariableSettingsProvidedByControl();

defineProps<FlowVariableIconProps>();
const emit = defineEmits(["tooltip"]);
const isControlled = computed(() =>
  Boolean(flowSettings.value?.controllingFlowVariableName),
);
const isExposed = computed(() =>
  Boolean(flowSettings.value?.exposedFlowVariableName),
);

const emitTooltip = (tooltip: string) => {
  emit("tooltip", tooltip);
};

watch(
  () => [isExposed.value, isControlled.value],
  ([exposed, controlled]) => {
    if (exposed && controlled) {
      emitTooltip("Config is overwritten by and output as a flow variable.");
    } else if (exposed) {
      emitTooltip("Config is output as a flow variable.");
    } else if (controlled) {
      emitTooltip("Config is overwritten by a flow variable.");
    } else {
      emitTooltip("");
    }
  },
  { immediate: true },
);
</script>

<template>
  <BothFlowVariables v-if="isControlled && isExposed" />
  <OnlyFlowVariable v-else-if="isControlled" />
  <ExposeFlowVariable v-else-if="isExposed" />
  <BothFlowVariables v-else-if="show" />
</template>
