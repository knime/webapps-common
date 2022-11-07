<script>
import CloseIcon from '../../assets/img/icons/close.svg';
import LensIcon from '../../assets/img/icons/lens.svg';

import InputField from './InputField.vue';
import FunctionButton from '../FunctionButton.vue';

/**
 * Search input box for searches in other components, like the TwinList.
 * Implements the v-model pattern.
 */
export default {
    components: {
        InputField,
        FunctionButton,
        CloseIcon,
        LensIcon
    },
    props: {
        id: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            // A pseudo-placeholder to allow hiding the clear-button without any input
            default: ' '
        },
        autofocus: {
            default: false,
            type: Boolean
        },
        disabled: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        clearSearch() {
            this.$emit('clear');
            this.$emit('input', '');
            this.focus();
        },
        focus() {
            this.$refs.searchInput.focus();
        }
    }

};
</script>

<template>
  <InputField
    :id="id"
    ref="searchInput"
    :name="name"
    :value="value"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :disabled="disabled"
    class="search-input"
    autocomplete="off"
    role="searchbox"
    @input="$emit('input', $event)"
  >
    <template #icon>
      <LensIcon />
    </template>
    <template #iconRight>
      <FunctionButton
        v-show="!disabled"
        class="clear-search"
        @click="clearSearch"
      >
        <CloseIcon />
      </FunctionButton>
    </template>
  </InputField>
</template>

<style lang="postcss" scoped>
.search-input {
  & .clear-search {
    position: absolute;
    --icon-size: 12;

    margin-right: calc(var(--icon-size) / 2 * 1px);
    top: -2px; /* Move clear-all button up 6px to be centered with FunctionButton in use. */

    & >>> svg {
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);

      /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
      stroke-width: calc(32px / var(--icon-size));
    }
  }

  &:has(input:placeholder-shown) .clear-search {
    visibility: hidden;
  }
}

</style>
