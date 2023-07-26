<!-- eslint-disable max-lines -->
<script>
import { JsonDataService, SelectionService } from "@knime/ui-extension-service";
import TableViewDisplay from "./TableViewDisplay.vue";
import { createDefaultFilterConfig, arrayEquals } from "@/tableView/utils";
import specialColumns from "./utils/specialColumns";
import { DEFAULT_IMAGE_ROW_HEIGHT } from "@/tableView/utils/getDataConfig";
const { ROW_ID, INDEX, SKIPPED_REMAINING_COLUMNS_COLUMN } = specialColumns;
// -1 is the backend representation (columnName) for sorting the table by rowKeys
const ROW_KEYS_SORT_COL_NAME = "-1";
const MIN_SCOPE_SIZE = 200;
const MIN_BUFFER_SIZE = 50;

export default {
  components: {
    TableViewDisplay,
  },
  inject: ["getKnimeService"],
  props: {
    initialData: {
      type: Object,
      default: null,
      required: false,
    },
    forceHideTableSizes: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
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
      searchTerm: "",
      columnFiltersMap: new Map(),
      baseUrl: null,
      currentAvailableWidth: 0,
      columnSizeOverrides: {},
      defaultColumnSizeOverride: null,
      currentRowHeight: DEFAULT_IMAGE_ROW_HEIGHT,
      scopeSize: MIN_SCOPE_SIZE,
      bufferSize: MIN_BUFFER_SIZE,
      numRowsAbove: 0,
      numRowsBelow: 0,
      maxNumRows: 200000,
      bottomRows: [],
      columnDataTypeIds: null,
      columnFormatterDescriptions: null,
      columnContentTypes: null,
      // a counter which is used to ignore all requests which were not the last sent one
      lastUpdateHash: 0,
      link: "",
    };
  },
  computed: {
    knimeService() {
      return this.getKnimeService();
    },
    numberOfDisplayedIdColumns() {
      let offset = this.settings.showRowKeys ? 1 : 0;
      offset += this.settings.showRowIndices ? 1 : 0;
      return offset;
    },
    colFilterActive() {
      for (const filter of this.columnFiltersMap.values()) {
        const { modelValue } = filter;
        if (typeof modelValue === "string") {
          if (modelValue !== "") {
            return true;
          }
        } else if (modelValue.length && modelValue[0] !== "") {
          return true;
        }
      }
      return false;
    },
    colSortActive() {
      return (
        this.columnSortColumnName !== null && this.columnSortIndex !== null
      );
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
      return this.settings.enablePagination
        ? this.settings.pageSize * (this.currentPage - 1)
        : 0;
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
      return this.bottomRowsMode
        ? this.maxNumRows - this.numRowsBottom - 1
        : this.currentNumRowsOnPage;
    },
    numRowsTotal() {
      return this.bottomRowsMode ? this.maxNumRows : this.currentNumRowsOnPage;
    },
    skipRemainingColumns() {
      return this.settings.skipRemainingColumns;
    },
    indicateRemainingColumnsSkipped() {
      return this.displayedColumns.length < this.columnCount;
    },
    useAutoColumnSizes() {
      const { autoSizeColumnsToContent } = this.settings;
      return (
        autoSizeColumnsToContent === "FIT_CONTENT" ||
        autoSizeColumnsToContent === "FIT_CONTENT_AND_HEADER"
      );
    },
    includeHeadersInAutoColumnSizes() {
      return (
        this.settings.autoSizeColumnsToContent === "FIT_CONTENT_AND_HEADER"
      );
    },
    fixedColumnSizes() {
      const fixedColumnSizes = {};
      // calculate the size of an img column by the ratio of the original img and the current row height
      Object.entries(this.table.firstRowImageDimensions || []).forEach(
        ([columnName, imageDimension]) => {
          fixedColumnSizes[columnName] = Math.floor(
            (imageDimension.widthInPx * this.currentRowHeight) /
              imageDimension.heightInPx,
          );
        },
      );
      return fixedColumnSizes;
    },
    autoColumnSizesOptions() {
      return {
        calculateForBody: this.useAutoColumnSizes,
        calculateForHeader: this.includeHeadersInAutoColumnSizes,
        fixedSizes: this.fixedColumnSizes,
      };
    },
  },
  async mounted() {
    this.jsonDataService = new JsonDataService(this.knimeService);
    this.jsonDataService.addOnDataChangeCallback(
      this.onViewSettingsChange.bind(this),
    );
    const initialData =
      this.initialData === null
        ? await this.jsonDataService.initialData()
        : this.initialData;
    this.selectionService = new SelectionService(this.knimeService);
    this.baseUrl = this.knimeService?.extensionConfig?.resourceInfo?.baseUrl;
    if (initialData) {
      const { table, dataTypes, columnDomainValues, settings } = initialData;
      this.displayedColumns = table.displayedColumns;
      this.columnCount = table.columnCount;
      this.columnDataTypeIds = table.columnDataTypeIds;
      this.columnFormatterDescriptions = table.columnFormatterDescriptions;
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
      this.selectionService.onInit(
        this.onSelectionChange,
        publishSelection,
        subscribeToSelection,
      );
      this.dataLoaded = true;
      this.columnFiltersMap = this.getDefaultFilterConfigsMap(
        this.displayedColumns,
      );
    }
  },
  methods: {
    async initializeLazyLoading(params) {
      const { updateDisplayedColumns = false, updateTotalSelected = true } =
        params || {};
      this.currentScopeStartIndex = 0;
      this.currentScopeEndIndex = Math.min(
        this.scopeSize,
        this.currentRowCount,
      );
      await this.updateData({
        lazyLoad: this.getLazyLoadParamsForCurrentScope(),
        updateDisplayedColumns,
        updateTotalSelected,
      });
    },
    getLazyLoadParamsForCurrentScope() {
      const numRows = this.currentScopeEndIndex - this.currentScopeStartIndex;
      return {
        loadFromIndex: this.currentScopeStartIndex,
        newScopeStart: this.currentScopeStartIndex,
        numRows,
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
      const scopeSizeChanged =
        Math.abs(prevScopeSize - this.scopeSize) > scopeChangeThreshold;
      let bufferStart, bufferEnd, newScopeStart, loadFromIndex, numRows;
      if (direction > 0) {
        if (prevScopeEnd - endIndex > this.bufferSize && !scopeSizeChanged) {
          return;
        }
        // keep bufferSize elements above the current first visible element or keep all previous rows if the
        // update is due to a change in scope size
        bufferStart = scopeSizeChanged
          ? prevScopeStart
          : Math.max(startIndex - this.bufferSize, 0);
        // keep the already loaded elements below the current last visible.
        bufferEnd = Math.max(bufferStart, prevScopeEnd);
        // The next scope consist of numRows newly loaded rows and the buffer.
        // the size of the next scope should be this.scopeSize again (or less at the bottom of the table).
        numRows = Math.min(
          this.scopeSize - (bufferEnd - bufferStart),
          this.numRowsTotal - bufferEnd,
        );
        newScopeStart = bufferStart;
        loadFromIndex = bufferEnd;
      } else {
        if (
          startIndex - prevScopeStart > this.bufferSize &&
          !scopeSizeChanged
        ) {
          return;
        }
        // keep bufferSize elements below the current last visible or keep all previous rows if the
        // update is due to a change in scope size
        bufferEnd = scopeSizeChanged
          ? prevScopeEnd
          : Math.min(endIndex + this.bufferSize, this.numRowsTotal);
        // keep already loaded elements above the current first visible.
        bufferStart = Math.min(bufferEnd, prevScopeStart);
        // The next scope consist of numRows newly loaded rows and the buffer.
        // the size of the next scope should be this.scopeSize again (or less at the top of the table).
        numRows = Math.min(
          bufferStart,
          this.scopeSize - (bufferEnd - bufferStart),
        );
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
            newScopeStart,
          },
        });
      }
    },
    computeScopeSize(startIndex, endIndex) {
      return Math.max(
        endIndex - startIndex + 2 * this.bufferSize,
        MIN_SCOPE_SIZE,
      );
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
      const {
        lazyLoad,
        updateTotalSelected = false,
        updateDisplayedColumns = false,
      } = options;
      const displayedColumns = this.getColumnsForRequest(
        updateDisplayedColumns,
      );

      let loadFromIndex, numRows;
      if (lazyLoad) {
        ({ loadFromIndex, numRows } = lazyLoad);
      } else {
        loadFromIndex = this.currentIndex;
        numRows = this.currentNumRowsOnPage;
      }
      const loadToIndex = loadFromIndex + numRows;
      const {
        topLoadFromIndex,
        topNumRows,
        bottomLoadFromIndex,
        bottomNumRows,
      } = this.settings.enablePagination
        ? this.getTopAndBottomIndicesOnPagination(loadFromIndex, numRows)
        : {
            ...this.getTopIndices(loadFromIndex, loadToIndex),
            ...this.getBottomIndices(loadFromIndex, loadToIndex),
          };

      const fetchTopTable = topNumRows !== 0 || bottomNumRows === 0;
      const fetchBottomTable = bottomNumRows !== 0;
      const topTablePromise = fetchTopTable
        ? this.requestTable(
            topLoadFromIndex,
            topNumRows,
            displayedColumns,
            updateDisplayedColumns,
            updateTotalSelected,
            this.settings.enablePagination,
          )
        : null;

      let bottomTablePromise = fetchBottomTable
        ? this.requestTable(
            bottomLoadFromIndex,
            bottomNumRows,
            displayedColumns,
            updateDisplayedColumns,
            updateTotalSelected,
            this.settings.enablePagination,
          )
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
        const newBottomStart = Math.max(
          topLoadFromIndex + topNumRows,
          topTable.rowCount - this.numRowsBottom,
        );
        bottomTable = await this.requestTable(
          newBottomStart,
          this.numRowsBottom,
          displayedColumns,
          updateDisplayedColumns,
          updateTotalSelected,
          this.settings.enablePagination,
        );
      }
      return { topTable, bottomTable };
    },
    updateInternals(tables, options) {
      const { topTable, bottomTable } = tables;
      const {
        updateDisplayedColumns,
        updateTotalSelected,
        updateColumnContentTypes,
        lazyLoad,
      } = options;
      const getFromTopOrBottom = (key) =>
        topTable ? topTable[key] : bottomTable[key];
      if (updateDisplayedColumns) {
        this.displayedColumns = getFromTopOrBottom("displayedColumns");
        this.columnFiltersMap = this.getDefaultFilterConfigsMap(
          this.displayedColumns,
        );
        this.columnDataTypeIds = getFromTopOrBottom("columnDataTypeIds");
        this.columnFormatterDescriptions = getFromTopOrBottom(
          "columnFormatterDescriptions",
        );
        this.columnCount = getFromTopOrBottom("columnCount");
      }
      if (updateTotalSelected) {
        if (
          this.columnSortColumnName ||
          this.searchTerm ||
          this.colFilterActive
        ) {
          this.totalSelected = getFromTopOrBottom("totalSelected");
        } else {
          this.totalSelected = this.currentSelectedRowKeys.size;
        }
      }
      if (updateColumnContentTypes || updateDisplayedColumns) {
        this.columnContentTypes = getFromTopOrBottom("columnContentTypes");
      }

      if (lazyLoad) {
        const {
          newScopeStart,
          direction,
          bufferStart = 0,
          bufferEnd = bufferStart,
          numRows,
        } = lazyLoad;
        const topPreviousDataLength = this.table?.rows?.length || 0;
        const rows = this.getCombinedTopRows({
          topTable,
          bufferStart,
          bufferEnd,
          direction,
          topPreviousDataLength,
        });
        if (typeof this.table.rows === "undefined") {
          this.table = { ...topTable, rows };
        } else {
          this.table.rows = rows;
          this.table.rowCount = getFromTopOrBottom("rowCount");
          this.table.firstRowImageDimensions = getFromTopOrBottom(
            "firstRowImageDimensions",
          );
        }
        this.bottomRows = this.getCombinedBottomRows({
          bottomTable,
          bufferStart,
          bufferEnd,
          direction,
        });
        this.currentScopeStartIndex = newScopeStart;
        this.currentScopeEndIndex = Math.min(
          newScopeStart + (bufferEnd - bufferStart) + numRows,
          this.table.rowCount,
        );
      } else {
        this.table = topTable;
        this.bottomRows = bottomTable ? bottomTable.rows : [];
      }
      this.currentRowCount = this.table.rowCount;
      this.transformSelection();
      this.numRowsAbove = lazyLoad ? this.currentScopeStartIndex : 0;
      this.numRowsBelow = lazyLoad
        ? this.numRowsTotal - this.currentScopeEndIndex
        : 0;
    },
    getTopAndBottomIndicesOnPagination(loadFromIndex, numRows) {
      const currentPageEnd = loadFromIndex + numRows;
      const topLoadFromIndex = loadFromIndex;
      const topNumRows = this.numRowsTop;
      const bottomLoadFromIndex = currentPageEnd - this.numRowsBottom;
      const bottomNumRows = this.numRowsBottom;
      return {
        topLoadFromIndex,
        topNumRows,
        bottomLoadFromIndex,
        bottomNumRows,
      };
    },
    getTopIndices(loadFromIndex, loadToIndex) {
      const topLoadFromIndex = Math.min(loadFromIndex, this.numRowsTop);
      const topLoadToIndex = Math.min(loadToIndex, this.numRowsTop);
      const topNumRows = topLoadToIndex - topLoadFromIndex;
      return { topLoadFromIndex, topNumRows };
    },
    getBottomIndices(loadFromIndex, loadToIndex) {
      const bottomLoadFromIndex =
        this.currentRowCount -
        Math.min(this.numRowsBottom, this.numRowsTotal - loadFromIndex);
      const bottomLoadToIndex =
        this.currentRowCount -
        Math.min(this.numRowsBottom, this.numRowsTotal - loadToIndex);
      const bottomNumRows = bottomLoadToIndex - bottomLoadFromIndex;
      return { bottomLoadFromIndex, bottomNumRows };
    },
    // eslint-disable-next-line max-params
    requestTable(
      startIndex,
      numRows,
      displayedColumns,
      updateDisplayedColumns,
      updateTotalSelected,
      clearImageDataCache,
    ) {
      const selectedRendererIds = updateDisplayedColumns
        ? this.getCurrentSelectedRenderers(
            this.settings.displayedColumns.selected,
          )
        : this.selectedRendererIds;
      // if columnSortColumnName is present a sorting is active
      if (
        this.columnSortColumnName ||
        this.searchTerm ||
        this.colFilterActive
      ) {
        return this.requestFilteredAndSortedTable(
          startIndex,
          numRows,
          displayedColumns,
          updateDisplayedColumns,
          updateTotalSelected,
          selectedRendererIds,
          clearImageDataCache,
        );
      } else {
        return this.requestUnfilteredAndUnsortedTable(
          startIndex,
          numRows,
          displayedColumns,
          updateDisplayedColumns,
          selectedRendererIds,
          clearImageDataCache,
        );
      }
    },
    // eslint-disable-next-line max-params
    requestFilteredAndSortedTable(
      startIndex,
      numRows,
      displayedColumns,
      updateDisplayedColumns,
      updateTotalSelected,
      selectedRendererIds,
      clearImageDataCache,
    ) {
      const columnSortIsAscending = this.columnSortDirection === 1;
      return this.performRequest("getFilteredAndSortedTable", [
        displayedColumns,
        Math.min(this.totalRowCount - 1, Math.max(0, startIndex)),
        numRows,
        this.columnSortColumnName,
        columnSortIsAscending,
        this.searchTerm,
        updateDisplayedColumns
          ? null
          : this.getColumnFilterValues(displayedColumns),
        this.settings.showRowKeys,
        selectedRendererIds,
        updateDisplayedColumns,
        updateTotalSelected,
        clearImageDataCache,
        this.skipRemainingColumns,
      ]);
    },
    // eslint-disable-next-line max-params
    requestUnfilteredAndUnsortedTable(
      startIndex,
      numRows,
      displayedColumns,
      updateDisplayedColumns,
      selectedRendererIds,
      clearImageDataCache,
    ) {
      return this.performRequest("getTable", [
        displayedColumns,
        startIndex,
        numRows,
        selectedRendererIds,
        updateDisplayedColumns,
        clearImageDataCache,
        this.skipRemainingColumns,
      ]);
    },
    getColumnsForRequest(updateDisplayedColumns) {
      return updateDisplayedColumns
        ? this.settings.displayedColumns.selected
        : this.displayedColumns;
    },
    getColumnFilterValues(displayedColumns) {
      return [ROW_ID.id, ...displayedColumns].map((colId) =>
        this.getArrayOfFilterValues(colId),
      );
    },
    getArrayOfFilterValues(colId) {
      const filter = this.columnFiltersMap.get(colId);
      if (typeof filter?.modelValue === "string") {
        return [filter?.modelValue];
      } else {
        return filter?.modelValue;
      }
    },
    performRequest(method, options) {
      return this.jsonDataService.data({ method, options });
    },
    getCombinedTopRows({
      topTable,
      bufferStart,
      bufferEnd,
      direction,
      topPreviousDataLength,
    }) {
      const previousStartIndex = this.currentScopeStartIndex;
      const topBufferStart = Math.min(
        bufferStart - previousStartIndex,
        topPreviousDataLength,
      );
      const topBufferEnd = Math.min(
        bufferEnd - previousStartIndex,
        topPreviousDataLength,
      );
      return this.combineWithPrevious({
        newRows: topTable?.rows,
        bufferStart: topBufferStart,
        bufferEnd: topBufferEnd,
        direction,
      });
    },
    getCombinedBottomRows({ bottomTable, bufferStart, bufferEnd, direction }) {
      // plus 1 because of the additional "…" row
      const previousBottomStartIndex = Math.max(
        this.numRowsTop + 1,
        this.currentScopeStartIndex,
      );
      const bottomBufferStart = Math.max(
        bufferStart - previousBottomStartIndex,
        0,
      );
      const bottomBufferEnd = Math.max(bufferEnd - previousBottomStartIndex, 0);
      return this.combineWithPrevious({
        newRows: bottomTable?.rows,
        bufferStart: bottomBufferStart,
        bufferEnd: bottomBufferEnd,
        direction,
        bottom: true,
      });
    },
    combineWithPrevious({
      newRows,
      bufferStart,
      bufferEnd,
      direction,
      bottom = false,
    }) {
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
    async refreshTable(params) {
      let {
        updateDisplayedColumns = false,
        resetPage = false,
        updateTotalSelected = false,
      } = params || {};
      this.$refs.tableViewDisplay.refreshScroller();
      if (resetPage) {
        this.currentPage = 1;
        this.currentIndex = 0;
      }
      if (this.useLazyLoading) {
        await this.initializeLazyLoading({
          updateDisplayedColumns,
          updateTotalSelected,
        });
      } else {
        await this.updateData({ updateDisplayedColumns, updateTotalSelected });
      }
    },
    async onPageChange(pageDirection) {
      const { pageSize } = this.settings;
      this.currentPage += pageDirection;
      this.currentIndex += pageDirection * pageSize;
      await this.refreshTable();
      this.$refs.tableViewDisplay.triggerCalculationOfAutoColumnSizes();
    },
    async onViewSettingsChange(event) {
      const newSettings = event.data.data.view;
      const enablePaginationChanged =
        newSettings.enablePagination !== this.settings.enablePagination;
      const displayedColumnsChanged = !arrayEquals(
        newSettings.displayedColumns.selected,
        this.settings.displayedColumns.selected,
      );
      const showRowKeysChanged =
        newSettings.showRowKeys !== this.settings.showRowKeys;
      const showRowIndicesChanged =
        newSettings.showRowIndices !== this.settings.showRowIndices;
      const pageSizeChanged = newSettings.pageSize !== this.settings.pageSize;
      const compactModeChangeInducesRefresh =
        this.useLazyLoading &&
        newSettings.compactMode !== this.settings.compactMode;
      const autoSizeColumnsToContentChanged =
        newSettings.autoSizeColumnsToContent !==
        this.settings.autoSizeColumnsToContent;

      this.settings = newSettings;

      const numberOfDisplayedColsChanged =
        displayedColumnsChanged || showRowKeysChanged || showRowIndicesChanged;
      let sortingParamsReseted = false;
      if (this.colSortActive && numberOfDisplayedColsChanged) {
        sortingParamsReseted = this.updateSortingParams(
          newSettings,
          displayedColumnsChanged,
          showRowKeysChanged,
          showRowIndicesChanged,
        );
      }
      if (displayedColumnsChanged) {
        this.refreshTable({
          updateDisplayedColumns: true,
          updateTotalSelected: true,
        });
      } else if (
        compactModeChangeInducesRefresh ||
        sortingParamsReseted ||
        (autoSizeColumnsToContentChanged && this.useAutoColumnSizes)
      ) {
        await this.refreshTable();
      } else if (pageSizeChanged || enablePaginationChanged) {
        await this.refreshTable({ resetPage: true });
        this.$refs.tableViewDisplay.triggerCalculationOfAutoColumnSizes();
      }

      this.selectionService.onSettingsChange(
        () => Array.from(this.currentSelectedRowKeys),
        this.clearSelection,
        newSettings.publishSelection,
        newSettings.subscribeToSelection,
      );
    },
    onColumnSort(newColumnSortIndex, newColumnSortId) {
      // if columnSortIndex equals newColumnSortIndex sorting is ascending as default is descending
      const ascendingSort =
        this.columnSortIndex === newColumnSortIndex &&
        this.columnSortDirection < 0;
      this.columnSortDirection = ascendingSort ? 1 : -1;
      this.currentPage = 1;
      this.currentIndex = 0;
      this.columnSortIndex = newColumnSortIndex;

      this.columnSortColumnName =
        newColumnSortId === ROW_ID.id
          ? ROW_KEYS_SORT_COL_NAME
          : newColumnSortId;
      this.refreshTable();
    },
    async onSelectionChange(rawEvent) {
      const { selection, mode } = rawEvent;
      if (mode === "REPLACE") {
        this.currentSelectedRowKeys = new Set(selection);
      } else {
        const addOrDelete = mode === "ADD" ? "add" : "delete";
        this.updateCurrentSelectedRowKeys(addOrDelete, selection);
      }
      this.transformSelection();
      this.totalSelected = await this.requestTotalSelected();
    },
    requestTotalSelected() {
      if (this.searchTerm || this.colFilterActive) {
        return this.performRequest("getTotalSelected");
      } else {
        return this.currentSelectedRowKeys.size;
      }
    },
    onRowSelect(selected, rowInd, _groupInd, isTop) {
      const rowKey = isTop
        ? this.table.rows[rowInd][1]
        : this.bottomRows[rowInd][1];
      this.totalSelected += selected ? 1 : -1;
      this.updateSelection(selected, [rowKey]);
    },
    async onSelectAll(selected) {
      const filterActive = this.currentRowCount !== this.totalRowCount;
      if (selected) {
        const currentRowKeys = await this.performRequest(
          "getCurrentRowKeys",
          [],
        );
        if (filterActive) {
          this.updateCurrentSelectedRowKeys("add", currentRowKeys);
        } else {
          this.currentSelectedRowKeys = new Set(currentRowKeys);
        }
        this.selectionService.publishOnSelectionChange("add", currentRowKeys);
      } else if (filterActive) {
        const currentRowKeys = await this.performRequest(
          "getCurrentRowKeys",
          [],
        );
        this.updateCurrentSelectedRowKeys("delete", currentRowKeys);
        this.selectionService.publishOnSelectionChange(
          "remove",
          currentRowKeys,
        );
      } else {
        this.currentSelectedRowKeys = new Set();
        this.selectionService.publishOnSelectionChange("replace", []);
      }
      this.transformSelection();
      this.totalSelected = selected ? this.currentRowCount : 0;
    },
    onSearch(input) {
      this.searchTerm = input;
      this.refreshTable({ resetPage: true, updateTotalSelected: true });
    },
    onColumnFilter(colId, value) {
      this.columnFiltersMap.get(colId).modelValue = value;
      this.refreshTable({ resetPage: true, updateTotalSelected: true });
    },
    onClearFilter() {
      this.columnFiltersMap = this.getDefaultFilterConfigsMap(
        this.displayedColumns,
      );
      this.refreshTable({ resetPage: true, updateTotalSelected: true });
    },
    onColumnResize(columnName, newColumnSize) {
      this.columnSizeOverrides[columnName] = newColumnSize;
    },
    onAllColumnsResize(columnSize) {
      this.defaultColumnSizeOverride = columnSize;
      this.displayedColumns.forEach((columnName) => {
        delete this.columnSizeOverrides[columnName];
      });
    },
    updateAvailableWidth(newAvailableWidth) {
      if (this.currentAvailableWidth && !this.useAutoColumnSizes) {
        // update all overridden column widths according to the relative change of the available width
        const ratio = newAvailableWidth / this.currentAvailableWidth;
        Object.keys(this.columnSizeOverrides).forEach((key) => {
          this.columnSizeOverrides[key] *= ratio;
        });
        Object.getOwnPropertySymbols(this.columnSizeOverrides).forEach(
          (symbol) => {
            this.columnSizeOverrides[symbol] *= ratio;
          },
        );
        if (this.defaultColumnSizeOverride) {
          this.defaultColumnSizeOverride *= ratio;
        }
      }
      this.currentAvailableWidth = newAvailableWidth;
    },
    onHeaderSubMenuItemSelection(item, columnName) {
      if (item.section === "dataRendering") {
        this.colNameSelectedRendererId[columnName] = item.id;
      }
      this.updateData({
        ...(this.useLazyLoading && {
          lazyLoad: this.getLazyLoadParamsForCurrentScope(),
        }),
        updateColumnContentTypes: true,
      });
    },
    updateSelection(selected, rowKeys) {
      this.selectionService.publishOnSelectionChange(
        selected ? "add" : "remove",
        rowKeys,
      );
      this.updateCurrentSelectedRowKeys(selected ? "add" : "delete", rowKeys);
      this.transformSelection();
    },
    updateCurrentSelectedRowKeys(addOrDelete, selectedRowKeys) {
      selectedRowKeys.forEach((selectedRowKey) =>
        this.currentSelectedRowKeys[addOrDelete](selectedRowKey),
      );
    },
    transformSelection() {
      if (typeof this.table.rows === "undefined") {
        return;
      }
      const getRowKey = (row) => row[1];
      const rowKeysTop = this.table.rows
        .map(getRowKey)
        .filter((x) => typeof x !== "undefined");
      const rowKeysBottom = this.bottomRows.map(getRowKey);
      this.currentSelection = rowKeysTop.map((rowKey) =>
        this.currentSelectedRowKeys.has(rowKey),
      );
      this.currentBottomSelection = rowKeysBottom.map((rowKey) =>
        this.currentSelectedRowKeys.has(rowKey),
      );
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
          selected: this.colNameSelectedRendererId[columnName] === renderer.id,
        });
      });
      return headerSubMenuItems;
    },
    getDefaultFilterConfigsMap(displayedColumns) {
      const filterConfigs = new Map();

      filterConfigs.set(ROW_ID.id, createDefaultFilterConfig(false, null));
      filterConfigs.set(INDEX.id, { is: "", modelValue: "" });
      filterConfigs.set(SKIPPED_REMAINING_COLUMNS_COLUMN.id, {
        is: "",
        modelValue: "",
      });

      displayedColumns.forEach((col) => {
        const domainValues = this.columnDomainValues[col];
        const domainValuesMapped = domainValues
          ? domainValues.map((val) => ({ id: val, text: val }))
          : null;
        filterConfigs.set(
          col,
          createDefaultFilterConfig(domainValues, domainValuesMapped),
        );
      });
      return filterConfigs;
    },
    // only call the method when (displayedColumns XOR showRowKeys XOR showRowKeys) changed and a sorting is active
    updateSortingParams(
      newSettings,
      displayedColumnsChanged,
      showRowKeysChanged,
      showRowIndicesChanged,
    ) {
      const { showRowKeys, showRowIndices, displayedColumns } = newSettings;
      if (displayedColumnsChanged) {
        // sort on column (not rowKey column) and add/remove (different) column (not rowKey/rowIndex column)
        if (this.columnSortColumnName !== ROW_KEYS_SORT_COL_NAME) {
          const newColIndexOfSortCol = displayedColumns.selected.indexOf(
            this.columnSortColumnName,
          );
          if (newColIndexOfSortCol === -1) {
            this.resetSorting();
            return true;
          } else {
            this.columnSortIndex =
              newColIndexOfSortCol + this.numberOfDisplayedIdColumns;
          }
        }
        // no change when sorting the rowKey column and adding/removing columns behind the rowKey column
        // current sorting is on rowKey column which is removed
      } else if (
        this.columnSortColumnName === ROW_KEYS_SORT_COL_NAME &&
        !showRowKeys
      ) {
        this.resetSorting();
        return true;
        // rowKey or rowIndex column is added
      } else if (
        (showRowKeys && showRowKeysChanged) ||
        (showRowIndices && showRowIndicesChanged)
      ) {
        this.columnSortIndex += 1;
        // rowKey or rowIndex column is removed
      } else {
        this.columnSortIndex -= 1;
      }
      return false;
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
        (columnName) => this.colNameSelectedRendererId[columnName] || null,
      );
    },
    onAutoColumnSizesUpdate(newAutoColumnSizes) {
      if (Reflect.ownKeys(newAutoColumnSizes).length === 0) {
        this.columnSizeOverrides = {};
      } else {
        Reflect.ownKeys(newAutoColumnSizes).forEach((columnId) => {
          this.columnSizeOverrides[columnId] = newAutoColumnSizes[columnId];
        });
      }
    },
    onRowHeightUpdate(rowHeight) {
      this.currentRowHeight = rowHeight;
    },
  },
};
</script>

<template>
  <TableViewDisplay
    ref="tableViewDisplay"
    class="table-view-display"
    :settings="settings"
    :rows="{
      loaded: dataLoaded,
      top: table.rows,
      bottom: bottomRows,
      numRowsAbove,
      numRowsBelow,
    }"
    :header="{
      displayedColumns,
      columnFiltersMap,
      columnContentTypes,
      columnSizeOverrides,
      defaultColumnSizeOverride,
      availableWidth: currentAvailableWidth,
      colNameSelectedRendererId,
      dataTypes,
      columnDataTypeIds,
      columnFormatterDescriptions,
      indicateRemainingColumnsSkipped,
    }"
    :selection="{
      top: currentSelection,
      bottom: currentBottomSelection,
      totalSelected,
    }"
    :page="{
      currentRowCount,
      totalRowCount,
      currentPage,
      columnCount,
    }"
    :sorting="{
      columnSortIndex,
      columnSortDirection,
    }"
    global-search-query=""
    :enable-virtual-scrolling="true"
    :enable-column-resizing="true"
    :enable-row-resizing="true"
    :include-image-resources="false"
    :knime-service="knimeService"
    :force-hide-table-sizes="forceHideTableSizes"
    :auto-column-sizes-options="autoColumnSizesOptions"
    @page-change="onPageChange"
    @column-sort="onColumnSort"
    @row-select="onRowSelect"
    @select-all="onSelectAll"
    @search="onSearch"
    @column-filter="onColumnFilter"
    @clear-filter="onClearFilter"
    @column-resize="onColumnResize"
    @all-columns-resize="onAllColumnsResize"
    @header-sub-menu-item-selection="onHeaderSubMenuItemSelection"
    @lazyload="onScroll"
    @update:available-width="updateAvailableWidth"
    @auto-column-sizes-update="onAutoColumnSizesUpdate"
    @row-height-update="onRowHeightUpdate"
  />
</template>

<style lang="postcss" scoped>
.table-view-display {
  height: 100%;

  & :deep(.row) img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }
}
</style>
