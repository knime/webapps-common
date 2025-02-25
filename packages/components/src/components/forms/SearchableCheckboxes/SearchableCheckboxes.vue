<script lang="ts">
import { computed, ref, toRef } from "vue";
import type { PropType, Ref } from "vue";

import useSearch from "../../../composables/useSearch";
import Checkboxes from "../Checkboxes/Checkboxes.vue";
import Label from "../Label/Label.vue";
import SearchInput from "../SearchInput/SearchInput.vue";
import {
  type Id,
  type PossibleValue,
  createMissingItem,
  useLabelInfo,
} from "../possibleValues";

const MIN_LIST_SIZE = 5;
const DEF_PIX_SIZE = 28;

export default {
  name: "SearchableCheckboxes",
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
      type: Array as PropType<Id[]>,
      default: () => [],
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
      default: 5,
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
      default: "No entries in this list",
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
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props) {
    const searchTerm = ref(props.initialSearchTerm);
    const caseSensitiveSearch = ref(props.initialCaseSensitiveSearch);

    const possibleValueMap = computed(() => {
      return Object.assign(
        {},
        ...props.possibleValues.map((obj: PossibleValue, index) => ({
          [obj.id]: { item: obj, index },
        })),
      ) as Record<Id, { item: PossibleValue; index: number }>;
    });

    const matchingValidIds = computed(() => {
      return props.possibleValues.map(
        (possibleValue) =>
          possibleValueMap.value[possibleValue.id]?.item as PossibleValue,
      );
    });

    const invalidValueIds = computed(() => {
      if (!props.modelValue) {
        return [];
      }
      return props.modelValue?.filter((x: Id) => !possibleValueMap.value[x]);
    });

    const matchingInvalidValueIds = computed(() => {
      return invalidValueIds.value?.map((item: Id) => createMissingItem(item));
    });

    const visibleValues = computed(() => {
      if (props.modelValue === null) {
        return [];
      }
      return [...matchingInvalidValueIds.value, ...matchingValidIds.value];
    });

    const allItems = useSearch(
      searchTerm,
      caseSensitiveSearch,
      visibleValues,
      toRef(props, "showSearch"),
    );

    const concatenatedItems = computed(() => {
      if (allItems.value.length === 0) {
        return [];
      }
      return allItems.value.filter((value: PossibleValue) =>
        visibleValues.value.includes(value),
      );
    });

    const hasActiveSearch = computed(() => {
      return props.showSearch && searchTerm.value !== "";
    });

    const numMatchedSearchedItems = computed(() => {
      const filteredList = concatenatedItems.value.filter(
        (item: { text: string }) =>
          item.text.toLowerCase().includes(searchTerm.value.toLowerCase()),
      );
      return filteredList;
    });

    const numLabelInfos = computed(() => {
      if (!props.showSearch) {
        return `[ ${props.modelValue?.length} selected ]`;
      }
      return hasActiveSearch.value
        ? useLabelInfo(
            numMatchedSearchedItems,
            matchingValidIds.value.length,
            toRef(props.modelValue ?? []) as Ref<Id[]>,
          )
        : `[ ${props.modelValue?.length} selected ]`;
    });
    return {
      searchTerm,
      visibleValues,
      concatenatedItems,
      caseSensitiveSearch,
      numLabelInfos,
      matchingInvalidValueIds,
      allItems,
    };
  },

  computed: {
    withIsEmptyState() {
      return this.concatenatedItems.length === 0;
    },
    listSize() {
      if (this.possibleValues.length >= MIN_LIST_SIZE) {
        const size = this.size === 0 ? this.possibleValues.length : this.size;
        return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
      }
      return this.size;
    },
    cssStyleSize() {
      const pixSize = `${this.listSize * DEF_PIX_SIZE + 2}px`;
      return this.listSize > 0 ? { height: pixSize } : {};
    },
    returnContainerRef() {
      return this.$refs.div as HTMLDivElement;
    },
    alignmentCheck() {
      return this.alignment === "vertical"
        ? this.cssStyleSize
        : { height: "auto" };
    },
  },
  methods: {
    onSearchInput(value: string) {
      this.searchTerm = value;
    },
    onChange(newVal: Id[]) {
      this.$emit("update:modelValue", newVal);
    },
    hasSelection() {
      return (this.modelValue?.length ?? 0) > 0;
    },

    handleMouseIn() {
      if (!this.disabled && this.size >= MIN_LIST_SIZE) {
        this.returnContainerRef.style.overflow = "auto";
      }
    },
    handleMouseLeave() {
      this.returnContainerRef.style.overflow = "hidden";
    },
    validate() {
      const isValid = !this.concatenatedItems.some(
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
  <div>
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
          :compact="compact"
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
      :style="[alignmentCheck, cssStyleSize]"
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
