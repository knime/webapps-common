<script>
export default {
    props: {
        value: {
            default: '',
            type: [Number, String]
        },
        id: {
            type: String,
            default: null
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
        focus() {
            this.$refs.input.focus();
        },
        /*
         * checks if value matches the provided pattern
         */
        validate() {
            let isValid = true;
            let errorMessage = null;
            const value = this.getValue();
            if (typeof value === 'undefined') {
                isValid = false;
                errorMessage = 'Invalid input';
            } else if (this.pattern) {
                const matches = value.match(new RegExp(`^(?:${this.pattern})$`, 'u'));
                let matchingRegex = matches !== null && matches[0] === value;
                if (!matchingRegex) {
                    isValid = false;
                    errorMessage = 'Input does not match the expected pattern';
                }
            }
            return { isValid,  errorMessage };
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
      :id="id"
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
  height: 40px;
  line-height: normal;
  padding: 0 10px;
  border-radius: 0;
  width: 100%;
  border: 1px solid var(--knime-stone-gray);
  outline: none;
  background-color: transparent;

  &::placeholder {
    color: var(--knime-dove-gray);
  }

  &:disabled {
    color: var(--knime-dove-gray);
    opacity: 0.5;
  }

  &:focus {
    border-color: var(--knime-masala);
  }

  &:hover:not(:focus):not(:disabled) {
    background-color: var(--knime-silver-sand-semi);
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
  z-index: 1;
  background-color: var(--theme-color-error);
  pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
}

svg {
  width: 18px;
  height: 18px;
  stroke-width: calc(32px / 18);
  stroke: var(--knime-masala);
  position: absolute;
  left: 12px;
  top: 10px;
  pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the icon */
}
</style>
