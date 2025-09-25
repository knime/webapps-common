<script setup lang="ts">
import { computed } from "vue";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";

import MultimodeTwinlistControl, {
  type TwinlistData,
} from "./MultimodeTwinlistControl.vue";

const props = defineProps<VueControlPropsForLabelContent<TwinlistData>>();
const options = computed(() => props.control.uischema.options!);
</script>

<template>
  <MultimodeTwinlistControl
    v-bind="{ ...$props, ...$attrs }"
    show-unknown-values
    :unknown-values-text="options.unknownValuesText"
    :empty-state-label="options.emptyStateLabel"
    :twinlist-size="props.control.uischema.options?.twinlistSize"
    :show-type-filter="!Boolean(options?.hideTypeFilter)"
  />
</template>
