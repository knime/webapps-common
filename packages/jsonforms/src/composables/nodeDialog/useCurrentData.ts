import { ref } from "vue";

import type { SettingsData } from "../../types/SettingsData";

/**
 * A composable for accessing and manipulating the current data of the node dialog.
 */
export default () => {
  const currentData = ref<SettingsData | null>(null);

  /**
   * Intended to be used initially and for updates emitted by JSONForms only.
   * If the current data should be manipulated, call getCurrentData instead.
   *
   * @param newData
   * @param path if provided, the new data are set at this path.
   */
  const setCurrentData = (newData: SettingsData) => {
    currentData.value = newData;
  };

  const getCurrentData = () => {
    if (currentData.value === null) {
      throw Error("No node dialog data are set.");
    }
    return currentData.value;
  };

  return {
    setCurrentData,
    getCurrentData,
  };
};
