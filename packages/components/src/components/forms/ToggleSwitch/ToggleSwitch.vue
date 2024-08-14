<script>
export default {
  name: "ToggleSwitch",
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
    /**
     * Controls the size of the label
     * supported values:
     * - regular
     * - large
     */
    labelSize: {
      type: String,
      default: "regular",
    },
  },
  emits: ["update:modelValue"],
  methods: {
    onChange($event) {
      /**
       * Fired when the toggle switch changes.
       *
       * @event input
       * @type {Boolean}
       */
      let { checked } = $event.target;
      consola.trace("ToggleSwitch value changed to", checked);
      this.$emit("update:modelValue", checked);
    },
    isChecked() {
      return this.$refs.input.checked;
    },
  },
};
</script>

<template>
  <label :class="['toggle', labelSize]">
    <input
      :id="id"
      ref="input"
      :name="name"
      type="checkbox"
      :checked="modelValue"
      @change="onChange"
    />
    <span>
      <slot />
    </span>
  </label>
</template>

<style lang="postcss" scoped>
.toggle {
  display: inline-block;
  position: relative;
  isolation: isolate;
  padding: 3px 0 3px 37px;
  max-width: 100%;
  cursor: pointer;
  vertical-align: middle;

  & input {
    user-select: none;
    display: flex;
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;

    & + span {
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & + span::before {
      display: inline-block;
      position: absolute;
      content: "";
      border-radius: 50px;
      transition: all 0.3s ease;
      transform-origin: 20% center;
      width: 27px;
      background: var(--theme-toggle-switch-background-color);
      border: 1px solid var(--knime-dove-gray);
      height: 10px;
      left: 0;
    }

    & + span::after {
      position: absolute;
      display: block;
      content: "";
      transition:
        all 0.3s ease,
        width 0.1s ease-in,
        left 0.3s ease;
      width: 14px;
      height: 14px;
      left: 0;
      border-radius: 9999px;
      background-color: var(--theme-toggle-switch-background-color);
      border: 1px solid var(--knime-dove-gray);
    }

    &:checked {
      & + span::before {
        background-color: var(--theme-toggle-switch-background-color-checked);
        border-color: var(--knime-masala);
      }

      & + span::after {
        left: 27px;
        transform: translateX(-100%);
        border-color: var(--knime-masala);
      }
    }

    &:hover {
      & + span::after {
        background-color: var(--theme-toggle-switch-background-color-hover);
      }
    }

    &:focus {
      & + span::after {
        background-color: var(--theme-toggle-switch-background-color-focus);
      }
    }

    &:active {
      & + span::after {
        width: 17px;
        background-color: var(--theme-toggle-switch-background-color-active);
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
      max-width: 100%;
    }
  }
}
</style>
