<script setup lang="ts">
import Part from "./Part.vue";
import { ControlElement } from "@jsonforms/core";
import { rendererProps } from "@jsonforms/vue";

const props = defineProps(rendererProps<ControlElement>());
</script>

<template>
  <Part
    v-bind="props"
    shape="circle"
    cx="65.5938"
    cy="30.5"
    r="28"
    stroke="black"
  />
</template>
