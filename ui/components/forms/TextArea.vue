<script>
export default {
    props: {
        value: {
            default: '',
            type: [Number, String]
        },
        id: {
            type: String,
            default: null
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
        },
        title: {
            default: null,
            type: String
        }
    },
    computed: {
        inputClassList() {
            let classes = this.inputClasses;
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
      class="invalid-marker"
    />
    <textarea
      :id="id"
      ref="input"
      :title="title"
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
  display: block;
  max-width: max-content;

  & textarea {
    font-size: 13px;
    font-weight: 300;
    color: var(--theme-text-normal-color);
    font-family: var(--theme-text-normal-font-family);
    line-height: 18px;
    padding: 11px 10px 11px 10px;
    border-radius: 0;
    border: 1px solid var(--knime-stone-gray);
    outline: none;
    display: block;

    &::placeholder {
      color: var(--knime-dove-gray);
    }

    &:focus {
      border-color: var(--knime-masala);
    }

    &:hover:not(:focus):not(:disabled) {
      background-color: var(--knime-silver-sand-semi);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: -1px;
    margin: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background-color: var(--theme-color-error);
  }
}

</style>

