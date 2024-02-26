import SettingsData from "../../types/SettingsData";
import { cloneDeep, set } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { toDataPath } from "@jsonforms/core";
import { TransformSettingsMethod } from "./useUpdates";
import { ref } from "vue";

type RegisteredWatcher = {
  id: string;
  dataPaths: string[];
  transformSettings: TransformSettingsMethod;
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
    const startsWithPath = (dataPath: string) => {
      return path.startsWith(`${dataPath}.`);
    };

    const triggeredWatchers = registeredWatchers.value.filter(
      ({ dataPaths }) =>
        dataPaths.includes(path) || dataPaths.some(startsWithPath),
    );
    if (triggeredWatchers.length === 0) {
      handleChange(path, data);
      return;
    }
    const newData = cloneDeep(currentData);
    set(newData, path, data);

    for (const watcher of triggeredWatchers) {
      await watcher.transformSettings(newData);
    }
    handleChange("", newData);
  };

  const registerWatcher = ({
    transformSettings,
    dependencies,
  }: {
    transformSettings: TransformSettingsMethod;
    dependencies: string[];
  }) => {
    const registered = {
      id: uuidv4(),
      transformSettings,
      dataPaths: dependencies.map(toDataPath),
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
