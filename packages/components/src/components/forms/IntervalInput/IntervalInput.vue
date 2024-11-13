<script lang="ts">
/**
 * Component used to input a period or duration in ISO format.
 */
export default {};
</script>

<script setup lang="ts">
import { type Ref, computed, ref, watch } from "vue";
import { onClickOutside, onKeyDown } from "@vueuse/core";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/vue";

import DurationIcon from "@knime/styles/img/icons/sprint.svg";
import { intervalUtils } from "@knime/utils";

import InputField from "../InputField/InputField.vue";

import IntervalInputPopoverContent from "./components/IntervalInputPopoverContent.vue";
import {
  convertPeriodOrDurationToPopoverModel,
  convertPopoverModelToPeriodOrDuration,
} from "./utils/functions";
import type {
  AllowedIntervalFormatsType,
  IntervalDirectionalityType,
  PopoverModelType,
  UsedIntervalFormatsType,
} from "./utils/types";

type IntervalInputProps = {
  format?: AllowedIntervalFormatsType;
  allowDescending?: boolean;
  disabled?: boolean;
  compact?: boolean;
};

const props = withDefaults(defineProps<IntervalInputProps>(), {
  format: "DATE_OR_TIME",
  allowDescending: true,
  disabled: false,
  compact: false,
});

/**
 * Period OR duration in ISO format. Which one depends on the usedFormat ref below, which
 * in turn depends on the format prop.
 */
const exposedVModel = defineModel<string>({
  required: true,
});

/**
 * The format that is actually used for displaying the text field and setting the v-model
 * for the component. If the format from the props is DATE_TIME, this
 * will be either DATE or TIME depending on user input. If the prop format is DATE or
 * TIME, this will be the same as the prop format.
 */
const usedFormat: Ref<UsedIntervalFormatsType> = ref(
  (() => {
    if (props.format === "DATE_OR_TIME") {
      const validationResult = intervalUtils.isValidIntervalString(
        exposedVModel.value,
        "DATE_OR_TIME",
      );

      if (validationResult.valid) {
        return validationResult.type;
      } else {
        return "DATE";
      }
    } else {
      return props.format;
    }
  })(),
);
const textFieldPlaceholder = computed(() => {
  if (usedFormat.value === "DATE") {
    return "ISO-8601, whole words (1 year), single letters (1y)";
  } else {
    return "ISO-8601, whole words (1 hour), single letters (1h)";
  }
});

const popoverModel = ref<PopoverModelType>(
  (() => {
    const parsedDurationModel = intervalUtils.parseISOIntervalString(
      exposedVModel.value,
    );

    return convertPeriodOrDurationToPopoverModel(parsedDurationModel, {
      periodPart: {
        negative: false,
        years: 0,
        months: 0,
        weeks: 0,
        days: 1,
      },
      durationPart: {
        negative: false,
        hours: 0,
        minutes: 0,
        seconds: 1,
        milliseconds: 0,
      },
    });
  })(),
);

const textFieldModel = ref<string>(
  intervalUtils.formatIntervalToHumanReadableIntervalString(
    intervalUtils.parseISOIntervalString(exposedVModel.value),
  ),
);
const textFieldValueValid = computed((): boolean => {
  const validityCheck = intervalUtils.isValidIntervalString(
    textFieldModel.value,
    "DATE_OR_TIME",
  );

  return (
    validityCheck.valid &&
    (props.allowDescending || !validityCheck.negative) &&
    !validityCheck.zero &&
    (validityCheck.type === usedFormat.value || props.format === "DATE_OR_TIME")
  );
});

/*
 * Component refs
 */
const durationInputPopoverRef = ref<HTMLDivElement | null>(null);
const togglePopoverButtonRef = ref<HTMLButtonElement | null>(null);
const inputTextFieldRef = ref<typeof InputField | null>(null);

/**
 * When the popover model updates, we should update the text field model and the v-model to match.
 */
const updateAllModelsToMatchPopoverModel = (
  newPopoverModel: PopoverModelType,
  newUsedFormat: UsedIntervalFormatsType,
) => {
  const intervalValue = convertPopoverModelToPeriodOrDuration(
    newPopoverModel,
    newUsedFormat,
  );

  textFieldModel.value =
    intervalUtils.formatIntervalToHumanReadableIntervalString(intervalValue);
  exposedVModel.value =
    intervalUtils.formatIntervalToISOIntervalString(intervalValue);
  usedFormat.value = newUsedFormat;

  popoverModel.value = newPopoverModel;
};

/**
 * When the popover is closed without applying, we should reset it to match the other models.
 */
const resetPopoverModelToMatchOtherModels = () => {
  popoverModel.value = convertPeriodOrDurationToPopoverModel(
    intervalUtils.parseISOIntervalString(exposedVModel.value),
    popoverModel.value,
  );
};

/**
 * When the text field model is updated, we should update the popover model and the v-model
 * (as well as the text field model to get it in canonical format). But only if the text field
 * model is valid.
 */
const updateAllModelsToMatchPossiblyValidTextFieldModel = (
  maybeValidTextFieldModel: string,
) => {
  const intervalValidationResult = intervalUtils.isValidIntervalString(
    maybeValidTextFieldModel,
    "DATE_OR_TIME",
  );

  if (!intervalValidationResult.valid) {
    return;
  }
  if (intervalValidationResult.zero) {
    return;
  }
  if (!props.allowDescending && intervalValidationResult.negative) {
    return;
  }
  if (
    intervalValidationResult.type !== usedFormat.value &&
    props.format !== "DATE_OR_TIME"
  ) {
    return;
  }

  const intervalValue = intervalUtils.parseGenericIntervalString(
    maybeValidTextFieldModel,
  );

  popoverModel.value = convertPeriodOrDurationToPopoverModel(
    intervalValue,
    popoverModel.value,
  );
  exposedVModel.value =
    intervalUtils.formatIntervalToISOIntervalString(intervalValue);
  usedFormat.value = intervalValidationResult.type;

  // also update the text model so it's in canonical format
  textFieldModel.value =
    intervalUtils.formatIntervalToHumanReadableIntervalString(intervalValue);
};

/**
 * If the v-model changes from outside, we need to update the text field and the popover model
 * to match.
 */
const updateAllModelsToMatchExposedModel = (newValue: string) => {
  const intervalValue = intervalUtils.parseISOIntervalString(newValue);

  textFieldModel.value =
    intervalUtils.formatIntervalToHumanReadableIntervalString(intervalValue);
  popoverModel.value = convertPeriodOrDurationToPopoverModel(
    intervalValue,
    popoverModel.value,
  );

  exposedVModel.value = newValue;
};

/**
 * If the usedFormat ref changes (e.g. because the format prop changes to something
 * that was not DATE_OR_TIME), we need to update the text field and the v-model to match.
 */
const updateAllModelsToMatchUsedFormat = (
  newUsedFormat: UsedIntervalFormatsType,
) => {
  const intervalValue = convertPopoverModelToPeriodOrDuration(
    popoverModel.value,
    newUsedFormat,
  );

  textFieldModel.value =
    intervalUtils.formatIntervalToHumanReadableIntervalString(intervalValue);
  exposedVModel.value =
    intervalUtils.formatIntervalToISOIntervalString(intervalValue);

  usedFormat.value = newUsedFormat;
};

/**
 * If the format prop changes to anything except DATE_OR_TIME, we need to update the models
 * to match the new format.
 */
const updateAllModelsToMatchFormatProp = (
  newInputFormat: AllowedIntervalFormatsType,
) => {
  if (newInputFormat !== "DATE_OR_TIME") {
    updateAllModelsToMatchUsedFormat(newInputFormat);
  }
};

const showPopOver = ref(false);

/*
 * When the prop changes from outside, we may need to update the used format.
 */
watch(() => props.format, updateAllModelsToMatchFormatProp);
/*
 * Only important when the model changes from outside, since when that happens we
 * want to update the text field and the popover model.
 */
watch(exposedVModel, updateAllModelsToMatchExposedModel);

/**
 * Whenever the text field model is 'committed' (i.e. the user unfocuses it, or presses
 * enter) AND IS VALID, we need to update the popover model and v-model, and also change
 * the text field model to the canonical format. This function takes care of that.
 *
 * (If the text field model is invalid, we don't do anything here at all.)
 */
const onCommitTextInputChanges = (newVal: string) => {
  updateAllModelsToMatchPossiblyValidTextFieldModel(newVal);
};

/**
 * When the popup is to be closed, we need to either accept or reject the changes. This
 * function takes care of that, and then closes the popover.
 *
 * @param accept if true, accept the changes and propagate them to the other models. If
 * false, reject the changes and reset the popover model.
 */
const onCommitPopupChanges = (
  accept: boolean,
  newValuesIfAccept?: {
    usedFormat: "DATE" | "TIME";
    popoverValues: PopoverModelType;
    directionality: "ASCENDING" | "DESCENDING";
  },
) => {
  if (accept && newValuesIfAccept) {
    updateAllModelsToMatchPopoverModel(
      newValuesIfAccept.popoverValues,
      newValuesIfAccept.usedFormat,
    );
  } else {
    // Revert any changed values in the popover's internal model.
    resetPopoverModelToMatchOtherModels();
  }

  showPopOver.value = false;
};

onClickOutside(durationInputPopoverRef, () => onCommitPopupChanges(false), {
  ignore: [togglePopoverButtonRef],
});

onKeyDown("Escape", () => onCommitPopupChanges(false));

const { floatingStyles: popoverFloatingStyles, update: updateFloating } =
  useFloating(togglePopoverButtonRef, durationInputPopoverRef, {
    middleware: [
      shift(), // move left/right to keep it on screen
      flip({
        // flip it vertically to keep it on screen
        mainAxis: true,
        crossAxis: false,
      }),
      offset({
        // move it a bit away from the button vertically
        mainAxis: 2, // vertical
        crossAxis: 0, // horizontal
      }),
    ],
    placement: "top-end",
    whileElementsMounted: autoUpdate,
  });
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
          @focusout="() => onCommitTextInputChanges(textFieldModel)"
          @keypress.enter="() => onCommitTextInputChanges(textFieldModel)"
        />
        <span v-if="!textFieldValueValid" class="invalid-marker" />
        <button
          ref="togglePopoverButtonRef"
          class="trigger-popover-button"
          :disabled="disabled"
          @click="
            () => {
              if (showPopOver) {
                onCommitPopupChanges(false);
              } else {
                showPopOver = true;
                updateFloating();
              }
            }
          "
        >
          <DurationIcon />
        </button>
      </span>
    </div>

    <div
      v-show="showPopOver"
      ref="durationInputPopoverRef"
      class="control-popup"
      :style="popoverFloatingStyles"
    >
      <IntervalInputPopoverContent
        :model-value="popoverModel"
        :used-format="usedFormat"
        :format="props.format"
        :allow-descending="props.allowDescending"
        @commit="
          (
            usedFormat: UsedIntervalFormatsType,
            popoverValues: PopoverModelType,
            directionality: IntervalDirectionalityType,
          ) =>
            onCommitPopupChanges(true, {
              usedFormat,
              popoverValues,
              directionality,
            })
        "
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.control-popup {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  position: absolute;
  top: 0;
  left: 0;
  min-width: 0;
  min-height: 0;
  box-shadow: var(--shadow-elevation-2);
  padding: var(--space-24);
  padding-bottom: var(--space-16);
  background-color: white;
  z-index: var(--z-index-common-modal, 100);
}

.ascending-descending-switch-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.wrapper {
  position: relative;
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
    padding-left: 8px;
    padding-right: 7px;
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
