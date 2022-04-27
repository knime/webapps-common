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
             * Fired when the ValueSwitch value changes.
             *
             * @event input
             * @type {String}
             */
            let value = $event.target.value;
            consola.trace('ValueSwitch value changed to', value);
            this.$emit('input', value);
        }
    }
};
</script>

<template>
  <div
    :id="id"
    class="value-switch"
    role="radiogroup"
  >
    <label
      v-for="item of possibleValues"
      :key="`value-switch-${item.id}`"
    >
      <input
        :id="item.id"
        ref="input"
        :checked="(value === item.id)"
        :value="item.id"
        :name="`value-switch-${count}`"
        type="radio"
        @change="onInput"
      >
      <span :title="item.text">{{ item.text }}</span>
    </label>
  </div>
</template>

<style lang="postcss" scoped>
.value-switch {
  display: flex;
  align-items: center;
  height: 30px;
  width: max-content;
  border-radius: 50px;
  border: 1px solid black;
  padding: 3px;

  & span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 41px;
    height: 24px;
    font-weight: 300;
    font-size: 13px;
    line-height: 18px;
    cursor: pointer;
    border-radius: 50px;
    transition: background-color 0.2s ease-in 0.1s;

    &:hover {
      background-color: var(--theme-value-switch-background-color-hover);
    }
  }

  & input {
    user-select: none;
    display: none;

    &:checked + span {
      background-color: var(--theme-value-switch-background-color-checked);
      color: var(--theme-value-switch-background-color);
    }
  }
}
</style>
