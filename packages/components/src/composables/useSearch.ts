import { type MaybeRef, type Ref, computed, unref } from "vue";

import { filters } from "../../../utils/src/filters";

export default <T extends { text: string }>(
  searchTerm: Ref<string | null | undefined>,
  caseSensitiveSearch: Ref<boolean>,
  allValues: Ref<T[] | null>,
  isActive: MaybeRef<boolean> = true,
): Ref<T[]> => {
  const normalizedSearchTerm = computed(() => {
    if (!searchTerm.value) {
      return "";
    }
    return filters.search.normalize(
      searchTerm.value,
      caseSensitiveSearch.value,
    );
  });

  const itemMatchesSearch = computed(() => {
    const normSearchTerm = normalizedSearchTerm.value;
    const isCaseSensitive = caseSensitiveSearch.value;
    return (item: T) =>
      filters.search.test(item.text, normSearchTerm, isCaseSensitive, false);
  });

  const allValuesList = computed(() => allValues.value ?? []);

  const searchIsActive = computed(() => unref(isActive) && searchTerm.value);

  const filteredValues = computed(() =>
    searchIsActive.value
      ? allValuesList.value.filter(itemMatchesSearch.value)
      : allValuesList.value,
  );

  return filteredValues;
};
