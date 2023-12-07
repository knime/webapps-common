<script setup lang="ts">
import TwinlistInput from "./TwinlistInput.vue";
import { rendererProps } from "@jsonforms/vue";

defineProps(rendererProps());
</script>

<template>
  <TwinlistInput
    v-bind="{ ...$props, ...$attrs }"
    unknown-values-text="Any unknown columns"
    show-unknown-values
    empty-state-label="No columns in this list"
  />
</template>
