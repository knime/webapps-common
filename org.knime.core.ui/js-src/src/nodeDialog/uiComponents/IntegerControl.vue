<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";
import NumberControlBase from "./NumberControlBase.vue";
defineProps(rendererProps());
</script>

<template>
  <NumberControlBase v-bind="$props" type="integer" />
</template>
