<script setup lang="ts">
import { computed, ref } from "vue";

import { Checkbox, InputField } from "@knime/components";

import LabeledControl from "../higherOrderComponents/control/LabeledControl.vue";
import ErrorMessages from "../higherOrderComponents/control/errorMessage/ErrorMessages.vue";
import type { VueControlProps } from "../higherOrderComponents/control/types";
import type { Messages } from "../higherOrderComponents/control/validation/types";

import useHideOnNull from "./composables/useHideOnNull";
import useProvidedState from "./composables/useProvidedState";

const props = defineProps<VueControlProps<string | null>>();

const {
  minLength,
  maxLength,
  pattern: optionPattern,
  minLengthErrorMessage,
  maxLengthErrorMessage,
  patternErrorMessage,
} = props.control.uischema.options || {};

if (
  typeof [minLength, maxLength, optionPattern].find(
    (prop) => typeof prop !== "undefined",
  ) !== "undefined"
) {
  const createErrors = ({
    value,
    minLength,
    maxLength,
    optionPattern,
  }: {
    value: string | null;
    minLength?: number;
    maxLength?: number;
    optionPattern?: string;
  }): Messages => {
    const errors: string[] = [];
    const valueLength = value?.length ?? 0;
    if (typeof minLength === "number" && valueLength < minLength) {
      errors.push(minLengthErrorMessage);
    }
    if (typeof maxLength === "number" && valueLength > maxLength) {
      errors.push(maxLengthErrorMessage);
    }
    if (typeof optionPattern === "string") {
      const pattern = new RegExp(`^(${optionPattern})$`);
      if (value === null || !pattern.test(value)) {
        errors.push(patternErrorMessage);
      }
    }
    return { errors };
  };
  const validator = computed(
    () => (value: string | null) =>
      createErrors({
        value,
        minLength,
        maxLength,
        optionPattern,
      }),
  );
  props.onRegisterValidation(validator);
}

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
