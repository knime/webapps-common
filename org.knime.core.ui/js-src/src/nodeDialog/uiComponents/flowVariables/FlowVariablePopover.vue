<script setup lang="ts">
import Label from "webapps-common/ui/components/forms/Label.vue";
import FlowVariableSelector from "./FlowVariableSelector.vue";
import type FlowVariableSelectorProps from "./types/FlowVariableSelectorProps";

defineProps<FlowVariableSelectorProps>();

const emit = defineEmits(["controllingFlowVariableSet"]);
</script>

<template>
  <Label text="Select variable" class="label" />
  <FlowVariableSelector
    :path="path"
    :config-keys="configKeys"
    :flow-settings="flowSettings"
    :flow-variables-map="flowVariablesMap"
    @controlling-flow-variable-set="emit('controllingFlowVariableSet', $event)"
  />
</template>
>
