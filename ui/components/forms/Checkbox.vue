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
         * - large (16px font size and always bold)
         * - medium (default: 14px regular)
         */
        labelSize: {
            type: String,
            default: 'medium'
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
  line-height: 1;
  padding: 3px 0 3px 24px;
  font-size: 13px;
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
      top: 4.5px;
    }

    & + span::before:hover { /* □ */
      background: var(--theme-color-silver-sand-semi);
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
      left: -1px;
      top: 2.5px;
      width: 10px;
      height: 5px;
      border-width: 0 0 1.5px 1.5px;
    }
  }

  &:hover input + span::before { /* □ */
    background: var(--theme-color-silver-sand-semi);
  }

  &:hover input + span::after { /* ✓ */
    border-color: var(--theme-color-masala);
  }

  /* label size */
  &.large {
    font-weight: 700;
    line-height: 18px;
    display: block;
    margin-bottom: 5px;

    & input:checked + span {
      font-weight: inherit;
    }
  }

  &.medium {
    font-weight: 300;
    line-height: 18px;
  }

  & input:hover + span::before,
  & input:checked:hover + span::before { /* □ */
    background: var(--theme-color-silver-sand-semi);
  }

  & input:checked:hover + span::after { /* ✓ */
    border-color: var(--theme-color-masala);
  }
}
</style>
