<script>
/**
 * Default text area for widgets.
 */
export default {
    props: {
        value: {
            default: '',
            type: String
        },
        isValid: {
            default: false,
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
            default: '',
            type: String
        }
    },
    computed: {
        textAreaClass() {
            const classes = ['knime-qf-input', 'knime-string', 'knime-multi-line'];
            if (!this.isValid) {
                classes.push('knime-textarea-invalid');
            }
            return classes;
        }
    },
    methods: {
        getValue() {
            return this.$el.value;
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
    :value="value"
    :class="textAreaClass"
    :cols="cols"
    :rows="rows"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

textarea.knime-qf-input {
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

textarea.knime-textarea-invalid {
  border-left-color: var(--theme-color-error);
}
</style>

