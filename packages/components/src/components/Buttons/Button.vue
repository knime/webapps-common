<script lang="ts">
import { defineComponent } from "vue";

import BaseButton from "../base/Button/BaseButton.vue";

export default defineComponent({
  name: "Button",
  components: {
    BaseButton,
  },
  props: {
    /**
     * @see {@link BaseButton.vue}
     */
    /**
     * show button with border
     */
    withBorder: {
      type: Boolean,
      default: false,
    },
    /**
     * switches colors to use button on a dark background
     */
    onDark: {
      type: Boolean,
      default: false,
    },
    /**
     * switches colors
     */
    primary: {
      type: Boolean,
      default: false,
    },
    /**
     * smaller font size and padding
     */
    compact: {
      type: Boolean,
      default: false,
    },
    /**
     * show button in an error state
     * - requires withBorder
     * - doesnt work onDark
     */
    withWarning: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return [
        "button",
        { primary: this.primary },
        { "with-border": this.withBorder },
        { "with-warning": this.withWarning },
        { "on-dark": this.onDark },
        { compact: this.compact },
      ];
    },
  },
});
</script>

<template>
  <BaseButton :class="classes" :disabled="disabled">
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
.button {
  display: inline-block;
  padding: 12px 30px;
  font-family: var(--theme-text-medium-font-family);
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  color: var(--knime-dove-gray);
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  background-color: transparent;
  border: 0;

  /* best way to ensure pill shaped buttons with flexible 1/4 corners */
  border-radius: var(--theme-button-border-radius, 9999px);

  & :slotted(svg) {
    position: relative;
    top: -0.11em;
    width: 18px;
    height: 18px;
    margin-right: 8px;
    vertical-align: middle;
    stroke: var(--knime-dove-gray);
    stroke-width: calc(32px / 18);
  }

  &[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:active,
  &:hover,
  &:focus {
    color: var(--knime-masala);
    outline: none;

    & :slotted(svg) {
      stroke: var(--knime-masala);
    }
  }

  &.compact {
    min-width: 50px;
    padding: 6px 15px;
    font-size: 13px;
    line-height: 18px;
    color: var(--theme-button-small-foreground-color);
    background: var(--theme-button-small-background-color);

    &:hover {
      color: var(--theme-button-small-foreground-color-hover);
      background: var(--theme-button-small-background-color-hover);
    }

    &:focus,
    &:active {
      color: var(--theme-button-small-foreground-color-focus);
      background: var(--theme-button-small-background-color-focus);
    }

    & :slotted(svg) {
      top: -0.1em;
      width: 14px;
      height: 14px;
      stroke-width: calc(32px / 14);
    }

    &.with-border {
      padding: 5px 14px;
      border: 1px solid var(--theme-button-small-border-color);

      &:hover {
        border-color: var(--theme-button-small-border-color-hover);
      }

      &:focus,
      &:active {
        border-color: var(--theme-button-small-border-color-focus);
      }
    }
  }

  &.primary {
    color: var(--theme-button-foreground-color);
    background-color: var(--theme-button-background-color);

    & :slotted(svg) {
      stroke: var(--theme-button-foreground-color);
    }
  }

  &.with-border {
    padding: 11px 29px;
    color: var(--theme-button-foreground-color);
    border: 1px solid var(--theme-button-border-color);

    & :slotted(svg) {
      stroke: var(--theme-button-foreground-color);
    }
  }

  &.primary,
  &.with-border {
    &.compact {
      border-radius: var(--theme-button-small-border-radius);
    }

    &.with-warning {
      color: var(--theme-color-error);
      border-color: var(--theme-color-error);

      & :deep(svg) {
        stroke: var(--theme-color-error);
      }
    }

    &:hover {
      color: var(--theme-button-foreground-color-hover);
      outline: none;
      background-color: var(--theme-button-background-color-hover);

      & :slotted(svg) {
        stroke: var(--theme-button-foreground-color-hover);
      }
    }

    &:active,
    &:focus {
      color: var(--theme-button-foreground-color-focus);
      outline: none;
      background-color: var(--theme-button-background-color-focus);

      & :slotted(svg) {
        stroke: var(--theme-button-foreground-color-focus);
      }
    }

    &.with-warning:hover {
      border-color: var(--theme-button-background-color-hover);
    }
  }

  &.on-dark {
    &.with-border {
      color: var(--knime-white);
      background-color: transparent;
      border: 1px solid var(--knime-white);

      & :slotted(svg) {
        stroke: var(--knime-white);
      }
    }

    &.primary,
    &.with-border {
      &:active,
      &:hover,
      &:focus {
        color: var(--knime-masala);
        outline: none;
        background-color: var(--knime-white);

        & :slotted(svg) {
          stroke: var(--knime-masala);
        }
      }
    }

    &:active,
    &:hover,
    &:focus {
      outline: none;
      background-color: var(--knime-white);
    }
  }
}
</style>
