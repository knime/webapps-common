<script>
import {
  parse,
  isValid,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { DatePicker } from "v-calendar";

import { resolveClientOnlyComponent } from "../../util/nuxtComponentResolver";
import CalendarIcon from "../../assets/img/icons/calendar.svg";
import updateDate from "../../../util/updateDate";
import { isBeforeMinDate, isAfterMaxDate } from "../../../util/dateMinMaxCheck";
import getLocalTimeZone from "../../../util/localTimezone";

import TimePartInput from "./TimePartInput.vue";

/**
 * DateTime component shows input field with a button and a popover calendar to choose the date. Time is represented
 * with multiple TimePartInputs for hour, minute etc.
 * Uses DatePicker from v-calendar. See: https://vcalendar.io/
 */
export default {
  components: {
    CalendarIcon,
    TimePartInput,
    DatePicker,
  },
  props: {
    /**
     * @type Date - date time in UTC.
     */
    modelValue: {
      type: Date,
      required: true,
    },
    /**
     * @type String - id of the <input> element; can be used with Label component.
     */
    id: {
      type: String,
      default: null,
    },
    /**
     * Date format in unicode, only date not time!
     * @see https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
     */
    dateFormat: {
      type: String,
      default: "yyyy-MM-dd",
    },
    /**
     * Date time format in unicode, only time not date!
     * @see https://www.unicode.org/reports/tr35/tr35-dates.html#dfst-hour
     */
    timeFormat: {
      type: String,
      default: "HH:mm:ss",
    },
    min: {
      default: null,
      type: Date,
    },
    max: {
      default: null,
      type: Date,
    },
    /**
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
      default: true,
      type: Boolean,
    },
    showSeconds: {
      default: true,
      type: Boolean,
    },
    showMilliseconds: {
      default: false,
      type: Boolean,
    },
    showTime: {
      default: true,
      type: Boolean,
    },
    showDate: {
      default: true,
      type: Boolean,
    },
    required: {
      default: false,
      type: Boolean,
    },
    /**
     * @type String - tz db timezone name.
     * @see https://www.iana.org/time-zones / https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
     */
    timezone: {
      type: String,
      default: getLocalTimeZone(),
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      popoverIsVisible: false,
      isInvalid: false,
      isAfterMax: false,
      isBeforeMin: false,
      // last invalid entered value (for error message)
      invalidValue: null,
      // internal value guarded by watcher to prevent invalid values (min/max, null etc.)
      // time in the given timezone (default: browser local) for correct display
      localValue: new Date(""),
    };
  },
  computed: {
    clientOnlyComponent() {
      return resolveClientOnlyComponent();
    },
    legacyDateFormat() {
      // see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
      // this only works for simple patterns and turn the unicode format into the moment.js de-facto standard
      return this.dateFormat.toUpperCase();
    },
    dateTimeHours() {
      return this.localValue.getHours();
    },
    dateTimeMinutes() {
      return this.localValue.getMinutes();
    },
    dateTimeSeconds() {
      return this.localValue.getSeconds();
    },
    dateTimeMilliseconds() {
      return this.localValue.getMilliseconds();
    },
  },
  watch: {
    modelValue: {
      // validates against min/max and sets appropriate state
      handler(newValue) {
        // update internal value if min/max bounds are kept and value is valid
        this.checkMinMax(newValue);
        if (this.checkIsValid(newValue)) {
          // convert to zoned time
          this.localValue = utcToZonedTime(newValue, this.timezone);
        }
      },
      immediate: true,
    },
  },
  methods: {
    formatDate(date) {
      // time and date
      if (this.showTime && this.showDate) {
        return format(date, `${this.dateFormat} ${this.timeFormat}`);
      }
      // only time
      if (this.showTime) {
        return format(date, this.timeFormat);
      }
      // only date
      return format(date, this.dateFormat);
    },
    emitInput(value) {
      // check min/max
      this.checkMinMax(value);
      this.$emit("update:modelValue", zonedTimeToUtc(value, this.timezone));
    },
    onDatePickerInput(date) {
      this.emitInput(updateDate(this.localValue, date));
    },
    onTextInputChange($event, hidePopoverFunction) {
      // parse the input
      let date = parse($event.target.value, this.dateFormat, new Date());

      // ignore invalid or unparseable input
      if (!this.checkIsValid(date)) {
        date = this.localValue;
      }

      // use time set in value
      let value = updateDate(this.localValue, date);

      // hide popover (if open)
      hidePopoverFunction();

      // trigger input event which will set value again and update picker
      // and trigger validation even if the value did not change
      this.onDatePickerInput(value);
    },
    checkIsValid(date) {
      if (isValid(date)) {
        return true;
      }
      this.isInvalid = true;
      this.invalidValue = date;
      return false;
    },
    checkMinMax(date) {
      // skip check if no min and max is set
      if (!this.min && !this.max) {
        return true;
      }

      this.isBeforeMin = isBeforeMinDate(
        date,
        this.min,
        this.showDate,
        this.showTime
      );
      this.isAfterMax = isAfterMaxDate(
        date,
        this.max,
        this.showDate,
        this.showTime
      );

      if (this.isBeforeMin || this.isAfterMax) {
        this.invalidValue = date;
        return false;
      }
      return true;
    },
    onTimeHoursBounds(bounds) {
      // skip this handler if date is not shown
      if (!this.showDate) {
        return;
      }
      if (["min", "max"].includes(bounds.type)) {
        this.emitInput(setHours(new Date(this.localValue), bounds.input));
      } else {
        this.emitInput(this.localValue);
      }
    },
    onTimeMinutesBounds(bounds) {
      if (["min", "max"].includes(bounds.type)) {
        this.emitInput(setMinutes(new Date(this.localValue), bounds.input));
      } else {
        this.emitInput(this.localValue);
      }
    },
    onTimeSecondsBounds(bounds) {
      if (["min", "max"].includes(bounds.type)) {
        this.emitInput(setSeconds(new Date(this.localValue), bounds.input));
      } else {
        this.emitInput(this.localValue);
      }
    },
    onTimeMillisecondsBounds(bounds) {
      if (["min", "max"].includes(bounds.type)) {
        this.emitInput(
          setMilliseconds(new Date(this.localValue), bounds.input)
        );
      } else {
        this.emitInput(this.localValue);
      }
    },
    onTimeHoursChange(hours) {
      let date = new Date(this.localValue);
      if (Number.isSafeInteger(hours)) {
        date = setHours(date, hours);
      }
      this.emitInput(date);
    },
    onTimeMinutesChange(minutes) {
      let date = new Date(this.localValue);
      if (Number.isSafeInteger(minutes)) {
        date = setMinutes(date, minutes);
      }
      this.emitInput(date);
    },
    onTimeSecondsChange(seconds) {
      let date = new Date(this.localValue);
      if (Number.isSafeInteger(seconds)) {
        date = setSeconds(date, seconds);
      }
      this.emitInput(date);
    },
    onTimeMillisecondsChange(milliseconds) {
      let date = new Date(this.localValue);
      if (Number.isSafeInteger(milliseconds)) {
        date = setMilliseconds(date, milliseconds);
      }
      this.emitInput(date);
    },
    validate() {
      let isValid = true;
      let errorMessage;
      if (this.required && this.isInvalid) {
        isValid = false;
        errorMessage = "Please input a valid date";
      }
      if (this.isAfterMax) {
        isValid = false;
        // eslint-disable-next-line max-len
        errorMessage = `${this.formatDate(
          this.invalidValue
        )} is after maximum ${this.formatDate(this.max)}`;
      }
      if (this.isBeforeMin) {
        isValid = false;
        // eslint-disable-next-line max-len
        errorMessage = `${this.formatDate(
          this.invalidValue
        )} is before minimum ${this.formatDate(this.min)}`;
      }
      return {
        isValid,
        errorMessage,
      };
    },
  },
};
</script>

<template>
  <div class="date-time-input">
    <div v-if="showDate" class="date-picker">
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
            #default="{ inputValue, inputEvents, hidePopover, togglePopover }"
          >
            <div>
              <input
                :id="id"
                :value="inputValue"
                v-on="inputEvents"
                @change="onTextInputChange($event, hidePopover)"
                @blur="hidePopover"
              />
              <span
                :class="['button', { active: popoverIsVisible }]"
                @click="togglePopover"
              >
                <CalendarIcon />
              </span>
            </div>
          </template>
        </DatePicker>
      </Component>
      <span v-if="!isValid" class="invalid-marker" />
    </div>
    <div v-if="showTime" class="time">
      <TimePartInput
        ref="hours"
        type="integer"
        :min="0"
        :max="23"
        :min-digits="2"
        :model-value="dateTimeHours"
        @bounds="onTimeHoursBounds"
        @update:model-value="onTimeHoursChange"
      />
      <span class="time-colon">:</span>
      <TimePartInput
        ref="minutes"
        type="integer"
        :min="0"
        :max="59"
        :min-digits="2"
        :model-value="dateTimeMinutes"
        @bounds="onTimeMinutesBounds"
        @update:model-value="onTimeMinutesChange"
      />
      <span v-if="showSeconds" class="time-colon">:</span>
      <TimePartInput
        v-if="showSeconds"
        ref="seconds"
        type="integer"
        :min="0"
        :max="59"
        :min-digits="2"
        :model-value="dateTimeSeconds"
        @bounds="onTimeSecondsBounds"
        @update:model-value="onTimeSecondsChange"
      />
      <span v-if="showMilliseconds" class="time-colon">.</span>
      <TimePartInput
        v-if="showMilliseconds"
        ref="milliseconds"
        type="integer"
        :min="0"
        :max="999"
        :min-digits="3"
        :model-value="dateTimeMilliseconds"
        @bounds="onTimeMillisecondsBounds"
        @update:model-value="onTimeMillisecondsChange"
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
  width: auto;
  flex-wrap: wrap;

  & > div {
    margin-top: 10px;
  }

  /* time */
  & .time {
    display: flex;
    width: auto;
    flex-wrap: wrap;
    align-items: center;

    & :deep(.wrapper) {
      width: 5rem;
    }

    & .time-colon {
      padding: 5px;
    }

    & span {
      display: flex;
      width: auto;
      flex-wrap: nowrap;
    }
  }

  & .date-picker {
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

    & :deep(.vc-container) {
      /* remove roundness */
      --rounded: 0;
      --rounded-lg: 0;

      /* popover box shadow */
      --shadow-lg: 0 1px 4px 0 var(--theme-date-input-box-shadow-color);

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

      &.vc-masala {
        --accent-100: var(--masala-100);
        --accent-200: var(--masala-200);
        --accent-300: var(--masala-300);
        --accent-400: var(--masala-400);
        --accent-500: var(--masala-500);
        --accent-600: var(--masala-600);
        --accent-700: var(--masala-700);
        --accent-800: var(--masala-800);
        --accent-900: var(--masala-900);
      }

      /* not themed items */
      & .vc-day-content:hover {
        background: var(--theme-date-input-day-content-background);
      }

      /* non "color" prop colors which are used regardless of color prop value */
      --white: var(--theme-date-input-white);
      --black: var(--theme-date-input-black);

      --gray-100: var(--theme-date-input-gray-100);
      --gray-200: var(--theme-date-input-gray-200);
      --gray-300: var(--theme-date-input-gray-300);
      --gray-400: var(--theme-date-input-gray-400);
      --gray-500: var(--theme-date-input-gray-500);
      --gray-600: var(--theme-date-input-gray-600);
      --gray-700: var(--theme-date-input-gray-700);
      --gray-800: var(--theme-date-input-gray-800);
      --gray-900: var(--theme-date-input-gray-900);
    }

    /* -- end v-calendar 'theme' */

    /* input wrapper style */
    max-width: 9rem;
    min-width: 7.5rem;
    margin-right: 20px;
    position: relative;
    border: 1px solid var(--theme-date-input-border-color);

    &:focus-within {
      border-color: var(--theme-date-input-border-focus-color);
    }

    & input {
      font-size: 13px;
      font-weight: 300;
      letter-spacing: inherit;
      height: 40px;
      line-height: normal;
      border: 0;
      margin: 0;
      padding: 0 10px;
      border-radius: 0;
      width: calc(100% - 32px);
      outline: none;
      background-color: var(--theme-date-input-input-background);

      /* css3 invalid state */
      &:invalid {
        box-shadow: none; /* override default browser styling */
      }

      &:hover:not(:focus) {
        background-color: var(--theme-date-input-input-hover-background);
      }
    }

    & .invalid-marker {
      position: absolute;
      display: block;
      width: 3px;
      left: -1px;
      top: 0;
      bottom: 0;
      z-index: 1;
      background-color: var(--theme-color-error);
    }

    & .button {
      position: absolute;
      z-index: 1;
      width: 32px;
      height: 40px;
      padding-left: 10px;
      padding-right: 9px;
      cursor: pointer;

      &:hover {
        background-color: var(--theme-date-input-input-hover-background);
      }

      & svg {
        width: 100%;
        height: 100%;
        stroke-width: 1.5px;
      }
    }

    & .button:active,
    & .button.active {
      color: var(--theme-date-input-white);
      background-color: var(--theme-date-input-button-active-color);

      & svg {
        stroke: var(--theme-date-input-white);
      }
    }
  }
}
</style>
