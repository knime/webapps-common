<script setup lang="ts">
import FlowVariableIcon from "./FlowVariableIcon.vue";
import FlowVariablePopover from "./FlowVariablePopover.vue";

import DialogPopover from "@/nodeDialog/popover/DialogPopover.vue";

import type FlowVariableButtonProps from "../types/FlowVariableButtonProps";

import { computed, ref, type Ref } from "vue";

defineProps<FlowVariableButtonProps>();
const emit = defineEmits(["controllingFlowVariableSet"]);

const tooltipPrefix: Ref<string | null> = ref(null);
const setTooltipPrefix = (prefix: string) => {
  tooltipPrefix.value = prefix;
};
const buttonTooltip = "Click to overwrite with or output as flow variable.";
const tooltip = computed(() => {
  if (tooltipPrefix.value === null) {
    return buttonTooltip;
  }
  return `${tooltipPrefix.value} ${buttonTooltip}`;
});
</script>

<template>
  <DialogPopover :tooltip="tooltip">
    <template #icon="{ expanded, focused }">
      <FlowVariableIcon
        :show="hover || expanded || focused"
        @tooltip="setTooltipPrefix"
      />
    </template>
    <template #popover>
      <FlowVariablePopover
        @controlling-flow-variable-set="
          emit('controllingFlowVariableSet', $event)
        "
      />
    </template>
  </DialogPopover>
</template>
@/nodeDialog/uiComponents/flowVariables/useFlowVariables
