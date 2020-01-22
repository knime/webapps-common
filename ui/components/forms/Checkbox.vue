<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        /**
         * Controls the size of the checkbox.
         * Supported values:
         *   large = 14×14px
         *   medium = 1×1em
         */
        boxSize: {
            type: String,
            default: 'large'
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
  <label :class="boxSize">
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
  line-height: 1;

  & input {
    opacity: 0;
    position: absolute;

    & + span::before { /* □ */
      border: 1px solid var(--theme-color-stone-gray);
      display: inline-block;
      content: '';
    }

    & + span::before, /* □ */
    & + span::after { /* ✓ */
      position: absolute;
      left: 0;
    }

    & + span::before:hover { /* □ */
      background: var(--theme-color-porcelain);
    }

    &:checked + span::before { /* □ */
      background: var(--theme-color-masala);
      border-color: var(--theme-color-masala);
      content: '';
    }

    &:checked + span::after { /* ✓ */
      content: '';
      position: absolute;
      display: block;
      border: solid var(--theme-color-white);
      transform: translate(0.2em, 0.35em) rotate(-45deg);
    }
  }

  &:hover input + span::before { /* □ */
    background: var(--theme-color-porcelain);
  }

  &:hover input + span::after { /* ✓ */
    border-color: var(--theme-color-masala);
  }

  &.medium {
    padding: 3px 0 3px 26px;

    & input {
      & + span::before,
      & + span::after {
        top: 4.5px;
      }

      & + span::before {
        width: 14px;
        height: 14px;
      }
    }
  }

  &.large {
    padding: 6px 0 3px 1.5em;

    & input {
      & + span::before,
      & + span::after {
        top: 6.5px;
      }

      & + span::before {
        width: 1em;
        height: 1em;
      }
    }
  }

  &.medium input:checked + span::after { /* ✓ */
    left: -1px;
    top: 2.5px;
    width: 10px;
    height: 5px;
    border-width: 0 0 1.5px 1.5px;
  }

  &.large input:checked + span::after { /* ✓ */
    left: 0;
    top: 5px;
    width: 0.6em;
    height: 0.35em;
    border-width: 0 0 2px 2px;
  }

  /* keyboard focus; :focus-visible would be better once browser
support is there https://caniuse.com/#feat=css-focus-visible */
  & input:focus + span::before,
  & input:checked:focus + span::before { /* □ */
    background: var(--theme-color-porcelain);
  }

  & input:checked:focus + span::after { /* ✓ */
    border-color: var(--theme-color-masala);
  }
}
</style>
