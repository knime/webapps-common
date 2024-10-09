import { type Ref, computed } from "vue";

import { type Id, type PossibleValue } from "./types";

/**
 * Create label for Searchable Widgets - Twinlist - SearchableCheckboxes - SearchableList
 */
export const useLabelInfo = (
  filteredValues: Ref<PossibleValue[] | null>,
  numAllValues: number,
  selectedValues?: Ref<Id[]>,
): string => {
  const numFilteredValues = computed(() => {
    if (!filteredValues.value || filteredValues.value.length === 0) {
      return 0;
    }
    return filteredValues.value.length;
  });
  const numSelectedValues = computed(() => {
    if (!selectedValues?.value || selectedValues?.value.length === 0) {
      return 0;
    }
    return selectedValues.value.length;
  });

  const getLabel = (
    numFilteredValues: number,
    numAllValues: number,
    numSelectedValues: number,
  ) => {
    let label = `${numFilteredValues} of ${numAllValues} entries`;
    if (selectedValues) {
      label += ` [ ${numSelectedValues} selected ]`;
    }
    return label;
  };

  return getLabel(
    numFilteredValues.value,
    numAllValues,
    numSelectedValues.value,
  );
};
