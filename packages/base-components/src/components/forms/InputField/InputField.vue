<script>
import "../variables.css";
export default {
  props: {
    modelValue: {
      default: "",
      type: [Number, String],
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    /**
     * Sets the error styling, validity needs to be controlled by the parent component to be flexible
     */
    isValid: {
      default: true,
      type: Boolean,
    },
    type: {
      default: "text",
      type: String,
    },
    pattern: {
      default: null,
      type: String,
    },
    placeholder: {
      default: null,
      type: String,
    },
    autocomplete: {
      default: null,
      type: String,
    },
    autofocus: {
      default: false,
      type: Boolean,
    },
    inputClasses: {
      default: "",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    ariaActivedescendant: {
      type: String,
      default: null,
    },
    ariaOwns: {
      type: String,
      default: null,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "focus", "keyup", "keypress", "keydown"],
  computed: {
    hasLeftIcon() {
      return this.$slots.icon && this.$slots.icon().length;
    },
    hasRightIcon() {
      return this.$slots.iconRight && this.$slots.iconRight().length;
    },
    inputClassList() {
      let classes = this.inputClasses;
      if (this.hasLeftIcon) {
        classes += " with-icon";
      }
      if (this.hasRightIcon) {
        classes += " with-icon-right";
      }
      if (!this.isValid) {
        classes += " invalid";
      }
      return classes;
    },
  },
  methods: {
    getValue() {
      return this.$refs.input.value;
    },
    onInput() {
      this.$emit("update:modelValue", this.getValue());
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
      if (typeof value === "undefined") {
        isValid = false;
        errorMessage = "Invalid input";
      } else if (this.pattern) {
        if (this.$refs.input.validity.patternMismatch) {
          isValid = false;
          errorMessage = "Input does not match the expected pattern";
        }
      }
      return { isValid, errorMessage };
    },
  },
};
</script>

<template>
  <div class="input-wrapper" :class="{ compact }">
    <div v-if="hasLeftIcon" class="icon">
      <slot name="icon" />
    </div>
    <input
      :id="id"
      ref="input"
      :name="name"
      :value="modelValue"
      :class="inputClassList"
      :type="type"
      :pattern="pattern"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :aria-activedescendant="ariaActivedescendant"
      :aria-owns="ariaOwns"
      :autocomplete="autocomplete"
      :disabled="disabled"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @keyup="$emit('keyup', $event)"
      @keypress="$emit('keypress', $event)"
      @keydown="$emit('keydown', $event)"
    />
    <div v-if="hasRightIcon" class="icon icon-right">
      <slot name="iconRight" />
    </div>
    <span class="invalid-marker" />
  </div>
</template>

<style lang="postcss" scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  border: var(--form-border-width) solid var(--knime-stone-gray);
  background-color: var(--theme-input-field-background-color);
  height: var(--single-line-form-height);
  padding: 0 5px;

  &.compact {
    height: var(--single-line-form-height-compact);
  }

  &:focus {
    border-color: var(--knime-masala);
  }

  & .icon {
    --icon-size: 18;

    display: flex;
    padding: 5px;
    pointer-events: none;

    /* The gap is needed if there are adjacent activated buttons, to keep some space. */
    gap: 1px;

    & :slotted(svg) {
      vertical-align: top;
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);

      /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
      stroke-width: calc(32px / var(--icon-size));
      stroke: var(--knime-masala);
    }
  }

  &:has(:deep(.function-button)) {
    padding-right: 0;
  }

  & :deep(.function-button) {
    --icon-size: 18;

    pointer-events: auto; /* otherwise, we won't be able to :hover the button */

    & :deep(svg) {
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);

      /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
      stroke-width: calc(32px / var(--icon-size));
    }
  }
}

input {
  flex-grow: 1;
  font-size: 13px;
  font-weight: 300;
  height: 100%;
  line-height: normal;
  padding: 0 5px;
  border: 0;
  background-color: transparent;
  min-width: 1em;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--knime-dove-gray);
  }

  &:disabled {
    opacity: 0.5;
  }

  &.invalid + .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    margin: 0;
    background-color: var(--theme-color-error);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */

    /* "Outside" location corresponds to wrapper border. */
    left: calc(-1 * var(--form-border-width));
    top: calc(-1 * var(--form-border-width));
    bottom: calc(-1 * var(--form-border-width));
  }
}

/* This is handled outside of the input element, because hovering inside slots
 * would otherwise not be noticed within the input element. */
.input-wrapper:hover:not(:focus):has(input:not(:focus, :disabled)) {
  background-color: var(--theme-input-field-background-color-focus);
}
</style>
