<script>
import Checkbox from '../forms/Checkbox';
import DropdownIcon from '../../assets/img/icons/arrow-dropdown.svg?inline';

export default {
    components: {
        Checkbox,
        DropdownIcon
    },
    props: {
        possibleValues: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        },
        textFormattingFn: {
            type: Function,
            default: text => text
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
            return this.checkedValue.length > 0
                ? Object.keys(this.possibleValues)
                    .map((key) => { 
                        if (this.checkedValue.indexOf(key) > -1) {
                            return this.textFormattingFn(key).toString();
                            // return `.${  key.toLowerCase()}`;
                        }
                    })
                    .filter(option => option)
                    .join(', ')
                : this.title;
        }
    },
    methods: {
        onChange(value, toggled) {
            if (toggled) {
                if (this.checkedValue.indexOf(value) === -1) {
                    this.checkedValue.push(value);
                }
            } else {
                this.checkedValue = this.checkedValue.filter(x => x !== value);
            }
            consola.trace('Multiselect value changed to', this.checkedValue);
            /**
             * Update event. Fired when a checkbox is clicked.
             *
             * @event input
             * @type {Array}
             */
            this.$emit('input', this.checkedValue);
        },
        toggle() {
            this.collapsed = !this.collapsed;
        }
    }
};
</script>

<template>
  <div :class="['multiselect', { collapsed }]">
    <h6 @click="toggle">{{ optionText }}</h6>
    <DropdownIcon class="icon" />
    <div
      v-show="!collapsed"
      class="options"
    >
      <Checkbox
        v-for="(label, value) of possibleValues"
        :key="`multiselect-${value}`"
        :value="checkedValue.indexOf(value) > -1"
        @input="onChange(value, $event)"
      >
        {{ label }}
      </Checkbox>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@import "webapps-common/ui/css/variables";

.multiselect {
  position: relative;

  &:not(.collapsed),
  &:hover {
    box-shadow: 0 1px 4px 0 var(--theme-color-gray-dark-semi);
  }
}

h6 {
  margin: 0;
  background: var(--theme-color-porcelain);
  padding: 10px 38px 10px 10px;
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  width: 18px;
  height: 18px;
  stroke-width: calc(32px / 18);
  position: absolute;
  right: 10px;
  top: 10px;
  pointer-events: none;
}

.multiselect:not(.collapsed) .icon {
  transform: scale(-1);
}

.options {
  position: absolute;
  width: 100%;
  padding: 5px 10px 0;
  background: var(--theme-color-white);
  box-shadow: 0 2px 4px 0 var(--theme-color-gray-dark-semi);

  & >>> label {
    display: block;
  }
}
</style>
