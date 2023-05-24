<!-- eslint-disable max-lines -->
<script>
import { JsonDataService, SelectionService } from '@knime/ui-extension-service';
import { TableUI, constants as tableUIConstants } from '@knime/knime-ui-table';
import { createDefaultFilterConfig, arrayEquals, isImage } from '@/tableView/utils';
import throttle from 'raf-throttle';

const { MIN_COLUMN_SIZE, SPECIAL_COLUMNS_SIZE } = tableUIConstants;

const INDEX_SYMBOL = Symbol('Index');
const ROW_KEY_SYMBOL = Symbol('RowID');
const REMAINING_COLUMNS_SYMBOL = Symbol('Remaining columns');
// -1 is the backend representation (columnName) for sorting the table by rowKeys
const ROW_KEYS_SORT_COL_NAME = '-1';
const MIN_SCOPE_SIZE = 200;
const MIN_BUFFER_SIZE = 50;
const DEFAULT_COLUMN_SIZE = 100;

export default {
    components: {
        TableUI
    },
    inject: ['getKnimeService'],
    data() {
        return {
            dataLoaded: false,
            currentIndex: 0,
            currentPage: 1,
            currentScopeStartIndex: null,
            currentScopeEndIndex: null,
            columnSortIndex: null,
            columnSortDirection: null,
            columnSortColumnName: null,
            currentSelection: null,
            currentBottomSelection: null,
            totalSelected: 0,
            table: {},
            colNameSelectedRendererId: {},
            dataTypes: {},
            columnDomainValues: {},
            currentSelectedRowKeys: new Set(),
            totalRowCount: 0,
            currentRowCount: 0,
            settings: {},
            displayedColumns: [],
            columnCount: 0,
            jsonDataService: null,
            selectionService: null,
            searchTerm: '',
            columnFilters: [],
            columnIndexMap: null,
            baseUrl: null,
            clientWidth: 0,
            columnSizeOverrides: {},
            scopeSize: MIN_SCOPE_SIZE,
            bufferSize: MIN_BUFFER_SIZE,
            numRowsAbove: 0,
            numRowsBelow: 0,
            maxNumRows: 200000,
            bottomRows: [],
            rowIdColumnName: 'RowID',
            indexColumnName: '#',
            skippedRemainingColumnsColumnName: '(skipped remaining columns)',
            skippedRemainingColumnsColumnMinWidth: 200,
            columnDataTypeIds: null,
            columnContentTypes: null,
            // a counter which is used to ignore all requests which were not the last sent one
            lastUpdateHash: 0,
            wrapperResizeObserver: new ResizeObserver(() => {
                this.onResize();
            })
        };
    },
    computed: {
        knimeService() {
            return this.getKnimeService();
        },
        specContainsImages() {
            return this.columnContentTypes?.some(contentType => isImage(contentType));
        },
        dataConfig() {
            const { showRowKeys, showRowIndices, compactMode } = this.settings;
            let columnConfigs = [];
            if (showRowIndices) {
                columnConfigs.push(this.createColumnConfig(
                    { index: 0, columnName: this.indexColumnName, isSortable: false }
                ));
            }
            if (showRowKeys) {
                columnConfigs.push(this.createColumnConfig(
                    { index: 1, columnName: this.rowIdColumnName, isSortable: true }
                ));
            }
            this.displayedColumns.forEach((columnName, index) => {
                // + 2: offset for the index and rowKey, because the first column
                // (index 0) always contains the indices and the second one the row keys
                const { showColumnDataType, enableRendererSelection } = this.settings;
                const columnInformation = {
                    index: index + 2,
                    columnName,
                    contentType: this.columnContentTypes?.[index],
                    ...showColumnDataType && {
                        columnTypeName: this.dataTypes[this.columnDataTypeIds?.[index]]?.name
                    },
                    ...enableRendererSelection && {
                        columnTypeRenderers: this.dataTypes[this.columnDataTypeIds?.[index]]?.renderers
                    },
                    isSortable: true
                };
                columnConfigs.push(this.createColumnConfig(columnInformation));
            });
            if (this.indicateRemainingColumnsSkipped) {
                columnConfigs.push(this.createColumnConfig(
                    {
                        index: this.displayedColumns.length + 2,
                        columnName: this.skippedRemainingColumnsColumnName,
                        isSortable: false
                    }
                ));
            }
            this.updateColumnIndexMap(columnConfigs);
            return {
                columnConfigs,
                rowConfig: { ...this.specContainsImages && { rowHeight: 80 }, compactMode }
            };
        },
        tableConfig() {
            const { enableSortingByHeader, enableGlobalSearch, enableColumnSearch,
                publishSelection, subscribeToSelection, pageSize, enablePagination } = this.settings;
            return {
                subMenuItems: [],
                showSelection: publishSelection || subscribeToSelection,
                showColumnFilters: enableColumnSearch,
                pageConfig: {
                    currentSize: this.currentRowCount,
                    tableSize: this.totalRowCount,
                    pageSize: enablePagination ? pageSize : this.currentRowCount,
                    currentPage: this.currentPage,
                    columnCount: this.columnCount
                },
                enableVirtualScrolling: true,
                fitToContainer: true,
                ...enableSortingByHeader && {
                    sortConfig: {
                        sortColumn: this.columnSortIndex,
                        sortDirection: this.columnSortDirection
                    }
                },
                ...enableGlobalSearch && {
                    searchConfig: {
                        searchQuery: ''
                    }
                }
            };
        },
        numberOfDisplayedIdColumns() {
            let offset = this.settings.showRowKeys ? 1 : 0;
            offset += this.settings.showRowIndices ? 1 : 0;
            return offset;
        },
        numberOfDisplayedRemainingColumns() {
            return this.indicateRemainingColumnsSkipped ? 1 : 0;
        },
        numberOfDisplayedColumns() {
            return this.displayedColumns.length + this.numberOfDisplayedIdColumns +
                this.numberOfDisplayedRemainingColumns;
        },
        numberOfUsedColumns() {
            // The columns sent to the TableUI. The rowIndex and rowKey are included but might not be displayed.
            return this.displayedColumns.length + 2 + this.numberOfDisplayedRemainingColumns;
        },
        columnSizes() {
            if (this.numberOfDisplayedColumns < 1) {
                return [];
            }
            const availableWidth = this.getAvailableWidth();
            const initialIndexColumnSize = this.settings.showRowIndices ? MIN_COLUMN_SIZE : 0;
            const initialRowKeyColumnSize = this.settings.showRowKeys ? MIN_COLUMN_SIZE : 0;
            const initialRemainingSkippedColumnSize = this.indicateRemainingColumnsSkipped
                ? this.skippedRemainingColumnsColumnMinWidth
                : 0;

            const initialTableColumnsSizeTotal = availableWidth - initialIndexColumnSize -
                initialRowKeyColumnSize - initialRemainingSkippedColumnSize;

            const indexColumnSize = this.columnSizeOverrides[INDEX_SYMBOL] || initialIndexColumnSize;
            const rowKeyColumnSize = this.columnSizeOverrides[ROW_KEY_SYMBOL] || initialRowKeyColumnSize;
            const remainingSkippedColumnSize = this.columnSizeOverrides[REMAINING_COLUMNS_SYMBOL] ||
                initialRemainingSkippedColumnSize;

            const currentColumnSizes = [indexColumnSize, rowKeyColumnSize]
                .concat(this.getDataColumnSizes(initialTableColumnsSizeTotal))
                .concat(this.indicateRemainingColumnsSkipped ? [remainingSkippedColumnSize] : []);

            const indexColumnIsOnlyColumn = currentColumnSizes.length === 2 && !this.settings.showRowKeys;
            const lastColumnIndex = indexColumnIsOnlyColumn ? 0 : currentColumnSizes.length - 1;
            return this.stretchOneColumnToFillAvailableSpace(currentColumnSizes, lastColumnIndex, availableWidth);
        },
        rowData() {
            return this.appendDotsIfColumnsSkipped(this.table.rows);
        },
        bottomRowData() {
            if (typeof this.bottomRows === 'undefined') {
                return [];
            }
            return this.appendDotsIfColumnsSkipped(this.bottomRows);
        },
        columnFilterValues() {
            const columnFilterValues = [];
            this.columnFilters.forEach((filter, index) => {
                // filter out empty dummy filter of rowIndices
                if (index === 0) {
                    return;
                }
                if (typeof filter.modelValue === 'string') {
                    columnFilterValues.push([filter.modelValue]);
                } else {
                    columnFilterValues.push(filter.modelValue);
                }
            });
            return columnFilterValues;
        },
        colFilterActive() {
            return this.columnFilterValues.some(val => val.length && val[0] !== '');
        },
        colSortActive() {
            return this.columnSortColumnName !== null && this.columnSortIndex !== null;
        },
        showTitle() {
            return this.settings.showTitle;
        },
        useLazyLoading() {
            return !this.settings.enablePagination;
        },
        selectedRendererIds() {
            return this.getCurrentSelectedRenderers(this.displayedColumns);
        },
        currentPageStart() {
            return this.settings.enablePagination ? this.settings.pageSize * (this.currentPage - 1) : 0;
        },
        currentPageEnd() {
            return this.settings.enablePagination
                ? this.settings.pageSize * this.currentPage
                : this.currentRowCount;
        },
        currentNumRowsOnPage() {
            return this.currentPageEnd - this.currentPageStart;
        },
        bottomRowsMode() {
            return this.currentNumRowsOnPage > this.maxNumRows;
        },
        numRowsBottom() {
            return this.bottomRowsMode ? 1000 : 0;
        },
        numRowsTop() {
            // minus 1 due to the additional "…" row
            return this.bottomRowsMode ? this.maxNumRows - this.numRowsBottom - 1 : this.currentNumRowsOnPage;
        },
        numRowsTotal() {
            return this.bottomRowsMode ? this.maxNumRows : this.currentNumRowsOnPage;
        },
        skipRemainingColumns() {
            return this.settings.skipRemainingColumns;
        },
        indicateRemainingColumnsSkipped() {
            return this.displayedColumns.length < this.columnCount;
        }
    },
    async mounted() {
        const clientWidth = this.$el.getBoundingClientRect().width;
        this.wrapperResizeObserver.observe(this.$el);
        // clientWidth can be 0, e.g., if table is not visible (yet)
        if (clientWidth) {
            this.clientWidth = clientWidth;
        } else {
            this.observeTableIntersection();
        }

        this.jsonDataService = new JsonDataService(this.knimeService);
        this.jsonDataService.addOnDataChangeCallback(this.onViewSettingsChange.bind(this));
        const initialData = await this.jsonDataService.initialData();
        this.selectionService = new SelectionService(this.knimeService);
        this.baseUrl = this.knimeService?.extensionConfig?.resourceInfo?.baseUrl;
        if (initialData) {
            const { table, dataTypes, columnDomainValues, settings } = initialData;
            this.displayedColumns = table.displayedColumns;
            this.columnCount = table.columnCount;
            this.columnDataTypeIds = table.columnDataTypeIds;
            this.columnContentTypes = table.columnContentTypes;
            this.dataTypes = dataTypes;
            this.columnDomainValues = columnDomainValues;
            this.totalRowCount = table.rowCount;
            this.currentRowCount = table.rowCount;
            this.settings = settings;
            if (this.useLazyLoading) {
                await this.initializeLazyLoading();
            } else {
                this.table = table;
            }
            await this.handleInitialSelection();
            const { publishSelection, subscribeToSelection } = settings;
            this.selectionService.onInit(this.onSelectionChange, publishSelection, subscribeToSelection);
            this.dataLoaded = true;
            this.columnFilters = this.getDefaultFilterConfigs(this.displayedColumns);
        }
    },
    beforeUnmount() {
        this.wrapperResizeObserver.disconnect();
    },
    methods: {
        // The avaliable space for all resizable columns (i.e. table columns, but also index, rowKey, ...)
        getAvailableWidth() {
            const specialColumnsSizeTotal = (this.settings.enableColumnSearch ? SPECIAL_COLUMNS_SIZE : 0) +
                (this.settings.publishSelection || this.settings.subscribeToSelection ? SPECIAL_COLUMNS_SIZE : 0);
            return this.clientWidth - specialColumnsSizeTotal;
        },
        getDataColumnSizes(availableSpace) {
            const defaultColumnSize = Math.max(DEFAULT_COLUMN_SIZE, availableSpace / this.displayedColumns.length);
            return this.displayedColumns.reduce((columnSizes, columnName) => {
                columnSizes.push(this.columnSizeOverrides[columnName] || defaultColumnSize);
                return columnSizes;
            }, []);
        },
        stretchOneColumnToFillAvailableSpace(columnSizes, index, availableSpace) {
            const totalSize = columnSizes.reduce((sum, size) => sum + size, 0);
            if (totalSize < availableSpace) {
                columnSizes[index] += availableSpace - totalSize;
            }
            return columnSizes;
        },
        appendDotsIfColumnsSkipped(rows) {
            if (this.indicateRemainingColumnsSkipped) {
                return rows.map((row) => [...row, '…']);
            } else {
                return rows;
            }
        },
        async initializeLazyLoading(params) {
            const { updateDisplayedColumns = false, updateTotalSelected = true } = params || {};
            this.currentScopeStartIndex = 0;
            this.currentScopeEndIndex = Math.min(this.scopeSize, this.currentRowCount);
            await this.updateData({
                lazyLoad: this.getLazyLoadParamsForCurrentScope(),
                updateDisplayedColumns,
                updateTotalSelected
            });
        },
        getLazyLoadParamsForCurrentScope() {
            const numRows = this.currentScopeEndIndex - this.currentScopeStartIndex;
            return {
                loadFromIndex: this.currentScopeStartIndex,
                newScopeStart: this.currentScopeStartIndex,
                numRows
            };
        },
        onScroll({ direction, startIndex, endIndex }) {
            if (!this.useLazyLoading) {
                return;
            }
            const prevScopeStart = this.currentScopeStartIndex;
            const prevScopeEnd = this.currentScopeEndIndex;
            const prevScopeSize = this.scopeSize;
            this.scopeSize = this.computeScopeSize(startIndex, endIndex);
            /** we only force an update on a scope size change if it is significant
             * (since startIndex and endIndex do not have a fixed distance even if the
             * height of the scroller is not changed)
             */
            const scopeChangeThreshold = 10;
            const scopeSizeChanged = Math.abs(prevScopeSize - this.scopeSize) > scopeChangeThreshold;
            let bufferStart, bufferEnd, newScopeStart, loadFromIndex, numRows;
            if (direction > 0) {
                if (prevScopeEnd - endIndex > this.bufferSize && !scopeSizeChanged) {
                    return;
                }
                // keep bufferSize elements above the current first visible element or keep all previous rows if the
                // update is due to a change in scope size
                bufferStart = scopeSizeChanged ? prevScopeStart : Math.max(startIndex - this.bufferSize, 0);
                // keep the already loaded elements below the current last visible.
                bufferEnd = Math.max(bufferStart, prevScopeEnd);
                // The next scope consist of numRows newly loaded rows and the buffer.
                // the size of the next scope should be this.scopeSize again (or less at the bottom of the table).
                numRows = Math.min(this.scopeSize - (bufferEnd - bufferStart), this.numRowsTotal - bufferEnd);
                newScopeStart = bufferStart;
                loadFromIndex = bufferEnd;
            } else {
                if (startIndex - prevScopeStart > this.bufferSize && !scopeSizeChanged) {
                    return;
                }
                // keep bufferSize elements below the current last visible or keep all previous rows if the
                // update is due to a change in scope size
                bufferEnd = scopeSizeChanged ? prevScopeEnd : Math.min(endIndex + this.bufferSize, this.numRowsTotal);
                // keep already loaded elements above the current first visible.
                bufferStart = Math.min(bufferEnd, prevScopeStart);
                // The next scope consist of numRows newly loaded rows and the buffer.
                // the size of the next scope should be this.scopeSize again (or less at the top of the table).
                numRows = Math.min(bufferStart, this.scopeSize - (bufferEnd - bufferStart));
                newScopeStart = loadFromIndex = bufferStart - numRows;
            }
            if (numRows > 0) {
                this.updateData({
                    lazyLoad: {
                        loadFromIndex,
                        numRows,
                        bufferStart,
                        bufferEnd,
                        direction,
                        newScopeStart
                    }
                });
            }
        },
        computeScopeSize(startIndex, endIndex) {
            return Math.max(endIndex - startIndex + 2 * this.bufferSize, MIN_SCOPE_SIZE);
        },

        async updateData(options) {
            this.lastUpdateHash += 1;
            const updateHash = this.lastUpdateHash;
            const data = await this.requestData(options);
            if (this.lastUpdateHash !== updateHash) {
                return;
            }
            this.updateInternals(data, options);
        },
        async requestData(options) {
            const { lazyLoad, updateTotalSelected = false, updateDisplayedColumns = false } = options;
            const displayedColumns = this.getColumnsForRequest(updateDisplayedColumns);

            let loadFromIndex, numRows;
            if (lazyLoad) {
                ({ loadFromIndex, numRows } = lazyLoad);
            } else {
                loadFromIndex = this.currentIndex;
                numRows = this.currentNumRowsOnPage;
            }
            const loadToIndex = loadFromIndex + numRows;
            const { topLoadFromIndex, topNumRows, bottomLoadFromIndex, bottomNumRows } = this.settings.enablePagination
                ? this.getTopAndBottomIndicesOnPagination(loadFromIndex, numRows)
                : {
                    ...this.getTopIndices(loadFromIndex, loadToIndex),
                    ...this.getBottomIndices(loadFromIndex, loadToIndex)
                };

            const fetchTopTable = topNumRows !== 0 || bottomNumRows === 0;
            const fetchBottomTable = bottomNumRows !== 0;
            const topTablePromise = fetchTopTable
                ? this.requestTable(topLoadFromIndex, topNumRows, displayedColumns,
                    updateDisplayedColumns, updateTotalSelected, this.settings.enablePagination)
                : null;

            let bottomTablePromise = fetchBottomTable
                ? this.requestTable(bottomLoadFromIndex, bottomNumRows, displayedColumns,
                    updateDisplayedColumns, updateTotalSelected, this.settings.enablePagination)
                : null;
            const topTable = fetchTopTable ? await topTablePromise : null;
            let bottomTable = fetchBottomTable ? await bottomTablePromise : null;

            /** If the amount of received data is smaller than anticipated it can happen that the bottom table is
                 * empty which would lead to displaying less data without a "⁞" row.
                 * This should however only happen when lazyloading is inactive and the pageSize is greater than the
                 * maximal allowed number of rows. It can happen due to a change of the page size or being on the last
                 *  page.
                 * TODO: Remove this workaround again when using lazyloading when paginating
                 *  (https://knime-com.atlassian.net/browse/UIEXT-527)
                 */
            if (bottomTable !== null && bottomTable.rows.length === 0) {
                const newBottomStart = Math.max(topLoadFromIndex + topNumRows, topTable.rowCount - this.numRowsBottom);
                bottomTable = await this.requestTable(newBottomStart, this.numRowsBottom, displayedColumns,
                    updateDisplayedColumns, updateTotalSelected, this.settings.enablePagination);
            }
            return { topTable, bottomTable };
        },
        updateInternals(tables, options) {
            const { topTable, bottomTable } = tables;
            const { updateDisplayedColumns, updateTotalSelected, updateColumnContentTypes, lazyLoad } = options;
            const getFromTopOrBottom = (key) => topTable ? topTable[key] : bottomTable[key];
            if (updateDisplayedColumns) {
                this.columnFilters = this.getDefaultFilterConfigs(getFromTopOrBottom('displayedColumns'));
                this.displayedColumns = getFromTopOrBottom('displayedColumns');
                this.columnDataTypeIds = getFromTopOrBottom('columnDataTypeIds');
                this.columnCount = getFromTopOrBottom('columnCount');
            }
            if (updateTotalSelected) {
                if (this.columnSortColumnName || this.searchTerm || this.colFilterActive) {
                    this.totalSelected = getFromTopOrBottom('totalSelected');
                } else {
                    this.totalSelected = this.currentSelectedRowKeys.size;
                }
            }
            if (updateColumnContentTypes) {
                this.columnContentTypes = getFromTopOrBottom('columnContentTypes');
            }

            if (lazyLoad) {
                const { newScopeStart, direction, bufferStart = 0, bufferEnd = bufferStart, numRows } = lazyLoad;
                const topPreviousDataLength = this.table?.rows?.length || 0;
                const rows = this.getCombinedTopRows(
                    { topTable, bufferStart, bufferEnd, direction, topPreviousDataLength }
                );
                if (typeof this.table.rows === 'undefined') {
                    this.table = { ...topTable, rows };
                } else {
                    this.table.rows = rows;
                    this.table.rowCount = getFromTopOrBottom('rowCount');
                }
                this.bottomRows = this.getCombinedBottomRows(
                    { bottomTable, bufferStart, bufferEnd, direction }
                );
                this.currentScopeStartIndex = newScopeStart;
                this.currentScopeEndIndex = Math.min(
                    newScopeStart + (bufferEnd - bufferStart) + numRows,
                    this.table.rowCount
                );
            } else {
                this.table = topTable;
                this.bottomRows = bottomTable ? bottomTable.rows : [];
            }
            this.currentRowCount = this.table.rowCount;
            this.transformSelection();
            this.numRowsAbove = lazyLoad ? this.currentScopeStartIndex : 0;
            this.numRowsBelow = lazyLoad ? this.numRowsTotal - this.currentScopeEndIndex : 0;
        },
        getTopAndBottomIndicesOnPagination(loadFromIndex, numRows) {
            const currentPageEnd = loadFromIndex + numRows;
            const topLoadFromIndex = loadFromIndex;
            const topNumRows = this.numRowsTop;
            const bottomLoadFromIndex = currentPageEnd - this.numRowsBottom;
            const bottomNumRows = this.numRowsBottom;
            return { topLoadFromIndex, topNumRows, bottomLoadFromIndex, bottomNumRows };
        },
        getTopIndices(loadFromIndex, loadToIndex) {
            const topLoadFromIndex = Math.min(loadFromIndex, this.numRowsTop);
            const topLoadToIndex = Math.min(loadToIndex, this.numRowsTop);
            const topNumRows = topLoadToIndex - topLoadFromIndex;
            return { topLoadFromIndex, topNumRows };
        },
        getBottomIndices(loadFromIndex, loadToIndex) {
            const bottomLoadFromIndex = this.currentRowCount - Math.min(
                this.numRowsBottom, this.numRowsTotal - loadFromIndex
            );
            const bottomLoadToIndex = this.currentRowCount - Math.min(
                this.numRowsBottom, this.numRowsTotal - loadToIndex
            );
            const bottomNumRows = bottomLoadToIndex - bottomLoadFromIndex;
            return { bottomLoadFromIndex, bottomNumRows };
        },
        // eslint-disable-next-line max-params
        requestTable(startIndex, numRows, displayedColumns, updateDisplayedColumns, updateTotalSelected,
            clearImageDataCache) {
            const selectedRendererIds = updateDisplayedColumns
                ? this.getCurrentSelectedRenderers(this.settings.displayedColumns.selected)
                : this.selectedRendererIds;
            // if columnSortColumnName is present a sorting is active
            if (this.columnSortColumnName || this.searchTerm || this.colFilterActive) {
                return this.requestFilteredAndSortedTable(startIndex, numRows, displayedColumns,
                    updateDisplayedColumns, updateTotalSelected, selectedRendererIds, clearImageDataCache);
            } else {
                return this.requestUnfilteredAndUnsortedTable(startIndex, numRows, displayedColumns,
                    updateDisplayedColumns, selectedRendererIds, clearImageDataCache);
            }
        },
        // eslint-disable-next-line max-params
        requestFilteredAndSortedTable(startIndex, numRows, displayedColumns, updateDisplayedColumns,
            updateTotalSelected, selectedRendererIds, clearImageDataCache) {
            const columnSortIsAscending = this.columnSortDirection === 1;
            return this.performRequest('getFilteredAndSortedTable',
                [
                    displayedColumns,
                    Math.min(this.totalRowCount - 1, Math.max(0, startIndex)),
                    numRows,
                    this.columnSortColumnName,
                    columnSortIsAscending,
                    this.searchTerm,
                    updateDisplayedColumns ? null : this.columnFilterValues,
                    this.settings.showRowKeys,
                    selectedRendererIds,
                    updateDisplayedColumns,
                    updateTotalSelected,
                    clearImageDataCache,
                    this.skipRemainingColumns
                ]);
        },
        // eslint-disable-next-line max-params
        requestUnfilteredAndUnsortedTable(startIndex, numRows, displayedColumns, updateDisplayedColumns,
            selectedRendererIds, clearImageDataCache) {
            return this.performRequest('getTable',
                [
                    displayedColumns,
                    startIndex,
                    numRows,
                    selectedRendererIds,
                    updateDisplayedColumns,
                    clearImageDataCache,
                    this.skipRemainingColumns
                ]);
        },
        getColumnsForRequest(updateDisplayedColumns) {
            return updateDisplayedColumns ? this.settings.displayedColumns.selected : this.displayedColumns;
        },
        performRequest(method, options) {
            return this.jsonDataService.data({ method, options });
        },
        getCombinedTopRows({ topTable, bufferStart, bufferEnd, direction, topPreviousDataLength }) {
            const previousStartIndex = this.currentScopeStartIndex;
            const topBufferStart = Math.min(bufferStart - previousStartIndex, topPreviousDataLength);
            const topBufferEnd = Math.min(bufferEnd - previousStartIndex, topPreviousDataLength);
            return this.combineWithPrevious({
                newRows: topTable?.rows,
                bufferStart: topBufferStart,
                bufferEnd: topBufferEnd,
                direction
            });
        },
        getCombinedBottomRows({ bottomTable, bufferStart, bufferEnd, direction }) {
            // plus 1 because of the additional "…" row
            const previousBottomStartIndex = Math.max(this.numRowsTop + 1, this.currentScopeStartIndex);
            const bottomBufferStart = Math.max(bufferStart - previousBottomStartIndex, 0);
            const bottomBufferEnd = Math.max(bufferEnd - previousBottomStartIndex, 0);
            return this.combineWithPrevious({
                newRows: bottomTable?.rows,
                bufferStart: bottomBufferStart,
                bufferEnd: bottomBufferEnd,
                direction,
                bottom: true
            });
        },
        combineWithPrevious({ newRows, bufferStart, bufferEnd, direction, bottom = false }) {
            const rows = newRows || [];
            if (bufferStart === bufferEnd) {
                return rows;
            }
            const previousRows = bottom ? this.bottomRows : this.table.rows;
            const buffer = previousRows?.slice(bufferStart, bufferEnd) || [];
            if (direction > 0) {
                return [...buffer, ...rows];
            } else {
                return [...rows, ...buffer];
            }
        },

        refreshTable(params) {
            let { updateDisplayedColumns = false, resetPage = false, updateTotalSelected = false } = params || {};
            const tableUI = this.$refs.tableUI;
            if (tableUI) {
                tableUI.refreshScroller();
            }
            if (resetPage) {
                this.currentPage = 1;
                this.currentIndex = 0;
            }
            if (this.useLazyLoading) {
                this.initializeLazyLoading({ updateDisplayedColumns, updateTotalSelected });
            } else {
                this.updateData({ updateDisplayedColumns, updateTotalSelected });
            }
        },
        onPageChange(pageDirection) {
            const { pageSize } = this.settings;
            this.currentPage += pageDirection;
            this.currentIndex += pageDirection * pageSize;
            this.refreshTable();
        },
        onViewSettingsChange(event) {
            const newSettings = event.data.data.view;
            const enablePaginationChanged = newSettings.enablePagination !== this.settings.enablePagination;
            const displayedColumnsChanged =
                !arrayEquals(newSettings.displayedColumns.selected, this.settings.displayedColumns.selected);
            const showRowKeysChanged = newSettings.showRowKeys !== this.settings.showRowKeys;
            const showRowIndicesChanged = newSettings.showRowIndices !== this.settings.showRowIndices;
            const pageSizeChanged = newSettings.pageSize !== this.settings.pageSize;
            const compactModeChangeInducesRefresh = this.useLazyLoading &&
                (newSettings.compactMode !== this.settings.compactMode);

            this.settings = newSettings;

            const numberOfDisplayedColsChanged = displayedColumnsChanged || showRowKeysChanged || showRowIndicesChanged;
            let sortingParamsReseted = false;
            if (this.colSortActive && numberOfDisplayedColsChanged) {
                sortingParamsReseted = this.updateSortingParams(newSettings, displayedColumnsChanged,
                    showRowKeysChanged, showRowIndicesChanged);
            }
            if (compactModeChangeInducesRefresh || sortingParamsReseted) {
                this.refreshTable();
            } else if (displayedColumnsChanged) {
                this.refreshTable({ updateDisplayedColumns: true, updateTotalSelected: true });
            } else if (pageSizeChanged || enablePaginationChanged) {
                this.refreshTable({ resetPage: true });
            }
            this.selectionService.onSettingsChange(() => Array.from(this.currentSelectedRowKeys), this.clearSelection,
                newSettings.publishSelection, newSettings.subscribeToSelection);
        },
        onColumnSort(newColumnSortIndex) {
            const mappedDisplayedColumns = [null, ROW_KEYS_SORT_COL_NAME, ...this.displayedColumns];
            // if columnSortIndex equals newColumnSortIndex sorting is ascending as default is descending
            const ascendingSort = this.columnSortIndex === newColumnSortIndex && this.columnSortDirection < 0;
            this.columnSortDirection = ascendingSort ? 1 : -1;
            this.currentPage = 1;
            this.currentIndex = 0;
            this.columnSortIndex = newColumnSortIndex;

            this.columnSortColumnName = mappedDisplayedColumns[this.columnIndexMap.get(this.columnSortIndex)];
            this.refreshTable();
        },
        async onSelectionChange(rawEvent) {
            const { selection, mode } = rawEvent;
            if (mode === 'REPLACE') {
                this.currentSelectedRowKeys = new Set(selection);
            } else {
                const addOrDelete = mode === 'ADD' ? 'add' : 'delete';
                this.updateCurrentSelectedRowKeys(addOrDelete, selection);
            }
            this.transformSelection();
            this.totalSelected = await this.requestTotalSelected();
        },
        requestTotalSelected() {
            if (this.searchTerm || this.colFilterActive) {
                return this.performRequest('getTotalSelected');
            } else {
                return this.currentSelectedRowKeys.size;
            }
        },
        onRowSelect(selected, rowInd, _groupInd, isTop) {
            const rowKey = isTop ? this.table.rows[rowInd][1] : this.bottomRows[rowInd][1];
            this.totalSelected += selected ? 1 : -1;
            this.updateSelection(selected, [rowKey]);
        },
        async onSelectAll(selected) {
            const filterActive = this.currentRowCount !== this.totalRowCount;
            if (selected) {
                const currentRowKeys = await this.performRequest('getCurrentRowKeys', []);
                if (filterActive) {
                    this.updateCurrentSelectedRowKeys('add', currentRowKeys);
                } else {
                    this.currentSelectedRowKeys = new Set(currentRowKeys);
                }
                this.selectionService.publishOnSelectionChange('add', currentRowKeys);
            } else if (filterActive) {
                const currentRowKeys = await this.performRequest('getCurrentRowKeys', []);
                this.updateCurrentSelectedRowKeys('delete', currentRowKeys);
                this.selectionService.publishOnSelectionChange('remove', currentRowKeys);
            } else {
                this.currentSelectedRowKeys = new Set();
                this.selectionService.publishOnSelectionChange('replace', []);
            }
            this.transformSelection();
            this.totalSelected = selected ? this.currentRowCount : 0;
        },
        onSearch(input) {
            this.searchTerm = input;
            this.refreshTable({ resetPage: true, updateTotalSelected: true });
        },
        onColumnFilter(colInd, value) {
            this.columnFilters[this.columnIndexMap.get(colInd)].modelValue = value;
            this.refreshTable({ resetPage: true, updateTotalSelected: true });
        },
        onClearFilter() {
            this.columnFilters = this.getDefaultFilterConfigs(this.displayedColumns);
            this.refreshTable({ resetPage: true, updateTotalSelected: true });
        },
        onColumnResize(columnIndex, newColumnSize) {
            const colName = this.dataConfig.columnConfigs[columnIndex].header;
            if (columnIndex < this.numberOfDisplayedIdColumns) {
                if (colName === this.indexColumnName) {
                    this.columnSizeOverrides[INDEX_SYMBOL] = newColumnSize;
                } else if (colName === this.rowIdColumnName) {
                    this.columnSizeOverrides[ROW_KEY_SYMBOL] = newColumnSize;
                } else {
                    this.columnSizeOverrides[REMAINING_COLUMNS_SYMBOL] = newColumnSize;
                }
            } else {
                this.columnSizeOverrides[colName] = newColumnSize;
            }
        },
        observeTableIntersection() {
            new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.target === this.$el && entry.boundingClientRect.width) {
                        this.clientWidth = entry.boundingClientRect.width;
                        // observer is either removed here or on garbage collection
                        observer.unobserve(entry.target);
                        window.addEventListener('resize', this.onResize);
                    }
                });
            }).observe(this.$el);
        },
        onResize: throttle(function () {
            /* eslint-disable no-invalid-this */
            const updatedClientWidth = this.$el.getBoundingClientRect().width;
            if (updatedClientWidth) {
                // also update all overridden column widths according to the relative change in client width
                const ratio = updatedClientWidth / this.clientWidth;
                Object.keys(this.columnSizeOverrides).forEach(key => {
                    this.columnSizeOverrides[key] *= ratio;
                });
                Object.getOwnPropertySymbols(this.columnSizeOverrides).forEach(symbol => {
                    this.columnSizeOverrides[symbol] *= ratio;
                });
                this.clientWidth = updatedClientWidth;
            } else {
                this.observeTableIntersection();
                window.removeEventListener('resize', this.onResize);
            }
            /* eslint-enable no-invalid-this */
        }),
        onHeaderSubMenuItemSelection(item, colInd) {
            if (item.section === 'dataRendering') {
                this.colNameSelectedRendererId[
                    this.displayedColumns[colInd - this.numberOfDisplayedIdColumns]
                ] = item.id;
            }
            this.updateData({
                ...this.useLazyLoading && { lazyLoad: this.getLazyLoadParamsForCurrentScope() },
                updateColumnContentTypes: true
            });
        },
        updateSelection(selected, rowKeys) {
            this.selectionService.publishOnSelectionChange(selected ? 'add' : 'remove', rowKeys);
            this.updateCurrentSelectedRowKeys(selected ? 'add' : 'delete', rowKeys);
            this.transformSelection();
        },
        updateCurrentSelectedRowKeys(addOrDelete, selectedRowKeys) {
            selectedRowKeys.forEach(selectedRowKey => this.currentSelectedRowKeys[addOrDelete](selectedRowKey));
        },
        transformSelection() {
            if (typeof this.table.rows === 'undefined') {
                return;
            }
            const getRowKey = (row) => row[1];
            const rowKeysTop = this.table.rows.map(getRowKey).filter(x => typeof x !== 'undefined');
            const rowKeysBottom = this.bottomRows.map(getRowKey);
            this.currentSelection = rowKeysTop.map(rowKey => this.currentSelectedRowKeys.has(rowKey));
            this.currentBottomSelection = rowKeysBottom.map(rowKey => this.currentSelectedRowKeys.has(rowKey));
        },
        clearSelection() {
            this.currentSelectedRowKeys = new Set();
            this.totalSelected = 0;
            this.transformSelection();
        },
        async handleInitialSelection() {
            if (this.settings.subscribeToSelection) {
                const initialSelection = await this.selectionService.initialSelection();
                this.currentSelectedRowKeys = new Set(initialSelection);
                this.totalSelected = initialSelection.length;
                this.transformSelection();
            } else {
                this.clearSelection();
            }
        },
        createHeaderSubMenuItems(columnName, renderers) {
            const headerSubMenuItems = [];
            headerSubMenuItems.push({ text: 'Data renderer', separator: true, sectionHeadline: true });
            renderers.forEach(renderer => {
                headerSubMenuItems.push({
                    text: renderer.name,
                    title: renderer.name,
                    id: renderer.id,
                    section: 'dataRendering',
                    selected: this.colNameSelectedRendererId[columnName] === renderer.id
                });
            });
            return headerSubMenuItems;
        },
        createColumnConfig(columnInformation) {
            const { index, columnName, columnTypeName, contentType, isSortable, columnTypeRenderers } =
                columnInformation;
            return {
                key: index,
                header: columnName,
                subHeader: columnTypeName,
                hasSlotContent: isImage(contentType),
                size: this.columnSizes[index],
                filterConfig: this.columnFilters[index],
                ...columnTypeRenderers && {
                    headerSubMenuItems: this.createHeaderSubMenuItems(columnName, columnTypeRenderers)
                },
                formatter: val => val,
                isSortable
            };
        },
        getDefaultFilterConfigs(displayedColumns) {
            // default filter config for rowKey and empty config for rowIndex
            const filterConfigs = [
                {
                    is: '',
                    modelValue: ''
                },
                createDefaultFilterConfig(false, null)
            ];
            displayedColumns.forEach(col => {
                const domainValues = this.columnDomainValues[col];
                const domainValuesMapped = domainValues ? domainValues.map(val => ({ id: val, text: val })) : null;
                filterConfigs.push(createDefaultFilterConfig(domainValues, domainValuesMapped));
            });
            filterConfigs.push({ is: '', modelValue: '' });
            return filterConfigs;
        },
        // only call the method when (displayedColumns XOR showRowKeys XOR showRowKeys) changed and a sorting is active
        updateSortingParams(newSettings, displayedColumnsChanged, showRowKeysChanged, showRowIndicesChanged) {
            const { showRowKeys, showRowIndices, displayedColumns } = newSettings;
            if (displayedColumnsChanged) {
                // sort on column (not rowKey column) and add/remove (different) column (not rowKey/rowIndex column)
                if (this.columnSortColumnName !== ROW_KEYS_SORT_COL_NAME) {
                    const newColIndexOfSortCol = displayedColumns.selected.indexOf(this.columnSortColumnName);
                    if (newColIndexOfSortCol === -1) {
                        this.resetSorting();
                        return true;
                    } else {
                        this.columnSortIndex = newColIndexOfSortCol + this.numberOfDisplayedIdColumns;
                    }
                }
                // no change when sorting the rowKey column and adding/removing columns behind the rowKey column
                // current sorting is on rowKey column which is removed
            } else if (this.columnSortColumnName === ROW_KEYS_SORT_COL_NAME && !showRowKeys) {
                this.resetSorting();
                return true;
                // rowKey or rowIndex column is added
            } else if ((showRowKeys && showRowKeysChanged) || (showRowIndices && showRowIndicesChanged)) {
                this.columnSortIndex += 1;
                // rowKey or rowIndex column is removed
            } else {
                this.columnSortIndex -= 1;
            }
            return false;
        },
        updateColumnIndexMap(columnConfigs) {
            this.columnIndexMap = new Map(columnConfigs.map((config, index) => [index, config.key]));
        },
        getImageUrl(data, index) {
            // the columnConfigs contain at index 0 rowIndices, at index 1 rowKeys, and at index 2+ the data
            // the rowData consists of [rowIndices?, rowkeys, ...data] (rowIndices if showRowIndices)
            // we need to map from the columnConfig data indices to the rowData data indices
            let cellData = data.data.row[index - (this.numberOfUsedColumns - this.numberOfDisplayedColumns)];
            if (typeof cellData !== 'string') {
                cellData = cellData.value;
            }
            return this.$store.getters['api/uiExtResourceLocation']({
                resourceInfo: {
                    baseUrl: this.baseUrl,
                    path: cellData
                }
            });
        },
        resetSorting() {
            this.columnSortColumnName = null;
            this.columnSortIndex = null;
            this.columnSortDirection = null;
            this.currentPage = 1;
            this.currentIndex = 0;
        },
        getCurrentSelectedRenderers(displayedColumns) {
            return displayedColumns.map(
                columnName => this.colNameSelectedRendererId[columnName] || null
            );
        }
    }
};
</script>

<template>
  <div class="table-view-wrapper">
    <h4
      v-if="showTitle"
      class="table-title"
    >
      {{ settings.title }}
    </h4>
    <TableUI
      v-if="dataLoaded && numberOfDisplayedColumns > 0"
      ref="tableUI"
      :data="[rowData]"
      :bottom-data="bottomRowData"
      :current-selection="[currentSelection]"
      :current-bottom-selection="currentBottomSelection"
      :total-selected="totalSelected"
      :data-config="dataConfig"
      :table-config="tableConfig"
      :num-rows-above="numRowsAbove"
      :num-rows-below="numRowsBelow"
      @page-change="onPageChange"
      @column-sort="onColumnSort"
      @row-select="onRowSelect"
      @select-all="onSelectAll"
      @search="onSearch"
      @column-filter="onColumnFilter"
      @clear-filter="onClearFilter"
      @column-resize="onColumnResize"
      @header-sub-menu-item-selection="onHeaderSubMenuItemSelection"
      @lazyload="onScroll"
    >
      <template
        v-for="index in numberOfUsedColumns"
        :key="index"
        #[`cellContent-${index}`]="data"
      >
        <img
          :key="index"
          loading="lazy"
          :src="getImageUrl(data, index)"
          alt=""
        >
      </template>
    </TableUI>
    <div
      v-else-if="dataLoaded"
      class="no-columns"
    >
      <h4>
        No data to display
      </h4>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.table-view-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  & :deep(.table-header) {
    background-color: var(--knime-porcelain);
  }

  & :deep(.row) {
    border-bottom: 1px solid var(--knime-porcelain);
    align-content: center;

    & img {
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }
}

.table-title {
  margin: 0;
  padding: 15px 0 5px 5px;
  color: rgb(70 70 70);
  font-size: 20px;
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
</style>
