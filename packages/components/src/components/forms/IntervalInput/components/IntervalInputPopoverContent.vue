<script setup lang="ts">
import { computed } from "vue";

import type { intervalUtils } from "@knime/utils";

import FunctionButton from "../../../Buttons/FunctionButton.vue";
import Tooltip from "../../../Tooltip/Tooltip.vue";
import NumberInput from "../../NumberInput/NumberInput.vue";
import ValueSwitch from "../../ValueSwitch/ValueSwitch.vue";
import {
  bounds,
  durationNumericKeys,
  periodNumericKeys,
} from "../utils/constants";
import { toTitleCase } from "../utils/functions";
import type {
  AllowedIntervalFormatsType,
  IntervalDirectionalityType,
  PopoverModelType,
  UsedIntervalFormatsType,
} from "../utils/types";

const emit = defineEmits<{
  commit: [
    usedFormat: UsedIntervalFormatsType,
    popoverValues: PopoverModelType,
    directionality: IntervalDirectionalityType,
  ];
}>();

const props = defineProps<{
  format: AllowedIntervalFormatsType;
  allowDescending: boolean;
}>();

/**
 * Popover has its own format, that is only propagated to usedFormat when the user
 * closes the popup with the accept button.
 */
const popoverUsedFormat = defineModel<UsedIntervalFormatsType>("usedFormat", {
  required: true,
});

/**
 * Model used for the popover. Initially, we parse the duration model to get the duration or period,
 * and then set the other part to some sensible nonzero default.
 */
const popoverModel = defineModel<PopoverModelType>({
  required: true,
});
type IsPopoverModelValidReturn =
  | { valid: true }
  | { valid: false; reason: string };
/**
 * Check that all values are within bounds.
 */
const isPopoverModelValid = computed((): IsPopoverModelValidReturn => {
  const relevantKeys =
    popoverUsedFormat.value === "DATE"
      ? periodNumericKeys
      : durationNumericKeys;
  const relevantValues =
    popoverUsedFormat.value === "DATE"
      ? relevantKeys.map(
          (k) =>
            popoverModel.value.periodPart[
              k as keyof intervalUtils.Period
            ] as number,
        )
      : relevantKeys.map(
          (k) =>
            popoverModel.value.durationPart[
              k as keyof intervalUtils.Duration
            ] as number,
        );

  for (let i = 0; i < relevantValues.length; i++) {
    const relevantKey = relevantKeys[i];
    const relevantValue = relevantValues[i];
    if (
      isNaN(relevantValue) ||
      relevantValue < bounds[relevantKey].min ||
      relevantValue > bounds[relevantKey].max
    ) {
      return {
        valid: false,
        reason: `${toTitleCase(relevantKey)} out of bounds.`,
      };
    }
  }

  return { valid: true };
});

/**
 * Whether the interval is ascending or descending. This is a computed property that
 * is derived from the popover model.
 */
const ascendingOrDescending = computed<IntervalDirectionalityType>({
  get() {
    if (!props.allowDescending) {
      return "ASCENDING";
    }

    if (popoverUsedFormat.value === "DATE") {
      return popoverModel.value.periodPart.negative
        ? "DESCENDING"
        : "ASCENDING";
    } else {
      return popoverModel.value.durationPart.negative
        ? "DESCENDING"
        : "ASCENDING";
    }
  },
  set(newVal) {
    popoverModel.value.periodPart.negative = newVal === "DESCENDING";
    popoverModel.value.durationPart.negative = newVal === "DESCENDING";
  },
});

const requestSavePopup = () => {
  emit(
    "commit",
    popoverUsedFormat.value,
    popoverModel.value,
    ascendingOrDescending.value,
  );
};
</script>

<template>
  <span class="header">
    <span class="input-title">Interval</span>
    <ValueSwitch
      v-if="props.format === 'DATE_OR_TIME'"
      v-model="popoverUsedFormat"
      :possible-values="[
        { id: 'DATE', text: 'Date' },
        { id: 'TIME', text: 'Time' },
      ]"
      compact
    />
  </span>

  <div v-show="allowDescending" class="ascending-descending-switch-container">
    <ValueSwitch
      v-model="ascendingOrDescending"
      compact
      :possible-values="[
        { id: 'ASCENDING', text: 'Forward' },
        { id: 'DESCENDING', text: 'Backward' },
      ]"
    />
  </div>

  <div class="input-grid">
    <template v-for="key in periodNumericKeys" :key="key">
      <span
        v-show="popoverUsedFormat === 'DATE'"
        class="labeled-date-time-input"
      >
        <span class="input-label">{{ toTitleCase(key) }}</span>
        <NumberInput
          v-model="
            popoverModel.periodPart[key as keyof intervalUtils.Period] as number
          "
          :min="bounds[key].min"
          :max="bounds[key].max"
          compact
          type="integer"
        />
      </span>
    </template>
    <template v-for="key in durationNumericKeys" :key="key">
      <span
        v-show="popoverUsedFormat === 'TIME'"
        class="labeled-date-time-input"
      >
        <span class="input-label">{{ toTitleCase(key) }}</span>
        <NumberInput
          :model-value="
            popoverModel.durationPart[
              key as keyof intervalUtils.Duration
            ] as number
          "
          :min="bounds[key].min"
          :max="bounds[key].max"
          compact
          type="integer"
          @update:model-value="
            (newVal: number) => {
              (popoverModel.durationPart[
                key as keyof intervalUtils.Duration
              ] as number) = newVal;
            }
          "
        />
      </span>
    </template>
  </div>

  <div class="accept-controls">
    <Tooltip
      :text="isPopoverModelValid.valid ? '' : isPopoverModelValid.reason"
    >
      <FunctionButton
        primary
        :disabled="!isPopoverModelValid.valid"
        @click="requestSavePopup"
      >
        Set
      </FunctionButton>
    </Tooltip>
  </div>
</template>

<style lang="postcss" scoped>
.accept-controls {
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin-top: var(--space-8);
  align-items: center;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--knime-silver-sand);

  & .input-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    text-align: left;
  }
}

.ascending-descending-switch-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: var(--space-4);
  width: 100%;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
  grid-auto-flow: row;

  & .labeled-date-time-input {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: var(--space-4);

    & .input-label {
      font-size: 13px;
      font-weight: 500;
      line-height: 14px;
      text-align: left;
      padding: 2px;
    }
  }
}
</style>
