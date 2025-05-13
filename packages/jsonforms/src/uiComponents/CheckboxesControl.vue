<script setup lang="ts">
import { type Ref, computed, onMounted, ref, toRef } from "vue";

import { Checkboxes } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";
import type { IdAndText } from "../types/ChoicesUiSchema";
import { optionsMapper } from "../utils";

import { usePossibleValues } from "./composables/usePossibleValues";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const alignment = computed(
  () => props.control.uischema.options?.checkboxLayout,
);

const staticOptions: Ref<IdAndText[] | null> = ref(null);

const { possibleValues } = usePossibleValues(toRef(props, "control"));

const options = computed(() => staticOptions.value ?? possibleValues.value);

onMounted(() => {
  staticOptions.value = props.control.schema.anyOf
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
