interface PageParams {
    currentRowCount: number,
    totalRowCount: number,
    currentPage: number,
    columnCount: number,
}

const getPageConfig = (pageParams: PageParams | undefined, pageSize: number,
    enablePagination: boolean, showTableSize: boolean) => {
    if (typeof pageParams === 'undefined') {
        return {
            pageConfig: {
                showTableSize: false,
                currentSize: 0,
                pageSize: 0
            }
        };
    }
    const { currentRowCount,
        totalRowCount,
        currentPage,
        columnCount } = pageParams;

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
    enableColumnResizing
} : {
    settings: any,
    pageParams?: {
        currentRowCount: number,
        totalRowCount: number,
        currentPage: number,
        columnCount: number,
    },
    sortParams?: {
        columnSortIndex: number,
        columnSortDirection: number
    },
    globalSearchQuery: string,
    enableVirtualScrolling: boolean,
    enableColumnResizing: boolean
}) => {
    const { enableSortingByHeader, enableGlobalSearch, enableColumnSearch,
        publishSelection, subscribeToSelection, pageSize, enablePagination, showTableSize } = settings;
    return {
        subMenuItems: [],
        showSelection: publishSelection || subscribeToSelection || false,
        enableColumnResizing,
        showColumnFilters: enableColumnSearch || false,
        ...getPageConfig(pageParams, pageSize, enablePagination, enablePagination || showTableSize),
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
