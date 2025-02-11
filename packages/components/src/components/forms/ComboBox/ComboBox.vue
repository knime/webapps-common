<script lang="ts">
import { type PropType, defineComponent } from "vue";

import CloseIcon from "@knime/styles/img/icons/close.svg";

import FunctionButton from "../../Buttons/FunctionButton.vue";
import Multiselect from "../Multiselect/Multiselect.vue";
import {
  type Id,
  type PossibleValue,
  createMissingItem,
} from "../possibleValues";

import "../variables.css";

const DRAFT_ITEM_ID = "draft-id-combobox-preview-item";

interface ComponentData {
  searchValue: string;
  inputOrOptionsFocussed: boolean;
  /*
   * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
   * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
   * it needs to be passed to the Multiselect component.
   */
  focusElement: any; // TODO - remove any type. Multiselect is not properly typed so when this value is passed as a prop the type-checker errors out
  refocusElement: any; // TODO - remove any type. Multiselect is not properly typed so when this value is passed as a prop the type-checker errors out
  allPossibleItems: Array<PossibleValue>;
}

type MultiselectRef = InstanceType<typeof Multiselect>;

export default defineComponent({
  name: "ComboBox",
  components: {
    Multiselect,
    FunctionButton,
    CloseIcon,
  },
  props: {
    /**
     * List of possible values. Each item must have an `id` and a `text` property. Some optional properties
     * can be used that are specified in Multiselect.vue.
     */
    possibleValues: {
      type: Array as PropType<Array<PossibleValue>>,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    /**
     * List of initial selected ids.
     */
    modelValue: {
      type: Array as PropType<Array<Id>>,
      default: () => [],
    },
    /**
     * Limit the number of visible options in the dropdown.
     */
    sizeVisibleOptions: {
      type: Number,
      default: 5,
      validator(value: number) {
        return value >= 0;
      },
    },
    /**
     * Close the dropdown when an entry was selected.
     */
    closeDropdownOnSelection: {
      type: Boolean,
      default: false,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    /**
     * Allow adding and selecting new tags, not just possible values
     */
    allowNewValues: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    "update:modelValue": (_payload: Array<Id>) => true,
  },

  data(): ComponentData {
    return {
      searchValue: "",
      inputOrOptionsFocussed: false,
      /*
       * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
       * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
       * it needs to be passed to the Multiselect component.
       */
      focusElement: null,
      refocusElement: null,
      allPossibleItems: [...this.possibleValues],
    };
  },

  computed: {
    trimmedSearchValue() {
      return this.searchValue.trim();
    },
    trimmedLowerCasedSearchValue() {
      return this.trimmedSearchValue.toLowerCase();
    },
    isSearchEmpty() {
      return !this.trimmedSearchValue;
    },

    searchResults() {
      const newIdIsExistingIdOrText = this.allPossibleItems.some(
        ({ id, text }) =>
          id === this.trimmedSearchValue || text === this.trimmedSearchValue,
      );

      const fuzzyMatchedItems = this.allPossibleItems.filter(
        ({ id, text }) =>
          text.toLowerCase().includes(this.trimmedLowerCasedSearchValue) ||
          id === this.trimmedSearchValue,
      );

      if (
        this.allowNewValues &&
        !newIdIsExistingIdOrText &&
        !this.isSearchEmpty
      ) {
        // add a preview for a non existing item
        return [
          { id: DRAFT_ITEM_ID, text: `${this.trimmedSearchValue} (new item)` },
          ...fuzzyMatchedItems,
        ];
      }

      return fuzzyMatchedItems;
    },

    hasSelection() {
      return this.selectedValues.length > 0;
    },

    inputWidth() {
      return this.inputOrOptionsFocussed && this.searchResults.length > 0
        ? {}
        : { width: "0%" };
    },

    selectedValues() {
      return this.modelValue.map(
        (id) =>
          this.allPossibleItems.find((item) => id === item.id) ||
          createMissingItem(id),
      );
    },

    maxSizeVisibleOptions() {
      return this.searchResults.length < this.sizeVisibleOptions
        ? this.searchResults.length
        : this.sizeVisibleOptions;
    },
  },

  created() {
    if (!this.allowNewValues) {
      this.$watch("possibleValues", (newPossibleValues) => {
        this.allPossibleItems = [...newPossibleValues];
      });
    }
  },

  mounted() {
    this.focusElement = this.$refs.searchInput as HTMLInputElement;
    this.refocusElement = this.$refs.listBox as HTMLDivElement;
  },

  methods: {
    emitNewSelection(newSelectedIds: Id[]) {
      this.$emit("update:modelValue", newSelectedIds);
    },
    focusInput() {
      (this.$refs.searchInput as HTMLInputElement).focus();
    },
    onDown() {
      (this.$refs.combobox as MultiselectRef).onDown();
    },
    onEnter() {
      if (
        this.isSearchEmpty ||
        typeof this.searchResults[0]?.id === "undefined" ||
        this.modelValue.includes(this.searchResults[0].id)
      ) {
        return;
      }

      this.updateSelectedIds([...this.modelValue, this.searchResults[0].id]);
      this.searchValue = "";
    },
    onBackspace() {
      if (!this.searchValue) {
        this.emitNewSelection(this.modelValue.slice(0, -1));
      }
      // else regular backspace behavior
    },
    onFocusOutside() {
      this.inputOrOptionsFocussed = false;
      this.searchValue = "";
    },
    onInput() {
      (this.$refs.combobox as MultiselectRef).updateFocusOptions();
    },
    onInputFocus() {
      if (!this.inputOrOptionsFocussed) {
        (this.$refs.combobox as MultiselectRef).toggle();
      }

      this.inputOrOptionsFocussed = true;
      (this.$refs.combobox as MultiselectRef).updateFocusOptions();
    },

    updateSelectedIds(selectedIds: Array<Id>) {
      const hasNewItem = selectedIds.includes(DRAFT_ITEM_ID);

      if (!hasNewItem) {
        this.emitNewSelection(selectedIds);
        return;
      }

      const newItem: PossibleValue = {
        id: this.trimmedSearchValue,
        text: this.trimmedSearchValue,
      };

      this.allPossibleItems.push(newItem);

      this.emitNewSelection(
        selectedIds.map((id) => (id === DRAFT_ITEM_ID ? newItem.id : id)),
      );
    },

    removeTag(idToRemove: Id) {
      this.emitNewSelection(this.modelValue.filter((id) => id !== idToRemove));
      this.closeOptions();
    },

    removeAllTags() {
      this.emitNewSelection([]);
      this.closeOptions();
    },
    closeOptionsAndStop(event: KeyboardEvent) {
      (this.$refs.combobox as MultiselectRef).closeOptionsAndStop(event);
    },
    closeOptions() {
      (this.$refs.combobox as MultiselectRef).closeOptions();
    },
    validate() {
      const isValid = !this.selectedValues.some(
        (x: PossibleValue) => x.invalid,
      );
      return {
        isValid,
        errorMessage: isValid
          ? null
          : "One or more of the selected items is invalid.",
      };
    },
  },
});
</script>

<template>
  <Multiselect
    ref="combobox"
    :model-value="modelValue"
    :possible-values="searchResults"
    use-custom-list-box
    :size-visible-options="maxSizeVisibleOptions"
    :parent-focus-element="focusElement"
    :parent-refocus-element-on-close="refocusElement"
    :close-dropdown-on-selection="closeDropdownOnSelection"
    :is-valid="isValid"
    :compact="compact"
    @focus-outside="onFocusOutside"
    @update:model-value="updateSelectedIds"
  >
    <template #listBox>
      <div
        ref="listBox"
        class="summary-input-icon-wrapper"
        tabindex="0"
        @keydown.enter.prevent.self="focusInput"
      >
        <div
          :class="[
            'summary-input-wrapper',
            { 'with-icon-right': hasSelection, compact },
          ]"
          @click.stop="focusInput"
        >
          <div
            v-for="({ id, text, invalid }, index) in selectedValues"
            :key="`item.id${index}`"
            class="tag"
            :title="text"
          >
            <span :class="['text', { invalid }]">{{ text }}</span>
            <FunctionButton
              class="remove-tag-button"
              :compact="compact"
              @click.stop="removeTag(id)"
            >
              <CloseIcon class="remove-tag-button-icon" />
            </FunctionButton>
          </div>
          <input
            ref="searchInput"
            v-model="searchValue"
            class="search-input"
            type="text"
            :style="inputWidth"
            @focus="onInputFocus"
            @input="onInput"
            @keydown.enter.prevent="onEnter"
            @keydown.backspace="onBackspace"
            @keydown.down.stop.prevent="onDown"
            @keydown.esc="closeOptionsAndStop"
          />
        </div>
        <div v-show="hasSelection" class="icon-right">
          <FunctionButton
            ref="removeAllTags"
            class="remove-all-tags-button"
            :compact="compact"
            @click.stop="removeAllTags"
          >
            <CloseIcon />
          </FunctionButton>
        </div>
      </div>
    </template>
  </Multiselect>
</template>

<style lang="postcss" scoped>
.multiselect {
  & .summary-input-icon-wrapper {
    border: var(--form-border-width) solid var(--knime-stone-gray);
    display: flex;
    justify-content: space-between;
    max-width: 100%;

    &:focus-within {
      border-color: var(--knime-masala);
    }

    &:focus {
      outline: none;
    }

    & .summary-input-wrapper {
      max-width: 100%;
      cursor: text;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      flex: 1;

      /** The height of the input field and tags inside the summary */
      --inner-height: 18px;

      padding: calc(
        (
            var(--single-line-form-height) - 2 * var(--form-border-width) -
              var(--inner-height)
          ) / 2
      );

      &.compact {
        padding: calc(
          (
              var(--single-line-form-height-compact) - 2 *
                var(--form-border-width) - var(--inner-height)
            ) / 2
        );
      }

      &.with-icon-right {
        max-width: calc(100% - 40px);
        padding-right: 0;
      }

      & .search-input {
        all: unset;
        height: var(--inner-height);
        font-size: 13px;
        font-weight: 300;
        line-height: normal;
        flex: 1;
      }

      & .tag {
        height: var(--inner-height);
        max-width: 100%;
        overflow: hidden;
        padding: 2px 2px 2px 5px;
        gap: 2px;
        display: flex;
        align-items: center;
        cursor: default;
        border: 1px solid var(--knime-dove-gray);

        & .text {
          font-weight: 500;
          font-size: 12px;
          color: var(--knime-dove-gray);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 12px;

          &.invalid {
            color: var(--theme-color-error);
          }
        }

        & .remove-tag-button {
          padding: 2px;

          & :deep(svg) {
            --icon-size: 10;

            width: calc(var(--icon-size) * 1px);
            height: calc(var(--icon-size) * 1px);
            stroke-width: calc(32px / var(--icon-size));
          }
        }
      }
    }

    & .icon-right {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
