<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/addLabel";
import type { Control } from "../../types/Control";
import { optionsMapper } from "../../utils";

import SimpleTwinlistControl from "./SimpleTwinlistControl.vue";

defineProps<VueControlPropsForLabelContent<string[]>>();
const optionsGenerator = (control: Control) => {
  return control!.schema!.anyOf!.map(optionsMapper);
};
</script>

<template>
  <SimpleTwinlistControl
    v-bind="$props"
    :options-generator="optionsGenerator"
  />
</template>
