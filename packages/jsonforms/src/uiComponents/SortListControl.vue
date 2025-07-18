<script lang="ts">
export const DEFAULT_ANY_UNKNOWN_VALUES_ID = "<any unknown new column>";
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { indexOf } from "lodash-es"; // eslint-disable-line depend/ban-dependencies

import { Button, SortList } from "@knime/components";

import LabeledControl from "../higherOrderComponents/control/LabeledControl.vue";
import ErrorMessages from "../higherOrderComponents/control/errorMessage/ErrorMessages.vue";
import type { VueControlProps } from "../higherOrderComponents/control/types";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type SortListControlOptions = {
  possibleValues?: { id: string; text: string; special?: true }[];
};

type SortListControlUiSchema =
  UiSchemaWithProvidedOptions<SortListControlOptions>;

const props = withDefaults(
  defineProps<
    VueControlProps<string[]> & {
      anyUnknownValuesId?: string;
      anyUnknownValuesText?: string;
    }
  >(),
  {
    anyUnknownValuesId: DEFAULT_ANY_UNKNOWN_VALUES_ID,
    anyUnknownValuesText: "Any unknown column",
  },
);

const data = computed(() => props.control.data);
const uischema = computed(
  () => props.control.uischema as SortListControlUiSchema,
);

const possibleValues = useProvidedState(
  uischema,
  "possibleValues",
  [] as SortListControlOptions["possibleValues"],
);

const possibleValuesWithUnknownValues = computed(() =>
  possibleValues.value.concat({
    id: props.anyUnknownValuesId,
    text: props.anyUnknownValuesText,
    special: true,
  }),
);

const addUnknownValuesToData = (currentPossibleValues: { id: string }[]) => {
  /**
   * This way, the dialog does not need to receive an initial materialized default order
   */
  if (data.value.length === 0) {
    resetAll();
    return;
  }
  const unknownValuesIndex = indexOf(data.value, props.anyUnknownValuesId);
  if (unknownValuesIndex === -1) {
    throw new Error(
      `SortList data have to contain the value "${props.anyUnknownValuesId}"`,
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

const sortAToZ = () => {
  props.changeValue(data.value.toSorted((a, b) => a.localeCompare(b)));
};
const sortZToA = () => {
  props.changeValue(data.value.toSorted((a, b) => b.localeCompare(a)));
};
const resetAll = () => {
  props.changeValue(possibleValuesWithUnknownValues.value.map(({ id }) => id));
};
const controlElement = ref<typeof SortList | null>(null);
</script>

<template>
  <div :class="['flex', 'space-between']">
    <div class="flex">
      <Button with-border compact @click="sortAToZ">A - Z</Button>
      <Button with-border compact @click="sortZToA">Z - A</Button>
    </div>
    <Button with-border compact @click="resetAll">Reset all</Button>
  </div>
  <LabeledControl
    :label="control.label"
    @controlling-flow-variable-set="changeValue"
  >
    <template #default="{ labelForId }">
      <ErrorMessages :errors="messages.errors">
        <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
        <SortList
          :id="labelForId ?? undefined"
          ref="controlElement"
          :possible-values="possibleValuesWithUnknownValues"
          :model-value="data"
          :ariaLabel="control.label"
          :disabled="disabled"
          @update:model-value="changeValue"
        />
      </ErrorMessages>
    </template>
    <template #icon>
      <slot name="icon" />
    </template>
    <template #buttons="{ hover }">
      <slot
        name="buttons"
        :hover="hover"
        :control-h-t-m-l-element="controlElement"
      />
    </template>
  </LabeledControl>
</template>

<style scoped lang="postcss">
.flex {
  display: flex;
  flex-direction: row;
  gap: 4px;

  &.space-between {
    justify-content: space-between;
  }
}
</style>
