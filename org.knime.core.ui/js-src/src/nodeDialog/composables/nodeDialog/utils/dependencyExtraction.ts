import { get } from "lodash-es";
import { IndexIdsValuePairs } from "@/nodeDialog/types/Update";
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
): IndexIdsValuePairs => {
  // eslint-disable-next-line no-use-before-define -- the function is hoisted
  return getDependencyValuesWithoutFixedIndices(
    settings,
    combineDataPathsWithIndices(dataPaths, indices),
  );
};

// eslint-disable-next-line func-style -- we need to hoist this function
function getDependencyValuesWithoutFixedIndices(
  settings: any,
  dataPaths: string[],
): IndexIdsValuePairs {
  const [firstDataPath, ...restDataPaths] = dataPaths;
  const atFirstPath = get(settings, firstDataPath);
  if (hasFurtherPaths(restDataPaths, atFirstPath)) {
    return atFirstPath.flatMap((elementSettings, index) => {
      const id = elementSettings._id;
      if (typeof id === "undefined") {
        throw new Error("No id found in array element");
      }
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
