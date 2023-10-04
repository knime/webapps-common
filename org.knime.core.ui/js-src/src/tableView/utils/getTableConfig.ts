import type { PageParams } from "../types";
import type TableViewViewSettings from "../types/ViewSettings";
import { SelectionMode } from "../types/ViewSettings";

const getPageConfig = (
  pageParams: PageParams,
  pageSize: number,
  enablePagination: boolean,
  showTableSize: boolean,
) => {
  const { currentRowCount, totalRowCount, currentPage, columnCount } =
    pageParams;

  return {
    pageConfig: {
      currentSize: currentRowCount,
      tableSize: totalRowCount,
      pageSize: enablePagination ? pageSize : currentRowCount,
      currentPage,
      columnCount,
      showTableSize,
    },
  };
};

export default ({
  settings,
  pageParams,
  sortParams,
  globalSearchQuery,
  enableVirtualScrolling,
  enableCellSelection,
  enableColumnResizing,
  forceHideTableSizes,
  settingsItems,
}: {
  settings: TableViewViewSettings;
  pageParams: PageParams;
  sortParams?: {
    columnSortIndex: number;
    columnSortDirection: number;
  };
  globalSearchQuery: string;
  enableVirtualScrolling: boolean;
  enableCellSelection: boolean;
  enableColumnResizing: boolean;
  forceHideTableSizes: boolean;
  settingsItems?: object[];
}) => {
  const {
    enableSortingByHeader,
    enableGlobalSearch,
    enableColumnSearch,
    selectionMode,
    pageSize,
    enablePagination,
    showTableSize,
  } = settings;
  return {
    subMenuItems: [],
    showSelection: selectionMode !== SelectionMode.OFF,
    disableSelection: selectionMode !== SelectionMode.EDIT,
    enableCellSelection,
    enableColumnResizing,
    showColumnFilters: enableColumnSearch || false,
    ...getPageConfig(
      pageParams,
      pageSize,
      enablePagination,
      forceHideTableSizes ? false : enablePagination || showTableSize,
    ),
    enableVirtualScrolling,
    ...(enableSortingByHeader && {
      sortConfig: {
        sortColumn: sortParams?.columnSortIndex,
        sortDirection: sortParams?.columnSortDirection,
      },
    }),
    ...(enableGlobalSearch && {
      searchConfig: {
        searchQuery: globalSearchQuery,
      },
    }),
    settingsItems,
  };
};
