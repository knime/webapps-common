import { computed, type Ref } from "vue";
import type { PossibleValue, Id } from "./types";
/**
 * Create label for Searchable Widgets - Twinlist - SearchableCheckboxes - SearchableList
 */
export default function useLabelInfoForSearchableWidgets(
  filteredValues: Ref<PossibleValue[]>,
  availableValues: Ref<Id[] | null>,
  numAllValues?: number,
) {
  const numFilteredValues = computed(() => {
    return filteredValues.value.length;
  });
  const numAvailableValues = computed(() => {
    if (availableValues.value === null) {
      return 0;
    }
    return availableValues.value.length;
  });

  const labelInfo = computed(() => {
    return numAllValues
      ? `${numFilteredValues.value} of ${numAllValues} entries [ ${numAvailableValues.value} selected ]`
      : `${numFilteredValues.value} of ${numAvailableValues.value} entries`;
  });

  return labelInfo;
}
