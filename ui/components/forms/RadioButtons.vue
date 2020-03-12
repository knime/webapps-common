<script>
let count = 0;
export default {
    props: {
        id: {
            type: String,
            default() {
                return `RadioButtons-${count++}`;
            }
        },
        value: {
            type: String,
            default: ''
        },
        /**
         * Controls the alignment of the RadioButtons
         */
        alignment: {
            type: String,
            default: 'horizontal',
            validator(val) {
                return ['horizontal', 'vertical'].includes(val);
            }
        },
        /**
         * List of possible values. Each item must have an `id` and a `text` property
         * @example
         * [{
         *   id: 'pdf',
         *   text: 'PDF'
         * }, {
         *   id: 'XLS',
         *   text: 'Excel',
         * }]
         */
        possibleValues: {
            type: Array,
            default: () => [],
            validator(values) {
                if (!Array.isArray(values)) {
                    return false;
                }
                return values.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('text'));
            }
        }
    },
    methods: {
        onInput($event) {
            /**
             * Fired when the radio button value changes.
             *
             * @event input
             * @type {String}
             */
            let value = $event.target.value;
            consola.trace('RadioButton value changed to', value);
            this.$emit('input', value);
        },
        hasSelection() {
            /* looks in the DOM if one radio button is checked */
            return this.$refs.input.some(x => x.checked);
        }
    }
};
</script>

<template>
  <div
    :class="['radio-buttons', alignment]"
    role="radiogroup"
  >
    <label
      v-for="item of possibleValues"
      :key="`radio-${item.id}`"
    >
      <input
        ref="input"
        :checked="(value === item.id)"
        :value="item.id"
        :name="`radio-${id}`"
        type="radio"
        @change="onInput"
      >
      <span :title="item.text">
        {{ item.text }}
      </span>
    </label>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.radio-buttons {
  & label {
    position: relative;
    font-weight: 300;
    font-size: 14px;
    line-height: 18px;
    padding: 3px 0 3px 23px;

    & input {
      opacity: 0;
      position: absolute;

      & + span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & + span::before { /* ◯ */
        border: 1px solid var(--theme-color-stone-gray);
        display: inline-block;
        content: '';
        width: 14px;
        height: 14px;
        border-radius: 100%;
        left: 0;
        top: 4px;
        position: absolute;
        vertical-align: top;
        cursor: pointer;
        text-align: center;
      }

      &:checked + span::before { /* 🔘 */
        background: var(--theme-color-white);
        border-color: var(--theme-color-masala);
        content: '';
        box-shadow: inset 0 0 0 4px var(--theme-color-masala);
      }
    }

    /* keyboard focus; :focus-visible would be better once browser support
         is there https://caniuse.com/#feat=css-focus-visible */
    & input:focus + span::before { /* ◯ */
      background: var(--theme-color-silver-sand-semi);
    }

    /* hover state */
    &:hover input + span::before { /* ◯ */
      background: var(--theme-color-silver-sand-semi);
    }

    /* keyboard focus; :focus-visible would be better once browser support
       is there https://caniuse.com/#feat=css-focus-visible */
    & input:checked:focus + span::before { /* 🔘 */
      box-shadow: unset;
      background: radial-gradient(
        ellipse at center,
        var(--theme-color-masala) 0%,
        var(--theme-color-masala) 25%,
        var(--theme-color-silver-sand-semi) 26%,
        var(--theme-color-silver-sand-semi) 100%
      );
    }

    /* hover state  checked */
    &:hover input:checked + span::before { /* 🔘 */
      box-shadow: unset;
      background: radial-gradient(
        ellipse at center,
        var(--theme-color-masala) 0%,
        var(--theme-color-masala) 25%,
        var(--theme-color-silver-sand-semi) 26%,
        var(--theme-color-silver-sand-semi) 100%
      );
    }
  }

  &.vertical label {
    display: block;
  }

  &.horizontal {
    display: flex;
    flex-wrap: wrap;

    & label {
      display: block;
      min-width: 0; /* sizing and text overflow with flexbox - see https://stackoverflow.com/a/26535469 */

      &:not(:last-of-type) {
        padding-right: 12px;
      }
    }
  }
}
</style>
