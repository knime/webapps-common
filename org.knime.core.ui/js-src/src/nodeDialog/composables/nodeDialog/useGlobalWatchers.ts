import SettingsData from "../../types/SettingsData";
import { cloneDeep, set } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { toDataPath } from "@jsonforms/core";
import { TransformSettingsMethod } from "./useUpdates";
import { ref } from "vue";

type RegisteredWatcher = {
  id: string;
  dataPaths: string[][];
  transformSettings: (indices: number[]) => TransformSettingsMethod;
};

/**
 * E.g.
 *  removeFromStart(["A", "B"], ["A"]) === ["B"]
 *  removeFromStart(["A"], ["A", "B"]) === []
 *  removeFromStart(["C", "B"], ["A"]) === null
 */
const removeFromStart = (segments: string[], startingSegments: string[]) => {
  const lengthMin = Math.min(segments.length, startingSegments.length);
  for (let i = 0; i < lengthMin; i++) {
    if (segments[i] !== startingSegments[i]) {
      return null;
    }
  }
  return segments.slice(startingSegments.length);
};

/**
 * This method checks whether the given path segments can be obtained by combining the dataPathSegments with
 * intermediate numbers. If so, these numbers are returned. If not, the result is null.
 */
const testMatchesAndGetIndices = (
  segments: string[],
  dataPathSegments: string[][],
): null | number[] => {
  if (segments.length === 0) {
    return [];
  }
  const segmentsWithoutFirstDataPath = removeFromStart(
    segments,
    dataPathSegments[0],
  );
  if (segmentsWithoutFirstDataPath === null) {
    return null;
  }
  if (dataPathSegments.length === 1) {
    return [];
  }
  if (segmentsWithoutFirstDataPath.length === 0) {
    return null;
  }
  const [needsToBeANumber, ...rest] = segmentsWithoutFirstDataPath;
  const nextNumber = parseInt(needsToBeANumber, 10);
  if (isNaN(nextNumber)) {
    return null;
  }
  const restMatchingIndices = testMatchesAndGetIndices(
    rest,
    dataPathSegments.slice(1),
  );
  return restMatchingIndices === null
    ? null
    : [nextNumber, ...restMatchingIndices];
};

const splitBy = (splitter: string) => (str: string) => str.split(splitter);

/**
 * Exported for tests
 */
export const getIndicesFromDataPaths = (
  dataPaths: RegisteredWatcher["dataPaths"],
  pathSegments: string[],
) => {
  let indicesFromDataPaths: null | number[] = null;
  const isMoreSpecificMatch = (newIndices: number[] | null) => {
    return (
      newIndices !== null &&
      (indicesFromDataPaths === null ||
        newIndices.length > indicesFromDataPaths.length)
    );
  };
  for (const dependency of dataPaths) {
    const indices = testMatchesAndGetIndices(
      pathSegments,
      dependency.map(splitBy(".")),
    );
    if (isMoreSpecificMatch(indices)) {
      indicesFromDataPaths = indices;
    }
  }
  return indicesFromDataPaths;
};

export default () => {
  const registeredWatchers = ref<RegisteredWatcher[]>([]);

  /**
   * @param {Function} handleChange The handler function that is used to handle the change of a dialog setting
   * @param {string} path The path of the setting that is changed
   * @param {any} data The new data that should be stored at the path
   * @returns {void}
   */
  const updateData = async (
    handleChange: (path: string, value: any) => any,
    path: string,
    data: any,
    currentData: SettingsData,
  ) => {
    const triggeredWatchers: {
      registeredWatcher: RegisteredWatcher;
      triggeredWithIndices: number[];
    }[] = [];

    const pathSegments = path.split(".");
    for (const registeredWatcher of registeredWatchers.value) {
      const indicesFromDataPaths = getIndicesFromDataPaths(
        registeredWatcher.dataPaths,
        pathSegments,
      );
      if (indicesFromDataPaths !== null) {
        triggeredWatchers.push({
          registeredWatcher,
          triggeredWithIndices: indicesFromDataPaths,
        });
      }
    }
    if (triggeredWatchers.length === 0) {
      handleChange(path, data);
      return;
    }
    const newData = cloneDeep(currentData);
    set(newData, path, data);

    for (const {
      registeredWatcher,
      triggeredWithIndices,
    } of triggeredWatchers) {
      await registeredWatcher.transformSettings(triggeredWithIndices)(newData);
    }
    handleChange("", newData);
  };

  const registerWatcher = ({
    transformSettings,
    dependencies,
  }: {
    transformSettings: (indices: number[]) => TransformSettingsMethod;
    dependencies: string[][];
  }) => {
    const registered = {
      id: uuidv4(),
      transformSettings,
      dataPaths: dependencies.map((scopes) => scopes.map(toDataPath)),
    };
    registeredWatchers.value.push(registered);
    return () => {
      registeredWatchers.value = registeredWatchers.value.filter(
        (item) => item.id !== registered.id,
      );
    };
  };

  return {
    updateData,
    registerWatcher,
    /**
     * Exposed only for tests
     */
    registeredWatchers,
  };
};
