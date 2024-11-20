<script setup lang="ts">
import { type Ref, computed, onMounted, onUpdated, ref, watch } from "vue";

import { JsonDataService } from "@knime/ui-extension-service";

import TableViewDisplay from "./TableViewDisplay.vue";
import useRowHeight from "./composables/useRowHeight";
import type { ImageDimension } from "./types";
import { SelectionMode } from "./types/ViewSettings";
import getKnimeService from "./utils/getKnimeService";

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
  columnNamesColors: string[] | null;
  firstRowImageDimensions: Record<string, ImageDimension>;
} | null> = ref(null);
const { currentRowHeight, setRowHeightSettings } = useRowHeight();

onMounted(async () => {
  const jsonDataService = new JsonDataService(knimeService);
  const initialData = await jsonDataService.initialData();
  if (initialData) {
    dataTypes.value = initialData.dataTypes;
    columnDataTypeIds.value = initialData.table.columnDataTypeIds;

    settings.value = {
      ...initialData.settings,
      selectionMode: SelectionMode.OFF,
      enableColumnSearch: false,
      enableSortingByHeader: false,
      enableGlobalSearch: false,
      enableRendererSelection: false,
      showOnlySelectedRowsConfigurable: false,
    };
    setRowHeightSettings(settings.value);
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
      columnNamesColors: table?.columnNamesColors || null,
    }"
    :page="{
      currentRowCount: table?.rowCount || 0,
      currentPage: 1,
      showPageControls: false,
      columnCount: table?.columnCount || 0,
    }"
    :enable-cell-selection="false"
    :enable-data-value-views="false"
    :enable-virtual-scrolling="false"
    :enable-column-resizing="false"
    :enable-row-resizing="false"
    :enable-dynamic-row-height="true"
    :current-row-height="currentRowHeight"
    global-search-query=""
    :include-image-resources="true"
    :knime-service="knimeService"
    :first-row-image-dimensions="table?.firstRowImageDimensions || {}"
    @pending-image="(id) => pendingImages.add(id)"
    @rendered-image="(id) => pendingImages.delete(id)"
    @table-is-ready="tableIsReady = true"
  />
</template>

<style scoped>
@media print {
  :deep(table) {
    display: table;
    border-collapse: collapse;

    & tr {
      display: table-row;
      break-inside: avoid;
    }

    & td {
      display: table-cell;
      vertical-align: top;
    }

    & .base-controls {
      /** fixes first blank page, does not repeat that header as its no real thead */
      display: table-header-group;
    }

    & thead.table-header {
      display: table-header-group;

      & tr {
        display: table-row;
        height: 41px;
        break-inside: avoid;

        & th.column-header {
          display: table-cell;
        }
      }
    }
  }
}
</style>
