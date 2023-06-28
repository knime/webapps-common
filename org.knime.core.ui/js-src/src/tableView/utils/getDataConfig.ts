const isImage = (contentType: string) => contentType === 'img_path';
const isHtml = (contentType: string) => contentType === 'html';

import specialColumns from './specialColumns';
const { INDEX, ROW_ID, SKIPPED_REMAINING_COLUMNS_COLUMN } = specialColumns;
const DEFAULT_IMAGE_ROW_HEIGHT = 80;

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
    indicateRemainingColumnsSkipped,
    enableRowResizing
}: {
    settings: any,
    columnSizes: number[],
    columnFiltersMap?: Map<symbol | string, any>,
    displayedColumns: string[],
    columnContentTypes: string[],
    dataTypes: Record<string, {
        name: string,
        renderers: { name: string, id: string }[]
    }>,
    colNameSelectedRendererId?: Record<string, string>,
    columnDataTypeIds: any,
    columnFormatterDescriptions?: (string|null)[],
    indicateRemainingColumnsSkipped: any,
    enableRowResizing: boolean
}) => {
    const { showRowKeys, showRowIndices, compactMode, showColumnDataType, enableRendererSelection } = settings;
    
    const createHeaderSubMenuItems = (columnName: string, renderers: any[]) => {
        const headerSubMenuItems = [];
        headerSubMenuItems.push({ text: 'Data renderer', separator: true, sectionHeadline: true });
        renderers.forEach(renderer => {
            headerSubMenuItems.push({
                text: renderer.name,
                title: renderer.name,
                id: renderer.id,
                section: 'dataRendering',
                selected: colNameSelectedRendererId ? colNameSelectedRendererId[columnName] === renderer.id : false
            });
        });
        return headerSubMenuItems;
    };
        
    const createColumnConfig = ({
        index,
        columnName,
        filterConfig,
        columnTypeName,
        contentType,
        isSortable,
        columnTypeRenderers
    }:
    {
        index: number,
        columnName: string,
        filterConfig?: any,
        isSortable: boolean,
        columnTypeName?: string,
        contentType?: any,
        columnTypeRenderers?: any
    }) => ({
        key: index,
        header: columnName,
        subHeader: columnTypeName,
        hasSlotContent: isImage(contentType) || isHtml(contentType),
        size: columnSizes[index],
        filterConfig: filterConfig || { is: '', modelValue: '' },
        ...columnTypeRenderers && {
            headerSubMenuItems: createHeaderSubMenuItems(columnName, columnTypeRenderers)
        },
        formatter: (val: string) => val,
        isSortable
    });
    
    const columnConfigs = [];
    const columnIds = [];
    if (showRowIndices) {
        columnConfigs.push(createColumnConfig(
            { index: 0, columnName: INDEX.name, isSortable: false }
        ));
        columnIds.push(INDEX.id);
    }
    if (showRowKeys) {
        columnConfigs.push(createColumnConfig(
            { index: 1, columnName: ROW_ID.name, filterConfig: columnFiltersMap?.get(ROW_ID.id), isSortable: true }
        ));
        columnIds.push(ROW_ID.id);
    }
    displayedColumns.forEach((columnName: string, index: number) => {
        const columnFormatterDescription = columnFormatterDescriptions?.[index];
        const renderers = dataTypes[columnDataTypeIds?.[index]]?.renderers as any[] | undefined;
        // + 2: offset for the index and rowKey, because the first column
        // (index 0) always contains the indices and the second one the row keys
        const columnInformation = {
            index: index + 2,
            columnName,
            filterConfig: columnFiltersMap?.get(columnName),
            contentType: columnContentTypes?.[index],
            ...showColumnDataType && {
                columnTypeName: dataTypes[columnDataTypeIds?.[index]]?.name
            },
            ...enableRendererSelection && {
                columnTypeRenderers: renderers && [
                    ...columnFormatterDescription ? [{ id: null, name: columnFormatterDescription }] : [],
                    ...renderers || []
                ]
            },
            isSortable: true
        };
        columnConfigs.push(createColumnConfig(columnInformation));
        columnIds.push(columnName);
    });
    if (indicateRemainingColumnsSkipped) {
        columnConfigs.push(createColumnConfig(
            {
                index: displayedColumns.length + 2,
                columnName: SKIPPED_REMAINING_COLUMNS_COLUMN.name,
                isSortable: false
            }
        ));
        columnIds.push(SKIPPED_REMAINING_COLUMNS_COLUMN.id);
    }

    const specContainsImages = columnContentTypes?.some(contentType => isImage(contentType));
    return {
        columnConfigs,
        columnIds,
        rowConfig: {
            ...specContainsImages && { rowHeight: DEFAULT_IMAGE_ROW_HEIGHT },
            compactMode,
            enableResizing: enableRowResizing
        }
    };
};
