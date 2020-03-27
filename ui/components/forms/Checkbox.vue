<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        /**
         * Controls the size of the label
         * supported values:
         * - regular
         * - large
         */
        labelSize: {
            type: String,
            default: 'regular'
        }
    },
    methods: {
        onInput($event) {
            /**
             * Fired when the checkbox value changes.
             *
             * @event input
             * @type {Boolean}
             */
            let { checked } = $event.target;
            consola.trace('Checkbox value changed to', checked);
            this.$emit('input', checked);
        }
    }
};
</script>

<template>
  <label :class="labelSize">
    <input
      ref="input"
      :checked="value"
      type="checkbox"
      @change="onInput"
    >
    <span>
      <slot />
    </span>
  </label>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

label {
  position: relative;
  padding: 3px 0 3px 24px;
  color: var(--theme-color-masala);

  & input {
    opacity: 0;
    position: absolute;

    & + span::before { /* □ */
      border: 1px solid var(--theme-color-stone-gray);
      display: inline-block;
      content: '';
      width: 14px;
      height: 14px;
    }

    & + span::before, /* □ */
    & + span::after { /* ✓ */
      position: absolute;
      left: 0;
      top: 3px;
    }

    &:checked {
      /* □ */
      & + span::before { /* default */
        border-color: var(--theme-color-masala);
        background: var(--theme-color-masala);
      }

      &:focus + span::before {
        background: var(--theme-color-white);
      }

      &:hover + span::before {
        border-color: var(--theme-color-stone-gray);
        background: var(--theme-color-silver-sand-semi);
      }

      /* ✓ */
      & + span::after { /* default */
        content: '';
        position: absolute;
        display: block;
        transform: translate(4px, 2.5px) rotate(-45deg);
        left: -1px;
        top: 4px;
        width: 8px;
        height: 5px;
        border-style: solid;
        border-width: 0 0 1.3px 1.3px;
        border-color: var(--theme-color-white);
      }

      &:hover + span::after,
      &:focus + span::after {
        border-color: var(--theme-color-masala);
      }
    }

    &:not(:checked) {
      /* □ */
      &:hover + span::before {
        background: var(--theme-color-silver-sand-semi);
      }

      &:focus:not(:hover) + span::before {
        border-color: var(--theme-color-masala);
      }
    }
  }

  /* label size */
  &.regular {
    font-size: 13px;
    font-weight: 300;
    line-height: 18px;
  }

  &.large {
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;

    /* stylelint-disable no-descending-specificity */
    & input + span::before,
    & input + span::after { /* ✓ */
      top: 4.5px;
    }

    & input + span::after { /* ✓ */
      transform: translate(4px, 3.5px) rotate(-45deg);
    }
  }
}
</style>
