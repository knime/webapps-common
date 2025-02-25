<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { Checkboxes } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";
import type { IdAndText } from "../types/ChoicesUiSchema";
import { optionsMapper } from "../utils";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const alignment = computed(
  () => props.control.uischema.options?.checkboxLayout,
);

const options = ref(null as null | IdAndText[]);
onMounted(() => {
  options.value = props.control.schema.anyOf
    ? props.control.schema.anyOf.map(optionsMapper)
    : null;
});
</script>

<template>
  <Checkboxes
    v-if="options"
    :id="labelForId"
    class="checkboxes"
    :possible-values="options"
    :alignment="alignment"
    :disabled="disabled"
    :model-value="control.data"
    :is-valid
    @update:model-value="changeValue"
  />
</template>

<style lang="postcss" scoped>
.checkboxes {
  margin-bottom: -10px;
}
</style>
