import { computed, ref, watch, type Ref } from "vue";
import { TwinlistData } from "./TwinlistInput.vue";

/**
 * This composable is specific to the NominalValueRowFilter update where
 * the manually selected are updated and filtered whenever another setting changed.
 *
 * TODO: Remove with UIEXT-1844 by introducing a more general solution for executing
 *  the refresh logic whenever the data are changed from "outside".
 */
export default ({
  data,
  refreshTwinlist,
}: {
  data: Ref<TwinlistData>;
  /**
   * Will be called whenever a backend value update is happening
   */
  refreshTwinlist: () => void;
}) => {
  const internalManuallySelectedLength = ref(
    data.value.manualFilter.manuallySelected.length,
  );
  const internalIncludeUnknownColumns = ref(
    data.value.manualFilter.includeUnknownColumns,
  );
  const internalMode = ref(data.value.mode);

  const onChange = (newData: TwinlistData) => {
    internalManuallySelectedLength.value =
      newData.manualFilter.manuallySelected.length;
    internalIncludeUnknownColumns.value =
      newData.manualFilter.includeUnknownColumns;
    internalMode.value = newData.mode;
  };

  const setInitialManuallySelected = (initialManuallySelected: string[]) => {
    internalManuallySelectedLength.value = initialManuallySelected.length;
  };

  const combinedEssentialData = computed(() => ({
    manuallySelectedLength: data.value.manualFilter.manuallySelected.length,
    includeUnknownColumns: data.value.manualFilter.includeUnknownColumns,
    mode: data.value.mode,
  }));

  watch(
    () => combinedEssentialData.value,
    ({ includeUnknownColumns, manuallySelectedLength, mode }) => {
      if (
        includeUnknownColumns === internalIncludeUnknownColumns.value &&
        manuallySelectedLength === internalManuallySelectedLength.value &&
        mode === internalMode.value
      ) {
        return;
      }
      refreshTwinlist();
    },
  );

  return { onChange, setInitialManuallySelected };
};
