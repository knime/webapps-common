<script setup lang="ts">
import { computed, reactive, onMounted, ref, type Ref, toRefs } from "vue";
import {
  TableUIWithAutoSizeCalculation,
  type Rect,
} from "@knime/knime-ui-table";
import ImageRenderer from "./ImageRenderer.vue";
import HtmlRenderer from "./HtmlRenderer.vue";
import getDataConfig from "./utils/getDataConfig";
import getTableConfig from "./utils/getTableConfig";
import useColumnSizes from "./composables/useColumnSizes";
import useAutoColumnSizes from "./composables/useAutoColumnSizes";
import type { TableViewDisplayProps } from "./types";
import useBoolean from "./utils/useBoolean";
import { separateSpecialColumns } from "./utils/specialColumns";
import { BORDER_BOTTOM_WIDTH } from "./constants";
import { RowHeightMode } from "./types/ViewSettings";

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
  "table-is-ready",
  "copy-selection",
]);

const props = defineProps<TableViewDisplayProps>();

const root: Ref<null | HTMLElement> = ref(null);

const baseUrl = ref("");

onMounted(() => {
  // @ts-ignore
  baseUrl.value = props.knimeService?.extensionConfig?.resourceInfo?.baseUrl;
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

const {
  header,
  settings,
  firstRowImageDimensions,
  currentRowHeight,
  enableDynamicRowHeight,
} = toRefs(props);

const hasDynamicRowHeight = computed(
  () =>
    enableDynamicRowHeight.value &&
    settings.value.rowHeightMode === RowHeightMode.DEFAULT,
);

const {
  autoColumnSizes,
  autoColumnSizesActive,
  autoColumnSizesOptions,
  onAutoColumnSizesUpdate,
} = useAutoColumnSizes({
  settings,
  firstRowImageDimensions,
  currentRowHeight,
  hasDynamicRowHeight,
});

const {
  columnSizes,
  onColumnResize,
  onAllColumnsResize,
  onUpdateAvailableWidth,
  deleteColumnSizeOverrides,
} = useColumnSizes({
  header,
  settings,
  autoColumnSizes,
  autoColumnSizesActive,
});

const dataConfig = computed(() => {
  const conf = getDataConfig({
    settings: props.settings,
    columnSizes: columnSizes.value,
    enableRowResizing: props.enableRowResizing,
    enableDynamicRowHeight: props.enableDynamicRowHeight,
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
    enableCellSelection: props.enableCellSelection,
    enableColumnResizing: props.enableColumnResizing,
    forceHideTableSizes: props.forceHideTableSizes || false,
    settingsItems: props.settingsItems,
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

const table: Ref<null | typeof TableUIWithAutoSizeCalculation> = ref(null);

const tableIsReady = ref(false);
const onTableIsReady = () => {
  emit("table-is-ready");
  tableIsReady.value = true;
};

defineExpose({
  ...[
    "refreshScroller" as const,
    "clearCellSelection" as const,
    "triggerCalculationOfAutoColumnSizes" as const,
  ].reduce((acc: Record<string, Function>, methodName) => {
    acc[methodName] = () => {
      const method = table.value?.[methodName];
      if (typeof method === "function") {
        method();
      }
    };
    return acc;
  }, {}),
  deleteColumnSizeOverrides,
});

const onCopySelection = ({
  rect: { x, y },
  id,
  withHeaders,
}: {
  rect: Rect;
  id: boolean;
  withHeaders: boolean;
}) => {
  const indices = Array.from(
    { length: x.max - x.min + 1 },
    (_, index) => x.min + index,
  );
  const { columnNames, containedSpecialColumns } = separateSpecialColumns(
    indices.map(getColumnId),
  );
  const fromIndex = y.min;
  const toIndex = y.max;
  emit("copy-selection", {
    columnNames,
    withRowIndices: containedSpecialColumns.has("INDEX"),
    withRowKeys: containedSpecialColumns.has("ROW_ID"),
    withHeaders,
    fromIndex,
    toIndex,
    isTop: id,
  });
};
</script>

<template>
  <div ref="root" class="table-view-wrapper">
    <h4 v-if="settings?.title" class="table-title">
      {{ settings.title }}
    </h4>
    <TableUIWithAutoSizeCalculation
      v-if="rows.loaded && numberOfDisplayedColumns > 0"
      ref="table"
      :data="[rowData]"
      :bottom-data="bottomRowData"
      :current-selection="selection ? [selection.top] : undefined"
      :current-bottom-selection="selection?.bottom"
      :total-selected="selection?.totalSelected"
      :data-config="dataConfig"
      :table-config="tableConfig"
      :num-rows-above="rows.numRowsAbove"
      :num-rows-below="rows.numRowsBelow"
      :auto-column-sizes-options="autoColumnSizesOptions"
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
          onColumnResize(getColumnId(colIndex), newSize)
      "
      @column-resize-start="columnResizeActive.setTrue"
      @column-resize-end="columnResizeActive.setFalse"
      @all-columns-resize="onAllColumnsResize"
      @update:available-width="onUpdateAvailableWidth"
      @header-sub-menu-item-selection="
        (item: any, colIndex: number) =>
          $emit('header-sub-menu-item-selection', item, getColumnId(colIndex))
      "
      @auto-column-sizes-update="onAutoColumnSizesUpdate"
      @row-height-update="$emit('row-height-update', $event)"
      @ready="onTableIsReady"
      @copy-selection="onCopySelection"
    >
      <template
        v-for="index in numberOfUsedColumns"
        :key="index"
        #[`cellContent-${index}`]="{
          data: { cell, width, height, paddingTopBottom },
        }"
      >
        <ImageRenderer
          v-if="getContentType(index) === 'img_path'"
          :key="index"
          :include-data-in-html="includeImageResources"
          :path="cell"
          :width="width"
          :height="
            typeof height === 'number' ? height - BORDER_BOTTOM_WIDTH : height
          "
          :base-url="baseUrl"
          :update="!columnResizeActive.state"
          :table-is-ready="tableIsReady"
          @pending="(id: string) => $emit('pending-image', id)"
          @rendered="(id: string) => $emit('rendered-image', id)"
        />
        <HtmlRenderer
          v-else
          :content="cell"
          :padding-top-bottom="paddingTopBottom"
        />
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
  padding: 10px 0 5px;
  color: rgb(70 70 70);
  font-size: 16px;
  line-height: 20px;
}

.no-columns {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & h4 {
    color: rgb(70 70 70);
    font-size: 16px;
  }
}

.table-view-wrapper {
  display: flex;
  flex-direction: column;

  & :deep(.row) {
    border-bottom: v-bind(BORDER_BOTTOM_WIDTH + "px") solid
      var(--knime-porcelain);
    align-content: center;
  }
}
</style>
