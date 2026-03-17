<script setup lang="ts">
import { computed } from "vue";

import { KdsDropdown } from "@knime/kds-components";

import type { LoadingDropdownProps } from "./types/LoadingDropdownProps";

const props = defineProps<LoadingDropdownProps>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const isLoading = computed(() => props.possibleValues === null);

const placeholderText = computed(() => {
  const { possibleValues } = props;
  if (possibleValues === null) {
    return "Loading";
  }
  return possibleValues.length > 0 ? "No value selected" : "No values present";
});

const asyncValue = computed(() => {
  return props.possibleValues === null ? "" : props.modelValue;
});

const isPartiallyTyped = computed(() =>
  props.possibleValues?.some((value) => value.type !== undefined),
);

const disabledOrNoOptions = computed(
  () =>
    props.disabled ||
    (props.possibleValues !== null && props.possibleValues.length === 0),
);

const possibleValues = computed(() => {
  if (props.possibleValues === null) {
    return [];
  }
  return props.possibleValues.map((value) => ({
    id: value.id,
    text: value.text,
    disabled: value.disabled,
    ...(value.subText ? { subText: value.subText } : {}),
    accessory: isPartiallyTyped.value
      ? {
          type: "dataType" as const,
          name: value.type?.id ?? "missing_type",
        }
      : "accessory" in value
        ? value.accessory
        : undefined,
  }));
});

const onUpdateModelValue = (value: string | null) => {
  emit("update:modelValue", value ?? "");
};
</script>

<template>
  <KdsDropdown
    v-bind="$attrs"
    :id="props.id"
    :aria-label="props.ariaLabel"
    :model-value="asyncValue"
    :disabled="disabledOrNoOptions"
    :possible-values="possibleValues"
    :loading="isLoading"
    :placeholder="placeholderText"
    :error="props.error"
    @update:model-value="onUpdateModelValue"
  />
</template>
