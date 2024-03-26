import { watch, ref, computed, type Ref } from "vue";
import { filters } from "../../util/filters";
import type { Id, PossibleValue } from "../services/types/types";

export default function useSearch(
  filterChosenValuesOnPossibleValuesChange: boolean,
  param: Ref<Id[] | null>,
  possibleValues: Ref<PossibleValue[]>,
  modelValue: Ref<Id[] | null>,
  caseSensitiveSearch: Ref<boolean>,
  showSearch: boolean,
  searchTerm: Ref<string>,
  emit: any,
) {
  const refParams = ref(param);
  watch(
    () => modelValue.value as Id[],
    (newValue: Id[]) => {
      if (
        param.value?.length !== newValue.length ||
        JSON.stringify(newValue) !== JSON.stringify(param.value)
      ) {
        param.value = newValue;
      }
    },
  );
  watch(
    () => param.value as Id[],
    (newVal: Id[], oldVal: Id[] | null) => {
      if (
        oldVal === null ||
        newVal.length !== oldVal.length ||
        oldVal.some((item, i) => item !== newVal[i])
      ) {
        emit("update:modelValue", param.value);
      }
    },
  );
  watch(
    () => possibleValues.value,
    (newPossibleValues: PossibleValue[]) => {
      if (filterChosenValuesOnPossibleValuesChange) {
        // Required to prevent invalid values from appearing (e.g. missing b/c of upstream filtering)
        const allValues = newPossibleValues.reduce((arr, valObj) => {
          arr.push(...Object.values(valObj));
          return arr;
        }, [] as Id[]);
        // Reset chosenValues as subset of original to prevent re-execution from resetting value
        param.value = (param.value ?? []).filter((item) =>
          allValues.includes(item),
        );
      }
    },
  );

  const generateInvalidItem = (id: Id) => {
    return { id, text: `(MISSING) ${String(id)}`, invalid: true };
  };

  const normalizedSearchTerm = computed(() => {
    if (!showSearch) {
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

  const possibleValueMap = computed(() => {
    return Object.assign(
      {},
      ...possibleValues.value.map((obj: PossibleValue, index) => ({
        [obj.id]: { item: obj, index },
      })),
    );
  });
  const invalidValueIds = computed(() => {
    if (refParams.value === null) {
      return [];
    }
    return refParams?.value.filter((x: Id) => !possibleValueMap.value[x]);
  });
  const matchingInvalidValueIds = computed(() => {
    return invalidValueIds.value.filter((item: Id) =>
      itemMatchesSearch(generateInvalidItem(item)),
    );
  });

  const matchingValidIds = computed(() => {
    return possibleValues.value
      .filter((possibleValue: PossibleValue) =>
        itemMatchesSearch(possibleValue),
      )
      .map((possibleValue: PossibleValue) => possibleValue.id);
  });
  const visibleValueIds = computed(() => {
    if (refParams.value === null) {
      return new Set();
    }
    return new Set([
      ...matchingValidIds.value,
      ...matchingInvalidValueIds.value,
    ]);
  });
  const selectedItems = computed(() => {
    if (refParams.value === null) {
      return [];
    }
    return refParams.value
      .map(
        (value) =>
          possibleValueMap.value[value]?.item || generateInvalidItem(value),
      )
      .filter((value) => visibleValueIds.value.has(value.id));
  });

  const unSelectedItems = computed(() => {
    if (visibleValueIds.value.size === 0) {
      return [];
    }
    const chosenValuesSet = new Set(refParams.value);
    return possibleValues.value.filter(
      (value: PossibleValue) =>
        visibleValueIds.value.has(value.id) && !chosenValuesSet.has(value.id),
    );
  });
  const concatenatedItems = computed(() => {
    if (visibleValueIds.value.size === 0) {
      return [];
    }
    return possibleValues.value.filter((value: PossibleValue) =>
      visibleValueIds.value.has(value.id),
    );
  });

  const hasActiveSearch = computed(() => {
    return showSearch && searchTerm.value !== "";
  });

  const numSelectedItems = computed(() => {
    if (refParams.value === null) {
      return 0;
    }
    return refParams.value.length;
  });

  const numAllLists = computed(() => {
    return possibleValues.value.length + invalidValueIds.value.length;
  });

  const numMatchedSearchedItemSelected = computed(() => {
    if (!hasActiveSearch.value) {
      return 0;
    }
    const filteredList = refParams.value?.filter((item: any) =>
      item.toLowerCase().includes(searchTerm.value),
    );
    return filteredList?.length;
  });

  const numMatchedSearchedItems = computed(() => {
    if (concatenatedItems.value.length === 0) {
      return 0;
    }
    const filteredList = concatenatedItems.value.filter(
      (item: { text: string }) =>
        item.text.toLowerCase().includes(searchTerm.value),
    );
    return filteredList.length;
  });

  return {
    concatenatedItems,
    caseSensitiveSearch,
    unSelectedItems,
    selectedItems,
    numSelectedItems,
    numAllLists,
    numMatchedSearchedItemSelected,
    numMatchedSearchedItems,
    hasActiveSearch,
    visibleValueIds,
    possibleValueMap,
    invalidValueIds,
    refParams,
  };
}
