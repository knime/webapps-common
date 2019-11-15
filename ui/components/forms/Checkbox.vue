<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        boxSize: {
            type: String,
            default: 'Large'
        }
    },
    computed: {
        /**
         * Default class knime-checkbox-large
         *
         * @returns {String} class name for checkbox sizing
         */
        boxSizingClass() {
            let size = this.boxSize.toLowerCase();
            if (size.match(/m.*d/)) {
                return 'knime-checkbox-medium';
            } else {
                return 'knime-checkbox-large';
            }
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
    :class="[boxSizingClass, 'knime-qf-title']"
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

label.knime-checkbox-medium {
  padding: 5px 0 3px 26px;

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
  padding: 4px 0 3px 1.5em;

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

label:hover input + span::before {
  background: var(--theme-color-silver-sand);
}

label:hover input + span::after {
  border-color: var(--theme-color-masala);
}
</style>
