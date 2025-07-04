<script lang="ts">
import { computed, ref, toRef } from "vue";
import type { PropType, Ref } from "vue";

import useSearch from "../../../composables/useSearch";
import Label from "../Label/Label.vue";
import MultiselectListBox from "../MultiselectListBox/MultiselectListBox.vue";
import SearchInput from "../SearchInput/SearchInput.vue";
import {
  type BottomValue,
  type Id,
  type PossibleValue,
  createMissingItem,
  useLabelInfo,
} from "../possibleValues";

const MIN_LIST_SIZE = 5;

export default {
  name: "SearchableList",
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
      default: () => [],
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
    unknownValuesText: {
      type: String,
      required: false,
      default: "Unknown values",
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
      concatenatedItems,
      visibleValues,
      searchTerm,
      matchingValidIds,
      caseSensitiveSearch,
      invalidValueIds,
      matchingInvalidValueIds,
      numLabelInfos,
      numMatchedSearchedItems,
      possibleValueMap,
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
  methods: {
    hasSelection() {
      return (this.modelValue?.length ?? 0) > 0;
    },
    onChange(newVal: Id[]) {
      this.$emit("update:modelValue", newVal);
    },
    onSearchInput(value: string) {
      this.searchTerm = value;
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
  </div>
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
