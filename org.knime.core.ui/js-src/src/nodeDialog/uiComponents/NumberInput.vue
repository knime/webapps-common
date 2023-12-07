<script setup lang="ts">
import NumberInputBase from "./NumberInputBase.vue";
import { rendererProps } from "@jsonforms/vue";
defineProps(rendererProps());
</script>

<template>
  <NumberInputBase v-bind="$props" type="double" />
</template>
