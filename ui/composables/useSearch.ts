import { computed, type Ref } from "vue";
import { filters } from "../../util/filters";
import type { PossibleValue } from "./types";

export default function useSearch(
  searchTerm: Ref<string>,
  caseSensitiveSearch: Ref<boolean>,
  allValues: Ref<PossibleValue[]>,
) {
  const normalizedSearchTerm = computed(() => {
    if (!searchTerm.value) {
      return "";
    }
    return filters.search.normalize(
      searchTerm.value,
      caseSensitiveSearch.value,
    );
  });
  const itemMatchesSearch = (item: PossibleValue) => {
    return filters.search.test(
      item.text,
      normalizedSearchTerm.value,
      caseSensitiveSearch.value,
      false,
    );
  };

  const filteredValues = computed((): PossibleValue[] => {
    if (allValues.value === null) {
      return [];
    }
    return allValues.value.filter((value) => itemMatchesSearch(value));
  });

  return { filteredValues };
}
