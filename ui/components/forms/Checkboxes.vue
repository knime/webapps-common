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
         * Controls the alignment
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
            consola.trace('Checkboxes value changed to', checkedValue);

            /**
             * Fired when the selection changes.
             *
             * @event input
             * @type {Array}
             */
            this.$emit('input', checkedValue);
        },
        /**
         * Is at least one checkbox checked?
         * @returns {boolean}
         */
        hasSelection() {
            return this.$refs.boxes.some(x => x.isChecked());
        }
    }
};
</script>

<template>
  <div :class="['checkboxes', alignment]">
    <Checkbox
      v-for="item of possibleValues"
      ref="boxes"
      :key="`checkboxes-${item.id}`"
      :value="value.indexOf(item.id) > -1"
      :title="item.text"
      class="box"
      @input="onInput(item.id, $event)"
    >
      {{ item.text }}
    </Checkbox>
  </div>
</template>

<style scoped lang="postcss">
.checkboxes {
  overflow: hidden;

  &.horizontal {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & >>> label {
      text-overflow: ellipsis;

      &:not(:last-of-type) {
        padding-right: 12px;
      }
    }
  }

  /* root of Checkbox which is a <label> */
  & .box {
    /* display block makes it vertical by default */
    display: block;
    overflow: hidden;
    width: max-content;
  }
}

</style>
