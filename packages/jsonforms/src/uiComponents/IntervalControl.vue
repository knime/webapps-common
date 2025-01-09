<script setup lang="ts">
import { computed } from "vue";

import { IntervalInput } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";

import useProvidedState from "./composables/useProvidedState";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const options = computed(() => props.control.uischema.options);
const format = useProvidedState<"DATE" | "TIME" | "DATE_OR_TIME">(
  computed(() => options.value?.intervalTypeProvider),
  options.value?.intervalType ?? "DATE_OR_TIME",
);
</script>

<template>
  <IntervalInput
    :id="labelForId"
    compact
    :disabled="disabled"
    :model-value="control.data"
    :format="format"
    @update:model-value="changeValue"
  />
</template>
