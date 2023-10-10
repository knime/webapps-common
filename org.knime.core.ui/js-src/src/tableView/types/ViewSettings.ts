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
  HIDE = "HIDE",
  SHOW_AND_PUBLISH = "SHOW_AND_PUBLISH",
}

type TableViewViewSettings = {
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
};

export default TableViewViewSettings;
