<!-- eslint-disable class-methods-use-this -->
<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";
import { computed, onMounted, watch, watchEffect } from "vue";
import type { PossibleValue } from "../types/ChoicesUiSchema";
import inject from "../utils/inject";
import DropdownInput from "./DropdownInput.vue";
import { isEqual } from "lodash-es";
import useDialogControl from "../composables/components/useDialogControl";
import useProvidedState from "../composables/components/useProvidedState";
import { DefaultSettingComparator } from "@knime/ui-extension-service";
import { withSpecialChoices } from "../utils/getPossibleValuesFromUiSchema";

class ColumnSelectValueComparator extends DefaultSettingComparator<
  { selected: string | null } | undefined,
  string | null | undefined
> {
  toInternalState(
    cleanSettings: { selected: string | null } | undefined,
  ): string | null | undefined {
    return cleanSettings?.selected;
  }

  equals(
    newState: string | null | undefined,
    cleanState: string | null | undefined,
  ): boolean {
    return newState === cleanState;
  }
}

const props = defineProps(rendererProps());
const jsonFormsControl = useDialogControl({
  props,
  subConfigKeys: ["selected"],
  valueComparator: new ColumnSelectValueComparator(),
});

const choicesProvider = computed<string | undefined>(
  () => jsonFormsControl.control.value.uischema.options?.choicesProvider,
);

const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");
const possibleValues = withSpecialChoices(
  useProvidedState<null | PossibleValue[]>(choicesProvider, null),
  jsonFormsControl.control.value,
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
  const initialData = jsonFormsControl.control.value.data;
  const updatedInitialData = toData(toValue(initialData));
  if (!isEqual(initialData, updatedInitialData)) {
    jsonFormsControl.onChange(updatedInitialData);
  }
};

watch(() => possibleValues.value, updateData);

onMounted(async () => {
  if (!choicesProvider.value) {
    possibleValues.value = await getPossibleValuesFromUiSchema(
      jsonFormsControl.control.value,
    );
  }
});
</script>

<template>
  <DropdownInput
    v-bind="{ ...$attrs, ...$props }"
    :async-initial-options="asyncInitialOptions"
    :json-forms-control="jsonFormsControl"
    :control-data-to-dropdown-value="toValue"
    :dropdown-value-to-control-data="toData"
  />
</template>
