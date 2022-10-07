<script>
import Checkbox from '../forms/Checkbox.vue';
import DropdownIcon from '../../assets/img/icons/arrow-dropdown.svg';

const BLUR_TIMEOUT = 1;

export default {
    components: {
        Checkbox,
        DropdownIcon
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
                return values.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('text'));
            }
        },
        /**
         * selected value (which is a list of ids of entries)
         */
        value: {
            type: Array,
            default: () => []
        },
        /**
         * placeholder to be displayed when nothing is selected
         */
        placeholder: {
            type: String,
            default: null
        },
        isValid: {
            type: Boolean,
            default: true
        },
        /**
         * Seperator which seperates selected items in the summary.
         */
        separator: {
            type: String,
            default: ', '
        },
        /**
         * Max number of items that will be displayed in the summary.
         */
        summaryMaxItemCount: {
            type: Number,
            default: Infinity
        },
        /**
         * Name that will be used if summaryMaxItemCount is exceeded.
         */
        summaryName: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            checkedValue: this.value,
            collapsed: true
        };
    },
    computed: {
        /**
         * @returns {Array<Element>} - HTML Elements to use for focus and events.
         */
        focusOptions() {
            return this.$refs.option.map(el => el.$el && el.$el.firstChild);
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
        }
    },
    watch: {
        value(newValue) {
            this.checkedValue = newValue;
        }
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
            return this.focusOptions[this.focusOptions.indexOf(document.activeElement) + changeInd] || (changeInd < 0
                ? this.focusOptions[this.focusOptions.length - 1]
                : this.focusOptions[0]);
        },
        onInput(value, toggled) {
            if (toggled) {
                if (this.checkedValue.indexOf(value) === -1) {
                    this.checkedValue.push(value);
                }
            } else {
                this.checkedValue = this.checkedValue.filter(x => x !== value);
            }
            consola.trace('Multiselect value changed to', this.checkedValue);

            /**
             * Fired when the selection changes.
             *
             * @event input
             * @type {Array}
             */
            this.$emit('input', this.checkedValue);
        },
        toggle() {
            this.collapsed = !this.collapsed;
            setTimeout(() => {
                this.$refs.toggle.focus();
            }, BLUR_TIMEOUT);
        },
        isChecked(itemId) {
            return this.checkedValue.includes(itemId);
        },
        /**
         * Handle closing the options.
         *
         * @param {Boolean} [refocusToggle = true] - if the toggle button should be re-focused after closing.
         * @return {undefined}
         */
        closeOptions(refocusToggle = true) {
            this.collapsed = true;
            if (refocusToggle) {
                setTimeout(() => {
                    this.$refs.toggle.focus();
                }, BLUR_TIMEOUT);
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
                if (!this.focusOptions.includes(document.activeElement)) {
                    this.closeOptions(false);
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
        }
    }
};
</script>

<template>
  <div
    :class="['multiselect', { collapsed, invalid: !isValid }]"
    @keydown.esc.stop.prevent="closeOptions"
    @keydown.up.stop.prevent="onUp"
    @keydown.down.stop.prevent="onDown"
    @focusout.stop="onFocusOut"
    @mousedown="onMousedown"
  >
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
    <div
      v-show="!collapsed"
      class="options"
    >
      <Checkbox
        v-for="item of possibleValues"
        ref="option"
        :key="`multiselect-${item.id}`"
        :value="isChecked(item.id)"
        :disabled="item.disabled"
        class="boxes"
        @input="onInput(item.id, $event)"
      >
        {{ item.text }}
      </Checkbox>
      <slot name="selectAction" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.multiselect {
  position: relative;

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
    border: 1px solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    font-weight: 300;
    height: 40px;
    line-height: 40px; /* to center text vertically */
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.placeholder {
      color: var(--knime-dove-gray);
    }

    &:focus {
      outline: none;
      border-color: var(--knime-masala);
    }
  }

  &:not(.collapsed) [role="button"] {
    border-color: var(--knime-masala);
  }

  &.collapsed:hover {
    background: var(--theme-multiselect-background-color-hover);
  }

  & .icon {
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
    stroke: var(--knime-masala);
    position: absolute;
    right: 10px;
    top: 11px;
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
    padding: 5px 10px;
    margin-top: -1px;
    background: var(--theme-multiselect-background-color);
    box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);

    & .boxes {
      display: block;
    }
  }
}

</style>
