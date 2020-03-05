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
            default: ''
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
            selectedIndex: 0,
            isExpanded: false
        };
    },
    computed: {
        displayTextMap() {
            let map = {};
            for (let value of this.possibleValues) {
                map[value.id] = value.text;
            }
            return map;
        }
    },
    mounted() {
        // update the selected index on start
        this.selectedIndex = this.possibleValues.map(x => x.id).indexOf(this.value);
    },
    methods: {
        isCurrentValue(candidate) {
            return this.value === candidate;
        },
        setSelected(value, index) {
            consola.trace('ListBox setSelected on', value);
            this.selectedIndex = index;

            /**
             * Fired when the selection changes.
             *
             * @event input
             * @type {String}
             */
            this.$emit('input', value);
        },
        onOptionClick(value, index) {
            this.setSelected(value, index);
            this.isExpanded = false;
            this.$refs.button.focus();
        },
        scrollToCurrent() {
            let listBoxNode = this.$refs.ul;
            if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
                let element = this.$refs.options[this.selectedIndex];
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
            this.setSelected(this.possibleValues[next].id, next);
            this.scrollToCurrent();
        },
        onArrowUp() {
            let next = this.selectedIndex - 1;
            if (next < 0) {
                return;
            }
            this.setSelected(this.possibleValues[next].id, next);
            this.scrollToCurrent();
        },
        onEndKey() {
            let next = this.possibleValues.length - 1;
            this.setSelected(this.possibleValues[next].id, next);
            this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
        },
        onHomeKey() {
            let next = 0;
            this.setSelected(this.possibleValues[next].id, next);
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
        showPlaceholder(value) {
            return this.displayTextMap.hasOwnProperty(value);
        },
        displayText(value) {
            if (this.displayTextMap.hasOwnProperty(value)) {
                return this.displayTextMap[value];
            } else {
                return this.placeholder;
            }
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
      {{ displayText(value) }}
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
        v-for="(item, index) of possibleValues"
        :id="generateId('option', item.id)"
        :key="`listbox-${item.id}`"
        ref="options"
        role="option"
        :class="{ 'focused': isCurrentValue(item.id), 'noselect': true }"
        :aria-selected="isCurrentValue(item.id)"
        @click="onOptionClick(item.id, index)"
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

  &.placeholder {
    color: var(--theme-color-stone-gray);
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
    border: 1px solid var(--theme-color-stone-gray);
    padding: 10px 38px 10px 10px;
    font-size: 13px;
    height: 40px;
    line-height: 19px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & [role=button]:focus {
    border-color: var(--theme-color-masala);
    outline: none;
  }

  &:not(.collapsed) [role=button] {
    border-color: var(--theme-color-masala);
  }

  &.collapsed:hover {
    background: var(--theme-color-porcelain);
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
    transition: transform 0.4s ease-in-out;
  }

  &:not(.collapsed) .icon {
    transform: scaleY(-1);
  }

  /* this selector is required to override some * rules interfere (overflow) - so do not simplify */
  & [role="listbox"] {
    overflow-y: auto;
    position: absolute;
    z-index: 20;
    max-height: calc(24px * 7); /* show max 7 items */
    font-size: 14px;
    min-height: 24px;
    min-width: 100%;
    max-width: 50vw;
    padding: 8px 0;
    margin: 0;
    background: var(--theme-color-white);
    box-shadow: 0 2px 4px 0 var(--theme-color-gray-dark-semi);
  }

  & [role="listbox"]:focus {
    outline: none;
    border-color: var(--theme-color-masala);
  }

  & [role="option"] {
    display: inline-block;
    min-width: 100%;
    padding: 0 10px 0 10px;
    line-height: 24px;
    position: relative;
  }

  & [role="option"]:hover {
    background: var(--theme-color-porcelain);
  }

  & [role="option"].focused {
    background: var(--theme-color-masala);
    color: var(--theme-color-white);
  }

  & .noselect {
    user-select: none;
  }
}

</style>
