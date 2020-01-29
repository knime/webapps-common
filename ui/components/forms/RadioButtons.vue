<script>
let count = 0;
export default {
    props: {
        id: {
            type: String,
            default() {
                return `RadioButtons-${count++}`;
            }
        },
        value: {
            type: String,
            default: ''
        },
        /**
         * Controls the size of the label
         */
        labelSize: {
            type: String,
            default: 'medium',
            validator(val) {
                return ['medium', 'large'].includes(val);
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
    methods: {
        onInput($event) {
            /**
             * Fired when the radio button value changes.
             *
             * @event input
             * @type {Boolean}
             */
            let value = $event.target.value;
            consola.trace('Radiobutton value changed to', value);
            this.$emit('input', value);
        },
        hasSelection() {
            /* looks in the DOM if one radio button is checked */
            return this.$refs.input.some(x => x.checked);
        }
    }
};
</script>

<template>
  <div :class="alignment">
    <label
      v-for="item of possibleValues"
      :key="`radio-${item.id}`"
      :class="labelSize"
    >
      <input
        ref="input"
        :checked="(value === item.id)"
        :value="item.id"
        :name="`radio-${id}`"
        type="radio"
        @change="onInput"
      >
      <span>
        {{ item.text }}
      </span>
    </label>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

label {
  position: relative;
  line-height: 1;
  padding: 3px 0 3px 23px;

  & input {
    opacity: 0;
    position: absolute;

    & + span::before { /* ◯ */
      border: 1px solid var(--theme-color-stone-gray);
      display: inline-block;
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 100%;
      left: 0;
      top: 6px;
      position: absolute;
      vertical-align: top;
      cursor: pointer;
      text-align: center;
    }

    &:checked + span::before { /* 🔘 */
      background: var(--theme-color-white);
      border-color: var(--theme-color-masala);
      content: '';
      box-shadow: inset 0 0 0 4px var(--theme-color-masala);
    }

    /* checked labels are bold */
    &:checked + span {
      font-weight: 700;
    }
  }

  /* keyboard focus; :focus-visible would be better once browser support
       is there https://caniuse.com/#feat=css-focus-visible */
  & input:focus + span::before { /* ◯ */
    background: var(--theme-color-porcelain);
  }

  /* hover state */
  &:hover input + span::before { /* ◯ */
    background: var(--theme-color-porcelain);
  }

  /* keyboard focus; :focus-visible would be better once browser support
     is there https://caniuse.com/#feat=css-focus-visible */
  & input:checked:focus + span::before { /* 🔘 */
    background: var(--theme-color-masala);
    box-shadow: inset 0 0 0 4px var(--theme-color-porcelain);
  }

  /* hover state  checked */
  &:hover input:checked + span::before { /* 🔘 */
    background: var(--theme-color-masala);
    box-shadow: inset 0 0 0 4px var(--theme-color-porcelain);
  }

  /* label size */
  &.large {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    display: block;
    margin-bottom: 5px;
    padding-top: 0;
  }

  &.medium {
    font-weight: 300;
    font-size: 14px;
    line-height: 18px;
  }
}

.horizontal label {
  padding-right: 3px;
}

.vertical label {
  display: block;
}

</style>
