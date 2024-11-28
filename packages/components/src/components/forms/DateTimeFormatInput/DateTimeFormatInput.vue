<script lang="ts">
/**
 * Component used to input a date/time format like 'YYYY-mm-dd'.
 */
export default {};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { onClickOutside, onKeyDown } from "@vueuse/core";

import CalendarFilterIcon from "@knime/styles/img/icons/calendar-filter.svg";

import InputField from "../InputField/InputField.vue";

import DateTimeFormatPickerPopover from "./components/DateTimeFormatPickerPopover.vue";
import { type FormatDateType, type FormatWithExample } from "./utils/types";

type FormatPickerProps = {
  disabled?: boolean;
  compact?: boolean;
  allDefaultFormats: FormatWithExample[];
  allowedFormats?: FormatDateType[];
  formatValidator?: (format: string) => boolean;
};

const props = withDefaults(defineProps<FormatPickerProps>(), {
  disabled: false,
  compact: false,
  formatValidator: () => true,
  allowedFormats: (): FormatDateType[] => [
    "DATE",
    "TIME",
    "DATE_TIME",
    "ZONED_DATE_TIME",
  ],
});

const pickedFormatModel = defineModel<string>({
  default: "yyyy-MM-dd",
});

const textFieldPlaceholder = "Format like 'yyyy-MM-dd'";

const textFieldModel = ref<string>(pickedFormatModel.value);

const textFieldValueValid = computed<boolean>(() =>
  props.formatValidator(textFieldModel.value),
);

const formatInputPopoverRef = ref<HTMLDivElement | null>(null);
const togglePopoverButtonRef = ref<HTMLButtonElement | null>(null);
const inputTextFieldRef = ref<typeof InputField | null>(null);

const supplyTogglePopoverButtonRef = () => togglePopoverButtonRef;

const showPopOver = ref(false);

/*
 * Only important when the model changes from outside.
 */
watch(pickedFormatModel, (newVal) => {
  textFieldModel.value = newVal;
});

/**
 * Whenever the text field model is 'committed' (i.e. the user unfocuses it, or presses
 * enter) AND IS VALID, we need to update the models.
 */
const onCommitTextInputChanges = (newVal: string) => {
  if (!props.formatValidator(newVal)) {
    return;
  }

  pickedFormatModel.value = newVal;
  textFieldModel.value = newVal;
};

/**
 * When the popup is to be closed, we need to either accept or reject the changes. This
 * function takes care of that, and then closes the popover.
 *
 * @param accept if true, accept the changes and propagate them to the other models. If
 * false, reject the changes and reset the popover model.
 */
const onCommitPopupChanges = (newFormat: string) => {
  textFieldModel.value = newFormat;
  pickedFormatModel.value = newFormat;
  showPopOver.value = false;
};

onClickOutside(formatInputPopoverRef, () => (showPopOver.value = false), {
  ignore: [togglePopoverButtonRef],
});

onKeyDown("Escape", () => (showPopOver.value = false));
</script>

<template>
  <div>
    <div :class="['wrapper', { disabled, compact }]">
      <span class="input-fields">
        <input
          ref="inputTextFieldRef"
          v-model="textFieldModel"
          type="text"
          :disabled="disabled"
          :placeholder="textFieldPlaceholder"
          spellcheck="false"
          @focus="showPopOver = false"
          @focusout="onCommitTextInputChanges(textFieldModel)"
          @keydown.enter="onCommitTextInputChanges(textFieldModel)"
        />
        <span v-if="!textFieldValueValid" class="invalid-marker" />
        <button
          ref="togglePopoverButtonRef"
          class="trigger-popover-button"
          :disabled="disabled"
          @click="showPopOver = !showPopOver"
        >
          <CalendarFilterIcon />
        </button>
      </span>
    </div>

    <DateTimeFormatPickerPopover
      v-if="showPopOver"
      ref="formatInputPopoverRef"
      :all-formats="allDefaultFormats"
      :allowed-formats="allowedFormats"
      :attach-to="supplyTogglePopoverButtonRef()"
      @commit="onCommitPopupChanges"
    />
  </div>
</template>

<style lang="postcss" scoped>
.wrapper {
  position: relative;
  isolation: isolate;
  width: 100%;
  border: var(--form-border-width) solid var(--knime-stone-gray);

  &.disabled {
    opacity: 0.5;

    & .trigger-popover-button {
      background-color: var(--theme-time-part-input-background-color-disabled);
      pointer-events: none;
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
    font-size: 13px;
    font-weight: 300;
    letter-spacing: inherit;
    height: calc(var(--single-line-form-height) - 2 * var(--form-border-width));
    line-height: normal;
    border: 0;
    margin: 0;
    padding: 0 10px;
    border-radius: 0;
    width: calc(100% - 32px);
    outline: none;
    background-color: var(--theme-time-part-input-background-color);

    /* remove browser spinners FF */
    appearance: textfield;

    /* remove browser spinners WebKit/Blink */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      appearance: none;
      margin: 0;
    }

    /* css3 invalid state */
    &:invalid {
      box-shadow: none; /* override default browser styling */
    }

    &:disabled {
      opacity: 0.5;
    }

    &:hover:not(:focus, :disabled) {
      background-color: var(--theme-time-part-input-background-color-hover);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: calc(-1 * var(--form-border-width));
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
  }

  & .trigger-popover-button {
    border: none;
    top: 0;
    bottom: 0;
    position: absolute;
    width: 32px;
    padding-left: 7px;
    padding-right: 4px;
    background-color: var(--theme-time-part-input-background-color);

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }
  }

  &:not(.disabled) {
    & .trigger-popover-button {
      &:hover {
        background-color: var(--theme-time-part-input-background-color-hover);
        cursor: pointer;
      }

      &:active {
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
