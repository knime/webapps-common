<script>
import BaseRadioButtons from "./BaseRadioButtons.vue";

export default {
  components: {
    BaseRadioButtons,
  },
  props: {
    // these props are passed to BaseRadioButtons
    id: {
      type: String,
      default: null,
    },
    modelValue: {
      type: String,
      default: "",
    },
    disabled: {
      default: false,
      type: Boolean,
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
    },

    // additional props
    alignment: {
      type: String,
      default: "horizontal",
      validator(value) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
  },
  emits: ["update:modelValue"],
  methods: {
    hasSelection() {
      /* looks in the DOM if one radio button is checked */
      return this.$refs.radioButton.$refs.input.some((x) => x.checked);
    },
  },
};
</script>

<template>
  <BaseRadioButtons
    :id="id"
    ref="radioButton"
    :possible-values="possibleValues"
    :model-value="modelValue"
    :disabled="disabled"
    :class="['radio-buttons', alignment, { disabled }]"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<style lang="postcss" scoped>
.radio-buttons :deep() {
  user-select: none;
  margin-top: calc(var(--spacing-6) * 0.5);

  & label {
    position: relative;
    display: block;
    font-weight: 300;
    font-size: 13px;
    line-height: 18px;
    padding: 3px 3px 3px 23px;
    max-width: 100%;
    width: max-content;
    cursor: pointer;

    &.disabled {
      opacity: 0.5;
      cursor: default;
    }

    & input {
      opacity: 0;
      position: absolute;
      width: 0;
      height: 0;

      & + span {
        display: inline-block;
        width: 100%;
        min-width: 1em;
        color: var(--knime-masala);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ◯ */
      & + span::before {
        border: 1px solid var(--theme-radio-border-color);
        background: var(--theme-radio-background-color);
        display: inline-block;
        content: "";
        width: 14px;
        height: 14px;
        border-radius: 100%;
        left: 0;
        top: 5px;
        position: absolute;
        vertical-align: top;
        text-align: center;
      }

      &:enabled:hover + span::before {
        border: 1px solid var(--theme-radio-border-color-hover);
        background: var(--theme-radio-background-color-hover);
        cursor: pointer;
      }

      /* 🔘 */
      &:checked {
        /* stylelint-disable no-descending-specificity */
        & + span::before {
          background: var(--theme-radio-foreground-color-selected);
          border-color: var(--theme-radio-border-color-selected);
          content: "";
          box-shadow: inset 0 0 0 4px
            var(--theme-radio-background-color-selected);
        }
        /* stylelint-enable no-descending-specificity */

        &:enabled:hover + span::before {
          box-shadow: unset;
          background: radial-gradient(
            ellipse at center,
            var(--theme-radio-foreground-color-selected-hover) 0%,
            var(--theme-radio-foreground-color-selected-hover) 25%,
            var(--theme-radio-background-color-selected-hover) 26%,
            var(--theme-radio-background-color-selected-hover) 100%
          );
          border-color: var(--theme-radio-border-color-selected-hover);
        }
      }
    }
  }
}

.radio-buttons:focus-within :deep(label input:not(:disabled) + span::before) {
  border: 1px solid var(--theme-radio-border-color-focus);
}

.horizontal :deep() {
  display: flex;
  flex-wrap: wrap;

  & label {
    min-width: 0; /* sizing and text overflow with flexbox - see https://stackoverflow.com/a/26535469 */

    &:not(:last-of-type) {
      padding-right: 12px;
    }
  }
}
</style>
