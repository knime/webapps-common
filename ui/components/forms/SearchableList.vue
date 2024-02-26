<script lang="ts">
import MultiselectListBox from "../forms/MultiselectListBox.vue";
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import { ref, computed } from "vue";
import useSearch from "../../composables/useSearch";
import type { PropType } from "vue";
import type {
  Id,
  PossibleValue,
  BottomValue,
} from "../../services/types/types";

const MIN_LIST_SIZE = 5;
const DEF_PIX_SIZE = 22;

export default {
  components: {
    MultiselectListBox,
    Label,
    SearchInput,
  },
  props: {
    initialCaseSensitiveSearch: {
      default: false,
      type: Boolean,
    },
    bottomValue: {
      type: Object as PropType<BottomValue>,
      default: () => ({ id: "bottom", text: "Other" }),
      validator(value: BottomValue) {
        return value.hasOwnProperty("id") && value.hasOwnProperty("text");
      },
    },
    withBottomValue: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      required: true,
      default: "Possible values",
    },
    /**
     * Controls the size of the list.
     * Number of visible items (for others user need to scroll)
     * - 0 means all
     * - values 1 - 4  are ignored; 5 is minimum
     */
    size: {
      type: Number,
      default: 0,
      validator(value: number) {
        return value >= 0;
      },
    },
    alignment: {
      type: String,
      default: "horizontal",
      validator(value: string) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
    id: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Array as PropType<Id[] | null>,
      default: () => {},
    },
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => [],
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    withSearchLabel: {
      default: false,
      type: Boolean,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    /**
     * Labels
     */
    searchLabel: {
      type: String,
      required: false,
      default: "",
    },
    searchPlaceholder: {
      type: String,
      required: false,
      default: "Search",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    initialSearchTerm: {
      type: String,
      default: "",
    },
    showEmptyState: {
      default: true,
      type: Boolean,
    },
    /**
     * Is only used when emptyStateComponent is null
     */
    emptyStateLabel: {
      default: "No entries in this list",
      type: String,
    },
    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
      default: null,
      type: Object,
    },
    filterChosenValuesOnPossibleValuesChange: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const chosenValues = ref(props.modelValue);
    const searchTerm = ref(props.initialSearchTerm);
    const caseSensitiveSearch = ref(props.initialCaseSensitiveSearch);

    /**
     * Values nested in the props in Composition api are not reactive
     */
    const reactiveModelValue = computed(() => {
      return props.modelValue;
    });

    /**
     * Values nested in the props in Composition api are not reactive
     */
    const reactivePossibleValues = computed(() => {
      return props.possibleValues;
    });

    const {
      concatenatedItems,
      numSelectedItems,
      numAllLists,
      numMatchedSearchedItemSelected,
      numMatchedSearchedItems,
      hasActiveSearch,
      visibleValueIds,
      invalidValueIds,
    } = useSearch(
      props.filterChosenValuesOnPossibleValuesChange,
      chosenValues,
      reactivePossibleValues,
      reactiveModelValue,
      caseSensitiveSearch,
      props.showSearch,
      searchTerm,
      emit,
    );

    return {
      visibleValueIds,
      chosenValues,
      searchTerm,
      concatenatedItems,
      caseSensitiveSearch,
      numSelectedItems,
      numAllLists,
      numMatchedSearchedItemSelected,
      numMatchedSearchedItems,
      hasActiveSearch,
      invalidValueIds,
    };
  },
  data() {
    return {
      selectedValues: [] as Id[],
    };
  },
  computed: {
    listSize() {
      // fixed size even when showing all to prevent height jumping when moving items between lists
      const size = this.size === 0 ? this.possibleValues.length : this.size;
      // limit size to minimum
      return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
    },
    getInfo() {
      if (!this.hasActiveSearch) {
        return false;
      }
      return `${this.numSelectedItems} of ${this.numAllLists} selected [${this.numMatchedSearchedItemSelected} of ${this.numMatchedSearchedItems}]`;
    },
    cssStyleSize() {
      const pixSize = `${this.listSize * DEF_PIX_SIZE + 2}px`;

      return this.listSize > 0 ? { height: pixSize } : {};
    },
    allignmentCheck() {
      if (this.alignment === "vertical") {
        const calcedStyle = this.cssStyleSize;

        return calcedStyle;
      }
      return { height: "auto" };
    },
  },
  methods: {
    hasSelection() {
      return (this.chosenValues?.length ?? 0) > 0;
    },
    onChange(newVal: Id[]) {
      this.chosenValues = newVal;
    },
    onSearchInput(value: string) {
      this.searchTerm = value;
    },
    validate() {
      let isValid = !this.concatenatedItems.some(
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
};
</script>

<template>
  <Label
    v-if="showSearch"
    #default="{ labelForId }"
    :active="withSearchLabel"
    :text="searchLabel"
    class="search-wrapper"
  >
    <SearchInput
      :id="labelForId"
      ref="search"
      :placeholder="searchPlaceholder"
      :model-value="searchTerm"
      :label="searchLabel"
      :initial-case-sensitive-search="initialCaseSensitiveSearch"
      show-case-sensitive-search-button
      :disabled="disabled"
      @update:model-value="onSearchInput"
      @toggle-case-sensitive-search="caseSensitiveSearch = $event"
    />
  </Label>
  <div class="header">
    <div class="title">
      <div v-if="getInfo" class="info">{{ getInfo }}</div>
    </div>
  </div>
  <!-- eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->

  <MultiselectListBox
    :id="id"
    ref="form"
    :ariaLabel="ariaLabel"
    :with-is-empty-state="showEmptyState"
    :empty-state-label="emptyStateLabel"
    :empty-state-component="emptyStateComponent"
    :size="listSize"
    :possible-values="concatenatedItems"
    :model-value="modelValue"
    :is-valid="isValid"
    :with-bottom-value="withBottomValue"
    :bottom-value="bottomValue"
    :disabled="disabled"
    @update:model-value="onChange"
  />
</template>

<style scoped>
.header {
  display: flex;
  align-items: stretch;
  flex-direction: row;
  justify-content: flex-end;
  height: 20px;

  & .info {
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 8px;
    font-weight: 300;
    white-space: nowrap;
    display: flex;
  }

  & .title {
    line-height: 18px;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 5px;
  }
}
</style>
