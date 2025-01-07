import type {
  IndexIdsValuePairs,
  IndicesValuePairs,
  Pairs,
} from "../../../types/Update";

/**
 * Converts indexIds back to indices filtering out all indexIds that are not present anymore (i.e. have been removed by the user)
 */
export const toIndicesValuePairs = (
  indexIdsValuePairs: IndexIdsValuePairs,
  getIndex: (indexId: string) => number | null,
): IndicesValuePairs =>
  indexIdsValuePairs
    .map(({ indices: indexIds, value }) => ({
      indices: indexIds.map(getIndex),
      value,
    }))
    .filter(({ indices }) =>
      indices.every((index) => index !== null),
    ) as IndicesValuePairs;

const isIndexIdArray = (array: number[] | string[]): array is string[] =>
  array.length === 0 || typeof array[0] === "string";
export const isIndexIdsAndValuePairs = (
  pairs: Pairs,
): pairs is IndexIdsValuePairs =>
  pairs.length === 0 || isIndexIdArray(pairs[0].indices);
