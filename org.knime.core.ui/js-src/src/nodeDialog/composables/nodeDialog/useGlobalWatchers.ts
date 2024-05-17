import SettingsData from "../../types/SettingsData";
import { v4 as uuidv4 } from "uuid";
import { toDataPath } from "@jsonforms/core";
import { ref } from "vue";
import { DialogSettings } from "@knime/ui-extension-service";
import { toIndexIds } from "./useArrayIds";
export type TransformSettings = (
  newSettings: DialogSettings & object,
) => DialogSettings & object;

export type RegisterWatcherTransformSettings = (
  indexIds: string[],
) => (
  settingsForDependencies: DialogSettings & object,
) => Promise<TransformSettings>;
type RegisteredWatcher = {
  id: string;
  dataPaths: string[][];
  transformSettings: RegisterWatcherTransformSettings;
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
    return dataPathSegments.length > 1 ? null : [];
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
  let result: null | { dataPath: string[]; indices: number[] } = null;
  const isMoreSpecificMatch = (newIndices: number[]) => {
    return result === null || newIndices.length > result.indices.length;
  };
  for (const dependency of dataPaths) {
    const indices = testMatchesAndGetIndices(
      pathSegments,
      dependency.map(splitBy(".")),
    );
    if (indices && isMoreSpecificMatch(indices)) {
      result = { indices, dataPath: dependency };
    }
  }
  return result;
};

const ongoingUpdateIds = new Map<string, string>();

/**
 * @param key a unique id for an update call where subsequent updates with the same id should abort the first one
 * @returns a callback that can be used to checked after the asynchronous call whether the result is to be applied
 */
const getIsToBeAppliedCallback = (key: string) => {
  const newId = uuidv4();
  ongoingUpdateIds.set(key, newId);
  return () => {
    return ongoingUpdateIds.get(key) === newId;
  };
};

/**
 * The key used in getIsToBeAppliedCallback
 */
const getKey = (item: {
  registeredWatcher: RegisteredWatcher;
  indexIds: string[];
}) =>
  JSON.stringify({
    watcherId: item.registeredWatcher.id,
    indexIds: item.indexIds,
  });

export default () => {
  const registeredWatchers = ref<RegisteredWatcher[]>([]);

  /**
   * A method called on every settings update before the to be handled change is committed to jsonforms
   * It is used to possible perform updates of other settings or ui states before doing so.
   */
  const updateData = async (
    /**
     * The path of the setting that is changed
     */
    path: string,
    currentData: SettingsData,
  ) => {
    const triggeredWatchers: {
      registeredWatcher: RegisteredWatcher;
      indexIds: string[];
    }[] = [];

    const pathSegments = path.split(".");
    for (const registeredWatcher of registeredWatchers.value) {
      const indicesFromDataPath = getIndicesFromDataPaths(
        registeredWatcher.dataPaths,
        pathSegments,
      );
      if (indicesFromDataPath !== null) {
        const indexIds = toIndexIds(
          indicesFromDataPath.indices,
          indicesFromDataPath.dataPath,
        );
        triggeredWatchers.push({
          registeredWatcher,
          indexIds,
        });
      }
    }

    const transformations = [];
    const withIsToBeAppliedTester = triggeredWatchers.map((item) => ({
      ...item,
      isToBeApplied: getIsToBeAppliedCallback(getKey(item)),
    }));
    for (const {
      registeredWatcher,
      indexIds,
      isToBeApplied,
    } of withIsToBeAppliedTester) {
      const transformation = await registeredWatcher.transformSettings(
        indexIds,
      )(currentData);
      if (isToBeApplied()) {
        transformations.push(transformation);
      }
    }
    transformations.forEach((transformation) => {
      currentData = transformation(currentData);
    });
  };
  /**
   * With this method a watcher for data changes that can be triggered within the updateData method can be registered.
   */
  const registerWatcher = ({
    transformSettings,
    dependencies,
  }: {
    /**
     *
     * @param indexIds The ids of indices of the trigger of the transformation
     *    (e.g. a value change within the third element of an array layout induces indices `[3]`)
     * @returns a transformation of the current settings of the dialog.
     */
    transformSettings: (
      indexIds: string[],
    ) => (
      settingsForDependencies: DialogSettings & object,
    ) => Promise<TransformSettings>;
    /**
     * 2d-array: Outer dimension, because there can be multiple dependencies. Inner dimension,
     * because a dependency consists of multiple scopes when nested within an array layout.
     */
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
