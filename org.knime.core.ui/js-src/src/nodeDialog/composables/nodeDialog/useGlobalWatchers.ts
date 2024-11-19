import type { SettingsData } from "../../types/SettingsData";
import { v4 as uuidv4 } from "uuid";
import { toDataPath } from "@jsonforms/core";
import { ref } from "vue";
import type { DialogSettings } from "@knime/ui-extension-service";
import { toIndexIds } from "./useArrayIds";
import { getIndicesFromDataPaths } from "./utils/dataPaths";
export type TransformSettings = (newSettings: DialogSettings & object) => void;

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

  type TriggeredWatcher = {
    registeredWatcher: RegisteredWatcher;
    indexIds: string[];
  };

  const triggeredWatcherEquals = (a: TriggeredWatcher, b: TriggeredWatcher) =>
    a.registeredWatcher.id === b.registeredWatcher.id &&
    a.indexIds.join(".") === b.indexIds.join(".");

  const getTriggeredWatchers = (path: string) => {
    const triggeredWatchers: TriggeredWatcher[] = [];

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
    return triggeredWatchers;
  };

  const updateDataMultiplePaths = async (
    /**
     * The path of the setting that is changed
     */
    paths: string[],
    currentData: SettingsData,
  ) => {
    const triggeredWatchers = paths.flatMap(getTriggeredWatchers).reduce(
      // deduplicate so that each watcher is only triggered once
      (acc: TriggeredWatcher[], item: TriggeredWatcher) =>
        acc.some((accItem) => triggeredWatcherEquals(accItem, item))
          ? acc
          : [...acc, item],
      [] satisfies TriggeredWatcher[],
    );
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
      transformation(currentData);
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

  /**
   * A method called on every settings update before the to be handled change is committed to jsonforms
   * It is used to possible perform updates of other settings or ui states before doing so.
   */
  const updateData = (
    /**
     * The path of the setting that is changed
     */
    path: string,
    currentData: SettingsData,
  ) => updateDataMultiplePaths([path], currentData);

  return {
    updateData,
    updateDataMultiplePaths,
    registerWatcher,
    /**
     * Exposed only for tests
     */
    registeredWatchers,
  };
};
