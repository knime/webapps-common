<script setup lang="ts">
import { ref } from "vue";

import { InputField } from "@knime/components";

import type {
  VueControlExposed,
  VueControlPropsForLabelContent,
} from "../higherOrderComponents/control/withLabel";

import { useBuiltinValidation } from "./composables/useBuiltinValidations";
import useProvidedState from "./composables/useProvidedState";

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

const placeholder = useProvidedState(
  props.control.uischema.options?.placeholderProvider,
  props.control.uischema.options?.placeholder ?? "",
);

const inputField = ref<InstanceType<typeof InputField> | null>(null);
defineExpose<VueControlExposed>({
  focus: () => inputField.value?.focus(),
});
</script>

<template>
  <InputField
    :id="labelForId"
    ref="inputField"
    :placeholder="placeholder"
    :model-value="control.data"
    :disabled="disabled"
    :is-valid
    compact
    @update:model-value="changeValue"
  />
</template>
