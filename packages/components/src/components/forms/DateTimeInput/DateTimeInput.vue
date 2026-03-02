<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  isValid as isValidDate,
  parse,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { map } from "lodash-es"; // eslint-disable-line depend/ban-dependencies
import { DatePicker } from "v-calendar";

import CalendarIcon from "@knime/styles/img/icons/calendar.svg";
import {
  getLocalTimeZone,
  isAfterMaxDate,
  isBeforeMinDate,
  updateDate,
} from "@knime/utils";

import { resolveClientOnlyComponent } from "../../nuxtComponentResolver";
import Dropdown from "../Dropdown/Dropdown.vue";
import TimePartInput from "../TimePartInput/TimePartInput.vue";
import "../variables.css";

/**
 * DateTime component shows input field with a button and a popover calendar to choose the date. Time is represented
 * with multiple TimePartInputs for hour, minute etc.
 * Uses DatePicker from v-calendar. See: https://vcalendar.io/
 */

interface Props {
  /** Date time in UTC */
  modelValue: Date;
  /** id of the <input> element; can be used with Label component */
  id?: string;
  /**
   * Date format in unicode, only date not time!
   * @see https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
   */
  dateFormat?: string;
  /**
   * Date time format in unicode, only time not date!
   * @see https://www.unicode.org/reports/tr35/tr35-dates.html#dfst-hour
   */
  timeFormat?: string;
  min?: Date | null;
  max?: Date | null;
  /** Validity controlled by the parent component to be flexible */
  isValid?: boolean;
  showSeconds?: boolean;
  showMilliseconds?: boolean;
  showTime?: boolean;
  showDate?: boolean;
  showTimezone?: boolean;
  /** If true, the time input fields (if present) are displayed in a separate row */
  twoLines?: boolean;
  required?: boolean;
  /**
   * tz db timezone name
   * @see https://www.iana.org/time-zones / https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timezone?: string;
  disabled?: boolean;
  compact?: boolean;
}

const {
  modelValue,
  id = undefined,
  dateFormat = "yyyy-MM-dd",
  timeFormat = "HH:mm:ss",
  min = null,
  max = null,
  isValid = true,
  showSeconds = true,
  showMilliseconds = false,
  showTime = true,
  showDate = true,
  showTimezone = false,
  twoLines = false,
  required = false,
  timezone = getLocalTimeZone(),
  disabled = false,
  compact = false,
} = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

// Refs (formerly data properties)
const popoverIsVisible = ref(false);
const isInvalid = ref(false);
const isAfterMax = ref(false);
const isBeforeMin = ref(false);
// last invalid entered value (for error message)
const invalidValue = ref<Date | null>(null);
// internal value guarded by watcher to prevent invalid values (min/max, null etc.)
// time in the given timezone (default: browser local) for correct display
const localValue = ref(new Date(""));
const selectedTimezone = ref(timezone);
const timezones = map(Intl.supportedValuesOf("timeZone"), (timezone) => ({
  id: timezone,
  text: timezone,
}));

// Template refs
const datePicker = ref(null);
const hours = ref(null);
const minutes = ref(null);
const seconds = ref(null);
const milliseconds = ref(null);

// Computed properties
const clientOnlyComponent = computed(() => resolveClientOnlyComponent());

const legacyDateFormat = computed(() => {
  // see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
  // this only works for simple patterns and turn the unicode format into the moment.js de-facto standard
  return dateFormat.toUpperCase();
});

const dateTimeHours = computed(() => localValue.value.getHours());
const dateTimeMinutes = computed(() => localValue.value.getMinutes());
const dateTimeSeconds = computed(() => localValue.value.getSeconds());
const dateTimeMilliseconds = computed(() => localValue.value.getMilliseconds());

// Helper functions (defined before watchers to avoid use-before-define errors)
const checkIsValid = (date: Date) => {
  if (isValidDate(date)) {
    return true;
  }
  isInvalid.value = true;
  invalidValue.value = date;
  return false;
};

const checkMinMax = (date: Date) => {
  // skip check if no min and max is set
  if (!min && !max) {
    return true;
  }

  isBeforeMin.value = isBeforeMinDate(date, min, showDate, showTime);
  isAfterMax.value = isAfterMaxDate(date, max, showDate, showTime);

  if (isBeforeMin.value || isAfterMax.value) {
    invalidValue.value = date;
    return false;
  }
  return true;
};

const formatDate = (date: Date) => {
  // time and date
  if (showTime && showDate) {
    return format(date, `${dateFormat} ${timeFormat}`);
  }
  // only time
  if (showTime) {
    return format(date, timeFormat);
  }
  // only date
  return format(date, dateFormat);
};

const emitInput = (value: string | number | Date) => {
  // check min/max
  const utcValue = zonedTimeToUtc(value, selectedTimezone.value);
  checkMinMax(utcValue);
  emit("update:modelValue", utcValue);
};

const onDatePickerInput = (date: Date) => {
  emitInput(updateDate(localValue.value, date));
};

const onTextInputChange = ($event: Event, hidePopoverFunction: () => void) => {
  // parse the input
  let date = parse(
    ($event.target as HTMLInputElement)?.value,
    dateFormat,
    new Date(),
  );

  // ignore invalid or unparseable input
  if (!checkIsValid(date)) {
    date = localValue.value;
  }

  // use time set in value
  const value = updateDate(localValue.value, date);

  // hide popover (if open)
  hidePopoverFunction();

  // trigger input event which will set value again and update picker
  // and trigger validation even if the value did not change
  onDatePickerInput(value);
};

// Watchers
watch(
  () => modelValue,
  (newValue) => {
    // validates against min/max and sets appropriate state
    // update internal value if min/max bounds are kept and value is valid
    checkMinMax(newValue);
    if (checkIsValid(newValue)) {
      // convert to zoned time
      localValue.value = utcToZonedTime(newValue, selectedTimezone.value);
    }
  },
  { immediate: true },
);

watch(
  () => timezone,
  (newValue) => {
    selectedTimezone.value = newValue;
    localValue.value = utcToZonedTime(modelValue, newValue);
  },
);

// Event handlers

const onTimeHoursBounds = (bounds: { type: string; value: number }) => {
  // skip this handler if date is not shown
  if (!showDate) {
    return;
  }
  if (["min", "max"].includes(bounds.type)) {
    emitInput(setHours(new Date(localValue.value), bounds.value));
  } else {
    emitInput(localValue.value);
  }
};

const onTimeMinutesBounds = (bounds: { type: string; value: number }) => {
  if (["min", "max"].includes(bounds.type)) {
    emitInput(setMinutes(new Date(localValue.value), bounds.value));
  } else {
    emitInput(localValue.value);
  }
};

const onTimeSecondsBounds = (bounds: { type: string; value: number }) => {
  if (["min", "max"].includes(bounds.type)) {
    emitInput(setSeconds(new Date(localValue.value), bounds.value));
  } else {
    emitInput(localValue.value);
  }
};

const onTimeMillisecondsBounds = (bounds: { type: string; value: number }) => {
  if (["min", "max"].includes(bounds.type)) {
    emitInput(setMilliseconds(new Date(localValue.value), bounds.value));
  } else {
    emitInput(localValue.value);
  }
};

const onTimeHoursChange = (hours: number) => {
  let date = new Date(localValue.value);
  if (Number.isSafeInteger(hours)) {
    date = setHours(date, hours);
  }
  emitInput(date);
};

const onTimeMinutesChange = (minutes: number) => {
  let date = new Date(localValue.value);
  if (Number.isSafeInteger(minutes)) {
    date = setMinutes(date, minutes);
  }
  emitInput(date);
};

const onTimeSecondsChange = (seconds: number) => {
  let date = new Date(localValue.value);
  if (Number.isSafeInteger(seconds)) {
    date = setSeconds(date, seconds);
  }
  emitInput(date);
};

const onTimeMillisecondsChange = (milliseconds: number) => {
  let date = new Date(localValue.value);
  if (Number.isSafeInteger(milliseconds)) {
    date = setMilliseconds(date, milliseconds);
  }
  emitInput(date);
};

const onTimeZoneChange = (timezone: string) => {
  selectedTimezone.value = timezone;
  emitInput(localValue.value);
};

const validate = () => {
  let isValidResult = true;
  let errorMessage;
  if (required && isInvalid.value) {
    isValidResult = false;
    errorMessage = "Please input a valid date";
  }
  if (isAfterMax.value && invalidValue.value) {
    isValidResult = false;

    // isAfterMax can only be true if max is not null
    errorMessage = `${formatDate(invalidValue.value)} is after maximum ${formatDate(max!)}`;
  }
  if (isBeforeMin.value && invalidValue.value) {
    isValidResult = false;

    // isBeforeMin can only be true if min is not null
    errorMessage = `${formatDate(invalidValue.value)} is before minimum ${formatDate(min!)}`;
  }
  return {
    isValid: isValidResult,
    errorMessage,
  };
};

const onKeydownEscape = (e: KeyboardEvent, hidePopover: () => void) => {
  if (popoverIsVisible.value) {
    e.preventDefault();
    hidePopover();
  }
};

// Expose methods that can be called from parent
defineExpose({
  validate,
});
</script>

<template>
  <div class="date-time-input">
    <div v-if="showDate" :class="['date-picker', { disabled, compact }]">
      <Component :is="clientOnlyComponent">
        <DatePicker
          ref="datePicker"
          :model-value="localValue"
          :is-required="true"
          :is-dark="false"
          color="masala"
          :popover="{ placement: 'bottom', visibility: 'click' }"
          :masks="{ L: legacyDateFormat }"
          :max-date="max"
          :min-date="min"
          @popover-will-hide="popoverIsVisible = false"
          @popover-will-show="popoverIsVisible = true"
          @update:model-value="onDatePickerInput"
        >
          <!--Custom Input Slot-->
          <template
            #default="{
              inputValue,
              inputEvents,
              hidePopover,
              togglePopover,
              showPopover,
            }"
          >
            <div @keydown.esc="onKeydownEscape($event, hidePopover)">
              <input
                :id="id"
                :value="inputValue"
                :disabled="disabled"
                v-on="inputEvents"
                @change="onTextInputChange($event, hidePopover)"
              />
              <span
                :class="['button', { active: popoverIsVisible, disabled }]"
                title="Select date"
                :tabindex="disabled ? -1 : 0"
                @click="disabled ? () => {} : togglePopover()"
                @keydown.space.prevent="disabled ? () => {} : showPopover()"
              >
                <CalendarIcon />
              </span>
            </div>
          </template>
        </DatePicker>
      </Component>
      <span v-if="!isValid" class="invalid-marker" />
    </div>
    <div
      v-if="showTime"
      :class="['time', { 'two-lines': twoLines || showTimezone, compact }]"
    >
      <TimePartInput
        ref="hours"
        class="time-part"
        type="integer"
        :compact="compact"
        :min="0"
        :max="23"
        :min-digits="2"
        :model-value="dateTimeHours"
        :disabled="disabled"
        @bounds="onTimeHoursBounds"
        @update:model-value="onTimeHoursChange"
      />
      <span class="time-colon">:</span>
      <TimePartInput
        ref="minutes"
        class="time-part"
        type="integer"
        :compact="compact"
        :min="0"
        :max="59"
        :min-digits="2"
        :model-value="dateTimeMinutes"
        :disabled="disabled"
        @bounds="onTimeMinutesBounds"
        @update:model-value="onTimeMinutesChange"
      />
      <span v-if="showSeconds" class="time-colon">:</span>
      <TimePartInput
        v-if="showSeconds"
        ref="seconds"
        class="time-part"
        type="integer"
        :compact="compact"
        :min="0"
        :max="59"
        :min-digits="2"
        :model-value="dateTimeSeconds"
        :disabled="disabled"
        @bounds="onTimeSecondsBounds"
        @update:model-value="onTimeSecondsChange"
      />
      <span v-if="showMilliseconds" class="time-colon">.</span>
      <TimePartInput
        v-if="showMilliseconds"
        ref="milliseconds"
        class="time-part"
        type="integer"
        :compact="compact"
        :min="0"
        :max="999"
        :min-digits="3"
        :model-value="dateTimeMilliseconds"
        :disabled="disabled"
        @bounds="onTimeMillisecondsBounds"
        @update:model-value="onTimeMillisecondsChange"
      />
      <span v-if="showTimezone" class="time-colon" />
      <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
      <Dropdown
        v-if="showTimezone"
        class="timezone"
        :model-value="selectedTimezone"
        ariaLabel="Timezone"
        :disabled="disabled"
        :possible-values="timezones"
        :compact="compact"
        @update:model-value="onTimeZoneChange"
      />
    </div>
  </div>
</template>

<style lang="postcss">
@import url("v-calendar/dist/style.css");
</style>

<style lang="postcss" scoped>
.date-time-input {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  width: auto;

  /* time */
  & .time {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 0;
    align-items: center;
    width: auto;

    & .time-part {
      width: 5rem;
    }

    &.two-lines {
      width: 100%;
    }

    & .time-colon {
      padding: 5px;
    }

    & span {
      display: flex;
      flex-wrap: nowrap;
      width: auto;
    }

    & .timezone {
      flex: 0 1 260px;
    }
  }

  & .date-picker {
    &.disabled {
      opacity: 0.5;
    }

    &.compact {
      height: var(--single-line-form-height-compact);

      & input {
        height: calc(
          var(--single-line-form-height-compact) - 2 * var(--form-border-width)
        );
      }

      & .button {
        height: calc(
          var(--single-line-form-height-compact) - 2 * var(--form-border-width)
        );
      }
    }

    /* v-calendar theme
       new 1.1+ theme with css-vars see https://github.com/nathanreyes/v-calendar/blob/master/src/styles/base.css */

    /* remove caret (triangle) */
    & :deep(.vc-popover-caret) {
      display: none;
    }

    /* no space between input and popover */
    & :deep(.vc-popover-content-wrapper) {
      --popover-vertical-content-offset: 0;
      --popover-horizontal-content-offset: 0;

      /* default animation is too slow */
      --popover-transition-time: 0.1s ease-in-out;
    }

    & :deep(.vc-day-content.is-disabled) {
      opacity: 0.5;
    }

    & :deep(.vc-popover-content) {
      --vc-rounded: 0;
      --vc-rounded-lg: 0;

      border: 0;

      /* popover box shadow */
      box-shadow: var(--shadow-elevation-2);
    }

    & :deep(.vc-arrow):not(:hover),
    & :deep(.vc-title) {
      background: var(--vc-white);
    }

    & :deep(.vc-container) {
      /* color prop value (in our case 'masala' see above) and vc-COLOR-PROP-NAME need to be defined */
      --masala-100: var(--theme-date-input-accent-100);
      --masala-200: var(--theme-date-input-accent-200);
      --masala-300: var(--theme-date-input-accent-300);
      --masala-400: var(--theme-date-input-accent-400);
      --masala-500: var(--theme-date-input-accent-500);
      --masala-600: var(--theme-date-input-accent-600);
      --masala-700: var(--theme-date-input-accent-700);
      --masala-800: var(--theme-date-input-accent-800);
      --masala-900: var(--theme-date-input-accent-900);

      & .vc-masala {
        --vc-accent-100: var(--masala-100);
        --vc-accent-200: var(--masala-200);
        --vc-accent-300: var(--masala-300);
        --vc-accent-400: var(--masala-400);
        --vc-accent-500: var(--masala-500);
        --vc-accent-600: var(--masala-600);
        --vc-accent-700: var(--masala-700);
        --vc-accent-800: var(--masala-800);
        --vc-accent-900: var(--masala-900);
      }

      /* not themed items */
      & .vc-day-content:hover {
        background: var(--theme-date-input-day-content-background);
      }

      /* non "color" prop colors which are used regardless of color prop value */
      --vc-white: var(--theme-date-input-white);
      --vc-black: var(--theme-date-input-black);

      --vc-gray-100: var(--theme-date-input-gray-100);
      --vc-gray-200: var(--theme-date-input-gray-200);
      --vc-gray-300: var(--theme-date-input-gray-300);
      --vc-gray-400: var(--theme-date-input-gray-400);
      --vc-gray-500: var(--theme-date-input-gray-500);
      --vc-gray-600: var(--theme-date-input-gray-600);
      --vc-gray-700: var(--theme-date-input-gray-700);
      --vc-gray-800: var(--theme-date-input-gray-800);
      --vc-gray-900: var(--theme-date-input-gray-900);
    }

    position: relative;
    min-width: 7.5rem;

    /* -- end v-calendar 'theme' */

    /* input wrapper style */
    max-width: 9rem;
    border: var(--form-border-width) solid var(--theme-date-input-border-color);

    &:focus-within {
      border-color: var(--theme-date-input-border-focus-color);
    }

    /* stylelint-disable-next-line no-descending-specificity */
    & input {
      width: calc(100% - 32px);
      height: calc(
        var(--single-line-form-height) - 2 * var(--form-border-width)
      );
      padding: 0 10px;
      margin: 0;
      font-size: 13px;
      font-weight: 300;
      line-height: normal;
      letter-spacing: inherit;
      outline: none;
      background-color: var(--theme-date-input-input-background);
      border: 0;
      border-radius: 0;

      /* css3 invalid state */
      &:invalid {
        box-shadow: none; /* override default browser styling */
      }

      &:disabled {
        opacity: 0.5;
      }

      &:hover:not(:focus, :disabled) {
        background-color: var(--theme-date-input-input-hover-background);
      }
    }

    & .invalid-marker {
      position: absolute;
      top: 0;
      bottom: 0;
      left: -1px;
      z-index: 1;
      display: block;
      width: 3px;
      background-color: var(--theme-color-error);
    }

    /* stylelint-disable-next-line no-descending-specificity */
    & .button {
      position: absolute;
      z-index: 1;
      width: 32px;
      height: calc(
        var(--single-line-form-height) - 2 * var(--form-border-width)
      );
      padding-right: 9px;
      padding-left: 10px;

      &:hover:not(.disabled),
      &:focus:not(.disabled) {
        cursor: pointer;
        outline: none;
        background-color: var(--theme-date-input-input-hover-background);
      }

      & svg {
        width: 100%;
        height: 100%;
        stroke-width: 1.5px;
      }

      &.disabled {
        opacity: 0.5;
      }
    }

    & .button:active:not(.disabled),
    & .button.active:not(.disabled) {
      color: var(--theme-date-input-white);
      background-color: var(--theme-date-input-button-active-color);

      & svg {
        stroke: var(--theme-date-input-white);
      }
    }
  }
}
</style>
