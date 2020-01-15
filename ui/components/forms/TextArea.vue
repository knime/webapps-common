<script>
export default {
    props: {
        value: {
            default: '',
            type: [Number, String]
        },
        /**
         * validity needs to be controlled by the parent component to be flexible
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
        },
        validate() {
            const value = this.getValue();
            return Boolean(value || value === '');
        }
    }
};
</script>

<template>
  <textarea
    ref="input"
    :value="value"
    :class="inputClassList"
    :cols="cols"
    :rows="rows"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

textarea {
  font-size: 13px;
  font-weight: 500;
  color: var(--theme-color-masala);
  line-height: 18px;
  background-color: var(--theme-color-porcelain);
  margin: 0;
  padding: 11px 10px 11px 10px;
  border-radius: 0;
  border: none;
  outline: none;
  border-left-width: 3px;
  border-color: transparent;
  border-left-style: solid;
}

textarea.invalid {
  border-left-color: var(--theme-color-error);
}
</style>

