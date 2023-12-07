<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";
import NumberInputBase from "./NumberInputBase.vue";
defineProps(rendererProps());
</script>

<template>
  <NumberInputBase v-bind="$props" type="integer" />
</template>
