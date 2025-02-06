<!-- eslint-disable class-methods-use-this -->
<script setup lang="ts">
import { computed, onMounted, watch, watchEffect } from "vue";
import { isEqual } from "lodash-es";

import type { VueControlProps } from "../higherOrderComponents/control/types";
import type { PossibleValue } from "../types/ChoicesUiSchema";
import inject from "../utils/inject";

import DropdownControl from "./DropdownControl.vue";
import useProvidedState from "./composables/useProvidedState";

type ColumnSelectValue = { selected: string | null } | undefined;

const props = defineProps<VueControlProps<ColumnSelectValue>>();

const choicesProvider = computed<string | undefined>(
  () => props.control.uischema.options?.choicesProvider,
);

const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");
const possibleValues = useProvidedState<null | PossibleValue[]>(
  choicesProvider,
  null,
);

const asyncInitialOptions = new Promise<PossibleValue[]>((resolve) => {
  watchEffect(() => {
    if (possibleValues.value) {
      resolve(possibleValues.value);
    }
  });
});

const toData = (value: string | null) => {
  const allColumns = possibleValues.value;
  if (allColumns === null) {
    throw new Error("Must not convert data before column choices are fetched.");
  }
  const compatibleTypes =
    allColumns.find((item) => item.id === value)?.compatibleTypes ?? [];
  return { selected: value, compatibleTypes };
};

const toValue = ({ selected }: any) => selected;

const updateData = () => {
  const initialData = props.control.data;
  const updatedInitialData = toData(toValue(initialData));
  if (!isEqual(initialData, updatedInitialData)) {
    props.changeValue(updatedInitialData);
  }
};

watch(() => possibleValues.value, updateData);

onMounted(async () => {
  if (!choicesProvider.value) {
    possibleValues.value = await getPossibleValuesFromUiSchema(props.control);
  }
});
</script>

<template>
  <DropdownControl
    v-bind="{ ...$attrs, ...$props }"
    :async-initial-options="asyncInitialOptions"
    :control-data-to-dropdown-value="toValue"
    compact
    :dropdown-value-to-control-data="toData"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <template #buttons="{ hover, controlHTMLElement }">
      <slot
        name="buttons"
        :hover="hover"
        :control-h-t-m-l-element="controlHTMLElement"
      />
    </template>
  </DropdownControl>
</template>
