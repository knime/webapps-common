<script setup lang="ts">
import RadioInputBase from "./RadioInputBase.vue";
import { rendererProps } from "@jsonforms/vue";

defineProps(rendererProps());
</script>

<template>
  <RadioInputBase v-bind="$props" type="radio" />
</template>
