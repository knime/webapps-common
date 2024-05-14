<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import Checkboxes from "../forms/Checkboxes.vue";
import { ref, computed } from "vue";
import type { ComputedRef, PropType } from "vue";
import type { Id, PossibleValue } from "../../composables/types";
import useSearch from "../../composables/useSearch";
import useLabelInfoForSearchableWidgets from "../../composables/useLabelInfoForSearchableWidgets";

const MIN_LIST_SIZE = 5;
const DEF_PIX_SIZE = 22;

export default {
  components: { Label, SearchInput, Checkboxes },

  props: {
    /**
     *  selected value (which is a list of ids of entries)
     */
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => {},
      validator(values: PossibleValue) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    modelValue: {
      type: Array as PropType<Id[] | null>,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    withSearchLabel: {
      default: false,
      type: Boolean,
    },
    id: {
      type: String,
      default: null,
    },
    initialCaseSensitiveSearch: {
      default: false,
      type: Boolean,
    },

    showSearch: {
      type: Boolean,
      default: false,
    },

    /**
     * Controls the size of the list.
     * Number of visible items (for others user need to scroll)
     * - 0 means all
     * - values 1 - 4  are ignored; 5 is minimum
     */

    size: {
      type: Number,
      default: 3,
      validator(value: number) {
        return value >= 0;
      },
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
    /**
     * controls the alignment
     */
    alignment: {
      type: String,
      default: "horizontal",
      validator(value: string) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
    /**
     * Is only used when emptyStateComponent is null
     */

    emptyStateLabel: {
      type: String,
      default: "No entires in this list",
    },
    filterChosenValuesOnPossibleValuesChange: {
      type: Boolean,
      default: true,
      required: false,
    },
    initialSearchTerm: {
      type: String,
      required: false,
      default: "",
    },
    showEmptyState: {
      default: true,
      type: Boolean,
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    /**
     * Is only used when emptyStateComponent is null
     */

    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
      default: null,
      type: Object,
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
      return possibleValues.value?.map(
        (possibleValue: PossibleValue) =>
          possibleValueMap.value[possibleValue.id]?.item,
      );
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
      return possibleValues.value?.length;
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
      chosenValues,
      searchTerm,
      concatenatedItems,
      caseSensitiveSearch,
      numLabelInfos,
    };
  },

  computed: {
    withIsEmptyState() {
      return this.concatenatedItems.length === 0;
    },
    listSize() {
      const size = this.size === 0 ? this.possibleValues.length : this.size;

      return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
    },
    cssStyleSize() {
      const pixSize = `${this.listSize * DEF_PIX_SIZE + 2}px`;

      return this.listSize > 0 ? { height: pixSize } : {};
    },
    returnContainerRef() {
      return this.$refs.div as HTMLDivElement;
    },
    allignmentCheck() {
      if (this.alignment === "vertical") {
        const calcedStyle = this.cssStyleSize;

        return calcedStyle;
      }
      return { height: "auto" };
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
    onSearchInput(value: string) {
      this.searchTerm = value;
    },
    onChange(newVal: Id[]) {
      this.$emit("update:modelValue", newVal);
      this.chosenValues = newVal;
    },
    hasSelection() {
      return (this.chosenValues?.length ?? 0) > 0;
    },

    handleMouseIn() {
      this.returnContainerRef.style.overflow = "auto";
    },
    handleMouseLeave() {
      this.returnContainerRef.style.overflow = "hidden";
    },
  },
};
</script>

<template>
  <div class="checkboxes-wrapper">
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
  </div>

  <div
    ref="div"
    class="container"
    :class="{ disabled, 'empty-box': withIsEmptyState }"
    :style="allignmentCheck"
    @mouseenter="handleMouseIn"
    @mouseleave="handleMouseLeave"
  >
    <Checkboxes
      v-show="!withIsEmptyState"
      ref="form"
      :empty-state-label="emptyStateLabel"
      :empty-state-component="emptyStateComponent"
      :model-value="modelValue"
      :alignment="alignment"
      :possible-values="concatenatedItems"
      :is-valid="isValid"
      :disabled="disabled"
      :show-search="true"
      @update:model-value="onChange"
    />
    <div
      v-if="!concatenatedItems.length && withIsEmptyState"
      class="empty-state"
    >
      <span>
        {{ emptyStateLabel }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.checkboxes-wrapper {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  --button-bar-width: 30px;

  & .header {
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
}

.container {
  overflow: hidden;
}

& .empty-box {
  background: var(--theme-empty-multiselect-listbox-background-color);

  & .empty-state {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & span {
      color: var(--theme-dropdown-foreground-color);
      font-style: italic;
      font-size: 10px;
    }
  }
}
</style>
../../composables/useLabelInfoForSearchableWidgets
