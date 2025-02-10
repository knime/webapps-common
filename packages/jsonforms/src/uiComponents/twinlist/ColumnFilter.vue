<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";

import TwinlistControl, {
  type TwinlistData,
} from "./MultimodeTwinlistControl.vue";

defineProps<VueControlPropsForLabelContent<TwinlistData>>();
</script>

<template>
  <TwinlistControl
    v-bind="{ ...$props, ...$attrs }"
    unknown-values-text="Any unknown column"
    show-unknown-values
    empty-state-label="No columns in this list"
  />
</template>
