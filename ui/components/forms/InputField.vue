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
        inputClassList() {
            let classes = this.inputClasses;
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
            this.$emit('input', this.getValue());
        },
        /**
         * checks if value matches the provided pattern
         * @return {Boolean}
         */
        validate() {
            const value = this.getValue();
            if (typeof value === 'undefined') {
                return false;
            }
            if (!this.pattern) {
                return true;
            }
            const matches = value.match(this.pattern);
            return matches !== null && matches[0] === value;
        }
    }
};
</script>

<template>
  <div>
    <slot name="icon" />
    <span
      v-if="!isValid"
      class="invalid-marker"
    />
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
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

div {
  /* icon and marker need pos 0,0 to be the wrapper */
  position: relative;
}

input {
  font-size: 13px;
  font-weight: 300;
  color: var(--theme-color-masala);
  line-height: 18px;
  height: 40px;
  padding: 11px 10px 11px 10px;
  border-radius: 0;
  width: 100%;
  border: 1px solid var(--theme-color-stone-gray);
  outline: none;
  background-color: transparent;

  &::placeholder {
    color: var(--theme-color-dove-gray);
  }

  &:disabled {
    color: var(--theme-color-dove-gray);
    opacity: 0.5;
  }

  /* active */
  &:focus {
    border-color: var(--theme-color-masala);
  }

  &:hover:not(:focus):not(:disabled) {
    background-color: var(--theme-color-silver-sand-semi);
  }

  &.with-icon {
    padding: 10px 10px 10px 38px;
  }
}

.invalid-marker {
  position: absolute;
  display: block;
  width: 3px;
  left: -1px;
  margin: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  background-color: var(--theme-color-error);
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
