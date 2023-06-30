import type { KnimeService } from '@knime/ui-extension-service';

export interface DataType {
    name: string,
    renderers: { name: string, id: string }[]
}

export interface TableViewDisplayProps {
    settings: any,
    rows: {
        loaded: boolean,
        top: any[][],
        bottom?: any[][],
        numRowsAbove?: number,
        numRowsBelow?: number
    },
    header: {
        displayedColumns: string[],
        columnFiltersMap?: Map<string|symbol, any>,
        columnContentTypes: ('txt' | 'img_path' | 'html')[],
        columnSizeOverrides?: Record<string | symbol, number>,
        defaultColumnSizeOverride?: number
        availableWidth?: number,
        dataTypes: Record<string, DataType>,
        columnDataTypeIds: string[],
        colNameSelectedRendererId?: Record<string, string>,
        columnFormatterDescriptions?: (string| null)[],
        indicateRemainingColumnsSkipped: boolean
    },
    selection?: {
        top: any[][],
        bottom: any[][],
        totalSelected: boolean
    },
    page?: {
        currentRowCount: number,
        totalRowCount: number,
        currentPage: number,
        columnCount: number
    },
    sorting?: {
        columnSortIndex: number,
        columnSortDirection: number
    },
    globalSearchQuery: string
    enableVirtualScrolling: boolean,
    enableColumnResizing: boolean,
    enableRowResizing: boolean,
    includeImageResources: boolean,
    knimeService: KnimeService
}
