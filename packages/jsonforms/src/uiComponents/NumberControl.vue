<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import NumberControlBase from "./NumberControlBase.vue";

defineProps<VueControlPropsForLabelContent<number>>();
</script>

<template>
  <NumberControlBase v-bind="$props" type="double" />
</template>
