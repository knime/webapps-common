<!-- eslint-disable max-lines -->
<script lang="ts">
import {
  Event,
  JsonDataService,
  KnimeService,
  SelectionModes,
  SelectionService,
} from "@knime/ui-extension-service";
import TableViewDisplay from "./TableViewDisplay.vue";
import { createDefaultFilterConfig, arrayEquals } from "@/tableView/utils";
import TableViewViewSettings, {
  AutoSizeColumnsToContent,
  PossiblyNonInitializedSettings,
  isInitialized,
} from "./types/ViewSettings";
import InitialData from "./types/InitialData";
import type Table from "./types/Table";
import type { ColumnContentType } from "./types/Table";
import type { HeaderMenuItem } from "./types";
import specialColumns from "./utils/specialColumns";
import { PropType, inject } from "vue";
import useSelectionCache from "./composables/useSelectionCache";
import useRowHeight from "./composables/useRowHeight";
import {
  type FilterConfig,
  constants as tableConstants,
} from "@knime/knime-ui-table";

const { ROW_ID, INDEX } = specialColumns;
// -1 is the backend representation (columnName) for sorting the table by rowKeys
const ROW_KEYS_SORT_COL_NAME = "-1";

/** We want to support firefox at least, see https://stackoverflow.com/questions/51890286/need-to-increase-the-allowable-maximum-height-for-a-div-element */
const MAX_NUM_PXL_BROWSER_LIMITATION = 17000000; // < 17.895.697 (px)
const DEFAULT_SCOPE_SIZE = 200;
const SMALL_SCOPE_SIZE = 2;
const DEFAULT_BUFFER_SIZE = 50;
const SMALL_BUFFER_SIZE = 1;
const DEFAULT_NUM_ROWS_BOTTOM = 1000;

interface DataRequestOptions {
  lazyLoad?: {
    loadFromIndex: number;
    numRows: number;
    newScopeStart: number;
    bufferStart?: number;
    bufferEnd?: number;
    direction: 1 | -1;
  };
  updateTotalSelected?: boolean;
  updateDisplayedColumns?: boolean;
  updateColumnContentTypes?: boolean;
}

export default {
  components: {
    TableViewDisplay,
  },
  props: {
    initialData: {
      type: Object as PropType<InitialData>,
      default: null,
      required: false,
    },
    forceHideTableSizes: {
      type: Boolean,
      default: false,
      required: false,
    },
    enableCellSelection: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  setup() {
    const knimeService = inject<() => KnimeService>("getKnimeService")!();
    const selectionCache = useSelectionCache(knimeService);
    const rowHeight = useRowHeight();
    return { ...selectionCache, ...rowHeight, knimeService };
  },
  data() {
    return {
      dataLoaded: false,
      selectionLoaded: false,
      currentIndex: 0,
      currentPage: 1,
      currentScopeStartIndex: 0,
      currentScopeEndIndex: 0,
      columnSortIndex: null as null | number,
      columnSortDirection: 0,
      columnSortColumnName: null as null | string,
      totalSelected: 0,
      table: {} as Table,
      colNameSelectedRendererId: {} as Record<string, string>,
      dataTypes: {} as InitialData["dataTypes"],
      columnDomainValues: {} as InitialData["columnDomainValues"],
      totalRowCount: 0,
      currentRowCount: 0,
      settings: {} as TableViewViewSettings,
      displayedColumns: [] as string[],
      columnCount: 0,
      jsonDataService: null as null | JsonDataService,
      selectionService: null as null | SelectionService,
      searchTerm: "",
      columnFiltersMap: new Map() as Map<string | symbol, FilterConfig>,
      baseUrl: null,
      scopeSize: 0,
      numRowsAbove: 0,
      numRowsBelow: 0,
      bottomRows: [] as any[],
      columnDataTypeIds: [] as string[],
      columnFormatterDescriptions: [] as string[],
      columnContentTypes: [] as ColumnContentType[],
      columnNamesColors: [] as string[],
      // a counter which is used to ignore all requests which were not the last sent one
      lastUpdateHash: 0,
      link: "",
      showOnlySelectedRows: false,
    };
  },
  computed: {
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
        } else if (
          typeof modelValue === "object" &&
          modelValue.length &&
          modelValue[0] !== ""
        ) {
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
    maxNumRows() {
      // The current row height does not contain the margin each row has to the next row.
      return Math.floor(
        MAX_NUM_PXL_BROWSER_LIMITATION /
          (this.currentRowHeight + tableConstants.ROW_MARGIN_BOTTOM),
      );
    },
    minScopeSize() {
      return this.maxNumRows < DEFAULT_SCOPE_SIZE
        ? SMALL_SCOPE_SIZE
        : DEFAULT_SCOPE_SIZE;
    },
    bufferSize() {
      return this.maxNumRows < DEFAULT_SCOPE_SIZE
        ? SMALL_BUFFER_SIZE
        : DEFAULT_BUFFER_SIZE;
    },
    numRowsBottom() {
      if (!this.bottomRowsMode) {
        return 0;
      }
      // If it is no longer possible to display 1000 rows at the top AND at the bottom.
      if (this.maxNumRows <= 2 * DEFAULT_NUM_ROWS_BOTTOM) {
        return 1;
      }
      return DEFAULT_NUM_ROWS_BOTTOM;
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
    showOnlySelectedRowsSettingsItem() {
      return {
        text: "Show only selected rows",
        checkbox: {
          checked: this.showOnlySelectedRows,
          setBoolean: (checked: boolean) => {
            this.showOnlySelectedRows = checked;
            this.resetTableAndComputeSizes();
          },
        },
      };
    },
    settingsItems() {
      return this.settings.showOnlySelectedRowsConfigurable
        ? [this.showOnlySelectedRowsSettingsItem]
        : [];
    },
  },
  async mounted() {
    this.jsonDataService = new JsonDataService(this.knimeService);
    this.jsonDataService.addOnDataChangeCallback(
      this.onViewSettingsChange.bind(this),
    );
    const initialData =
      this.initialData === null
        ? ((await this.jsonDataService.initialData()) as InitialData)
        : this.initialData;
    // @ts-expect-error
    this.baseUrl = this.knimeService?.extensionConfig?.resourceInfo?.baseUrl;
    if (initialData) {
      const { table, dataTypes, columnDomainValues, settings } = initialData;
      this.displayedColumns = table.displayedColumns;
      this.columnCount = table.columnCount;
      this.columnDataTypeIds = table.columnDataTypeIds;
      this.columnFormatterDescriptions = table.columnFormatterDescriptions;
      this.columnContentTypes = table.columnContentTypes;
      this.columnNamesColors = table.columnNamesColors;
      this.dataTypes = dataTypes;
      this.columnDomainValues = columnDomainValues;
      this.totalRowCount = table.rowCount;
      this.currentRowCount = table.rowCount;
      this.setSettings(settings);
      this.setRowHeightSettings(settings);
      if (this.useLazyLoading) {
        await this.initializeLazyLoading();
      } else {
        this.table = table;
        this.dataLoaded = true;
      }
      await this.handleInitialSelection();
      this.selectionService.addOnSelectionChangeCallback(
        this.onSelectionChange,
      );
      this.selectionLoaded = true;
      this.columnFiltersMap = this.getDefaultFilterConfigsMap(
        this.displayedColumns,
      );
    }
  },
  methods: {
    setSettings(settings: TableViewViewSettings) {
      this.settings = settings;
      this.showOnlySelectedRows = settings.showOnlySelectedRows;
    },
    async initializeLazyLoading(
      params: {
        updateDisplayedColumns?: boolean;
        updateTotalSelected?: boolean;
      } = {},
    ) {
      const { updateDisplayedColumns = false, updateTotalSelected = true } =
        params;
      this.currentScopeStartIndex = 0;
      this.scopeSize = this.minScopeSize;
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
        direction: 1 as const,
      };
    },
    onScroll({
      direction,
      startIndex,
      endIndex,
    }: {
      direction: 1 | -1;
      startIndex: number;
      endIndex: number;
    }) {
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
    computeScopeSize(startIndex: number, endIndex: number) {
      return Math.max(
        endIndex - startIndex + 2 * this.bufferSize,
        this.minScopeSize,
      );
    },

    async updateData(options: DataRequestOptions) {
      this.lastUpdateHash += 1;
      const updateHash = this.lastUpdateHash;
      const data = await this.requestData(options);
      if (this.lastUpdateHash !== updateHash) {
        return;
      }
      this.updateInternals(data, options);
      this.dataLoaded = true;
    },
    async requestData(options: DataRequestOptions) {
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
          topTable!.rowCount - this.numRowsBottom,
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
    updateInternals(
      tables: { topTable: Table | null; bottomTable: Table | null },
      options: DataRequestOptions,
    ) {
      const { topTable, bottomTable } = tables;
      const {
        updateDisplayedColumns,
        updateTotalSelected,
        updateColumnContentTypes,
        lazyLoad,
      } = options;
      const getFromTopOrBottom = <T extends keyof Table>(key: T) =>
        topTable ? topTable[key] : bottomTable![key];
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
        this.columnNamesColors = getFromTopOrBottom("columnNamesColors");
      }
      if (updateTotalSelected) {
        if (this.colSortActive || this.searchTerm || this.colFilterActive) {
          this.totalSelected = getFromTopOrBottom("totalSelected");
        } else {
          this.totalSelected = this.getCurrentSelectedRowKeys().size;
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
          this.table = { ...topTable!, rows };
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
        this.table = topTable!;
        this.bottomRows = bottomTable ? bottomTable.rows : [];
      }
      this.currentRowCount = this.table.rowCount;
      this.transformSelection();
      this.numRowsAbove = lazyLoad ? this.currentScopeStartIndex : 0;
      this.numRowsBelow = lazyLoad
        ? this.numRowsTotal - this.currentScopeEndIndex
        : 0;
    },
    getTopAndBottomIndicesOnPagination(loadFromIndex: number, numRows: number) {
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
    getTopIndices(loadFromIndex: number, loadToIndex: number) {
      const topLoadFromIndex = Math.min(loadFromIndex, this.numRowsTop);
      const topLoadToIndex = Math.min(loadToIndex, this.numRowsTop);
      const topNumRows = topLoadToIndex - topLoadFromIndex;
      return { topLoadFromIndex, topNumRows };
    },
    getBottomIndices(loadFromIndex: number, loadToIndex: number) {
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
      startIndex: number,
      numRows: number,
      displayedColumns: string[],
      updateDisplayedColumns: boolean,
      updateTotalSelected: boolean,
      clearImageDataCache: boolean,
    ): Promise<Table> {
      const selectedRendererIds = updateDisplayedColumns
        ? this.getCurrentSelectedRenderers(
            this.settings.displayedColumns.selected,
          )
        : this.selectedRendererIds;
      if (this.colSortActive || this.searchTerm || this.colFilterActive) {
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
      startIndex: number,
      numRows: number,
      displayedColumns: string[],
      updateDisplayedColumns: boolean,
      updateTotalSelected: boolean,
      selectedRendererIds: (string | null)[],
      clearImageDataCache: boolean,
    ) {
      const columnSortIsAscending = this.columnSortDirection === 1;
      return this.performRequest("getFilteredAndSortedTable", [
        displayedColumns,
        startIndex,
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
        this.showOnlySelectedRows,
      ]);
    },
    // eslint-disable-next-line max-params
    requestUnfilteredAndUnsortedTable(
      startIndex: number,
      numRows: number,
      displayedColumns: string[],
      updateDisplayedColumns: boolean,
      selectedRendererIds: (string | null)[],
      clearImageDataCache: boolean,
    ) {
      return this.performRequest("getTable", [
        displayedColumns,
        startIndex,
        numRows,
        selectedRendererIds,
        updateDisplayedColumns,
        clearImageDataCache,
        this.skipRemainingColumns,
        this.showOnlySelectedRows,
      ]);
    },
    getColumnsForRequest(updateDisplayedColumns: boolean) {
      return updateDisplayedColumns
        ? this.settings.displayedColumns.selected
        : this.displayedColumns;
    },
    getColumnFilterValues(displayedColumns: string[]) {
      return [ROW_ID.id, ...displayedColumns].map((colId) =>
        this.getArrayOfFilterValues(colId),
      );
    },
    getArrayOfFilterValues(colId: string | symbol) {
      const filter = this.columnFiltersMap.get(colId);
      if (typeof filter?.modelValue === "string") {
        return [filter?.modelValue];
      } else {
        return filter?.modelValue ?? "";
      }
    },
    performRequest(method: string, options?: any) {
      return this.jsonDataService!.data({ method, options });
    },
    getCombinedTopRows({
      topTable,
      bufferStart,
      bufferEnd,
      direction,
      topPreviousDataLength,
    }: {
      topTable: Table | null;
      bufferStart: number;
      bufferEnd: number;
      direction: 1 | -1;
      topPreviousDataLength: number;
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
    getCombinedBottomRows({
      bottomTable,
      bufferStart,
      bufferEnd,
      direction,
    }: {
      bottomTable: Table | null;
      bufferStart: number;
      bufferEnd: number;
      direction: 1 | -1;
    }) {
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
    }: {
      newRows?: any[];
      bufferStart?: number;
      bufferEnd?: number;
      direction: 1 | -1;
      bottom?: boolean;
    }) {
      const rows = newRows ?? [];
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
    async refreshTable(
      params: {
        updateDisplayedColumns?: boolean;
        resetPage?: boolean;
        updateTotalSelected?: boolean;
      } = {},
    ) {
      let {
        updateDisplayedColumns = false,
        resetPage = false,
        updateTotalSelected = false,
      } = params;
      const tableViewDisplay = this.getTableViewDisplay();
      tableViewDisplay.refreshScroller();
      tableViewDisplay.clearCellSelection();
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
    async onPageChange(pageDirection: 1 | -1) {
      const { pageSize } = this.settings;
      this.currentPage += pageDirection;
      this.currentIndex += pageDirection * pageSize;
      await this.refreshTable();
      this.getTableViewDisplay().triggerCalculationOfAutoColumnSizes();
    },
    settingsChanged(
      newSettings: TableViewViewSettings,
      key: keyof TableViewViewSettings,
    ) {
      return newSettings[key] !== this.settings[key];
    },
    onViewSettingsChange(event: Event) {
      const newSettings = event.data.data
        .view as PossiblyNonInitializedSettings;
      if (isInitialized(newSettings)) {
        this.handleNewSettings(newSettings);
      }
    },
    async handleNewSettings(newSettings: TableViewViewSettings) {
      const enablePaginationChanged = this.settingsChanged(
        newSettings,
        "enablePagination",
      );
      const displayedColumnsChanged = !arrayEquals(
        newSettings.displayedColumns.selected,
        this.settings.displayedColumns.selected,
      );
      const showRowKeysChanged = this.settingsChanged(
        newSettings,
        "showRowKeys",
      );
      const showRowIndicesChanged = this.settingsChanged(
        newSettings,
        "showRowIndices",
      );
      const pageSizeChanged = this.settingsChanged(newSettings, "pageSize");
      const rowHeightChanged =
        this.settingsChanged(newSettings, "rowHeightMode") ||
        this.settingsChanged(newSettings, "customRowHeight");
      if (rowHeightChanged) {
        this.setRowHeightSettings(newSettings);
      }
      const rowHeightChangeInducesRefresh =
        rowHeightChanged && this.useLazyLoading;
      const autoSizeColumnsToContentChanged = this.settingsChanged(
        newSettings,
        "autoSizeColumnsToContent",
      );
      const showOnlySelectedRowsChanged = this.settingsChanged(
        newSettings,
        "showOnlySelectedRows",
      );

      const oldDisplayedColumns = this.settings.displayedColumns.selected;

      if (autoSizeColumnsToContentChanged) {
        this.getTableViewDisplay().deleteColumnSizeOverrides();
      }

      this.setSettings(newSettings);

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
      if (showRowKeysChanged || showRowIndicesChanged) {
        this.getTableViewDisplay().clearCellSelection();
      }
      if (displayedColumnsChanged) {
        await this.refreshTable({
          updateDisplayedColumns: true,
          updateTotalSelected: true,
        });
      } else if (
        rowHeightChangeInducesRefresh ||
        sortingParamsReseted ||
        (autoSizeColumnsToContentChanged &&
          this.settings.autoSizeColumnsToContent !==
            AutoSizeColumnsToContent.FIXED)
      ) {
        this.refreshTable();
      } else if (
        pageSizeChanged ||
        enablePaginationChanged ||
        showOnlySelectedRowsChanged
      ) {
        await this.resetTableAndComputeSizes();
      }

      this.deleteColumnSizeOverrides({
        showRowIndicesChanged,
        showRowKeysChanged,
        displayedColumnsChanged,
        oldDisplayedColumns,
      });
    },
    onColumnSort(newColumnSortIndex: number, newColumnSortId: symbol | string) {
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
          : (newColumnSortId as string);
      this.refreshTable();
    },
    async onSelectionChange() {
      this.transformSelection();
      if (this.showOnlySelectedRows) {
        await this.refreshTable({ resetPage: true, updateTotalSelected: true });
      } else {
        this.totalSelected = await this.requestTotalSelected();
      }
    },
    requestTotalSelected() {
      if (this.searchTerm || this.colFilterActive) {
        return this.performRequest("getTotalSelected");
      } else {
        return this.getCurrentSelectedRowKeys().size;
      }
    },
    async onRowSelect(
      selected: boolean,
      rowInd: number,
      _groupInd: number,
      isTop: boolean,
    ) {
      const rowKey = isTop
        ? this.table.rows[rowInd][1]
        : this.bottomRows[rowInd][1];
      this.totalSelected += selected ? 1 : -1;
      await this.selectionService.publishOnSelectionChange(
        selected ? SelectionModes.ADD : SelectionModes.REMOVE,
        [rowKey],
      );
      this.transformSelection();
      if (this.showOnlySelectedRows) {
        this.refreshTable({ resetPage: true });
      }
    },
    async onSelectAll(selected: boolean) {
      const filterActive = this.currentRowCount !== this.totalRowCount;
      let backendSelectionPromise;
      if (selected || filterActive) {
        const currentRowKeys = await this.performRequest(
          "getCurrentRowKeys",
          [],
        );
        backendSelectionPromise =
          this.selectionService[selected ? "add" : "remove"](currentRowKeys);
      } else {
        backendSelectionPromise = this.selectionService.replace([]);
      }
      this.transformSelection();
      if (this.showOnlySelectedRows) {
        await backendSelectionPromise;
        await this.refreshTable({ resetPage: true });
      }
      this.totalSelected = selected ? this.currentRowCount : 0;
    },
    onSearch(input: string) {
      this.searchTerm = input;
      this.refreshTable({ resetPage: true, updateTotalSelected: true });
    },
    onColumnFilter(colId: string | symbol, value: string | string[]) {
      const columnFilter = this.columnFiltersMap.get(colId);
      if (!columnFilter) {
        return;
      }
      columnFilter.modelValue = value;
      this.refreshTable({ resetPage: true, updateTotalSelected: true });
    },
    onClearFilter() {
      this.columnFiltersMap = this.getDefaultFilterConfigsMap(
        this.displayedColumns,
      );
      this.refreshTable({ resetPage: true, updateTotalSelected: true });
    },
    onHeaderSubMenuItemSelection(item: HeaderMenuItem, columnName: string) {
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
    transformSelection() {
      this.mapSelectionToRows({
        topRows: this.table.rows,
        bottomRows: this.bottomRows,
      });
    },
    async handleInitialSelection() {
      const initialSelection = await this.selectionService.initialSelection();
      this.totalSelected = initialSelection ? initialSelection.length : 0;
      this.transformSelection();
    },
    getDefaultFilterConfigsMap(displayedColumns: string[]) {
      const filterConfigs: Map<string | symbol, FilterConfig> = new Map();

      filterConfigs.set(ROW_ID.id, createDefaultFilterConfig(false, null));
      displayedColumns.forEach((col) => {
        const domainValues = this.columnDomainValues[col];
        const domainValuesMapped = domainValues
          ? domainValues.map((val: string) => ({ id: val, text: val }))
          : null;
        filterConfigs.set(
          col,
          createDefaultFilterConfig(Boolean(domainValues), domainValuesMapped),
        );
      });
      return filterConfigs;
    },
    // only call the method when (displayedColumns XOR showRowKeys XOR showRowKeys) changed and a sorting is active
    updateSortingParams(
      newSettings: TableViewViewSettings,
      displayedColumnsChanged: boolean,
      showRowKeysChanged: boolean,
      showRowIndicesChanged: boolean,
    ) {
      /**
       * This check happens already earlier but is repeated here in order to have type safety
       */
      if (this.columnSortIndex === null || this.columnSortColumnName === null) {
        throw Error(
          "This method should only be called when column sorting is active",
        );
      }
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
      this.columnSortDirection = 0;
      this.currentPage = 1;
      this.currentIndex = 0;
    },
    getCurrentSelectedRenderers(displayedColumns: string[]) {
      return displayedColumns.map(
        (columnName) => this.colNameSelectedRendererId[columnName] || null,
      );
    },
    async onCopySelection(rect: {
      isTop: boolean;
      fromIndex: number;
      toIndex: number;
      withRowIndices: boolean;
      withRowKeys: boolean;
      withHeaders: boolean;
      columnNames: string[];
    }) {
      const fromIndex = rect.isTop
        ? rect.fromIndex
        : this.bottomScrollIndexToIndex(rect.fromIndex);
      const toIndex = rect.isTop
        ? rect.toIndex
        : this.bottomScrollIndexToIndex(rect.toIndex);
      document.body.style.cursor = "wait";
      const { withRowIndices, withRowKeys } = rect;

      const rowIndexConfig = {
        isIncluded: withRowIndices,
        columnName: INDEX.name,
      };
      const rowKeyConfig = {
        isIncluded: withRowKeys,
        columnName: ROW_ID.name,
      };

      try {
        const copyContent = await this.performRequest("getCopyContent", [
          rowIndexConfig,
          rowKeyConfig,
          rect.withHeaders,
          rect.columnNames,
          fromIndex,
          toIndex,
        ]);

        const blobHTML = new Blob([copyContent.html], { type: "text/html" });
        const blobCSV = new Blob([copyContent.csv], { type: "text/plain" });

        const clipboardItem = new ClipboardItem({
          [blobHTML.type]: blobHTML,
          [blobCSV.type]: blobCSV,
        });

        navigator.clipboard.write([clipboardItem]);
      } catch (error) {
        consola.error(
          "Failed to copy content to clipboard with error: ",
          error,
        );
      }
      document.body.style.cursor = "unset";
    },
    /**
     * A method to revert the index shift caused by leaving out rows between top and bottom rows by counting from the bottom.
     */
    bottomScrollIndexToIndex(bottomScrollIndex: number) {
      return this.currentRowCount - this.maxNumRows + bottomScrollIndex;
    },
    deleteColumnSizeOverrides({
      showRowIndicesChanged,
      showRowKeysChanged,
      displayedColumnsChanged,
      oldDisplayedColumns,
    }: {
      showRowIndicesChanged: boolean;
      showRowKeysChanged: boolean;
      displayedColumnsChanged: boolean;
      oldDisplayedColumns: string[];
    }) {
      if (showRowIndicesChanged && !this.settings.showRowIndices) {
        this.getTableViewDisplay().deleteColumnSizeOverrides([INDEX.id]);
      } else if (showRowKeysChanged && !this.settings.showRowKeys) {
        this.getTableViewDisplay().deleteColumnSizeOverrides([ROW_ID.id]);
      } else if (displayedColumnsChanged) {
        this.getTableViewDisplay().deleteColumnSizeOverrides(
          oldDisplayedColumns.filter(
            (columnName) => !this.displayedColumns.includes(columnName),
          ),
        );
      }
    },
    async resetTableAndComputeSizes() {
      await this.refreshTable({ resetPage: true });
      this.getTableViewDisplay().triggerCalculationOfAutoColumnSizes();
    },
    getTableViewDisplay(): typeof TableViewDisplay {
      return this.$refs.tableViewDisplay as typeof TableViewDisplay;
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
      loaded: dataLoaded && selectionLoaded,
      top: table.rows,
      bottom: bottomRows,
      numRowsAbove,
      numRowsBelow,
    }"
    :header="{
      displayedColumns,
      columnFiltersMap,
      columnContentTypes,
      colNameSelectedRendererId,
      dataTypes,
      columnDataTypeIds,
      columnFormatterDescriptions,
      columnNamesColors,
      indicateRemainingColumnsSkipped,
    }"
    :selection="{
      top: currentSelection,
      bottom: currentBottomSelection,
      totalSelected: Boolean(totalSelected),
    }"
    :page="{
      currentRowCount,
      totalRowCount: settings.showOnlySelectedRows
        ? totalSelected
        : totalRowCount,
      currentPage,
      columnCount,
    }"
    :sorting="
      columnSortIndex === null
        ? undefined
        : {
            columnSortIndex,
            columnSortDirection,
          }
    "
    global-search-query=""
    :enable-virtual-scrolling="true"
    :enable-column-resizing="true"
    :enable-row-resizing="true"
    :current-row-height="currentRowHeight"
    :include-image-resources="false"
    :enable-cell-selection="
      enableCellSelection && Boolean(settings.enableCellCopying)
    "
    :knime-service="knimeService"
    :force-hide-table-sizes="forceHideTableSizes"
    :first-row-image-dimensions="table.firstRowImageDimensions || {}"
    :settings-items="settingsItems"
    @page-change="onPageChange"
    @column-sort="onColumnSort"
    @row-select="onRowSelect"
    @row-height-update="onRowHeightChange"
    @select-all="onSelectAll"
    @search="onSearch"
    @column-filter="onColumnFilter"
    @clear-filter="onClearFilter"
    @header-sub-menu-item-selection="onHeaderSubMenuItemSelection"
    @lazyload="onScroll"
    @copy-selection="onCopySelection"
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
