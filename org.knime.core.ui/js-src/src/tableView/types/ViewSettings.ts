export enum RowHeightMode {
  COMPACT = "COMPACT",
  DEFAULT = "DEFAULT",
  CUSTOM = "CUSTOM",
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

export type PossiblyNonInitializedSettings = GenericTableViewViewSettings<
  string[] | undefined
>;

export const isInitialized = (
  newSettings: PossiblyNonInitializedSettings,
): newSettings is TableViewViewSettings => {
  return typeof newSettings.displayedColumns.selected !== "undefined";
};

export default TableViewViewSettings;
