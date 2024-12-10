<script setup lang="ts">
import type { ControlElement } from "@jsonforms/core";
import { rendererProps } from "@jsonforms/vue";

import Part from "./Part.vue";

const props = defineProps(rendererProps<ControlElement>());
</script>

<template>
  <Part
    v-bind="props"
    shape="circle"
    cx="29.5"
    cy="30.5"
    r="28"
    stroke="black"
  />
</template>
