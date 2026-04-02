<script lang="ts">
export const DEFAULT_ANY_UNKNOWN_VALUES_ID = "<any unknown new column>";
</script>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";

import {
  KdsSortableListBox,
  type KdsSortableListBoxOption,
  type KdsTypeIconName,
} from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type PossibleValueOption = {
  id: string;
  text: string;
  special?: true;
  type?: { id: string; text: string };
};

type SortListControlOptions = {
  possibleValues?: PossibleValueOption[];
  unknownElementId?: string;
  unknownElementLabel?: string;
};

type SortListControlUiSchema =
  UiSchemaWithProvidedOptions<SortListControlOptions>;

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const data = computed(() => props.control.data);
const uischema = computed(
  () => props.control.uischema as SortListControlUiSchema,
);
const anyUnknownValuesId = computed(
  () =>
    uischema.value.options?.unknownElementId ?? DEFAULT_ANY_UNKNOWN_VALUES_ID,
);
const anyUnknownValuesText = computed(
  () => uischema.value.options?.unknownElementLabel ?? "Any unknown column",
);

const possibleValues = useProvidedState(
  uischema,
  "possibleValues",
  [] as SortListControlOptions["possibleValues"],
);

const toKdsOption = (option: PossibleValueOption): KdsSortableListBoxOption => {
  const kdsOption: KdsSortableListBoxOption = {
    id: option.id,
    text: option.text,
    ...(option.special ? { special: true } : {}),
  };
  if (option.type?.id) {
    kdsOption.accessory = {
      type: "dataType",
      name: option.type.id as KdsTypeIconName,
    };
  }
  return kdsOption;
};

const possibleValuesWithUnknownValues = computed(() =>
  possibleValues.value.map(toKdsOption).concat(
    toKdsOption({
      id: anyUnknownValuesId.value,
      text: anyUnknownValuesText.value,
      special: true,
    }),
  ),
);

const addUnknownValuesToData = (currentPossibleValues: { id: string }[]) => {
  /**
   * This way, the dialog does not need to receive an initial materialized default order
   */
  if (data.value.length === 0) {
    resetAll();
    return;
  }
  const unknownValuesIndex = data.value.indexOf(anyUnknownValuesId.value);
  if (unknownValuesIndex === -1) {
    throw new Error(
      `SortList data have to contain the value "${anyUnknownValuesId.value}"`,
    );
  }
  const before = data.value.slice(0, unknownValuesIndex + 1);
  const after = data.value.slice(unknownValuesIndex + 1);
  const dataSet = new Set(data.value);
  const unknownValues = currentPossibleValues
    .map(({ id }) => id)
    .filter((id) => !dataSet.has(id));
  if (unknownValues.length > 0) {
    props.changeValue(before.concat(unknownValues, after));
  }
};

onMounted(() => {
  addUnknownValuesToData(possibleValues.value);
});

watch(() => possibleValues.value, addUnknownValuesToData);

const resetAll = () => {
  props.changeValue(possibleValuesWithUnknownValues.value.map(({ id }) => id));
};

const onModelUpdate = (newOrder: string[]) => {
  props.changeValue(newOrder);
};
</script>

<template>
  <KdsSortableListBox
    :id="labelForId"
    :ariaLabel="control.label"
    :possible-values="possibleValuesWithUnknownValues"
    :model-value="data"
    :disabled="disabled"
    :error="!isValid"
    @update:model-value="onModelUpdate"
  />
</template>
