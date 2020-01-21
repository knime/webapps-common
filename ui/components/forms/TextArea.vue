<script>
export default {
    props: {
        value: {
            default: '',
            type: [Number, String]
        },
        /**
         * Validity controlled by the parent component to be flexible.
         */
        isValid: {
            default: true,
            type: Boolean
        },
        cols: {
            default: 12,
            type: Number
        },
        rows: {
            default: 4,
            type: Number
        },
        placeholder: {
            default: null,
            type: String
        },
        inputClasses: {
            default: '',
            type: String
        }
    },
    computed: {
        inputClassList() {
            let classes = this.inputClasses;

            if (!this.isValid) {
                classes += ' invalid';
            }
            return classes;
        }
    },
    methods: {
        getValue() {
            return this.$refs.input.value;
        },
        onInput(e) {
            this.$emit('input', this.getValue());
        }
    }
};
</script>

<template>
  <div>
    <span
      v-if="!isValid"
      class="marker invalid"
    />
    <textarea
      ref="input"
      :value="value"
      :class="inputClassList"
      :cols="cols"
      :rows="rows"
      :placeholder="placeholder"
      @input="onInput"
    />
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

div {
  position: relative;

  & textarea {
    font-size: 13px;
    font-weight: 500;
    color: var(--theme-color-masala);
    line-height: 18px;
    margin: 0;
    padding: 11px 10px 11px 10px;
    border-radius: 0;
    border: 1px solid var(--theme-color-stone-gray);
    outline: none;
    display: block;

    &:hover:not(:focus):not(:disabled) {
      background-color: var(--theme-color-porcelain);
    }

    &::placeholder {
      font-weight: 300;
    }
  }

  & .marker {
    background-color: transparent;
    position: absolute;
    display: block;
    width: 3px;
    left: -1px;
    margin: 0;
    top: 0;
    bottom: 0;
    z-index: 10;

    &.invalid {
      background-color: var(--theme-color-error);
    }
  }
}

</style>

