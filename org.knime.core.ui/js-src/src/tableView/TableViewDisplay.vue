<script setup lang="ts">
import { computed, reactive, onMounted, ref, type Ref } from "vue";
// @ts-ignore
import { TableUIWithAutoSizeCalculation } from "@knime/knime-ui-table";
import ImageRenderer from "./ImageRenderer.vue";
import HtmlRenderer from "./HtmlRenderer.vue";
import getDataConfig from "./utils/getDataConfig";
import getTableConfig from "./utils/getTableConfig";
import getColumnSizes from "./utils/columnSizes";
import type { TableViewDisplayProps } from "./types";
import useBoolean from "./utils/useBoolean";

const emit = defineEmits([
  "page-change",
  "column-sort",
  "row-select",
  "select-all",
  "search",
  "column-filter",
  "clear-filter",
  "column-resize",
  "header-sub-menu-item-selection",
  "lazyload",
  "update-column-configs",
  "pending-image",
  "rendered-image",
  "all-columns-resize",
  "update:available-width",
  "auto-column-sizes-update",
  "row-height-update",
]);

const props = defineProps<TableViewDisplayProps>();

const root: Ref<null | HTMLElement> = ref(null);

const availableWidth = ref(0);
const baseUrl = ref("");

onMounted(() => {
  // @ts-ignore
  baseUrl.value = props.knimeService?.extensionConfig?.resourceInfo?.baseUrl;
  if (root.value === null) {
    return;
  }
  availableWidth.value = root.value.getBoundingClientRect().width;
});

const numberOfDisplayedIdColumns = computed(() => {
  let offset = props.settings.showRowKeys ? 1 : 0;
  offset += props.settings.showRowIndices ? 1 : 0;
  return offset;
});
const numberOfDisplayedRemainingColumns = computed(() =>
  props.header.indicateRemainingColumnsSkipped ? 1 : 0,
);

const numberOfDisplayedColumns = computed(
  () =>
    props.header.displayedColumns.length +
    numberOfDisplayedIdColumns.value +
    numberOfDisplayedRemainingColumns.value,
);
// The columns sent to the TableUI. The rowIndex and rowKey are included but might not be displayed.
const numberOfUsedColumns = computed(
  () =>
    props.header.displayedColumns.length +
    2 +
    numberOfDisplayedRemainingColumns.value,
);

const columnSizes = computed(() =>
  getColumnSizes({
    columnSizeOverrides: props.header.columnSizeOverrides || {},
    defaultColumnSizeOverride: props.header.defaultColumnSizeOverride,
    displayedColumns: props.header.displayedColumns,
    indicateRemainingColumnsSkipped:
      props.header.indicateRemainingColumnsSkipped,
    settings: props.settings,
    availableWidth: props.header.availableWidth || availableWidth.value,
  }),
);

const dataConfig = computed(() => {
  const conf = getDataConfig({
    settings: props.settings,
    columnSizes: columnSizes.value,
    enableRowResizing: props.enableRowResizing,
    ...reactive(props.header),
  });
  emit("update-column-configs", conf.columnConfigs);
  return conf;
});

const columnIds = computed(() =>
  dataConfig.value.columnConfigs.map((columnConfig) => columnConfig.id),
);

const tableConfig = computed(() =>
  getTableConfig({
    settings: props.settings,
    pageParams: props.page,
    sortParams: props.sorting,

    globalSearchQuery: props.globalSearchQuery,
    enableVirtualScrolling: props.enableVirtualScrolling,
    enableColumnResizing: props.enableColumnResizing,
    forceHideTableSizes: props.forceHideTableSizes || false,
  }),
);

// data
const appendDotsIfColumnsSkipped = (rows: any[]) => {
  if (props.header.indicateRemainingColumnsSkipped) {
    return rows.map((row) => [...row, "…"]);
  } else {
    return rows;
  }
};

const rowData = computed(() => appendDotsIfColumnsSkipped(props.rows.top));
const bottomRowData = computed(() =>
  props.rows.bottom ? appendDotsIfColumnsSkipped(props.rows.bottom) : [],
);

// map index to columnId. Used to transform params of emitted events
const getColumnId = (colIndex: number) => columnIds.value[colIndex];

// for slots
const getContentType = (index: number) =>
  props.header.columnContentTypes[index - 2];
const columnResizeActive = useBoolean();

const tableUIWithAutoSizeCalculation: Ref<null | TableUIWithAutoSizeCalculation> =
  ref(null);

defineExpose({
  refreshScroller: () => {
    if (tableUIWithAutoSizeCalculation.value?.refreshScroller) {
      tableUIWithAutoSizeCalculation.value.refreshScroller();
    }
  },
  triggerCalculationOfAutoColumnSizes: () => {
    if (
      tableUIWithAutoSizeCalculation.value?.triggerCalculationOfAutoColumnSizes
    ) {
      tableUIWithAutoSizeCalculation.value?.triggerCalculationOfAutoColumnSizes();
    }
  },
});
</script>

<template>
  <div ref="root" class="table-view-wrapper">
    <h4 v-if="settings?.showTitle" class="table-title">
      {{ settings.title }}
    </h4>
    <TableUIWithAutoSizeCalculation
      v-if="rows.loaded && numberOfDisplayedColumns > 0"
      ref="tableUIWithAutoSizeCalculation"
      :data="[rowData]"
      :bottom-data="bottomRowData"
      :current-selection="[selection?.top]"
      :current-bottom-selection="selection?.bottom"
      :total-selected="selection?.totalSelected"
      :data-config="dataConfig"
      :table-config="tableConfig"
      :num-rows-above="rows.numRowsAbove"
      :num-rows-below="rows.numRowsBelow"
      :auto-column-sizes-options="props.autoColumnSizesOptions"
      @page-change="(...args: any[]) => $emit('page-change', ...args)"
      @column-sort="
        (colIndex: number) =>
          $emit('column-sort', colIndex, getColumnId(colIndex))
      "
      @row-select="(...args: any[]) => $emit('row-select', ...args)"
      @select-all="(...args: any[]) => $emit('select-all', ...args)"
      @search="(...args: any[]) => $emit('search', ...args)"
      @column-filter="
        (colIndex: number, newVal: any) =>
          $emit('column-filter', getColumnId(colIndex), newVal)
      "
      @clear-filter="(...args: any[]) => $emit('clear-filter', ...args)"
      @lazyload="(...args: any[]) => $emit('lazyload', ...args)"
      @column-resize="
        (colIndex: number, newSize: number) =>
          $emit('column-resize', getColumnId(colIndex), newSize)
      "
      @column-resize-start="columnResizeActive.setTrue"
      @column-resize-end="columnResizeActive.setFalse"
      @all-columns-resize="
        (...args: any[]) => $emit('all-columns-resize', ...args)
      "
      @update:available-width="
        (...args: any[]) => $emit('update:available-width', ...args)
      "
      @header-sub-menu-item-selection="
        (item: any, colIndex: number) =>
          $emit('header-sub-menu-item-selection', item, getColumnId(colIndex))
      "
      @auto-column-sizes-update="
        (newAutoColumnSizes: Record<string | symbol, number>) =>
          emit('auto-column-sizes-update', newAutoColumnSizes)
      "
      @row-height-update="
        (newRowHeight: number) => $emit('row-height-update', newRowHeight)
      "
    >
      <template
        v-for="index in numberOfUsedColumns"
        :key="index"
        #[`cellContent-${index}`]="{ data: { cell, width, height } }"
      >
        <ImageRenderer
          v-if="getContentType(index) === 'img_path'"
          :key="index"
          :include-data-in-html="includeImageResources"
          :path="cell"
          :width="width"
          :height="height"
          :base-url="baseUrl"
          :update="!columnResizeActive.state"
          @pending="(id: string) => $emit('pending-image', id)"
          @rendered="(id: string) => $emit('rendered-image', id)"
        />
        <HtmlRenderer v-else :content="cell" />
      </template>
    </TableUIWithAutoSizeCalculation>
    <div v-else-if="rows.loaded" class="no-columns">
      <h4>No data to display</h4>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.table-title {
  margin: 0;
  padding: 13px 0 5px;
  color: rgb(70 70 70);
  font-size: 18px;
}

.no-columns {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & h4 {
    color: rgb(70 70 70);
    font-size: 18px;
  }
}

.table-view-wrapper {
  display: flex;
  flex-direction: column;

  & :deep(.table-header) {
    background-color: var(--knime-porcelain);
  }

  & :deep(.row) {
    border-bottom: 1px solid var(--knime-porcelain);
    align-content: center;
  }
}
</style>
