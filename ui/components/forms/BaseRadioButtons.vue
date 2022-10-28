<script>
let count = 0;
export default {
    compatConfig: {
        COMPONENT_V_MODEL: false
    },
    props: {
        id: {
            type: String,
            default: null
        },
        modelValue: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        disabled: {
            default: false,
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
    emits: ['update:modelValue'],
    computed: {
        inputName() {
            return this.name ? this.name : `wc-radio-${this.count}`;
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
            this.$emit('update:modelValue', value);
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
        :checked="(modelValue === item.id)"
        :value="item.id"
        :name="inputName"
        :disabled="disabled"
        type="radio"
        @change="onInput"
      >
      <span :title="item.text">{{ item.text }}</span>
    </label>
  </div>
</template>
