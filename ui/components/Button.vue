<script>
import BaseButton from './BaseButton';

export default {
    components: {
        BaseButton
    },
    props: {
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
        },
        /**
         * toggle to prevent default click handler
         */
        preventDefault: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        component() {
            if (this.to) {
                return 'nuxt-link';
            } else if (this.href) {
                return 'a';
            } else {
                return 'button';
            }
        },
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
    },
    methods: {
        // eslint-disable-next-line consistent-return
        onClick(e) {
            /* anchor tags can act as buttons without href and space key should work */
            if (e.code === 'Space' && this.href) {
                return false;
            }
            /**
             * Click event. Fired when the button is clicked.
             *
             * @event click
             */
            this.$emit('click');
            if (this.preventDefault) {
                e.preventDefault();
                return false;
            }
        }
    }
};
</script>

<template>
  <BaseButton
    :class="classes"
    @click="onClick"
    @keyBoardAction="onClick"
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
  line-height: 19px;
  padding: 12px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  color: var(--theme-color-dove-gray);
  background-color: transparent;
  border-radius: 9999px;  /* best way to ensure pill shaped buttons with flexible 1/4 corners */

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

  &.compact {
    padding: 6px 15px;
    min-width: 50px;
    font-size: 13px;
    line-height: 18px;

    & >>> svg {
      width: 14px;
      height: 14px;
      stroke-width: calc(32px / 14);
      top: -0.1em;
    }

    &.with-border {
      padding: 5px 14px;
    }
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

  &.primary {
    color: var(--theme-color-masala);
    background-color: var(--theme-color-yellow);

    & >>> svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.with-border {
    border: 1px solid var(--theme-color-masala);
    color: var(--theme-color-masala);
    padding: 11px;

    & >>> svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.primary,
  &.with-border {
    &:active,
    &:hover,
    &:focus {
      outline: none;
      color: var(--theme-color-white);
      background-color: var(--theme-color-masala);

      & >>> svg {
        stroke: var(--theme-color-white);
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
