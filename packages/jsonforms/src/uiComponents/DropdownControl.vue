<script setup lang="ts">
import { computed, ref, toRef } from "vue";

import { Checkbox } from "@knime/components";

import LabeledControl from "../higherOrderComponents/control/LabeledControl.vue";
import ErrorMessages from "../higherOrderComponents/control/errorMessage/ErrorMessages.vue";
import type { VueControlProps } from "../higherOrderComponents/control/types";
import type { IdAndText } from "../types/ChoicesUiSchema";

import useHideOnNull from "./composables/useHideOnNull";
import { usePossibleValues } from "./composables/usePossibleValues";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

const props = defineProps<VueControlProps<string | null>>();

const controlElement = ref(null);

const { possibleValues } = usePossibleValues(toRef(props, "control"));

const previousControlData = ref(props.control.data);

const getFirstValueFromDropdownOrNull = (result: IdAndText[]) =>
  result.length > 0 ? result[0].id : null;

const { showCheckbox, showControl, checkboxProps } = useHideOnNull(
  {
    control: computed(() => props.control),
    disabled: computed(() => props.disabled),
    controlElement,
  },
  {
    setDefault: () => {
      if (!previousControlData.value && possibleValues.value) {
        props.changeValue(
          getFirstValueFromDropdownOrNull(possibleValues.value),
        );
      } else {
        props.changeValue(previousControlData.value);
      }
    },
    setNull: () => {
      props.changeValue(null);
    },
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
        <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
        <LoadingDropdown
          :id="labelForId ?? ''"
          ref="controlElement"
          :ariaLabel="control.label"
          :disabled="disabled"
          :model-value="control.data ?? ''"
          :possible-values="possibleValues"
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
