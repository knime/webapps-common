<script setup lang="ts">
import { computed, ref } from "vue";

import { Checkbox, InputField } from "@knime/components";

import LabeledControl from "../higherOrderComponents/control/LabeledControl.vue";
import ErrorMessages from "../higherOrderComponents/control/errorMessage/ErrorMessages.vue";
import type { VueControlProps } from "../higherOrderComponents/control/types";

import { useBuiltinValidation } from "./composables/useBuiltinValidations";
import useHideOnNull from "./composables/useHideOnNull";
import useProvidedState from "./composables/useProvidedState";

const props = defineProps<VueControlProps<string | null>>();

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

const controlElement = ref<null | HTMLElement>(null);
const { showCheckbox, showControl, checkboxProps } = useHideOnNull(
  {
    control: computed(() => props.control),
    disabled: computed(() => props.disabled),
    controlElement,
  },
  {
    setDefault: () => props.changeValue(""),
    setNull: () => props.changeValue(null),
  },
);
</script>

<template>
  <LabeledControl
    :label="control.label"
    :hide-control-header="control.uischema.options?.hideControlHeader"
  >
    <template #before-label>
      <Checkbox v-if="showCheckbox" v-bind="checkboxProps" />
    </template>
    <template #default="{ labelForId }">
      <ErrorMessages v-if="showControl" :errors="messages.errors">
        <InputField
          :id="labelForId"
          ref="controlElement"
          :placeholder="placeholder"
          :model-value="control.data"
          :disabled="disabled"
          :is-valid
          compact
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
