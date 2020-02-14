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
            default: ''
        }
    },
    data() {
        return {
            collapsed: true
        };
    },
    computed: {
        optionText() {
            if (this.value.length === 0) {
                return this.placeholder;
            }
            return this.possibleValues
                .filter(({ id }) => this.value.indexOf(id) > -1)
                .map(({ text, selectedText = text }) => selectedText)
                .join(', ');
        }
    },
    methods: {
        onInput(value, toggled) {
            let checkedValue = Array.from(this.value);
            if (toggled) {
                if (checkedValue.indexOf(value) === -1) {
                    checkedValue.push(value);
                }
            } else {
                checkedValue = checkedValue.filter(x => x !== value);
            }
            consola.trace('Multiselect value changed to', checkedValue);

            /**
             * Fired when the selection changes.
             *
             * @event input
             * @type {Array}
             */
            this.$emit('input', checkedValue);
        },
        toggle() {
            this.collapsed = !this.collapsed;
        },
        isChecked(itemId) {
            return this.value.indexOf(itemId) > -1;
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
    :class="['multiselect', { collapsed }]"
    @keydown.esc.prevent="closeOptions"
  >
    <div
      role="button"
      tabindex="0"
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

    &:focus {
      outline: none;
      border-color: var(--theme-color-masala);
    }
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
    position: absolute;
    right: 10px;
    top: 11px;
    pointer-events: none;
  }

  &:not(.collapsed) .icon {
    transform: scale(-1);
  }

  & .options {
    position: absolute;
    width: 100%;
    padding: 5px 10px;
    background: var(--theme-color-white);
    box-shadow: 0 2px 4px 0 var(--theme-color-gray-dark-semi);

    & .boxes {
      display: block;
    }
  }
}

</style>
