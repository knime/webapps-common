<script setup lang="ts">
import { JsonDataService } from "@knime/ui-extension-service";
import { ref, type Ref, onMounted, onUpdated, computed, watch } from "vue";
import TableViewDisplay from "./TableViewDisplay.vue";
import getKnimeService from "./utils/getKnimeService";
import type { ImageDimension } from "./types";

const knimeService = getKnimeService();
const settings: Ref<any> = ref({});
const dataTypes: Ref<any> = ref(null);
const columnDataTypeIds: Ref<any> = ref(null);
const dataLoaded = ref(false);
const table: Ref<{
  rows: any[];
  rowCount: number;
  columnCount: number;
  displayedColumns: string[];
  columnContentTypes: ("txt" | "img_path" | "html")[];
  firstRowImageDimensions: Record<string, ImageDimension>;
} | null> = ref(null);

onMounted(async () => {
  const jsonDataService = new JsonDataService(knimeService);
  const initialData = await jsonDataService.initialData();
  if (initialData) {
    dataTypes.value = initialData.dataTypes;
    columnDataTypeIds.value = initialData.table.columnDataTypeIds;

    settings.value = {
      ...initialData.settings,
      publishSelection: false,
      subscribeToSelection: false,
      enableColumnSearch: false,
      enableSortingByHeader: false,
      enableGlobalSearch: false,
      enableRendererSelection: false,
    };
    table.value = initialData.settings.enablePagination
      ? initialData.table
      : await jsonDataService.data({
          method: "getTable",
          options: [
            settings.value.displayedColumns.selected,
            0,
            initialData.table.rowCount,
            [],
            true,
            true,
            false,
          ],
        });
  }
  dataLoaded.value = true;
});

const emit = defineEmits(["rendered"]);
const pendingImages = ref(new Set());

const tableIsReady = ref(false);

const updatedAfterInitialRender = ref(false);
onUpdated(() => {
  if (dataLoaded.value) {
    updatedAfterInitialRender.value = true;
  }
});

const imagesLoaded = computed(() => pendingImages.value.size === 0);
const ready = computed(
  () =>
    updatedAfterInitialRender.value && imagesLoaded.value && tableIsReady.value,
);
watch(ready, () => ready.value && emit("rendered"));
</script>

<template>
  <TableViewDisplay
    :settings="settings"
    :rows="{
      loaded: dataLoaded,
      top: table?.rows || [],
    }"
    :header="{
      displayedColumns: table?.displayedColumns || [],
      columnContentTypes: table?.columnContentTypes || [],
      dataTypes,
      columnDataTypeIds,
      indicateRemainingColumnsSkipped: false,
    }"
    :page="{
      currentRowCount: table?.rows.length || 0,
      currentPage: 1,
      columnCount: table?.columnCount || 0,
    }"
    :enable-cell-selection="false"
    :enable-virtual-scrolling="false"
    :enable-column-resizing="false"
    :enable-row-resizing="false"
    global-search-query=""
    :include-image-resources="true"
    :knime-service="knimeService"
    :first-row-image-dimensions="table?.firstRowImageDimensions || {}"
    @pending-image="(id) => pendingImages.add(id)"
    @rendered-image="(id) => pendingImages.delete(id)"
    @table-is-ready="tableIsReady = true"
  />
</template>
