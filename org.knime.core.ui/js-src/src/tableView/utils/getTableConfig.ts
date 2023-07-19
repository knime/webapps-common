import type { PageParams } from '../types';

const getPageConfig = (pageParams: PageParams, pageSize: number,
    enablePagination: boolean, showTableSize: boolean) => {
    const {
        currentRowCount,
        totalRowCount,
        currentPage,
        columnCount
    } = pageParams;

    return {
        pageConfig: {
            currentSize: currentRowCount,
            tableSize: totalRowCount,
            pageSize: enablePagination ? pageSize : currentRowCount,
            currentPage,
            columnCount,
            showTableSize
        }
    };
};

export default ({
    settings,
    pageParams,
    sortParams,
    globalSearchQuery,
    enableVirtualScrolling,
    enableColumnResizing,
    forceHideTableSizes
} : {
    settings: any,
    pageParams: PageParams,
    sortParams?: {
        columnSortIndex: number,
        columnSortDirection: number
    },
    globalSearchQuery: string,
    enableVirtualScrolling: boolean,
    enableColumnResizing: boolean,
    forceHideTableSizes: boolean
}) => {
    const { enableSortingByHeader, enableGlobalSearch, enableColumnSearch,
        publishSelection, subscribeToSelection, pageSize, enablePagination, showTableSize } = settings;
    return {
        subMenuItems: [],
        showSelection: publishSelection || subscribeToSelection || false,
        enableColumnResizing,
        showColumnFilters: enableColumnSearch || false,
        ...getPageConfig(pageParams, pageSize, enablePagination,
            forceHideTableSizes ? false : enablePagination || showTableSize),
        enableVirtualScrolling,
        ...enableSortingByHeader && {
            sortConfig: {
                sortColumn: sortParams?.columnSortIndex,
                sortDirection: sortParams?.columnSortDirection
            }
        },
        ...enableGlobalSearch && {
            searchConfig: {
                searchQuery: globalSearchQuery
            }
        }
    };
};
