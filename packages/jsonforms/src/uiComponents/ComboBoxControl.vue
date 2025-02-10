<script setup lang="ts">
import { computed, onMounted, ref, toRef } from "vue";

import { ComboBox } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import { usePossibleValues } from "./composables/usePossibleValues";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const selectedIds = ref([] as string[]);
const loaded = ref(false);

const { possibleValues } = usePossibleValues(toRef(props, "control"));

onMounted(() => {
  selectedIds.value = props.control.data;
  loaded.value = true;
});

const noPossibleValuesPresent = computed(
  () => possibleValues.value === null || possibleValues.value.length === 0,
);
const isDisabled = computed(
  () => props.disabled || noPossibleValuesPresent.value,
);
</script>

<template>
  <!--
        TODO Enable unsing :allow-new-values="noPossibleValuesPresent"
        (see https://github.com/vuejs/vue/issues/2169)
      -->
  <ComboBox
    v-if="loaded"
    :id="labelForId"
    :allow-new-values="noPossibleValuesPresent ? ('' as any) : false"
    :aria-label="control.label"
    :disabled="isDisabled"
    :possible-values="possibleValues ?? []"
    :model-value="selectedIds"
    :is-valid
    compact
    @update:model-value="(newValue: any[]) => changeValue(newValue)"
  />
</template>

<style scoped>
:deep(.multiselect) {
  background-color: var(--knime-white);
}
</style>
