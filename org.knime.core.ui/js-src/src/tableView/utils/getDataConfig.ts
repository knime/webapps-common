import type {
  ColumnConfig,
  DataConfig,
  FilterConfig,
} from "@knime/knime-ui-table";
import { getCustomRowHeight } from "../composables/useRowHeight";
import type { TableViewViewSettings } from "../types/ViewSettings";
import { RowHeightMode, VerticalPaddingMode } from "../types/ViewSettings";
import specialColumns from "./specialColumns";
import type { DataType, HeaderMenuItem } from "../types";
import type { Renderer } from "../types/InitialData";
import type { MenuItem } from "@knime/components";
import type { ColumnContentType } from "../types/Table";
import type { Ref } from "vue";
const { INDEX, ROW_ID, SKIPPED_REMAINING_COLUMNS_COLUMN } = specialColumns;
const isImage = (contentType?: ColumnContentType) => contentType === "img_path";
const isHtml = (contentType?: ColumnContentType) => contentType === "html";
const isMultiLineTxt = (contentType?: ColumnContentType) =>
  contentType === "multi_line_txt";
const isJSON = (contentType?: ColumnContentType) => contentType === "json";
const isXML = (contentType?: ColumnContentType) => contentType === "xml";

const getRowHeightByRowHeightMode = (
  rowHeightMode: RowHeightMode,
  currentRowHeight: number,
  customRowHeight: number,
) =>
  rowHeightMode === RowHeightMode.AUTO
    ? currentRowHeight
    : getCustomRowHeight({ customRowHeight });

export default ({
  settings,
  displayedColumns,
  columnSizes,
  columnFiltersMap,
  columnContentTypes,
  colNameSelectedRendererId,
  dataTypes,
  columnDataTypeIds,
  columnFormatterDescriptions,
  columnNamesColors,
  indicateRemainingColumnsSkipped,
  enableRowResizing,
  hasDynamicRowHeight,
  currentRowHeight,
}: {
  settings: TableViewViewSettings;
  columnSizes: number[];
  columnFiltersMap?: Map<symbol | string, FilterConfig>;
  displayedColumns: string[];
  columnContentTypes: ColumnContentType[];
  dataTypes: Record<string, DataType>;
  colNameSelectedRendererId?: Record<string, string>;
  columnDataTypeIds: string[];
  columnFormatterDescriptions?: (string | null)[];
  columnNamesColors: string[] | null;
  indicateRemainingColumnsSkipped: boolean;
  enableRowResizing: boolean;
  hasDynamicRowHeight: boolean;
  currentRowHeight: Ref<number>;
}): DataConfig => {
  const {
    showRowKeys,
    showRowIndices,
    rowHeightMode,
    customRowHeight,
    showColumnDataType,
    enableRendererSelection,
    verticalPaddingMode,
  } = settings;

  const createHeaderSubMenuItems = (
    columnName: string,
    renderers: Renderer[],
  ) => {
    const headerSubMenuItems: (HeaderMenuItem | MenuItem)[] = [];
    headerSubMenuItems.push({
      text: "Data renderer",
      separator: true,
      sectionHeadline: true,
    });
    renderers.forEach((renderer) => {
      headerSubMenuItems.push({
        text: renderer.name,
        title: renderer.name,
        id: renderer.id,
        section: "dataRendering",
        selected: colNameSelectedRendererId
          ? colNameSelectedRendererId[columnName] === renderer.id
          : false,
      });
    });
    return headerSubMenuItems;
  };

  const createColumnConfig = ({
    id,
    index,
    columnName,
    filterConfig,
    columnTypeName,
    contentType,
    isSortable,
    hasDataValueView,
    columnTypeRenderers,
    headerColor,
  }: {
    id: symbol | string;
    index: number;
    columnName: string;
    filterConfig?: FilterConfig;
    isSortable: boolean;
    hasDataValueView?: boolean;
    columnTypeName?: string;
    contentType?: ColumnContentType;
    columnTypeRenderers?: Renderer[];
    headerColor?: string;
  }): ColumnConfig => ({
    // the id is used to keep track of added/removed columns in the TableUIForAutoSizeCalculation
    id,
    // the key is used to access the data in the TableUI
    key: index,
    header: columnName,
    subHeader: columnTypeName,
    noPadding: isImage(contentType),
    hasSlotContent:
      isImage(contentType) ||
      isHtml(contentType) ||
      isMultiLineTxt(contentType) ||
      isJSON(contentType) ||
      isXML(contentType),
    hasDataValueView,
    size: columnSizes[index],
    filterConfig,
    ...(columnTypeRenderers && {
      headerSubMenuItems: createHeaderSubMenuItems(
        columnName,
        columnTypeRenderers,
      ),
    }),
    formatter: (val: string) => val,
    isSortable,
    headerColor,
  });

  const columnConfigs: ColumnConfig[] = [];
  if (showRowIndices) {
    columnConfigs.push(
      createColumnConfig({
        id: INDEX.id,
        index: 0,
        columnName: INDEX.name,
        isSortable: false,
      }),
    );
  }
  if (showRowKeys) {
    columnConfigs.push(
      createColumnConfig({
        id: ROW_ID.id,
        index: 1,
        columnName: ROW_ID.name,
        filterConfig: columnFiltersMap?.get(ROW_ID.id),
        isSortable: true,
      }),
    );
  }
  displayedColumns.forEach((columnName: string, index: number) => {
    const columnFormatterDescription = columnFormatterDescriptions?.[index];
    const dataType = dataTypes[columnDataTypeIds?.[index]] as
      | DataType
      | undefined;
    const renderers = dataType?.renderers as any[] | undefined;
    // + 2: offset for the index and rowKey, because the first column
    // (index 0) always contains the indices and the second one the row keys
    const columnInformation = {
      id: columnName,
      index: index + 2,
      columnName,
      filterConfig: columnFiltersMap?.get(columnName),
      contentType: columnContentTypes?.[index],
      ...(showColumnDataType && {
        columnTypeName: dataType?.name,
      }),
      ...(enableRendererSelection && {
        columnTypeRenderers: renderers && [
          ...(columnFormatterDescription
            ? [{ id: null, name: columnFormatterDescription }]
            : []),
          ...(renderers || []),
        ],
      }),
      isSortable: true,
      hasDataValueView: dataType?.hasDataValueView,
      headerColor: columnNamesColors?.[index],
    };
    columnConfigs.push(createColumnConfig(columnInformation));
  });
  if (indicateRemainingColumnsSkipped) {
    columnConfigs.push(
      createColumnConfig({
        id: SKIPPED_REMAINING_COLUMNS_COLUMN.id,
        index: displayedColumns.length + 2,
        columnName: SKIPPED_REMAINING_COLUMNS_COLUMN.name,
        isSortable: false,
      }),
    );
  }

  const rowHeight = hasDynamicRowHeight
    ? ("dynamic" as const)
    : getRowHeightByRowHeightMode(
        rowHeightMode,
        currentRowHeight.value,
        customRowHeight,
      );
  const compactMode = verticalPaddingMode === VerticalPaddingMode.COMPACT;

  return {
    columnConfigs,
    rowConfig: {
      rowHeight,
      compactMode,
      enableResizing: enableRowResizing,
    },
  };
};
