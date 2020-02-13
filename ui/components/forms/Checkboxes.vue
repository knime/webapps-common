<script>
import Checkbox from '../forms/Checkbox';

export default {
    components: {
        Checkbox
    },
    props: {
        /**
         * List of possible values. Each item must have an `id` and a `text` property.
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
        },
        /**
         * Controls the alignment of the RadioButtons
         */
        alignment: {
            type: String,
            default: 'horizontal',
            validator(val) {
                return ['horizontal', 'vertical'].includes(val);
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
            checkedValue: this.value,
            collapsed: true
        };
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
            consola.trace('Checkboxes value changed to', this.checkedValue);

            /**
             * Fired when the selection changes.
             *
             * @event input
             * @type {Array}
             */
            this.$emit('input', this.checkedValue);
        },
        hasSelection() {
            return this.$refs.boxes.some(x => x.isChecked);
        }
    }
};
</script>

<template>
  <div :class="['checkboxes', alignment]">
    <div
      class="options"
    >
      <Checkbox
        v-for="item of possibleValues"
        ref="boxes"
        :key="`checkboxes-${item.id}`"
        :value="checkedValue.indexOf(item.id) > -1"
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

.checkboxes {
  & .boxes {
    margin-right: 5px;
  }

  &.vertical .boxes {
    display: block;
  }
}

</style>
