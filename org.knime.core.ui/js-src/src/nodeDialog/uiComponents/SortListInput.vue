<script lang="ts">
export const DEFAULT_ANY_UNKNOWN_VALUES_ID = "<any unknown new column>";
</script>

<script setup lang="ts">
import SortList from "webapps-common/ui/components/forms/SortList.vue";
import Button from "webapps-common/ui/components/Button.vue";
import useDialogControl from "../composables/components/useDialogControl";
import { rendererProps } from "@jsonforms/vue";
import LabeledInput from "./label/LabeledInput.vue";
import { computed, onMounted, watch } from "vue";
import { indexOf } from "lodash-es";
import useProvidedState from "../composables/components/useProvidedState";
import { withSpecialChoices } from "../utils/getPossibleValuesFromUiSchema";

const props = defineProps({
  ...rendererProps(),
  anyUnknownValuesId: {
    type: String,
    default: DEFAULT_ANY_UNKNOWN_VALUES_ID,
  },
  anyUnknownValuesText: {
    type: String,
    default: "Any unknown column",
  },
});
const { onChange, control, disabled } = useDialogControl<string[]>({ props });

const data = computed<string[]>(() => control.value.data);
const choicesProvider = computed(
  () => control.value.uischema.options!.choicesProvider,
);
const possibleValues = withSpecialChoices(
  useProvidedState<{ id: string; text: string; special?: true }[]>(
    choicesProvider,
    [],
  ),
  control.value,
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
    onChange(before.concat(unknownValues, after));
  }
};

onMounted(() => {
  const staticPossibleValues = control.value.uischema.options!.possibleValues;
  if (staticPossibleValues) {
    possibleValues.value = staticPossibleValues;
  }
});

watch(() => possibleValues.value, addUnknownValuesToData);

const sortAToZ = () => {
  onChange(data.value.toSorted((a, b) => a.localeCompare(b)));
};
const sortZToA = () => {
  onChange(data.value.toSorted((a, b) => b.localeCompare(a)));
};
const resetAll = () => {
  onChange(possibleValuesWithUnknownValues.value.map(({ id }) => id));
};
</script>

<template>
  <div :class="['flex', 'space-between', 'with-padding']">
    <div class="flex">
      <Button with-border compact @click="sortAToZ">A - Z</Button>
      <Button with-border compact @click="sortZToA">Z - A</Button>
    </div>
    <Button with-border compact @click="resetAll">Reset all</Button>
  </div>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
    <SortList
      :id="labelForId ?? undefined"
      :possible-values="possibleValuesWithUnknownValues"
      :model-value="data"
      :ariaLabel="control.label"
      :disabled="disabled"
      @update:model-value="onChange"
    />
  </LabeledInput>
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

.with-padding {
  padding: 10px;
}
</style>
