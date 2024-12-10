<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";

import RadioControlBase from "./RadioControlBase.vue";

defineProps(rendererProps());
</script>

<template>
  <RadioControlBase v-bind="$props" type="radio" />
</template>
