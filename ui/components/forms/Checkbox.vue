<script>
export default {
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    classes() {
      return ["checkbox", this.labelSize, { disabled: this.disabled }];
    },
  },
  methods: {
    onInput($event) {
      /**
       * Fired when the checkbox value changes.
       *
       * @event input
       * @type {Boolean}
       */
      let { checked } = $event.target;
      consola.trace("Checkbox value changed to", checked);
      this.$emit("update:modelValue", checked);
    },
    isChecked() {
      return this.$refs.input.checked;
    },
  },
};
</script>

<template>
  <label :class="[classes, { invalid }]">
    <input
      :id="id"
      ref="input"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      type="checkbox"
      @change="onInput"
    />
    <span>
      <slot />
    </span>
  </label>
</template>

<style lang="postcss" scoped>
/* if you consider removing this class: don't!
   selector specificity requires it for container system used in page-builder */
.checkbox {
  display: inline-block;
  position: relative;
  isolation: isolate;
  padding: 1px 3px 1px 5px;
  max-width: 100%;
  cursor: pointer;
  font-size: 13px;
  font-weight: 300;
  line-height: 16px;

  &:focus-within {
    box-shadow: var(--theme-default-focus-state);
  }

  /* invalid value */
  &.invalid {
    color: var(--theme-color-error);
  }

  &.disabled {
    cursor: initial;
    opacity: 0.5;
  }

  & input {
    user-select: none;
    display: flex;
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;

    & + span {
      position: relative;
      display: inline-block;
      overflow: hidden;
      min-width: 1em;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
      padding-left: 24px;
      min-height: 16px;
      vertical-align: bottom;
    }

    & + span::before {
      /* □ */
      border: 1px solid var(--theme-checkbox-border-color);
      background: var(--theme-checkbox-background-color);
      display: inline-block;
      content: "";
      width: 14px;
      height: 14px;
    }

    & + span::before, /* □ */
    & + span::after {
      /* ✓ */
      position: absolute;
      left: 0;
      top: 1px;
    }

    &:checked {
      /* □ */
      & + span::before {
        /* default */
        border-color: var(--theme-checkbox-border-color-selected);
        background: var(--theme-checkbox-background-color-selected);
      }

      &:hover:enabled + span::before {
        border-color: var(--theme-checkbox-border-color-selected-hover);
        background: var(--theme-checkbox-background-color-selected-hover);
      }

      &:hover:disabled + span::before {
        border-color: var(--theme-checkbox-border-color-selected);
        background: var(--theme-checkbox-background-color-selected);
      }

      /* ✓ */
      & + span::after {
        /* default */
        content: "";
        position: absolute;
        display: block;
        transform: translate(4px, 3.5px) rotate(-45deg);
        left: -1px;
        width: 8px;
        height: 5px;
        border-style: solid;
        border-width: 0 0 1.3px 1.3px;
        border-color: var(--theme-checkbox-foreground-color-selected);
      }

      &:hover:enabled + span::after {
        border-color: var(--theme-checkbox-foreground-color-selected-hover);
      }

      &:hover:disabled + span::after {
        border-color: var(--theme-checkbox-foreground-color-selected);
      }
    }

    &:not(:checked) {
      background: var(--theme-checkbox-background-color);

      /* □ */
      &:hover:enabled + span::before {
        border-color: var(--theme-checkbox-border-color-hover);
      }
    }
  }
}
</style>
