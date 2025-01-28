<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";

import TwinlistControl, { type TwinlistData } from "./TwinlistControl.vue";

defineProps<VueControlPropsForLabelContent<TwinlistData>>();
</script>

<template>
  <TwinlistControl
    v-bind="{ ...$props, ...$attrs }"
    unknown-values-text="Any unknown value"
    show-unknown-values
    empty-state-label="No values in this list"
  />
</template>
