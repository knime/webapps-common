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

  position: relative;
  display: inline-flex;
  max-width: 100%;
  padding: 3px 0 3px 37px;
  cursor: pointer;
  isolation: isolate;

  & svg {
    position: absolute;
    top: 50%;
    left: 15px;
    z-index: 1;
    width: 10px;
    height: 10px;
    margin-top: -5px; /* half of the height */
    opacity: 0;
    stroke-width: 2.5; /* manual setting the stroke-width as the usual calc-expression result is too thick */

    &.checked {
      opacity: 1;
      transition: opacity 0.1s ease 0.3s;
    }
  }

  & input {
    position: absolute;
    display: flex;
    width: 0;
    height: 0;
    user-select: none;
    opacity: 0;

    & + span {
      display: inline-flex;
      align-items: center;
    }

    & + span::before {
      position: absolute;
      left: 0;
      display: inline-block;
      width: 27px;
      height: 10px;
      content: "";
      background: var(--theme-toggle-switch-background-color);
      border: 1px solid var(--knime-dove-gray);
      border-radius: 50px;
      transform-origin: 20% center;
      transition: all 0.3s ease;
    }

    & + span::after {
      position: absolute;
      left: 0;
      display: block;
      width: 14px;
      height: 14px;
      content: "";
      background-color: var(--theme-toggle-switch-background-color);
      border: 1px solid var(--knime-dove-gray);
      border-radius: 9999px;
      transition:
        all 0.3s ease,
        width 0.1s ease-in,
        left 0.3s ease;
    }

    &:checked {
      & + span::before {
        background-color: var(--theme-toggle-switch-background-color-checked);
        border-color: var(--knime-masala);
      }

      & + span::after {
        left: 27px;
        border-color: var(--knime-masala);
        transform: translateX(-100%);
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
    min-height: var(--component-height);
    font-size: 13px;
    font-weight: 300;
  }

  &.large {
    --component-height: 20px;

    min-height: var(--component-height);
    font-family: var(--theme-text-bold-font-family);
    font-size: 16px;
    font-weight: 700;
    color: var(--theme-text-bold-color);
  }

  &:has(:checked:focus) svg {
    stroke: var(--knime-white);
  }
}
</style>
