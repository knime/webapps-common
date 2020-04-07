<script>
export default {
    props: {
        /**
         * If set, the button renders an <a> element instead of a <button> element
         * When used together with `to`, the `href` attribute is passed to <nuxt-link>.
         */
        href: {
            type: String,
            default: ''
        },
        /**
         * If set, the button renders a <nuxt-link> instead of a <button> element.
         */
        to: {
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
         * disable button
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * switches style to function button
         */
        function: {
            type: Boolean,
            default: false
        },
        /**
         * changes style of function button without text
         */
        withoutText: {
            type: Boolean,
            default: false
        },
        /**
         * switches state of function button
         */
        active: {
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
                { disabled: this.disabled },
                { function: this.function },
                { 'without-text': this.withoutText },
                { active: this.active }
            ];
        }
    },
    methods: {
        // eslint-disable-next-line consistent-return
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
  <!-- see https://stackoverflow.com/a/41476882/5134084 for the `.native` in `@click.native`  -->
  <nuxt-link
    v-if="component === 'nuxt-link'"
    :to="to"
    :class="classes"
    v-bind="optionalProps"
    :event="preventDefault ? [] : 'click'"
    @click.native="onClick"
  >
    <slot />
  </nuxt-link>

  <Component
    :is="component"
    v-else
    :href="href || null"
    :class="classes"
    v-bind="optionalProps"
    :disabled="component === 'button' ? disabled : null"
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
  border: 0;
  cursor: pointer;
  color: var(--theme-color-dove-gray);
  background-color: transparent;
  border-radius: 9999px;

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
  &:hover {
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

  &.primary:active,
  &.primary:hover,
  &.with-border:active,
  &.with-border:hover,
  &.active {
    color: var(--theme-color-white);
    background-color: var(--theme-color-masala);

    & >>> svg {
      stroke: var(--theme-color-white);
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
      &:hover {
        background-color: var(--theme-color-white);
        color: var(--theme-color-masala);

        & >>> svg {
          stroke: var(--theme-color-masala);
        }
      }
    }

    &:active,
    &:hover {
      background-color: var(--theme-color-white);
    }
  }

  &.function {
    padding: 6px 15px;
    font-size: 13px;
    line-height: 18px;

    & svg {
      margin: 0 8px 0 0;
      display: inline-block;
      position: relative;
      top: -0.05em;
    }

    &:not(.active) {
      &:active,
      &:hover {
        background-color: var(--theme-color-silver-sand-semi);
      }
    }

    &.without-text {
      padding: 6px;

      & svg {
        margin: 0;
        display: block;
        position: relative;
        top: -0.04em;
      }
    }

    &.compact {
      padding: 4px 10px;
      line-height: 16px;
      font-size: 11px;
      margin-right: 10px;

      &.without-text {
        padding: 5px;
        min-width: unset;
        
        & svg {
          top: -0.00em;
        }
      }
    }
  }
}
</style>
