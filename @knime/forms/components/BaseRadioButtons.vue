<script>
let count = 0;
export default {
    props: {
        id: {
            type: String,
            default: null
        },
        value: {
            type: String,
            default: ''
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
    beforeCreate() {
        count += 1;
        this.count = count;
    },
    methods: {
        onInput($event) {
            /**
             * Fired when the radio button value changes.
             *
             * @event input
             * @type {String}
             */
            let value = $event.target.value;
            this.$emit('input', value);
        }
    }
};
</script>

<template>
  <div
    :id="id"
    role="radiogroup"
  >
    <label
      v-for="item of possibleValues"
      :key="`radio-${item.id}`"
    >
      <input
        ref="input"
        :checked="(value === item.id)"
        :value="item.id"
        :name="`wc-radio-${count}`"
        type="radio"
        @change="onInput"
      >
      <span :title="item.text">{{ item.text }}</span>
    </label>
  </div>
</template>
