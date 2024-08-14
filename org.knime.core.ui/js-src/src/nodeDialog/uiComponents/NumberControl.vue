<script setup lang="ts">
import NumberControlBase from "./NumberControlBase.vue";
import { rendererProps } from "@jsonforms/vue";
defineProps(rendererProps());
</script>

<template>
  <NumberControlBase v-bind="$props" type="double" />
</template>
