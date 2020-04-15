<script>
import Checkbox from '../forms/Checkbox';
import DropdownIcon from '../../assets/img/icons/arrow-dropdown.svg?inline';

const BLUR_TIMEOUT = 50;

export default {
    components: {
        Checkbox,
        DropdownIcon
    },
    props: {
        /**
         * List of possible values. Each item must have an `id` and a `text` property, and optionally a `selectedText`
         * property that is used for displaying the list of selected items. If it is omitted, `text` is used instead.
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
            default: true,
            type: Boolean
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
         * @returns {Array} - HTML elements to use for focus and events.
         */
        focusOptions() {
            return this.$refs.option.map(el => el.$el && el.$el.firstChild);
        },
        optionText() {
            if (this.checkedValue.length === 0) {
                return this.placeholder;
            }
            return this.possibleValues
                .filter(({ id }) => this.checkedValue.indexOf(id) > -1)
                .map(({ text, selectedText = text }) => selectedText)
                .join(', ');
        }
    },
    watch: {
        value(newValue) {
            this.checkedValue = newValue;
        }
    },
    methods: {
        /**
         * Returns the next HTML element from the list of options. If the current focused element is at an end of
         * the list (either first [0], or last [focusOptions.length - 1]) this method will return the the opposite
         * end ([focusOptions.length - 1] or [0] respectively).
         *
         * @param {Number} changeInd - the positive or negative index shift for the next element (usually 1 || -1).
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
        },
        isChecked(itemId) {
            return this.checkedValue.indexOf(itemId) > -1;
        },
        /**
         * Handle closing the options.
         *
         * @param {Boolean} [refocusToggle = true] - if the toggle button should
         *    be re-focused after closing.
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
                if (this.focusOptions.indexOf(document.activeElement) === -1) {
                    this.closeOptions(false);
                }
            }, BLUR_TIMEOUT);
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
  >
    <div
      ref="toggle"
      role="button"
      tabindex="0"
      :class="{ placeholder: !checkedValue.length }"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      {{ optionText }}
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
        class="boxes"
        @input="onInput(item.id, $event)"
      >
        {{ item.text }}
      </Checkbox>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@import "webapps-common/ui/css/variables";

.multiselect {
  position: relative;

  &.invalid::before {
    content: '';
    position: absolute;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    background-color: var(--theme-color-error);
  }

  & [role=button] {
    margin: 0;
    border: 1px solid var(--theme-color-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    font-weight: 300;
    height: 40px;
    line-height: 40px; /* to center text vertically */
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--theme-color-masala);

    &.placeholder {
      color: var(--theme-color-dove-gray);
    }

    &:focus {
      outline: none;
      border-color: var(--theme-color-masala);
    }
  }

  &:not(.collapsed) [role=button] {
    border-color: var(--theme-color-masala);
  }

  &.collapsed:hover {
    background: var(--theme-color-silver-sand-semi);
  }

  & .icon {
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
    stroke: var(--theme-color-masala);
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
    z-index: 20;
    width: 100%;
    padding: 5px 10px;
    margin-top: -1px;
    background: var(--theme-color-white);
    box-shadow: 0 1px 4px 0 var(--theme-color-gray-dark-semi);

    & .boxes {
      display: block;
    }
  }
}

</style>
