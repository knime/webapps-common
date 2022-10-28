<script>
import BaseButton from './BaseButton.vue';

export default {
    compatConfig: {
        INSTANCE_LISTENERS: false
    },
    components: {
        BaseButton
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
            default: false
        },
        /**
         * switches colors to use button on a dark background
         */
        onDark: {
            type: Boolean,
            default: false
        },
        /**
         * switches colors
         */
        primary: {
            type: Boolean,
            default: false
        },
        /**
         * smaller font size and padding
         */
        compact: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return [
                'button',
                { primary: this.primary },
                { 'with-border': this.withBorder },
                { 'on-dark': this.onDark },
                { compact: this.compact }
            ];
        }
    }
};
</script>

<template>
  <BaseButton
    v-bind="$attrs"
    :class="classes"
  >
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
.button {
  display: inline-block;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  font-family: var(--theme-text-medium-font-family);
  line-height: 19px;
  padding: 12px 30px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  color: var(--knime-dove-gray);
  background-color: transparent;
  
  /* best way to ensure pill shaped buttons with flexible 1/4 corners */
  border-radius: var(--theme-button-border-radius, 9999px);

  & :slotted(svg) {
    width: 18px;
    height: 18px;
    stroke: var(--knime-dove-gray);
    stroke-width: calc(32px / 18);
    position: relative;
    top: -0.11em;
    vertical-align: middle;
    margin-right: 8px;
  }

  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &:active,
  &:hover,
  &:focus {
    outline: none;
    color: var(--knime-masala);

    & :slotted(svg) {
      stroke: var(--knime-masala);
    }
  }

  &.compact {
    padding: 6px 15px;
    min-width: 50px;
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
      width: 14px;
      height: 14px;
      stroke-width: calc(32px / 14);
      top: -0.1em;
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
    border: 1px solid var(--theme-button-border-color);
    color: var(--theme-button-foreground-color);

    & :slotted(svg) {
      stroke: var(--theme-button-foreground-color);
    }
  }

  &.primary,
  &.with-border {
    &.compact {
      border-radius: var(--theme-button-small-border-radius);
    }

    &:hover {
      outline: none;
      color: var(--theme-button-foreground-color-hover);
      background-color: var(--theme-button-background-color-hover);

      & :slotted(svg) {
        stroke: var(--theme-button-foreground-color-hover);
      }
    }

    &:active,
    &:focus {
      outline: none;
      color: var(--theme-button-foreground-color-focus);
      background-color: var(--theme-button-background-color-focus);

      & :slotted(svg) {
        stroke: var(--theme-button-foreground-color-focus);
      }
    }
  }

  &.on-dark {
    &.with-border {
      border: 1px solid var(--knime-white);
      background-color: transparent;
      color: var(--knime-white);

      & :slotted(svg) {
        stroke: var(--knime-white);
      }
    }

    &.primary,
    &.with-border {
      &:active,
      &:hover,
      &:focus {
        outline: none;
        background-color: var(--knime-white);
        color: var(--knime-masala);

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
