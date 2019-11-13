<script>
export default {
    props: {
        /**
         * if set, the button renders an <a> element instead of a <button> element
         */
        href: {
            type: String,
            default: ''
        },
        // to pass-trough all other props
        optionalProps: {
            type: Object,
            default: () => ({})
        },
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
         * toggle to prevent default click handler
         */
        preventDefault: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onClick(e) {
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
  <Component
    :is="href ? 'a' : 'button'"
    :href="href || false"
    :class="[
      'button',
      {'primary': primary},
      {'with-border': withBorder},
      {'on-dark': onDark},
      {'compact': compact}
    ]"
    v-bind="optionalProps"
    @click="onClick"
  >
    <slot />
  </Component>
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
  margin-bottom: 10px;
  border: 0;
  cursor: pointer;
  color: var(--theme-color-dove-gray);
  background-color: transparent;

  & svg {
    width: 18px;
    height: 18px;
    stroke: var(--theme-color-dove-gray);
    stroke-width: calc(32px / 18); /* replace 25 with the desired display size to get 1px stroke width */
    position: relative;
    top: 3px;
    margin-right: 8px;
  }

  &.compact {
    padding: 6px 15px;
    min-width: 50px;
    font-size: 13px;
    line-height: 18px;

    & svg {
      width: 14px;
      height: 14px;
      stroke-width: calc(32px / 14); /* replace 25 with the desired display size to get 1px stroke width */
      top: 2px;
    }

    &.with-border {
      padding: 5px 14px;
    }
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &:active,
  &:hover {
    outline: none;
    color: var(--theme-color-masala);

    & svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.primary {
    color: var(--theme-color-masala);
    background-color: var(--theme-color-yellow);

    & svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.with-border {
    border: 1px solid var(--theme-color-masala);
    color: var(--theme-color-masala);
    padding: 11px;

    & svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.primary,
  &.with-border {
    &:active,
    &:hover {
      color: var(--theme-color-white);
      background-color: var(--theme-color-masala);

      & svg {
        stroke: var(--theme-color-white);
      }
    }
  }

  &.on-dark {
    &.with-border {
      border: 1px solid var(--theme-color-white);
      background-color: transparent;
      color: var(--theme-color-white);

      & svg {
        stroke: var(--theme-color-white);
      }
    }

    &.primary,
    &.with-border {
      &:active,
      &:hover {
        background-color: var(--theme-color-white);
        color: var(--theme-color-masala);

        & svg {
          stroke: var(--theme-color-masala);
        }
      }
    }

    &:active,
    &:hover {
      background-color: var(--theme-color-white);
    }
  }
}
</style>
