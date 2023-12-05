<script>
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
  isolation: isolate;
  display: block;
  max-width: max-content;

  &.disabled {
    opacity: 0.5;
  }

  & textarea {
    font-size: 13px;
    font-weight: 300;
    line-height: 18px;
    padding: 11px 10px;
    border-radius: 0;
    border: 1px solid var(--knime-stone-gray);
    background-color: var(--theme-text-area-background-color);
    outline: none;
    display: block;

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
    display: block;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
  }
}
</style>
