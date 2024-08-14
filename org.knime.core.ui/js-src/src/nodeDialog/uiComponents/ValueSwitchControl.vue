<script setup lang="ts">
import RadioControlBase from "./RadioControlBase.vue";
import { rendererProps } from "@jsonforms/vue";

defineProps(rendererProps());
</script>

<template>
  <RadioControlBase v-bind="$props" type="valueSwitch" />
</template>
