<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        /**
         * This prop controls the size of the checkbox.
         * The available options for this prop are: 'Large'
         * or 'Medium'. The case of the first letter does
         * NOT matter. If 'Medium' is provided, the checkbox
         * will be 14px by 14px, which is ideal for the
         * BooleanWidget component. If 'Large' is provided
         * (which is also default), the checkbox will be 1em
         *  x 1em. This is ideal for the Multiselect drop-
         * down menu.
         */
        boxSize: {
            type: String,
            default: 'Large'
        }
    },
    computed: {
        /**
         * Default class knime-checkbox-large. The options
         * available are: 'Large' or 'Medium'.
         *
         * @returns {String} class name for checkbox sizing
         */
        boxSizingClass() {
            if (/^med/i.test(this.boxSize)) {
                return 'knime-checkbox-medium';
            }
            return 'knime-checkbox-large';
        }
    },
    methods: {
        onChange($event) {
            /**
             * Update event. Fired when the checkbox is clicked.
             *
             * @event input
             * @type {String}
             */
            let { checked } = $event.target;
            consola.trace('Checkbox value changed to', checked);
            this.$emit('input', checked);
        }
    }
};
</script>

<template>
  <label
    :class="boxSizingClass"
  >
    <input
      v-model="value"
      type="checkbox"
      @input="onChange"
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
}

input {
  opacity: 0;
  position: absolute;

  & + span::before {
    background: var(--theme-color-porcelain);
    display: inline-block;
    content: '';
  }

  & + span::before,
  & + span::after {
    position: absolute;
    left: 0;
  }

  &:checked + span::before {
    background: var(--theme-color-masala);
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

label:hover input + span::before {
  background: var(--theme-color-silver-sand);
}

label:hover input + span::after {
  border-color: var(--theme-color-masala);
}

/* Non-deterministic specificity */
/* stylelint-disable no-descending-specificity */
label.knime-checkbox-medium {
  padding: 3px 0 3px 26px;

  &.knime-qf-title {
    padding-top: 0;
  }

  & input {
    & + span::before,
    & + span::after {
      top: 4.5px;
    }

    & + span::before {
      width: 14px;
      height: 14px;
    }

    &:checked + span::after { /* ✓ */
      left: -1px;
      top: 2.5px;
      width: 10px;
      height: 5px;
      border-width: 0 0 1.5px 1.5px;
    }
  }
}

label.knime-checkbox-large {
  padding: 6px 0 3px 1.5em;

  &.knime-qf-title {
    padding-top: 3px;
  }

  & input {
    & + span::before,
    & + span::after {
      top: 6.5px;
    }

    & + span::before {
      width: 1em;
      height: 1em;
    }

    &:checked + span::after { /* ✓ */
      left: 0;
      top: 5px;
      width: 0.6em;
      height: 0.35em;
      border-width: 0 0 2px 2px;
    }
  }
}
/* stylelint-enable */
</style>
