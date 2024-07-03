import { computed, type Ref } from "vue";
import { filters } from "@knime/utils";
import { type PossibleValue } from "./types";

export const useSearch = (
  searchTerm: Ref<string | null>,
  caseSensitiveSearch: Ref<boolean>,
  allValues: Ref<PossibleValue[] | null>,
): PossibleValue[] => {
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

  // filtered values
  return allValues.value
    ? allValues.value.filter((value) => itemMatchesSearch(value))
    : [];
};
