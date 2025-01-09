<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";

import NumberControlBase from "./NumberControlBase.vue";

defineProps<VueControlPropsForLabelContent<number>>();
</script>

<template>
  <NumberControlBase v-bind="$props" type="double" />
</template>
