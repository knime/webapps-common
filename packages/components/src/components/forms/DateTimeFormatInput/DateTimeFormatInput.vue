<script lang="ts">
/**
 * Component used to input a date/time format like 'YYYY-mm-dd'.
 */
export default {};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/vue";

import CalendarFilterIcon from "@knime/styles/img/icons/calendar-filter.svg";

import DateTimeFormatPickerPopover from "./components/DateTimeFormatPickerPopover.vue";
import {
  type DateTimeFormatModel,
  type FormatDateType,
  type FormatWithExample,
} from "./utils/types";

type FormatPickerProps = {
  disabled?: boolean;
  compact?: boolean;
  isValid?: boolean;
  allDefaultFormats: FormatWithExample[] | null;
  allowedTypes?: FormatDateType[];
  showTypeSwitchInPopover?: boolean;
};

const props = withDefaults(defineProps<FormatPickerProps>(), {
  disabled: false,
  compact: false,
  isValid: true,
  allowedTypes: (): FormatDateType[] => [
    "DATE",
    "TIME",
    "DATE_TIME",
    "ZONED_DATE_TIME",
  ],
  showTypeSwitchInPopover: true,
});

const pickedFormatModel = defineModel<DateTimeFormatModel>({
  default: {
    format: "yyyy-MM-dd",
    temporalType: "DATE",
  },
});

const formatSubModel = computed({
  get: () => pickedFormatModel.value.format,
  set: (newFormat: string) => {
    pickedFormatModel.value = {
      ...pickedFormatModel.value,
      format: newFormat,
    };
  },
});

const textFieldPlaceholder = "Format like 'yyyy-MM-dd'";

const isValueValid = computed<boolean>(() => props.isValid);

const togglePopoverButtonRef = ref<HTMLButtonElement | null>(null);
const floatingPopoverRef = ref<HTMLElement | null>(null);

const showPopOver = ref(false);

/**
 * When the popup is to be closed, we need to propagate the changes. This
 * function takes care of that, and then closes the popover.
 */
const onCommitPopupChanges = (newFormat: DateTimeFormatModel) => {
  pickedFormatModel.value = newFormat;
  showPopOver.value = false;
};

onClickOutside(floatingPopoverRef, () => (showPopOver.value = false), {
  ignore: [togglePopoverButtonRef],
});

const { floatingStyles: popoverFloatingStyles } = useFloating(
  togglePopoverButtonRef,
  floatingPopoverRef,
  {
    middleware: [
      offset({
        mainAxis: 2,
        crossAxis: 0,
      }),
      shift(),
      flip({
        mainAxis: true,
        crossAxis: false,
      }),
    ],
    placement: "top-end",
    whileElementsMounted: autoUpdate,
  },
);
</script>

<template>
  <div>
    <div :class="['wrapper', { disabled, compact }]">
      <span class="input-fields">
        <input
          v-model="formatSubModel"
          type="text"
          :disabled="disabled"
          :placeholder="textFieldPlaceholder"
          spellcheck="false"
          @focus="showPopOver = false"
        />
        <span v-if="!isValueValid" class="invalid-marker" />
        <button
          ref="togglePopoverButtonRef"
          class="trigger-popover-button"
          :class="{ active: showPopOver }"
          :disabled="disabled"
          @click="showPopOver = !showPopOver"
        >
          <CalendarFilterIcon />
        </button>
      </span>
    </div>
    <div
      v-if="showPopOver"
      ref="floatingPopoverRef"
      class="popover"
      :style="popoverFloatingStyles"
    >
      <DateTimeFormatPickerPopover
        :all-formats="allDefaultFormats"
        :initial-selected-pattern="pickedFormatModel.format"
        :selected-type="pickedFormatModel.temporalType"
        :show-type-switch="showTypeSwitchInPopover"
        @commit="onCommitPopupChanges"
        @cancel="showPopOver = false"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.popover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: var(--z-index-common-modal, 100);
  width: 360px;
  min-width: 0;
  min-height: 0;
  padding: var(--space-24);
  padding-bottom: var(--space-16);
  background-color: white;
  box-shadow: var(--shadow-elevation-2);
}

.wrapper {
  position: relative;
  width: 100%;
  border: var(--form-border-width) solid var(--knime-stone-gray);

  &.disabled {
    opacity: 0.5;

    & .trigger-popover-button {
      pointer-events: none;
      background-color: var(--theme-time-part-input-background-color-disabled);
    }
  }

  &:focus-within {
    border-color: var(--knime-masala);
  }

  &.compact {
    & input[type="text"] {
      height: calc(
        var(--single-line-form-height-compact) - 2 * var(--form-border-width)
      );
    }

    /* stylelint-disable no-descending-specificity */
    & .trigger-popover-button {
      height: calc(
        var(--single-line-form-height-compact) - 2 * var(--form-border-width)
      );
      line-height: 14px;
    }
  }

  & input[type="text"] {
    width: calc(100% - 32px);
    height: calc(var(--single-line-form-height) - 2 * var(--form-border-width));
    padding: 0 10px;
    margin: 0;
    font-size: 13px;
    font-weight: 300;
    line-height: normal;
    letter-spacing: inherit;

    /* remove browser spinners FF */
    appearance: textfield;
    outline: none;
    background-color: var(--theme-time-part-input-background-color);
    border: 0;
    border-radius: 0;

    /* remove browser spinners WebKit/Blink */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      margin: 0;
      appearance: none;
    }

    /* css3 invalid state */
    &:invalid {
      box-shadow: none; /* override default browser styling */
    }

    &:disabled {
      opacity: 0.5;
    }

    &:hover:not(:focus, :disabled) {
      background-color: var(--knime-silver-sand-semi);
    }
  }

  & .invalid-marker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(-1 * var(--form-border-width));
    display: block;
    width: 3px;
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
    background-color: var(--theme-color-error);
  }

  & .trigger-popover-button {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 32px;
    padding-right: 4px;
    padding-left: 7px;
    background-color: var(--theme-time-part-input-background-color);
    border: none;

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }
  }

  &:not(.disabled) {
    & .trigger-popover-button {
      &:hover {
        cursor: pointer;
        background-color: var(--theme-time-part-input-background-color-hover);
      }

      &:active,
      &.active {
        color: var(--knime-white);
        background-color: var(--knime-masala);

        & svg {
          stroke: var(--knime-white);
        }
      }
    }
  }
}
</style>
