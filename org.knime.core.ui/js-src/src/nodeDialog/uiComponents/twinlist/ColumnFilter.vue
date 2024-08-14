<script setup lang="ts">
import TwinlistControl from "./TwinlistControl.vue";
import { rendererProps } from "@jsonforms/vue";

defineProps(rendererProps());
</script>

<template>
  <TwinlistControl
    v-bind="{ ...$props, ...$attrs }"
    unknown-values-text="Any unknown column"
    show-unknown-values
    empty-state-label="No columns in this list"
  />
</template>
