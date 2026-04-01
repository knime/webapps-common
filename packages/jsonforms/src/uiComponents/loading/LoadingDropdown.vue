<script setup lang="ts">
import { computed } from "vue";

import {
  KdsDropdown,
  type KdsDropdownOption,
  type KdsDropdownOptionAccessory,
} from "@knime/kds-components";

import type { LoadingDropdownProps } from "./types/LoadingDropdownProps";

const props = defineProps<LoadingDropdownProps>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const asyncValue = computed(() => {
  return props.possibleValues === null ? "" : props.modelValue;
});

const isLoading = computed(() => props.possibleValues === null);

const isPartiallyTyped = computed(() =>
  props.possibleValues?.some((value) => value.type !== undefined),
);

const possibleValues = computed<KdsDropdownOption[]>(() => {
  if (props.possibleValues === null) {
    return [];
  }
  const result: KdsDropdownOption[] = [];
  for (const value of props.possibleValues) {
    if (!value.text) {
      continue;
    }

    let accessory: KdsDropdownOptionAccessory | undefined;
    if (isPartiallyTyped.value) {
      accessory = {
        type: "dataType" as const,
        name: value.type?.id ?? "missing_type",
      } as KdsDropdownOptionAccessory;
    } else if ("accessory" in value) {
      accessory = value.accessory as KdsDropdownOptionAccessory;
    }

    result.push({
      id: value.id,
      text: value.text,
      disabled: value.disabled,
      ...(value.subText ? { subText: value.subText } : {}),
      accessory,
    });
  }
  return result;
});

const placeholderText = computed(() => {
  if (isLoading.value) {
    return "Loading";
  }

  return possibleValues.value.length > 0
    ? "No value selected"
    : "No values present";
});

const disabledOrNoOptions = computed(
  () => props.disabled || possibleValues.value.length === 0,
);

const onUpdateModelValue = (value: string | null) => {
  emit("update:modelValue", value ?? "");
};
</script>

<template>
  <KdsDropdown
    v-bind="$attrs"
    :id="props.id"
    :ariaLabel="props.ariaLabel"
    :model-value="asyncValue"
    :disabled="disabledOrNoOptions"
    :possible-values="possibleValues"
    :loading="isLoading"
    :placeholder="placeholderText"
    :error="props.error"
    @update:model-value="onUpdateModelValue"
  />
</template>
