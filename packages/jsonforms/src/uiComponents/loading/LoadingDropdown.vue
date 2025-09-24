<script setup lang="ts">
import { computed } from "vue";

import { Dropdown, LoadingIcon } from "@knime/components";
import { DataType } from "@knime/kds-components";

import type { LoadingDropdownProps } from "./types/LoadingDropdownProps";

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

const isPartiallyTyped = computed(() =>
  props.possibleValues?.some((value) => value.type !== undefined),
);

const disabledOrNoOptions = computed(
  () =>
    props.disabled ||
    props.possibleValues === null ||
    props.possibleValues.length === 0,
);

const possibleValues = computed(() => {
  if (props.possibleValues === null) {
    return [];
  }
  if (!isPartiallyTyped.value) {
    return props.possibleValues;
  }
  return props.possibleValues.map((value) => ({
    ...value,
    slotData: {
      text: value.text,
      ...(value.type && { typeId: value.type.id, typeText: value.type.text }),
    },
  }));
});
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
    <template
      #option="{ slotData, selectedValue, isMissing, expanded } = {
        slotData: {},
      }"
    >
      <template v-if="expanded || selectedValue !== '' || isMissing">
        <div
          :class="[
            'data-type-entry',
            { missing: isMissing, 'with-type': isMissing || slotData.typeId },
          ]"
        >
          <template v-if="isMissing">
            <DataType size="small" />
            <span>(MISSING) {{ selectedValue }}</span>
          </template>
          <template v-else>
            <template v-if="slotData.typeId">
              <DataType
                :icon-name="slotData.typeId"
                :icon-title="slotData.typeText"
                size="small"
              />
            </template>
            <span>{{ slotData.text }}</span>
          </template>
        </div>
      </template>
      <template v-else>{{ placeholderText }}</template>
    </template>
    <template #icon-right>
      <LoadingIcon v-if="possibleValues === null" class="loading-icon" />
    </template>
  </Dropdown>
</template>

<style lang="postcss" scoped>
.data-type-entry.with-type {
  display: flex;
  gap: var(--space-4);
  align-items: center;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.loading-icon {
  width: 14px;
  height: 14px;
}
</style>
