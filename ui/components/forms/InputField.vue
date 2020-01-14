<script>
export default {
    props: {
        value: {
            default: '',
            type: [Number, String]
        },
        /**
         * validity needs to be controlled by the parent component to be flexible
         */
        isValid: {
            default: true,
            type: Boolean
        },
        type: {
            default: 'text',
            type: String
        },
        pattern: {
            default: null,
            type: String
        },
        placeholder: {
            default: null,
            type: String
        },
        inputClasses: {
            default: '',
            type: String
        },
        disabled: {
            default: false,
            type: Boolean
        }
    },
    computed: {
        markerClassList() {
            let classes = ['marker'];

            if (!this.isValid) {
                classes.push('invalid');
            }
            return classes.join(' ');
        },
        inputClassList() {
            let classes = this.inputClasses;

            if (!this.isValid) {
                classes += ' invalid';
            }
            if (this.$slots.icon && this.$slots.icon.length) {
                classes += ' with-icon';
            }
            return classes;
        }
    },
    methods: {
        getValue() {
            return this.$refs.input.value;
        },
        onInput(e) {
            this.$emit('input', this.getValue(), { isValid: this.validate() });
        },
        /**
         * checks if value matches the provided pattern
         * @return {Boolean}
         */
        validate() {
            if (!this.pattern) {
                return true;
            }
            const matches = this.getValue().match(this.pattern);
            return matches !== null && matches[0] === this.getValue();
        }
    }
};
</script>

<template>
  <label>
    <slot name="icon" />
    <span :class="markerClassList"></span>
    <input
      ref="input"
      :value="value"
      :class="inputClassList"
      :type="type"
      :pattern="pattern"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
    >
  </label>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

label {
  position: relative;
  display: block;
}

input {
  font-size: 13px;
  font-weight: 500;
  color: var(--theme-color-masala);
  line-height: 18px;
  margin: 0;
  padding: 11px 10px 11px 10px;
  border-radius: 0;
  width: 100%;
  border: 1px solid var(--theme-color-stone-gray);
  outline: none;

  &::placeholder {
    color: var(--theme-color-dove-gray);
  }

  &:disabled {
    color: var(--theme-color-dove-gray);
  }

  &:hover:not(:focus) {
    background-color: var(--theme-color-porcelain);
  }

  /* active */
  &:focus {
    border: 1px solid var(--theme-color-masala);
    background-color: var(--knime-white);
  }

  &.with-icon {
    padding: 10px 10px 10px 38px;
  }
}

.marker {
  background-color: transparent;
  position: absolute;
  display: block;
  width: 3px;
  left: -1px;
  top: 0;
  bottom: 0;
  z-index: 10;
  &.invalid {
    background-color: var(--theme-color-error);
  }
}

svg {
  width: 18px;
  height: 18px;
  stroke-width: calc(32px / 18);
  stroke: var(--theme-color-masala);
  position: absolute;
  left: 12px;
  top: 10px;
}
</style>


