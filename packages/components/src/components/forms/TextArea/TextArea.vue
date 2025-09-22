<script>
export default {
  name: "TextArea",
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
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
      default: true,
      type: Boolean,
    },
    cols: {
      default: 12,
      type: Number,
    },
    rows: {
      default: 4,
      type: Number,
    },
    placeholder: {
      default: null,
      type: String,
    },
    inputClasses: {
      default: "",
      type: String,
    },
    title: {
      default: null,
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    getValue() {
      return this.$refs.input.value;
    },
    onInput() {
      this.$emit("update:modelValue", this.getValue());
    },
  },
};
</script>

<template>
  <div :class="{ disabled }">
    <textarea
      v-bind="$attrs"
      :id="id"
      ref="input"
      :name="name"
      :title="title"
      :value="modelValue"
      :class="inputClasses"
      :cols="cols"
      :disabled="disabled"
      :rows="rows"
      :placeholder="placeholder"
      @input="onInput"
    />
    <span v-if="!isValid" class="invalid-marker" />
  </div>
</template>

<style lang="postcss" scoped>
div {
  position: relative;
  display: block;
  max-width: max-content;
  isolation: isolate;

  &.disabled {
    opacity: 0.5;
  }

  & textarea {
    display: block;
    padding: 11px 10px;
    font-size: 13px;
    font-weight: 300;
    line-height: 18px;
    outline: none;
    background-color: var(--theme-text-area-background-color);
    border: 1px solid var(--knime-stone-gray);
    border-radius: 0;

    &::placeholder {
      color: var(--knime-dove-gray);
    }

    &:focus {
      border-color: var(--knime-masala);
    }

    &:hover:not(:focus, :disabled) {
      background-color: var(--theme-text-area-background-color-hover);
    }
  }

  & .invalid-marker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 3px;
    margin: 0;
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
    background-color: var(--theme-color-error);
  }
}
</style>
