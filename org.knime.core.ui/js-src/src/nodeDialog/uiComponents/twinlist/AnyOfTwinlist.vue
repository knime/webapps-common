<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";

import type { Control } from "@/nodeDialog/types/Control";
import { optionsMapper } from "@/nodeDialog/utils";

import SimpleTwinlistControl from "./SimpleTwinlistControl.vue";

defineProps(rendererProps());
const optionsGenerator = (control: Control) => {
  return control?.schema?.anyOf?.map(optionsMapper);
};
</script>

<template>
  <SimpleTwinlistControl
    v-bind="$props"
    :options-generator="optionsGenerator"
  />
</template>
