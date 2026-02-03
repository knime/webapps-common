<script setup lang="ts">
import { computed, ref } from "vue";

import { KdsTextInput } from "@knime/kds-components";

import type {
  VueControlExposed,
  VueControlPropsForLabelContent,
} from "../higherOrderComponents";

import { useBuiltinValidation } from "./composables/useBuiltinValidations";
import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type TextControlOptions = {
  placeholder?: string;
};

type TextControlUiSchema = UiSchemaWithProvidedOptions<TextControlOptions>;

const props = defineProps<VueControlPropsForLabelContent<string | null>>();

type ValidationParameters = {
  pattern: { pattern: string };
  minLength: { minLength: number };
  maxLength: { maxLength: number };
};

useBuiltinValidation<ValidationParameters, string | null>(
  {
    pattern: ({ pattern }) => {
      const regex = new RegExp(`^(${pattern})$`);
      return (value) => regex.test(value ?? "");
    },
    minLength:
      ({ minLength }) =>
      (value) =>
        (value?.length ?? 0) >= minLength,
    maxLength:
      ({ maxLength }) =>
      (value) =>
        (value?.length ?? 0) <= maxLength,
  },
  props,
);

const uischema = computed(() => props.control.uischema as TextControlUiSchema);
const placeholder = useProvidedState(uischema, "placeholder", "");

const inputField = ref<InstanceType<typeof KdsTextInput> | null>(null);
defineExpose<VueControlExposed>({
  focus: () => inputField.value?.focus(),
});
</script>

<template>
  <KdsTextInput
    :id="labelForId"
    ref="inputField"
    :placeholder="placeholder"
    :model-value="control.data"
    :disabled="disabled"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
