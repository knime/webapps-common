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

const schemaPattern = props.control.schema.pattern;
if (typeof schemaPattern === "string") {
  const pattern = new RegExp(`^(${schemaPattern})$`);
  const validateAgainstPattern = (value: string | null): Messages => ({
    errors:
      value === null || typeof value === "undefined" || !pattern.test(value)
        ? [`The value has to match the pattern "${schemaPattern}"`]
        : [],
  });
  props.onRegisterValidation(validateAgainstPattern);
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
