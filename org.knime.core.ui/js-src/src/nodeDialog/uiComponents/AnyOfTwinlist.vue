<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";
import Control from "../types/Control";
import { optionsMapper } from "../utils";
import SimpleTwinlistInput from "./SimpleTwinlistInput.vue";

defineProps(rendererProps());
const optionsGenerator = (control: Control) => {
  return control?.schema?.anyOf?.map(optionsMapper);
};
</script>

<template>
  <SimpleTwinlistInput v-bind="$props" :options-generator="optionsGenerator" />
</template>
