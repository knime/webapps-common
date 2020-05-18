<script>
import BaseButton from './BaseButton';

export default {
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
        },
        /**
         * disable button
         */
        disabled: {
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
                { compact: this.compact },
                { disabled: this.disabled }
            ];
        }
    }
};
</script>

<template>
  <BaseButton
    :class="classes"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.button {
  display: inline-block;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  font-family: var(--theme-text-medium-font-family);
  line-height: 19px;
  padding: 12px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  color: var(--theme-color-dove-gray);
  background-color: transparent;

  /* best way to ensure pill shaped buttons with flexible 1/4 corners */
  border-radius: var(--theme-button-border-radius, 9999px);

  & >>> svg {
    width: 18px;
    height: 18px;
    stroke: var(--theme-color-dove-gray);
    stroke-width: calc(32px / 18);
    position: relative;
    top: -0.11em;
    vertical-align: middle;
    margin-right: 8px;
  }

  &.disabled { /* via class since <a> elements don't have a native disabled attribute */
    opacity: 0.5;
    pointer-events: none;
  }

  &:active,
  &:hover,
  &:focus {
    outline: none;
    color: var(--theme-color-masala);

    & >>> svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.compact {
    padding: 6px 15px;
    min-width: 50px;
    font-size: 13px;
    line-height: 18px;
    border-radius: var(--theme-button-small-border-radius);
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

    & >>> svg {
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
    color: var(--theme-button-foreground-color, --theme-color-masala);
    background-color: var(--theme-button-background-color, --theme-color-yellow);

    & >>> svg {
      stroke: var(--theme-button-foreground-color, --theme-color-masala);
    }
  }

  &.with-border {
    border: 1px solid var(--theme-button-border-color);
    color: var(--theme-button-foreground-color);
    padding: 11px;

    & >>> svg {
      stroke: var(--theme-button-foreground-color);
    }
  }

  &.primary,
  &.with-border {
    &:hover {
      outline: none;
      color: var(--theme-button-foreground-color-hover, --theme-color-white);
      background-color: var(--theme-button-background-color-hover, --theme-color-masala);

      & >>> svg {
        stroke: var(--theme-button-foreground-color-hover, --theme-color-white);
      }
    }

    &:active,
    &:focus {
      outline: none;
      color: var(--theme-button-foreground-color-focus, --theme-color-white);
      background-color: var(--theme-button-background-color-focus, --theme-color-masala);

      & >>> svg {
        stroke: var(--theme-button-foreground-color-focus, --theme-color-white);
      }
    }
  }

  &.on-dark {
    &.with-border {
      border: 1px solid var(--theme-color-white);
      background-color: transparent;
      color: var(--theme-color-white);

      & >>> svg {
        stroke: var(--theme-color-white);
      }
    }

    &.primary,
    &.with-border {
      &:active,
      &:hover,
      &:focus {
        outline: none;
        background-color: var(--theme-color-white);
        color: var(--theme-color-masala);

        & >>> svg {
          stroke: var(--theme-color-masala);
        }
      }
    }

    &:active,
    &:hover,
    &:focus {
      outline: none;
      background-color: var(--theme-color-white);
    }
  }
}
</style>
