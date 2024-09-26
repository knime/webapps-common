<script setup lang="ts">
import { computed } from "vue";
import { Dropdown, LoadingIcon } from "@knime/components";
import type LoadingDropdownProps from "./types/LoadingDropdownProps";

const props = defineProps<LoadingDropdownProps>();

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

const disabledOrNoOptions = computed(
  () =>
    props.disabled ||
    props.possibleValues === null ||
    props.possibleValues.length === 0,
);
</script>

<template>
  <Dropdown
    v-bind="{ ...$props, ...$attrs }"
    :model-value="asyncValue"
    :disabled="disabledOrNoOptions"
    :possible-values="possibleValues ?? []"
    :placeholder="placeholderText"
    compact
  >
    <template #icon-right>
      <LoadingIcon v-if="possibleValues === null" class="loading-icon" />
    </template>
  </Dropdown>
</template>

<style lang="postcss" scoped>
.loading-icon {
  width: 14px;
  height: 14px;
}
</style>
