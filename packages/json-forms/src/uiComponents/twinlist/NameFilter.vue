<script setup lang="ts">
import TwinlistControl from "./TwinlistControl.vue";
import { rendererProps } from "@jsonforms/vue";

defineProps(rendererProps());
</script>

<template>
  <TwinlistControl
    v-bind="{ ...$props, ...$attrs }"
    unknown-values-text="Any unknown value"
    show-unknown-values
    empty-state-label="No values in this list"
  />
</template>
