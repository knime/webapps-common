<script>
import "./variables.css";
import Checkbox from "../forms/Checkbox.vue";
import DropdownIcon from "../../assets/img/icons/arrow-dropdown.svg";
import { useActiveElement } from "@vueuse/core";

const BLUR_TIMEOUT = 1;
const BOXES_HEIGHT = 28.5; // 22.5px for the checkbox label and 2 * 3px for vertical padding of a single option
// vertical padding, 5px for either top/bottom of the options wrapper and 3px either top/bottom of a single option
const OPTIONS_WRAPPER_VERT_PAD = 8;

export default {
  components: {
    Checkbox,
    DropdownIcon,
  },
  props: {
    /**
     * List of possible values. Each item must have an `id` and a `text` property. Optionally it can have:
     * - `selectedText` property that is used for displaying the list of selected items.
     *   If it is omitted, `text` is used instead.
     * - `disabled` property for disabling the corresponding checkbox so that the user can not change the value.
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     *   selectedText: '.xls'
     * }]
     */
    possibleValues: {
      type: Array,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    /**
     * selected value (which is a list of ids of entries)
     */
    modelValue: {
      type: Array,
      default: () => [],
    },
    /**
     * placeholder to be displayed when nothing is selected
     */
    placeholder: {
      type: String,
      default: null,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    /**
     * Seperator which seperates selected items in the summary.
     */
    separator: {
      type: String,
      default: ", ",
    },
    /**
     * Max number of items that will be displayed in the summary.
     */
    summaryMaxItemCount: {
      type: Number,
      default: Infinity,
    },
    /**
     * Name that will be used if summaryMaxItemCount is exceeded.
     */
    summaryName: {
      type: String,
      default: null,
    },
    /**
     * Use a custom list box (slot: 'listBox') that replaces the standard Multiselect element containing the button
     * to toggle the dropdown and the summary
     */
    useCustomListBox: {
      type: Boolean,
      default: false,
    },
    /**
     * Limit the number of visible options (more options are reachable by scrolling)
     */
    sizeVisibleOptions: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0;
      },
    },
    /**
     * Focus element of the parent for which the options don't get closed when it is focussed.
     */
    parentFocusElement: {
      type: Object,
      default: () => ({}),
    },
    /**
     * The element of the parent to refocus when the options get closed and using a custom listbox.
     */
    parentRefocusElementOnClose: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Close the dropdown when a value was selected.
     */
    closeDropdownOnSelection: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "focusOutside"],
  setup() {
    const activeElement = useActiveElement();
    return { activeElement };
  },
  data() {
    return {
      checkedValue: this.modelValue,
      collapsed: true,
      focusOptions: [],
    };
  },
  computed: {
    focusElements() {
      return [...this.focusOptions, this.parentFocusElement];
    },
    summary() {
      if (this.checkedValue.length === 0) {
        return this.placeholder;
      }

      if (this.checkedValue.length > this.summaryMaxItemCount) {
        return `${this.checkedValue.length} ${this.summaryName}`;
      }

      return this.possibleValues
        .filter(({ id }) => this.checkedValue.indexOf(id) > -1)
        .map(({ text, selectedText = text }) => selectedText)
        .join(this.separator);
    },
    showOptions() {
      return !this.collapsed && this.possibleValues.length > 0;
    },
    useSpecificOptionsHeight() {
      return (
        this.sizeVisibleOptions > 0 &&
        this.sizeVisibleOptions < this.possibleValues.length
      );
    },
    optionsHeight() {
      return this.useSpecificOptionsHeight
        ? {
            "max-height": `${
              this.sizeVisibleOptions * BOXES_HEIGHT + OPTIONS_WRAPPER_VERT_PAD
            }px`,
          }
        : {};
    },
    refocusElementOnClose() {
      return this.useCustomListBox
        ? this.parentRefocusElementOnClose
        : this.$refs.toggle;
    },
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.checkedValue = newValue;
      },
      deep: true,
    },
  },
  mounted() {
    this.updateFocusOptions();
  },
  methods: {
    /**
     * Returns the next HTML Element from the list of items. If the current focused Element is at the top or bottom
     * of the list, this method will return the opposite end.
     *
     * @param {Number} changeInd - the positive or negative index shift for the next Element (usually 1 || -1).
     * @returns {Element} - the next option Element in the list of options.
     */
    getNextElement(changeInd) {
      return (
        this.focusOptions[
          this.focusOptions.indexOf(this.activeElement) + changeInd
        ] ||
        (changeInd < 0
          ? this.focusOptions[this.focusOptions.length - 1]
          : this.focusOptions[0])
      );
    },
    onUpdateModelValue(value, toggled) {
      if (toggled) {
        if (this.checkedValue.indexOf(value) === -1) {
          this.checkedValue.push(value);
        }
      } else {
        this.checkedValue = this.checkedValue.filter((x) => x !== value);
      }
      consola.trace("Multiselect value changed to", this.checkedValue);

      /**
       * Fired when the selection changes.
       */
      this.$emit("update:modelValue", this.checkedValue);
      if (this.closeDropdownOnSelection) {
        this.closeOptions();
      }
    },
    toggle() {
      this.collapsed = !this.collapsed;
      setTimeout(() => {
        this.$refs.toggle?.focus();
      }, BLUR_TIMEOUT);
    },
    isChecked(itemId) {
      return this.checkedValue.includes(itemId);
    },
    /**
     * Handle closing the options.
     *
     * @param {Boolean} [refocusToggle = true] - if the toggle button / parentRefocusElement should be re-focused
     * after closing.
     * @return {undefined}
     */
    closeOptions(refocusToggle = true) {
      this.collapsed = true;
      if (refocusToggle) {
        setTimeout(() => {
          this.refocusElementOnClose.focus();
        }, BLUR_TIMEOUT);
      }
    },
    /**
     * Handle closing the options if necessary and stopping the event if so.
     *
     * @param {KeyboardEvent} event - the keyboard "Escape" event triggering the close.
     * @return {undefined}
     */
    closeOptionsAndStop(event) {
      if (!this.collapsed) {
        this.closeOptions();
        event.stopPropagation();
        event.preventDefault();
      }
    },
    /* Handle arrow key "up" events. */
    onUp() {
      if (document.activeElement === this.$refs.toggle) {
        return;
      }
      this.getNextElement(-1).focus();
    },
    /* Handle arrow key "down" events. */
    onDown() {
      this.getNextElement(1).focus();
    },
    /* Handle focus leaving events.
     *
     * NOTE: focusout bubbles, so we can use this event to close options.
     */
    onFocusOut() {
      setTimeout(() => {
        if (!this.focusElements.includes(document.activeElement)) {
          this.closeOptions(false);
          if (this.useCustomListBox) {
            this.$emit("focusOutside");
          }
        }
      }, BLUR_TIMEOUT);
    },
    /*
     * Manually prevents default event bubbling and propagation for mousedown which can fire blur events that
     * interfere with the refocusing behavior. This allows the timeout to be set extremely low.
     */
    onMousedown(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    },
    /*
     * Update focus options when possibleValues change to adapt keyboard navigation (e.g using ComboBox.vue)
     * $refs are unordered, suggested solution is to use a data-index
     * https://github.com/vuejs/vue/issues/4952#issuecomment-407550765
     */
    updateFocusOptions() {
      if (this.$refs.option) {
        this.focusOptions = this.$refs.option
          .sort(
            (option1, option2) =>
              parseInt(option1.$el.dataset.index, 10) -
              parseInt(option2.$el.dataset.index, 10),
          )
          .map((el) => el.$el && el.$el.firstChild);
      }
    },
  },
};
</script>

<template>
  <div
    ref="multiselect"
    :class="['multiselect', { collapsed, invalid: !isValid }]"
    @keydown.esc="closeOptionsAndStop"
    @keydown.up.stop.prevent="onUp"
    @keydown.down.stop.prevent="onDown"
    @focusout.stop="onFocusOut"
    @mousedown="onMousedown"
  >
    <slot v-if="useCustomListBox" name="listBox" />
    <div v-else>
      <div
        ref="toggle"
        role="button"
        tabindex="0"
        :class="{ placeholder: !checkedValue.length }"
        @click="toggle"
        @keydown.space.prevent="toggle"
      >
        {{ summary }}
      </div>
      <DropdownIcon class="icon" />
    </div>
    <div v-show="showOptions" class="options" :style="optionsHeight">
      <Checkbox
        v-for="(item, index) of possibleValues"
        ref="option"
        :key="`multiselect-${item.id}`"
        :data-index="index"
        :model-value="isChecked(item.id)"
        :disabled="item.disabled"
        class="boxes"
        @update:model-value="onUpdateModelValue(item.id, $event)"
      >
        {{ item.text }}
      </Checkbox>
      <slot name="selectAction" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
@import url("../../css/mixins.css");

.multiselect {
  position: relative;
  background-color: var(--knime-white);

  & label {
    &:hover {
      background-color: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
    }

    &:focus-within {
      background-color: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
      box-shadow: none;

      &:deep(input) {
        outline: none;
      }
    }
  }

  &.invalid::after {
    content: "";
    position: absolute;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
  }

  & [role="button"] {
    margin: 0;
    border: var(--form-border-width) solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    font-weight: 300;
    height: var(--single-line-form-height);
    line-height: var(--single-line-form-height); /* to center text vertically */
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.placeholder {
      color: var(--knime-dove-gray);
    }

    &:focus {
      outline: none;
    }
  }

  &:not(.collapsed) [role="button"] {
    border-color: var(--knime-masala);
  }

  &:focus-within [role="button"] {
    @mixin focus-style;
  }

  &.collapsed:hover:not(:focus-within) {
    background: var(--theme-multiselect-background-color-hover);
  }

  & .icon {
    --icon-size: 18px;

    width: var(--icon-size);
    height: var(--icon-size);
    stroke-width: calc(32px / 18);
    stroke: var(--knime-masala);
    position: absolute;
    right: 10px;
    top: calc((var(--single-line-form-height) - var(--icon-size)) / 2);
    pointer-events: none;
    transition: transform 0.2s ease-in-out;
  }

  &:not(.collapsed) .icon {
    transform: scaleY(-1);
  }

  & .options {
    position: absolute;
    z-index: var(--z-index-common-multiselect-expanded, 2);
    width: 100%;
    padding: 5px 0;
    background: var(--theme-multiselect-background-color);
    box-shadow: var(--shadow-elevation-1);
    overflow-y: auto;
    margin-top: 1px;

    & :deep(span) {
      padding-left: 28px;

      &::before {
        left: 10px;
      }

      &::after {
        left: 9px !important;
      }
    }

    & .boxes {
      display: block;
    }
  }
}
</style>
