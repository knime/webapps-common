<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentValue: this.value
        };
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
  <label>
    <input
      v-model="currentValue"
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
  padding: 4px 0 3px 1.5em;
}

input {
  opacity: 0;
  position: absolute;

  & + span::before {
    background: var(--theme-color-porcelain);
    width: 1em;
    height: 1em;
    display: inline-block;
    content: '';
  }

  & + span::before,
  & + span::after {
    position: absolute;
    left: 0;
    top: 6.5px;
  }

  &:checked + span::before {
    background: var(--theme-color-masala);
    content: '';
  }

  &:checked + span::after { /* ✓ */
    content: '';
    position: absolute;
    display: block;
    left: 0;
    top: 5px;
    width: 0.6em;
    height: 0.35em;
    border: solid var(--theme-color-white);
    border-width: 0 0 1px 1px;
    transform: translate(0.2em, 0.35em) rotate(-45deg);
  }
}

label:hover input + span::before {
  background: var(--theme-color-silver-sand);
}

label:hover input + span::after {
  border-color: var(--theme-color-masala);
}
</style>
