<script lang="ts">
import MultiselectListBox from "../forms/MultiselectListBox.vue";
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import { ref, computed } from "vue";
import useSearch from "../../composables/useSearch";
import type { ComputedRef, PropType } from "vue";
import type { Id, PossibleValue, BottomValue } from "../../composables/types";
import createMissingItem from "./possibleValues/createMissingItem";
import useLabelInfoForSearchableWidgets from "../../composables/useLabelInfoForSearchableWidgets";

const MIN_LIST_SIZE = 5;

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
  setup(props) {
    const possibleValues = ref(props.possibleValues);
    const chosenValues = ref(props.modelValue);
    const searchTerm = ref(props.initialSearchTerm);
    const caseSensitiveSearch = ref(props.initialCaseSensitiveSearch);

    const possibleValueMap = computed(() => {
      return Object.assign(
        {},
        ...possibleValues.value.map((obj: PossibleValue, index) => ({
          [obj.id]: { item: obj, index },
        })),
      );
    });

    const matchingValidIds: ComputedRef<PossibleValue[]> = computed(() => {
      return possibleValues.value.map(
        (possibleValue: PossibleValue) =>
          possibleValueMap.value[possibleValue.id]?.item ||
          createMissingItem(possibleValue.id),
      );
    });

    const invalidValueIds = computed(() => {
      if (chosenValues.value === null) {
        return [];
      }
      return chosenValues.value.filter((x: Id) => !possibleValueMap.value[x]);
    });

    const allItems = computed(() => {
      if (!props.showSearch) {
        return matchingValidIds.value;
      }

      const { filteredValues: firstArr } = useSearch(
        searchTerm,
        caseSensitiveSearch,
        matchingValidIds,
      );
      return firstArr.value;
    });

    const visibleValueIds = computed(() => {
      if (chosenValues.value === null) {
        return new Set();
      }
      return new Set([...allItems.value]);
    });

    const concatenatedItems = computed(() => {
      if (visibleValueIds.value.size === 0) {
        return [];
      }
      return possibleValues.value.filter((value: PossibleValue) =>
        visibleValueIds.value.has(value),
      );
    });

    const hasActiveSearch = computed(() => {
      return props.showSearch && searchTerm.value !== "";
    });

    const numAllLists = computed(() => {
      return possibleValues.value.length;
    });

    const numMatchedSearchedItems = computed(() => {
      const filteredList = concatenatedItems.value.filter(
        (item: { text: string }) =>
          item.text.toLowerCase().includes(searchTerm.value),
      );
      return filteredList;
    });

    const numLabelInfos = computed(() => {
      if (!props.showSearch) {
        return `[ ${chosenValues.value?.length} selected ]`;
      }
      return hasActiveSearch.value
        ? useLabelInfoForSearchableWidgets(
            numMatchedSearchedItems,
            chosenValues,
            numAllLists.value,
          ).value
        : `[ ${chosenValues.value?.length} selected ]`;
    });

    return {
      concatenatedItems,
      visibleValueIds,
      chosenValues,
      searchTerm,
      matchingValidIds,
      caseSensitiveSearch,
      invalidValueIds,
      numLabelInfos,
    };
  },
  computed: {
    listSize() {
      // fixed size even when showing all to prevent height jumping when moving items between lists
      const size = this.size === 0 ? this.possibleValues.length : this.size;
      // limit size to minimum
      return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
    },
  },
  watch: {
    possibleValues(newPossibleValues: PossibleValue[]) {
      if (this.filterChosenValuesOnPossibleValuesChange) {
        // Required to prevent invalid values from appearing (e.g. missing b/c of upstream filtering)
        const allValues = newPossibleValues.reduce((arr, valObj) => {
          arr.push(...Object.values(valObj));
          return arr;
        }, [] as Id[]);
        // Reset chosenValues as subset of original to prevent re-execution from resetting value
        this.chosenValues = (this.chosenValues ?? []).filter((item) =>
          allValues.includes(item),
        );
      }
    },
    chosenValues(newVal: Id[], oldVal: Id[] | null) {
      if (
        oldVal === null ||
        newVal.length !== oldVal.length ||
        oldVal.some((item, i) => item !== newVal[i])
      ) {
        // emit modelValue after changes in possibleValues
        this.$emit("update:modelValue", this.chosenValues);
      }
    },
  },
  methods: {
    hasSelection() {
      return (this.chosenValues?.length ?? 0) > 0;
    },
    onChange(newVal: Id[]) {
      this.$emit("update:modelValue", newVal);
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
      <div v-if="numLabelInfos" class="info">{{ numLabelInfos }}</div>
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
