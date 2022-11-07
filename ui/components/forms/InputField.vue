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
        name: {
            type: String,
            default: null
        },
        /**
         * Sets the error styling, validity needs to be controlled by the parent component to be flexible
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
        autocomplete: {
            default: null,
            type: String
        },
        autofocus: {
            default: false,
            type: Boolean
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
        hasLeftIcon() {
            return this.$slots.icon && this.$slots.icon.length;
        },
        hasRightIcon() {
            return this.$slots.iconRight && this.$slots.iconRight.length;
        },
        inputClassList() {
            let classes = this.inputClasses;
            if (this.hasLeftIcon) {
                classes += ' with-icon';
            }
            if (this.hasRightIcon) {
                classes += ' with-icon-right';
            }
            if (!this.isValid) {
                classes += ' invalid';
            }
            return classes;
        }
    },
    methods: {
        getValue() {
            return this.$refs.input.value;
        },
        onInput() {
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
                if (this.$refs.input.validity.patternMismatch) {
                    isValid = false;
                    errorMessage = 'Input does not match the expected pattern';
                }
            }
            return { isValid, errorMessage };
        }
    }
};
</script>

<template>
  <div>
    <div
      v-if="hasLeftIcon"
      class="icon"
    >
      <slot name="icon" />
    </div>
    <div
      v-if="hasRightIcon"
      class="icon icon-right"
    >
      <slot name="iconRight" />
    </div>
    <input
      :id="id"
      ref="input"
      :name="name"
      :value="value"
      :class="inputClassList"
      :type="type"
      :pattern="pattern"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :disabled="disabled"
      @input="onInput"
    >
    <span
      class="invalid-marker"
    />
  </div>
</template>

<style lang="postcss" scoped>
div {
  /* icon and marker need pos 0,0 to be the wrapper */
  position: relative;
  isolation: isolate;
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
  background-color: var(--theme-input-field-background-color);

  &::placeholder {
    color: var(--knime-dove-gray);
  }

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    border-color: var(--knime-masala);
  }

  &.invalid + .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
  }

  &:hover:not(:focus):not(:disabled) {
    background-color: var(--theme-input-field-background-color-focus);
  }

  &.with-icon {
    padding: 10px 10px 10px 38px;
  }

  &.with-icon-right {
    padding: 10px 38px 10px 10px;
  }

  &.with-icon.with-icon-right {
    padding: 10px 38px 10px 38px;
  }
}

.icon {
  position: absolute;
  left: 12px;
  top: 10px;

  & svg {
    width: 18px;
    height: 18px;
    /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
    stroke-width: calc(32px / 18);
    stroke: var(--knime-masala);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the icon */
  }
}

.icon-right {
  left: calc(100% - 12px - 18px);
}
</style>
