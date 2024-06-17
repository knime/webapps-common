<script>
import CloseIcon from "../../assets/img/icons/close.svg";
import LensIcon from "../../assets/img/icons/lens.svg";
import InverseSearchIcon from "../../assets/img/icons/arrows-order-left-right.svg";
import UpperLowerCaseIcon from "../../assets/img/icons/upper-lower-case.svg";

import InputField from "./InputField.vue";
import FunctionButton from "../FunctionButton.vue";

const defaultTooltips = {
  clear: "Clear",
  inverseSearch: "Exclude results that match query",
  caseSensitive: "Toggle case sensitivity",
};

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
    UpperLowerCaseIcon,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      // A pseudo-placeholder to allow hiding the clear-button without any input
      default: " ",
    },
    initialCaseSensitiveSearch: {
      default: false,
      type: Boolean,
    },
    initialInverseSearch: {
      default: false,
      type: Boolean,
    },
    showCaseSensitiveSearchButton: {
      default: false,
      type: Boolean,
    },
    showInverseSearchButton: {
      default: false,
      type: Boolean,
    },
    autofocus: {
      default: false,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    tooltips: {
      type: Object,
      default: () => ({}),
    },
    focusOnMount: {
      type: Boolean,
      default: false,
    },
    ariaActivedescendant: {
      type: String,
      default: null,
    },
    ariaOwns: {
      type: String,
      default: null,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "clear",
    "update:modelValue",
    "toggle-case-sensitive-search",
    "toggle-inverse-search",
    "focus",
  ],
  data() {
    return {
      caseSensitiveSearch: this.initialCaseSensitiveSearch,
      inverseSearch: this.initialInverseSearch,
    };
  },
  computed: {
    showClearButton() {
      return !this.disabled && this.modelValue !== "";
    },
    showSpacer() {
      return (
        this.showClearButton &&
        (this.showCaseSensitiveSearchButton || this.showInverseSearchButton)
      );
    },
    tooltipsWithDefaults() {
      return { ...defaultTooltips, ...this.tooltips };
    },
  },
  expose: ["focus"],
  async mounted() {
    if (this.focusOnMount) {
      await this.$nextTick();
      this.focus();
    }
  },
  methods: {
    clearSearch() {
      this.$emit("clear");
      this.$emit("update:modelValue", "");
      this.focus();
    },
    toggleCaseSensitiveSearch() {
      this.caseSensitiveSearch = !this.caseSensitiveSearch;
      this.$emit("toggle-case-sensitive-search", this.caseSensitiveSearch);
      this.focus();
    },
    toggleInverseSearch() {
      this.inverseSearch = !this.inverseSearch;
      this.$emit("toggle-inverse-search", this.inverseSearch);
      this.focus();
    },
    focus() {
      this.$refs.searchInput.focus();
    },
  },
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
    :class="{ disabled }"
    autocomplete="off"
    :aria-owns="ariaOwns"
    :aria-activedescendant="ariaActivedescendant"
    role="searchbox"
    :compact="compact"
    @focus="$emit('focus', $event)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #icon>
      <div v-if="!disabled" class="icon-slot-wrapper">
        <slot name="icon">
          <LensIcon />
        </slot>
      </div>
    </template>
    <template #iconRight>
      <FunctionButton
        v-if="showClearButton"
        class="clear-search"
        :compact="compact"
        :title="tooltipsWithDefaults.clear"
        @click="clearSearch"
      >
        <CloseIcon />
      </FunctionButton>
      <span v-if="showSpacer" class="spacer" />
      <FunctionButton
        v-if="!disabled && showCaseSensitiveSearchButton"
        class="toggle-case-sensitive-search"
        :compact="compact"
        :active="caseSensitiveSearch"
        :title="tooltipsWithDefaults.caseSensitive"
        @click="toggleCaseSensitiveSearch"
      >
        <UpperLowerCaseIcon />
      </FunctionButton>
      <FunctionButton
        v-if="!disabled && showInverseSearchButton"
        class="toggle-inverse-search"
        :compact="compact"
        :title="tooltipsWithDefaults.inverseSearch"
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
  & .spacer {
    border: 0.4pt solid var(--knime-silver-sand);
    height: 20px;
    margin: auto 0.3em auto 0.2em;
  }
}

.disabled {
  opacity: 0.5;
}

.icon-slot-wrapper {
  /* This is done to make the wrapper have the same height as its content. */
  display: contents;
}
</style>
