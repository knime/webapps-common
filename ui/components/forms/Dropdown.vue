<script>
import DropdownIcon from '../../assets/img/icons/arrow-dropdown.svg?inline';
import Vue from 'vue';
import { mixin as clickaway } from 'vue-clickaway';

let count = 0;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_HOME = 36;
const KEY_END = 35;
const KEY_ESC = 27;
const KEY_ENTER = 13;

export default {
    components: {
        DropdownIcon
    },
    mixins: [clickaway],
    props: {
        id: {
            type: String,
            default() {
                return `Dropdown-${count++}`;
            }
        },
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: null
        },
        ariaLabel: {
            type: String,
            required: true
        },
        isValid: {
            default: true,
            type: Boolean
        },
        /**
         * List of possible values. Each item must have an `id` and a `text` property
         * @example
         * [{
         *   id: 'pdf',
         *   text: 'PDF'
         * }, {
         *   id: 'XLS',
         *   text: 'Excel',
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
        }
    },
    data() {
        return {
            isExpanded: false
        };
    },
    computed: {
        selectedIndex() {
            return this.possibleValues.map(x => x.id).indexOf(this.value);
        },
        showPlaceholder() {
            return !this.value;
        },
        displayTextMap() {
            let map = {};
            for (let value of this.possibleValues) {
                map[value.id] = value.text;
            }
            return map;
        },
        displayText() {
            if (this.showPlaceholder) {
                return this.placeholder;
            } else if (this.displayTextMap.hasOwnProperty(this.value)) {
                return this.displayTextMap[this.value];
            } else {
                return `(MISSING) ${this.value}`;
            }
        }
    },
    methods: {
        isCurrentValue(candidate) {
            return this.value === candidate;
        },
        setSelected(value) {
            consola.trace('ListBox setSelected on', value);

            /**
             * Fired when the selection changes.
             *
             * @event input
             * @type {String}
             */
            this.$emit('input', value);
        },
        onOptionClick(value) {
            this.setSelected(value);
            this.isExpanded = false;
            this.$refs.button.focus();
        },
        scrollTo(optionIndex) {
            let listBoxNode = this.$refs.ul;
            if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
                let element = this.$refs.options[optionIndex];
                let scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
                let elementBottom = element.offsetTop + element.offsetHeight;
                if (elementBottom > scrollBottom) {
                    listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
                } else if (element.offsetTop < listBoxNode.scrollTop) {
                    listBoxNode.scrollTop = element.offsetTop;
                }
            }
        },
        onArrowDown() {
            let next = this.selectedIndex + 1;
            if (next >= this.possibleValues.length) {
                return;
            }
            this.setSelected(this.possibleValues[next].id);
            this.scrollTo(next);
        },
        onArrowUp() {
            let next = this.selectedIndex - 1;
            if (next < 0) {
                return;
            }
            this.setSelected(this.possibleValues[next].id);
            this.scrollTo(next);
        },
        onEndKey() {
            let next = this.possibleValues.length - 1;
            this.setSelected(this.possibleValues[next].id);
            this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
        },
        onHomeKey() {
            let next = 0;
            this.setSelected(this.possibleValues[next].id);
            this.$refs.ul.scrollTop = 0;
        },
        toggleExpanded() {
            this.isExpanded = !this.isExpanded;
            if (this.isExpanded) {
                Vue.nextTick(() => this.$refs.ul.focus());
            }
        },
        handleKeyDownList(e)  {
            /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
            if (e.keyCode === KEY_DOWN) {
                this.onArrowDown();
                e.preventDefault();
            }
            if (e.keyCode === KEY_UP) {
                this.onArrowUp();
                e.preventDefault();
            }
            if (e.keyCode === KEY_END) {
                this.onEndKey();
                e.preventDefault();
            }
            if (e.keyCode === KEY_HOME) {
                this.onHomeKey();
                e.preventDefault();
            }
            if (e.keyCode === KEY_ESC) {
                this.isExpanded = false;
                this.$refs.ul.blur();
                e.preventDefault();
            }
            if (e.keyCode === KEY_ENTER) {
                this.isExpanded = false;
                this.$refs.button.focus();
                e.preventDefault();
            }
        },
        handleKeyDownButton(e) {
            if (e.keyCode === KEY_ENTER) {
                this.toggleExpanded();
                e.preventDefault();
            }
            if (e.keyCode === KEY_DOWN) {
                this.onArrowDown();
                e.preventDefault();
            }
            if (e.keyCode === KEY_UP) {
                this.onArrowUp();
                e.preventDefault();
            }
        },
        hasSelection() {
            return this.selectedIndex >= 0;
        },
        getCurrentSelectedId() {
            try {
                return this.possibleValues[this.selectedIndex].id;
            } catch (e) {
                return '';
            }
        },
        generateId(node, itemId) {
            if (!itemId) {
                return `${node}-${this.id}`;
            }
            let cleanId = String(itemId).replace(/[^\w]/gi, '');
            return `${node}-${this.id}-${cleanId}`;
        },
        clickAway() {
            this.isExpanded = false;
        }
    }
};
</script>

<template>
  <div
    v-on-clickaway="clickAway"
    :class="['dropdown' , { collapsed: !isExpanded, invalid: !isValid }]"
  >
    <div
      :id="generateId('button')"
      ref="button"
      role="button"
      tabindex="0"
      aria-haspopup="listbox"
      :class="{'placeholder': showPlaceholder}"
      :aria-label="ariaLabel"
      :aria-labelledby="generateId('button')"
      :aria-expanded="isExpanded"
      @click="toggleExpanded"
      @keydown="handleKeyDownButton"
    >
      {{ displayText }}
      <DropdownIcon class="icon" />
    </div>
    <ul
      v-show="isExpanded"
      ref="ul"
      role="listbox"
      tabindex="-1"
      :aria-activedescendant="isExpanded ? generateId('option', getCurrentSelectedId()) : false"
      @keydown="handleKeyDownList"
    >
      <li
        v-for="item of possibleValues"
        :id="generateId('option', item.id)"
        :key="`listbox-${item.id}`"
        ref="options"
        role="option"
        :title="item.text"
        :class="{ 'focused': isCurrentValue(item.id), 'noselect': true }"
        :aria-selected="isCurrentValue(item.id)"
        @click="onOptionClick(item.id)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.dropdown {
  position: relative;

  & .placeholder {
    color: var(--knime-stone-gray);
  }

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
    border: 1px solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    height: 40px;
    line-height: 40px; /* to center text vertically */
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--theme-text-normal-font-family);
    color: var(--theme-text-normal-color);

    &:focus {
      border-color: var(--knime-masala);
      outline: none;
    }
  }

  &:not(.collapsed) [role=button] {
    border-color: var(--knime-masala);
  }

  &.collapsed:hover {
    background: var(--knime-silver-sand-semi);
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

  /* this selector is required to override some * rules interfere (overflow) - so do not simplify */
  & [role="listbox"] {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    z-index: 20;
    max-height: calc(22px * 7); /* show max 7 items */
    font-size: 14px;
    min-height: 22px;
    width: 100%;
    padding: 0;
    margin: 0;
    margin-top: -1px;
    background: var(--knime-white);
    box-shadow: 0 1px 5px 0 var(--knime-gray-dark);

    &:focus {
      outline: none;
      border-color: var(--knime-masala);
    }
  }

  & [role="option"] {
    display: block;
    width: 100%;
    padding: 0 10px 0 10px;
    line-height: 22px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    background: var(--theme-dropdown-background-color);
    color: var(--theme-dropdown-foreground-color);

    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);
    }

    &.focused {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);
    }
  }

  & .noselect {
    user-select: none;
  }
}
</style>
