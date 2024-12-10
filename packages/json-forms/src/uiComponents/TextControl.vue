<script setup lang="ts">
import { ref } from "vue";
import { rendererProps } from "@jsonforms/vue";

import { Checkbox, InputField } from "@knime/components";

import useDialogControl from "../composables/components/useDialogControl";
import useProvidedState from "../composables/components/useProvidedState";

import useHideOnNull from "./composables/useHideOnNull";
import LabeledControl from "./label/LabeledControl.vue";

const props = defineProps(rendererProps());
const { onChange, control, disabled } = useDialogControl<
  string | null | undefined
>({ props });

const placeholder = useProvidedState(
  control.value.uischema.options?.placeholderProvider,
  control.value.uischema.options?.placeholder ?? "",
);

const controlElement = ref(null);
const { showCheckbox, showControl, checkboxProps } = useHideOnNull(
  {
    control,
    disabled,
    controlElement,
  },
  {
    setDefault: () => onChange(""),
    setNull: () => onChange(null),
  },
);
</script>

<template>
  <LabeledControl :control="control" @controlling-flow-variable-set="onChange">
    <template #before-label>
      <Checkbox v-if="showCheckbox" v-bind="checkboxProps" />
    </template>
    <template #default="{ labelForId }">
      <InputField
        v-if="showControl"
        :id="labelForId"
        ref="controlElement"
        :placeholder="placeholder"
        :model-value="control.data"
        :disabled="disabled"
        compact
        @update:model-value="onChange"
      />
    </template>
  </LabeledControl>
</template>
