<script setup lang="ts">
import { computed, ref } from "vue";

import { Checkbox, InputField } from "@knime/components";

import LabeledControl from "../higherOrderComponents/control/LabeledControl.vue";
import type { VueControlProps } from "../higherOrderComponents/control/types";

import useHideOnNull from "./composables/useHideOnNull";
import useProvidedState from "./composables/useProvidedState";

const props = defineProps<VueControlProps<string | null>>();

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
  <LabeledControl :label="control.label">
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
        @update:model-value="changeValue"
      />
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
