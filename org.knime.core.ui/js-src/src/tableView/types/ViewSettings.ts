export enum RowHeightMode {
  AUTO = "AUTO",
  CUSTOM = "CUSTOM",
}

export enum VerticalPaddingMode {
  DEFAULT = "DEFAULT",
  COMPACT = "COMPACT",
}

export enum AutoSizeColumnsToContent {
  FIXED = "FIXED",
  FIT_CONTENT = "FIT_CONTENT",
  FIT_CONTENT_AND_HEADER = "FIT_CONTENT_AND_HEADER",
}

export enum SelectionMode {
  SHOW = "SHOW",
  OFF = "OFF",
  EDIT = "EDIT",
}

type GenericTableViewViewSettings<T extends string[] | undefined> = {
  showRowKeys: boolean;
  showRowIndices: boolean;
  showColumnDataType: boolean;
  enableRendererSelection: boolean;
  showTableSize: boolean;
  rowHeightMode: RowHeightMode;
  verticalPaddingMode: VerticalPaddingMode;
  customRowHeight: number;
  selectionMode: SelectionMode;
  enableColumnSearch: boolean;
  enablePagination: boolean;
  pageSize: number;
  enableSortingByHeader: boolean;
  enableGlobalSearch: boolean;
  autoSizeColumnsToContent: AutoSizeColumnsToContent;
  title: string;
  skipRemainingColumns: boolean;
  showOnlySelectedRows: boolean;
  showOnlySelectedRowsConfigurable: boolean;
  displayedColumns: { selected: T };
  enableCellCopying: boolean;
};

type TableViewViewSettings = GenericTableViewViewSettings<string[]>;

export type TableViewDialogSettings = GenericTableViewViewSettings<
  string[] | undefined
>;

export default TableViewViewSettings;

/**
 * TODO: Remove statistics logic from knime-core-ui. This could be achieved with UIEXT-1882.
 */
export type StatisticsViewDialogSettings = Omit<
  TableViewViewSettings,
  "displayedColumns"
> & {
  displayedColumns: string[];
};

const isStatisticsSettings = (
  data: StatisticsViewDialogSettings | TableViewDialogSettings,
): data is StatisticsViewDialogSettings => Array.isArray(data.displayedColumns);

const toTableViewSettings = (
  statisticsDialogSettings: StatisticsViewDialogSettings,
): TableViewViewSettings => ({
  ...statisticsDialogSettings,
  displayedColumns: { selected: statisticsDialogSettings.displayedColumns },
});

export const parseOnViewSettingsChangeSettings = (
  dialogSettings: StatisticsViewDialogSettings | TableViewDialogSettings,
  currentSelected: string[],
): TableViewViewSettings => {
  if (isStatisticsSettings(dialogSettings)) {
    return toTableViewSettings(dialogSettings);
  }
  const newSelected = dialogSettings.displayedColumns.selected;
  return {
    ...dialogSettings,
    displayedColumns: { selected: newSelected ?? currentSelected },
  };
};
