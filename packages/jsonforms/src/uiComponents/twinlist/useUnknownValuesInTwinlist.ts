import { type Ref, ref, watch } from "vue";

import { getValuesInSet, getValuesNotInSet } from "../../utils";

import { type TwinlistData } from "./MultimodeTwinlistControl.vue";

interface PreviousAndNext {
  setNext: (next: string[]) => void;
  previous: string[];
}
const adjustManualSelection = ({
  knownValuesSide,
  possibleValueIds,
  unknownValuesSide,
}: {
  possibleValueIds: string[];
  unknownValuesSide: PreviousAndNext;
  knownValuesSide: PreviousAndNext;
}) => {
  const knownPreviousSet = new Set(knownValuesSide.previous);
  const possibleValueIdsSet = new Set(possibleValueIds);
  const getInvalidValues = (ids: string[]) =>
    getValuesNotInSet(ids, possibleValueIdsSet);
  unknownValuesSide.setNext([
    ...getInvalidValues(unknownValuesSide.previous),
    ...getValuesNotInSet(possibleValueIds, knownPreviousSet),
  ]);
  knownValuesSide.setNext([
    ...getInvalidValues(knownValuesSide.previous),
    ...getValuesInSet(possibleValueIds, knownPreviousSet),
  ]);
};

export default ({
  data,
  possibleValueIds,
}: {
  /**
   * The jsonforms data of the TwinlistControl
   */
  data: Ref<{ manualFilter: TwinlistData["manualFilter"] }>;
  /**
   * The array of possible value ids or null if no possible values are present yet.
   */
  possibleValueIds: Ref<Array<string> | null>;
}) => {
  const selectedAndDeselected = ref<{
    selected: string[] | null;
    deselected: string[] | null;
  }>({
    selected: null,
    deselected: null,
  });

  const currentManualFilter = ref<null | TwinlistData["manualFilter"]>(null);

  const setCurrentManualFilter = (newData: TwinlistData["manualFilter"]) => {
    currentManualFilter.value = newData;
  };

  /**
   * Add unknown columns either to the manually selected or manually deselected.
   * Also sorts the existing columns by the order given by the possible values
   */
  const refreshManualSelection = () => {
    if (!currentManualFilter.value || !possibleValueIds.value) {
      return;
    }
    let newManuallyDeselected: string[], newManuallySelected: string[];
    const { manuallyDeselected, manuallySelected, includeUnknownColumns } =
      currentManualFilter.value;
    const leftSide = {
      previous: manuallyDeselected,
      setNext: (value: string[]) => {
        newManuallyDeselected = value;
      },
    };
    const rightSide = {
      previous: manuallySelected,
      setNext: (value: string[]) => {
        newManuallySelected = value;
      },
    };
    const knownValuesSide = includeUnknownColumns ? leftSide : rightSide;
    const unknownValuesSide = includeUnknownColumns ? rightSide : leftSide;
    adjustManualSelection({
      possibleValueIds: possibleValueIds.value,
      knownValuesSide,
      unknownValuesSide,
    });
    selectedAndDeselected.value = {
      selected: newManuallySelected!,
      deselected: newManuallyDeselected!,
    };
  };

  /**
   * For adding unknown values initially and whenever there are new data set from outside the component
   */
  watch(
    () => data.value.manualFilter,
    (newData) => {
      if (Object.is(currentManualFilter.value, newData)) {
        /**
         * The change comes from an internal update of the Twinlist.
         */
        selectedAndDeselected.value = {
          selected: newData.manuallySelected,
          deselected: newData.manuallyDeselected,
        };
      } else {
        currentManualFilter.value = newData;
        refreshManualSelection();
      }
    },
    { immediate: true },
  );

  /**
   * Important in two situations:
   * * Initially when possible values are loaded asynchronously.
   * * On an update of possible values.
   */
  watch(() => possibleValueIds.value, refreshManualSelection, {
    immediate: true,
  });

  return { selectedAndDeselected, setCurrentManualFilter };
};
