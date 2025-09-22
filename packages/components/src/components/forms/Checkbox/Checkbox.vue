<script>
export default {
  name: "Checkbox",
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
    /**
     * Controls the size of the label
     * supported values:
     * - regular
     * - large
     */
    labelSize: {
      type: String,
      default: "regular",
      validator: (value) => ["regular", "large"].includes(value),
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
      const { checked } = $event.target;
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
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 3px 0 3px 24px;
  cursor: pointer;
  isolation: isolate;

  /* invalid value */
  &.invalid {
    color: var(--theme-color-error);
  }

  &.disabled {
    cursor: initial;
    opacity: 0.5;
  }

  & input {
    position: absolute;
    display: flex;
    width: 0;
    height: 0;
    user-select: none;
    opacity: 0;

    & + span {
      display: inline-block;
      min-width: 1em;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & + span::before {
      display: inline-block;
      width: 14px;
      height: 14px;
      content: "";
      background: var(--theme-checkbox-background-color);

      /* □ */
      border: 1px solid var(--theme-checkbox-border-color);
    }

    & + span::before, /* □ */
    & + span::after {
      /* ✓ */
      position: absolute;
      top: 4px; /* based on regular line-height of 18px; container will be 24px(2x3px padding) 24-14=10/2 = 5-1 = 4
      to let higher letters appear more centered */
      left: 0;
    }

    &:checked {
      /* □ */
      & + span::before {
        background: var(--theme-checkbox-background-color-selected);

        /* default */
        border-color: var(--theme-checkbox-border-color-selected);
      }

      &:focus + span::before {
        background: var(--theme-checkbox-background-color-selected-focus);
        border-color: var(--theme-checkbox-border-color-selected-focus);
      }

      &:hover:enabled + span::before {
        background: var(--theme-checkbox-background-color-selected-hover);
        border-color: var(--theme-checkbox-border-color-selected-hover);
      }

      &:hover:disabled + span::before {
        background: var(--theme-checkbox-background-color-selected);
        border-color: var(--theme-checkbox-border-color-selected);
      }

      /* ✓ */
      & + span::after {
        position: absolute;
        left: -1px;
        display: block;
        width: 8px;
        height: 5px;

        /* default */
        content: "";
        border-color: var(--theme-checkbox-foreground-color-selected);
        border-style: solid;
        border-width: 0 0 1.3px 1.3px;
        transform: translate(4px, 3.5px) rotate(-45deg);
      }

      &:focus + span::after {
        border-color: var(--theme-checkbox-foreground-color-selected-focus);
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

      &:focus:not(:hover) + span::before {
        border-color: var(--theme-checkbox-border-color-focus);
      }
    }
  }

  /* label size */
  &.regular {
    --regular-height: 18px;

    font-size: 13px;
    font-weight: 300;
    line-height: var(--regular-height);

    & > span {
      min-height: var(--regular-height);
    }
  }

  &.large {
    --large-height: 20px;

    font-family: var(--theme-text-bold-font-family);
    font-size: 16px;
    font-weight: 700;
    line-height: var(--large-height);
    color: var(--theme-text-bold-color);

    & > span {
      min-height: var(--large-height);
    }

    /* stylelint-disable no-descending-specificity */
    & input + span::before,
    & input + span::after {
      /* ✓ */
      top: 5px; /* line height 20px; container 26px(2x3px padding) 26-14=12/2=6  -1=5 to center higher letters better */
    }
    /* stylelint-enable no-descending-specificity */
  }
}
</style>
