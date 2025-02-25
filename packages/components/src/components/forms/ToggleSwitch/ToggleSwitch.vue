<script>
import CheckIcon from "@knime/styles/img/icons/check.svg";

export default {
  name: "ToggleSwitch",
  components: {
    CheckIcon,
  },
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
      const { checked } = $event.target;
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
    <CheckIcon :class="{ checked: modelValue }" />
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
  --component-height: 18px;

  display: inline-flex;
  position: relative;
  isolation: isolate;
  padding: 3px 0 3px 37px;
  max-width: 100%;
  cursor: pointer;

  & svg {
    opacity: 0;
    position: absolute;
    z-index: 1;
    left: 15px;
    width: 10px;
    height: 10px;
    top: 50%;
    margin-top: -5px; /* half of the height */
    stroke-width: 2.5; /* manual setting the stroke-width as the usual calc-expression result is too thick */

    &.checked {
      opacity: 1;
      transition: opacity 0.1s ease 0.3s;
    }
  }

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
    font-size: 13px;
    font-weight: 300;
    min-height: var(--component-height);
  }

  &.large {
    --component-height: 20px;

    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    font-size: 16px;
    font-weight: 700;
    min-height: var(--component-height);
  }

  &:has(:checked:focus) svg {
    stroke: var(--knime-white);
  }
}
</style>
