<script>
import CloseIcon from '../../assets/img/icons/close.svg';
import LensIcon from '../../assets/img/icons/lens.svg';

import FunctionButton from '../FunctionButton.vue';

/**
 * Search input box for searches in other components, like the TwinList.
 * Implements the v-model pattern.
 */
export default {
    components: {
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
  <div
    id="search-bar"
    class="search-bar"
  >
    <div class="lens-icon">
      <LensIcon />
    </div>
    <input
      :id="id"
      ref="searchInput"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :disabled="disabled"
      autocomplete="off"
      role="searchbox"
      @input="$emit('input', $event.target.value)"
    >
    <FunctionButton
      class="clear-search"
      @click="clearSearch"
    >
      <CloseIcon />
    </FunctionButton>
  </div>
</template>

<style lang="postcss" scoped>
.search-bar {
  margin-bottom: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid var(--knime-stone-gray);
  background-color: var(--knime-white);
  font-size: 13px;
  font-weight: 300;
  height: 40px;

  & .lens-icon {
    display: flex;
    padding: 6px;
    margin-left: 3px;
    pointer-events: none;
    --icon-size: 18;

    & svg {
      vertical-align: top;
      stroke: var(--theme-button-function-foreground-color);
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);
      stroke-width: calc(32px / var(--icon-size));
    }
  }

  & .clear-search {
    --icon-size: 12;

    margin-right: calc(var(--icon-size) / 2 * 1px);

    & >>> svg {
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);
      stroke-width: calc(32px / var(--icon-size));
    }
  }

  & .search-wrapper {
    margin-bottom: 10px;
  }

  &:hover:not(:focus):not(:disabled) {
    background-color: var(--theme-input-field-background-color-focus);
  }
}

input {
  flex-grow: 1;
  height: 100%;
  border: 0;
  padding-right: 6px;
  color: var(--knime-masala);
  background-color: transparent;

  &::placeholder {
    color: var(--knime-dove-gray);
  }

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    border-color: var(--knime-masala);
  }

  &:placeholder-shown + button {
    visibility: hidden;
  }

  &:disabled + button {
    visibility: hidden;
  }
}
</style>
