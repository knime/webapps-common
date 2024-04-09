import { getValuesInSet, getValuesNotInSet } from "@/nodeDialog/utils";
import { Ref } from "vue";

export const adjustManualSelection = ({
  knownValuesSide,
  possibleValueIds,
  unknownValuesSide,
}: {
  possibleValueIds: string[];
  unknownValuesSide: {
    next: Ref<string[] | null>;
    previous: string[];
  };
  knownValuesSide: {
    next: Ref<string[] | null>;
    previous: string[];
  };
}) => {
  const knownPreviousSet = new Set(knownValuesSide.previous);
  const possibleValueIdsSet = new Set(possibleValueIds);
  const getInvalidValues = (ids: string[]) =>
    getValuesNotInSet(ids, possibleValueIdsSet);
  unknownValuesSide.next.value = [
    ...getInvalidValues(unknownValuesSide.previous),
    ...getValuesNotInSet(possibleValueIds, knownPreviousSet),
  ];
  knownValuesSide.next.value = [
    ...getInvalidValues(knownValuesSide.previous),
    ...getValuesInSet(possibleValueIds, knownPreviousSet),
  ];
};
