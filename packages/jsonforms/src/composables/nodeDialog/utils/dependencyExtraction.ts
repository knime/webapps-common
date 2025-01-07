import { get } from "lodash-es";

import type { IndexIdsValuePairs } from "../../../types/Update";
import {
  type ArrayRecord,
  getArrayIdsRecord,
  getOrCreateIdForIndex,
  getOrCreateNestedArrayRecord,
} from "../useArrayIds";

import { combineDataPathsWithIndices } from "./dataPaths";

/**
 * If there is more than one path, we know that the settings at the first are an array
 */
const hasFurtherPaths = (
  dataPaths: string[],
  settings: object,
): settings is { _id: string | undefined }[] => dataPaths.length > 0;

export const getDependencyValues = (
  settings: object,
  dataPaths: string[],
  indices: number[],
  arrayRecord: ArrayRecord = getArrayIdsRecord(),
): IndexIdsValuePairs => {
  // eslint-disable-next-line no-use-before-define -- the function is hoisted
  return getDependencyValuesWithoutFixedIndices(
    settings,
    combineDataPathsWithIndices(dataPaths, indices),
    getOrCreateNestedArrayRecord(dataPaths, indices, arrayRecord),
  );
};

const getOrCreateIdFromSettings = (
  settings: { _id: string | undefined },
  index: number,
  dataPath: string,
  arrayRecord: ArrayRecord,
) => {
  const id = settings._id;
  if (typeof id === "undefined") {
    const { indexId: newId } = getOrCreateIdForIndex(
      arrayRecord,
      dataPath,
      index,
    );
    settings._id = newId;
    return newId;
  }
  return id;
};

// eslint-disable-next-line func-style -- we need to hoist this function
function getDependencyValuesWithoutFixedIndices(
  settings: any,
  dataPaths: string[],
  arrayRecord: ArrayRecord,
): IndexIdsValuePairs {
  const [firstDataPath, ...restDataPaths] = dataPaths;
  const atFirstPath = get(settings, firstDataPath);
  if (hasFurtherPaths(restDataPaths, atFirstPath)) {
    return atFirstPath.flatMap((elementSettings, index) => {
      const id = getOrCreateIdFromSettings(
        elementSettings,
        index,
        firstDataPath,
        arrayRecord,
      );
      return getDependencyValues(elementSettings, restDataPaths, [index]).map(
        ({ indices: indexIds, value }) => ({
          indices: [id, ...indexIds],
          value,
        }),
      );
    });
  }
  return [{ indices: [], value: atFirstPath }];
}
