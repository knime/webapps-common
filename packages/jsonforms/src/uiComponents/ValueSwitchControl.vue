<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import RadioControlBase from "./RadioControlBase.vue";

defineProps<VueControlPropsForLabelContent<string>>();
</script>

<template>
  <RadioControlBase v-bind="$props" type="valueSwitch" />
</template>
