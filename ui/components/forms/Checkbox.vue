<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        boxSize: {
            type: String,
            default: '1em'
        },
        boxPadding: {
            type: String,
            default: '4px 0 3px 1.5em'
        },
        checkHeight: {
            type: String,
            default: '0.35em'
        },
        checkWidth: {
            type: String,
            default: '0.6em'
        },
        checkTop: {
            type: String,
            default: '5px'
        },
        checkLeft: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            currentValue: this.value
        };
    },
    computed: {
        cssProps() {
            return {
                '--checkbox-size': this.boxSize,
                '--checkbox-padding': this.boxPadding,
                '--check-height': this.checkHeight,
                '--check-width': this.checkWidth,
                '--check-top': this.checkTop,
                '--check-left': this.checkLeft
            };
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
    class="knime-qf-title"
    :style="cssProps"
  >
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
  padding: var(--checkbox-padding);
}

input {
  opacity: 0;
  position: absolute;

  & + span::before {
    background: var(--theme-color-porcelain);
    width: var(--checkbox-size);
    height: var(--checkbox-size);
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
    left: var(--check-left);
    top: var(--check-top);
    width: var(--check-width);
    height: var(--check-height);
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
