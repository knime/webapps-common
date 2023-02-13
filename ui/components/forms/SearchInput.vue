<script>
import CloseIcon from '../../assets/img/icons/close.svg';
import LensIcon from '../../assets/img/icons/lens.svg';
import InverseSearchIcon from '../../assets/img/icons/arrows-order-left-right.svg';
import UpperLowerCaseIcon from '../../assets/img/icons/upper-lower-case.svg';

import InputField from './InputField.vue';
import FunctionButton from '../FunctionButton.vue';

/**
 * Search input box for searches in other components, like the Twinlist.
 * Implements the v-model pattern.
 */
export default {
    components: {
        InputField,
        FunctionButton,
        CloseIcon,
        LensIcon,
        InverseSearchIcon,
        UpperLowerCaseIcon
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
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            // A pseudo-placeholder to allow hiding the clear-button without any input
            default: ' '
        },
        initialCaseSensitiveSearch: {
            default: false,
            type: Boolean
        },
        initialInverseSearch: {
            default: false,
            type: Boolean
        },
        showCaseSensitiveSearchButton: {
            default: false,
            type: Boolean
        },
        showInverseSearchButton: {
            default: false,
            type: Boolean
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
    emits: ['clear', 'update:modelValue', 'toggle-case-sensitive-search', 'toggle-inverse-search', 'focus'],
    data() {
        return {
            caseSensitiveSearch: this.initialCaseSensitiveSearch,
            inverseSearch: this.initialInverseSearch
        };
    },
    methods: {
        clearSearch() {
            this.$emit('clear');
            this.$emit('update:modelValue', '');
            this.focus();
        },
        toggleCaseSensitiveSearch() {
            this.caseSensitiveSearch = !this.caseSensitiveSearch;
            this.$emit('toggle-case-sensitive-search', this.caseSensitiveSearch);
            this.focus();
        },
        toggleInverseSearch() {
            this.inverseSearch = !this.inverseSearch;
            this.$emit('toggle-inverse-search', this.inverseSearch);
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
    :model-value="modelValue"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :disabled="disabled"
    class="search-input"
    :class="{disabled}"
    autocomplete="off"
    role="searchbox"
    @focus="$emit('focus', $event)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #icon>
      <LensIcon v-if="!disabled" />
    </template>
    <template #iconRight>
      <FunctionButton
        v-show="!disabled"
        class="clear-search"
        @click="clearSearch"
      >
        <CloseIcon />
      </FunctionButton>
      <FunctionButton
        v-if="!disabled && showCaseSensitiveSearchButton"
        class="toggle-case-sensitive-search"
        :active="caseSensitiveSearch"
        @click="toggleCaseSensitiveSearch"
      >
        <UpperLowerCaseIcon />
      </FunctionButton>
      <FunctionButton
        v-if="!disabled && showInverseSearchButton"
        class="toggle-inverse-search"
        :active="inverseSearch"
        @click="toggleInverseSearch"
      >
        <InverseSearchIcon />
      </FunctionButton>
    </template>
  </InputField>
</template>

<style lang="postcss" scoped>
.search-input {
  &:has(input:placeholder-shown) .clear-search {
    visibility: hidden;
  }
}

.disabled {
  opacity: 0.5;
}

</style>
