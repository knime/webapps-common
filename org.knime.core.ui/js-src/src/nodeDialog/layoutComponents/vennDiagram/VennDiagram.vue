<script setup lang="ts">
import Left from "./Left.vue";
import Right from "./Right.vue";
import Inner from "./Inner.vue";
import type { ControlElement } from "@jsonforms/core";
import { rendererProps } from "@jsonforms/vue";

const props = defineProps(
  rendererProps<{
    elements: [
      left: ControlElement,
      middle: ControlElement,
      right: ControlElement,
    ];
  }>(),
);
const [middle, left, right] = props.uischema.elements;
</script>

<template>
  <svg
    width="95"
    height="60"
    viewBox="0 0 95 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Left v-bind="{ ...props, uischema: left }" />
    <Right v-bind="{ ...props, uischema: right }" />
    <Inner v-bind="{ ...props, uischema: middle }" />
  </svg>
</template>
