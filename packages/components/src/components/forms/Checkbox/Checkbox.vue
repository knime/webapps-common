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
  display: inline-block;
  position: relative;
  isolation: isolate;
  padding: 3px 0 3px 24px;
  max-width: 100%;
  cursor: pointer;

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
      display: inline-block;
      overflow: hidden;
      min-width: 1em;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
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
      top: 4px; /* based on regular line-height of 18px; container will be 24px(2x3px padding) 24-14=10/2 = 5-1 = 4
      to let higher letters appear more centered */
    }

    &:checked {
      /* □ */
      & + span::before {
        /* default */
        border-color: var(--theme-checkbox-border-color-selected);
        background: var(--theme-checkbox-background-color-selected);
      }

      &:focus + span::before {
        border-color: var(--theme-checkbox-border-color-selected-focus);
        background: var(--theme-checkbox-background-color-selected-focus);
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
    color: var(--theme-text-bold-color);
    font-size: 16px;
    font-weight: 700;
    line-height: var(--large-height);

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
