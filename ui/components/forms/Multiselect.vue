<script>
import Checkbox from '../forms/Checkbox';
import DropdownIcon from '../../assets/img/icons/arrow-dropdown.svg?inline';
import { mixin as clickaway } from 'vue-clickaway';

export default {
    components: {
        Checkbox,
        DropdownIcon
    },
    mixins: [clickaway],
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
        closeOptions() {
            this.collapsed = true;
        },
        showOptions() {
            this.collapsed = false;
        }
    }
};
</script>

<template>
  <div
    v-on-clickaway="closeOptions"
    :class="['multiselect', { collapsed, invalid: !isValid }]"
    @keydown.esc.prevent="closeOptions"
  >
    <div
      role="button"
      tabindex="0"
      :class="{ placeholder: !checkedValue.length }"
      @click="toggle"
      @keydown.esc.prevent="closeOptions"
      @keydown.enter.prevent="showOptions"
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
    transition: transform 0.4s ease-in-out;
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
