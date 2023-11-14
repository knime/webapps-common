<script lang="ts">
import { rendererProps } from "@jsonforms/vue";
import { onMounted, ref, watchEffect, type Ref } from "vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";
import type { PossibleValue } from "../types/ChoicesUiSchema";
import inject from "../utils/inject";
import DropdownInput from "./DropdownInput.vue";
import { isEqual } from "lodash";

export default {
  name: "ColumnSelect",
  components: {
    DropdownInput,
  },
  inject: ["getPossibleValuesFromUiSchema"],
  inheritAttrs: false,
  props: {
    ...rendererProps(),
  },
  setup(props) {
    const jsonFormsControl = useJsonFormsControlWithUpdate(props);
    const getPossibleValuesFromUiSchema = inject(
      "getPossibleValuesFromUiSchema",
    );
    const possibleValues: Ref<null | PossibleValue[]> = ref(null);

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
        throw new Error(
          "Must not convert data before column choices are fetched.",
        );
      }
      const compatibleTypes = allColumns.find((item) => item.id === value)
        ?.compatibleTypes;
      return { selected: value, compatibleTypes };
    };

    const toValue = ({ selected }: any) => selected;

    const updateInitialData = () => {
      const initialData = jsonFormsControl.control.value.data;
      const updatedInitialData = toData(toValue(initialData));
      if (!isEqual(initialData, updatedInitialData)) {
        jsonFormsControl.handleChange(
          jsonFormsControl.control.value.path,
          updatedInitialData,
        );
      }
    };

    onMounted(async () => {
      possibleValues.value = await getPossibleValuesFromUiSchema(
        jsonFormsControl.control.value,
      );
      updateInitialData();
    });

    return {
      asyncInitialOptions,
      jsonFormsControl,
      toData,
      toValue,
    };
  },
};
</script>

<template>
  <DropdownInput
    v-bind="{ ...$attrs, ...$props }"
    :async-initial-options="asyncInitialOptions"
    :sub-config-keys="['selected']"
    :json-forms-control="jsonFormsControl"
    :control-data-to-dropdown-value="toValue"
    :dropdown-value-to-control-data="toData"
  />
</template>
