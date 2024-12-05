/* eslint-disable vitest/max-nested-describe, max-lines */
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { ref, unref } from "vue";
import { VueWrapper } from "@vue/test-utils";

// @ts-ignore
import { LoadingIcon } from "@knime/components";
import { TableUIWithAutoSizeCalculation } from "@knime/knime-ui-table";

import TableViewDisplay from "../TableViewDisplay.vue";
import useAutoSizes from "../composables/useAutoSizes";
import useColumnSizes from "../composables/useColumnSizes";
import type { TableViewDisplayProps } from "../types";
import {
  RowHeightMode,
  SelectionMode,
  VerticalPaddingMode,
} from "../types/ViewSettings";
import specialColumns from "../utils/specialColumns";

import { getDefaultProps, shallowMountDisplay } from "./utils/display";

const useColumnSizesMock: { [key: string]: any } = {
  columnSizes: ref([50, 50, 50]),
  onColumnResize: vi.fn(),
  onAllColumnsResize: vi.fn(),
  onUpdateAvailableWidth: vi.fn(),
};
vi.mock("../composables/useColumnSizes", () => ({
  default: vi.fn(() => useColumnSizesMock),
}));

const useAutoSizesMock: { [key: string]: any } = {
  autoColumnSizes: { col1: 55 },
  autoColumnSizesActive: true,
  autoColumnSizesOptions: {
    calculateForBody: true,
    calculateForHeader: true,
    fixedSizes: { col1: 77 },
  },
  onAutoColumnSizesUpdate: vi.fn(),
};
vi.mock("../composables/useAutoSizes", () => ({
  default: vi.fn(() => useAutoSizesMock),
}));

describe("TableViewDisplay.vue", () => {
  let props: TableViewDisplayProps;

  beforeEach(() => {
    props = getDefaultProps();
  });

  describe("tableUI props", () => {
    const findTableComponent = (wrapper: VueWrapper<any>) => {
      return wrapper.findComponent(TableUIWithAutoSizeCalculation);
    };

    describe("data", () => {
      const getData = (wrapper: VueWrapper): any[][] =>
        findTableComponent(wrapper).vm.$props.data as any;
      const getBottomData = (wrapper: VueWrapper): any[] =>
        findTableComponent(wrapper).vm.$attrs["bottom-data"] as any;

      it("sets data", () => {
        const wrapper = shallowMountDisplay({ props });
        const data = getData(wrapper);
        expect(data).toStrictEqual([props.rows.top]);
        const bottomData = getBottomData(wrapper);
        expect(bottomData).toStrictEqual(props.rows.bottom);
      });

      it("defaults to empty bottom data", () => {
        props.rows.bottom = undefined;
        const wrapper = shallowMountDisplay({ props });
        const bottomData = getBottomData(wrapper);
        expect(bottomData).toStrictEqual([]);
      });

      it("appends dots", () => {
        props.header.indicateRemainingColumnsSkipped = true;
        const wrapper = shallowMountDisplay({ props });
        const data = getData(wrapper);
        expect(data[0][0]).toStrictEqual([
          "cell(0,0)",
          "cell(0,1)",
          "cell(0,2)",
          "…",
        ]);
        const bottomData = getBottomData(wrapper);
        expect(bottomData[0]).toStrictEqual([
          "bottomCell(0,0)",
          "bottomCell(0,1)",
          "bottomCell(0,2)",
          "…",
        ]);
      });
    });

    describe("dataConfig", () => {
      const getDataConfig = (wrapper: VueWrapper) =>
        findTableComponent(wrapper).vm.$props.dataConfig;

      it("sets dataConfig without special columns", () => {
        const wrapper = shallowMountDisplay({ props });
        const dataConfig = getDataConfig(wrapper);
        expect(dataConfig).toMatchObject({
          columnConfigs: [
            expect.objectContaining({ header: "col1" }),
            expect.objectContaining({ header: "col2" }),
            expect.objectContaining({ header: "col3" }),
          ],
          rowConfig: { enableResizing: false },
        });

        expect(dataConfig?.columnConfigs[0]).toStrictEqual({
          filterConfig: undefined,
          formatter: expect.anything(),
          hasSlotContent: false,
          noPadding: false,
          header: "col1",
          isSortable: true,
          key: 2,
          id: "col1",
          size: 50,
          subHeader: undefined,
          headerColor: "#ff0000",
          hasDataValueView: true,
        });
      });

      const {
        INDEX,
        ROW_ID,
        SKIPPED_REMAINING_COLUMNS_COLUMN: SKIPPED,
      } = specialColumns;

      it("sets dataConfig with special columns", () => {
        useColumnSizesMock.columnSizes = ref([
          INDEX.defaultSize,
          ROW_ID.defaultSize,
          50,
          50,
          50,
          SKIPPED.defaultSize,
        ]);

        props.settings.showRowIndices = true;
        props.settings.showRowKeys = true;
        props.header.indicateRemainingColumnsSkipped = true;
        const wrapper = shallowMountDisplay({ props });
        const dataConfig = getDataConfig(wrapper);
        expect(dataConfig).toMatchObject({
          columnConfigs: [
            expect.objectContaining({ header: INDEX.name }),
            expect.objectContaining({ header: ROW_ID.name }),
            expect.objectContaining({ header: "col1" }),
            expect.objectContaining({ header: "col2" }),
            expect.objectContaining({ header: "col3" }),
            expect.objectContaining({ header: SKIPPED.name }),
          ],
        });

        expect(dataConfig?.columnConfigs[0]).toStrictEqual({
          filterConfig: undefined,
          formatter: expect.anything(),
          hasSlotContent: false,
          noPadding: false,
          header: INDEX.name,
          isSortable: false,
          key: 0,
          id: INDEX.id,
          size: INDEX.defaultSize,
          subHeader: undefined,
          headerColor: undefined,
          hasDataValueView: undefined,
        });

        expect(dataConfig?.columnConfigs[1]).toStrictEqual({
          filterConfig: undefined,
          formatter: expect.anything(),
          hasSlotContent: false,
          noPadding: false,
          header: ROW_ID.name,
          isSortable: true,
          key: 1,
          id: ROW_ID.id,
          size: ROW_ID.defaultSize,
          subHeader: undefined,
          headerColor: undefined,
          hasDataValueView: undefined,
        });

        expect(dataConfig?.columnConfigs[5]).toStrictEqual({
          filterConfig: undefined,
          formatter: expect.anything(),
          hasSlotContent: false,
          noPadding: false,
          header: SKIPPED.name,
          isSortable: false,
          key: 5,
          id: SKIPPED.id,
          size: SKIPPED.defaultSize,
          subHeader: undefined,
          headerColor: undefined,
          hasDataValueView: undefined,
        });
      });

      describe("columnConfig", () => {
        const getColumnConfigs = (wrapper: VueWrapper) =>
          getDataConfig(wrapper)?.columnConfigs;

        it("sets minimal column config", () => {
          const wrapper = shallowMountDisplay({ props });
          const columnConfigs = getColumnConfigs(wrapper);

          expect(columnConfigs?.[1]).toStrictEqual({
            filterConfig: undefined,
            formatter: expect.anything(),
            noPadding: false,
            hasSlotContent: false,
            header: "col2",
            isSortable: true,
            key: 3,
            id: "col2",
            size: 50,
            subHeader: undefined,
            headerColor: "#00ff00",
            hasDataValueView: false,
          });
        });

        it("sets filter config", () => {
          const customColumnFilter = { is: "Dropdown", modelValue: "foo" };
          const columnFiltersMap = new Map();
          columnFiltersMap.set("col2", customColumnFilter);
          props.header.columnFiltersMap = columnFiltersMap;
          const wrapper = shallowMountDisplay({ props });
          const columnConfigs = getColumnConfigs(wrapper);

          expect(columnConfigs?.[1]).toMatchObject({
            filterConfig: customColumnFilter,
          });
        });

        it("sets sub header", () => {
          props.settings.showColumnDataType = true;
          const wrapper = shallowMountDisplay({ props });
          const columnConfigs = getColumnConfigs(wrapper);

          expect(columnConfigs?.[1]).toMatchObject({
            subHeader:
              props.header.dataTypes[props.header.columnDataTypeIds[1]].name,
          });
        });

        describe("renderers", () => {
          beforeEach(() => {
            props.settings.enableRendererSelection = true;
          });

          it("sets renderers", () => {
            const wrapper = shallowMountDisplay({ props });
            const columnConfigs = getColumnConfigs(wrapper);

            expect(columnConfigs?.[1]).toMatchObject({
              headerSubMenuItems: [
                expect.objectContaining({ text: "Data renderer" }),
                expect.objectContaining({ id: "t2r1" }),
                expect.objectContaining({ id: "t2r2" }),
              ],
            });
          });

          it("sets selected renderer", () => {
            props.header.colNameSelectedRendererId = {
              col2: "t2r2",
            };
            const wrapper = shallowMountDisplay({ props });
            const columnConfigs = getColumnConfigs(wrapper);
            expect(columnConfigs?.[1]).toMatchObject({
              headerSubMenuItems: [
                expect.objectContaining({ text: "Data renderer" }),
                expect.objectContaining({ id: "t2r1", selected: false }),
                expect.objectContaining({ id: "t2r2", selected: true }),
              ],
            });
          });

          it("sets renderer attached to column", () => {
            props.header.columnFormatterDescriptions = [
              "Col1-Formatter",
              "Col2-Formatter",
              null,
            ];
            const wrapper = shallowMountDisplay({ props });
            const columnConfigs = getColumnConfigs(wrapper);
            expect(columnConfigs?.[0]).toMatchObject({
              headerSubMenuItems: [
                expect.objectContaining({ text: "Data renderer" }),
                expect.objectContaining({ id: null, text: "Col1-Formatter" }),
                expect.objectContaining({ id: "t1r1" }),
                expect.objectContaining({ id: "t1r2" }),
                expect.objectContaining({ id: "t1r3" }),
                expect.objectContaining({ id: "t1r4" }),
              ],
            });
            expect(columnConfigs?.[1]).toMatchObject({
              headerSubMenuItems: [
                expect.objectContaining({ text: "Data renderer" }),
                expect.objectContaining({ id: null, text: "Col2-Formatter" }),
                expect.objectContaining({ id: "t2r1" }),
                expect.objectContaining({ id: "t2r2" }),
              ],
            });
            expect(columnConfigs?.[2]).toMatchObject({
              headerSubMenuItems: [
                expect.objectContaining({ text: "Data renderer" }),
                expect.objectContaining({ id: "t3r1" }),
                expect.objectContaining({ id: "t3r2" }),
                expect.objectContaining({ id: "t3r3" }),
              ],
            });
          });
        });
      });

      describe("rowConfig", () => {
        const getRowConfig = (wrapper: VueWrapper) =>
          getDataConfig(wrapper)?.rowConfig;

        it("sets minimal row config", () => {
          const wrapper = shallowMountDisplay({ props });
          expect(getRowConfig(wrapper)?.rowHeight).toBe(50);
          expect(getRowConfig(wrapper)?.compactMode).toBeFalsy();
          expect(getRowConfig(wrapper)?.enableResizing).toBeFalsy();
        });

        it("sets compact mode", () => {
          props.settings.verticalPaddingMode = VerticalPaddingMode.COMPACT;
          const wrapper = shallowMountDisplay({ props });
          expect(getRowConfig(wrapper)?.compactMode).toBeTruthy();
        });

        it("sets custom row height", () => {
          const customRowHeight = 80;
          props.settings.rowHeightMode = RowHeightMode.CUSTOM;
          props.settings.customRowHeight = customRowHeight;
          const wrapper = shallowMountDisplay({ props });
          const rowConfig = getRowConfig(wrapper);
          expect(rowConfig?.compactMode).toBeFalsy();
          expect(rowConfig?.rowHeight).toBe(80);
        });

        it("sets dynamic row height when using auto row height mode", () => {
          props.settings.rowHeightMode = RowHeightMode.AUTO;
          props.enableDynamicRowHeight = true;
          const wrapper = shallowMountDisplay({ props });
          const rowConfig = getRowConfig(wrapper);
          expect(rowConfig?.compactMode).toBeFalsy();
          expect(rowConfig?.rowHeight).toBe("dynamic");
        });

        it("does not set dynamic row height when using custom row height mode", () => {
          props.settings.rowHeightMode = RowHeightMode.CUSTOM;
          props.enableDynamicRowHeight = true;
          const wrapper = shallowMountDisplay({ props });
          const rowConfig = getRowConfig(wrapper);
          expect(rowConfig?.compactMode).toBeFalsy();
          expect(rowConfig?.rowHeight).toBe(80);
        });

        it("applies default value for small custom row height", () => {
          const customRowHeight = 1;
          props.settings.rowHeightMode = RowHeightMode.CUSTOM;
          props.settings.customRowHeight = customRowHeight;
          const wrapper = shallowMountDisplay({ props });
          const rowConfig = getRowConfig(wrapper);
          expect(rowConfig?.rowHeight).toBe(24);
        });

        it("enables row resizing", () => {
          props.enableRowResizing = true;
          const wrapper = shallowMountDisplay({ props });
          expect(getRowConfig(wrapper)?.enableResizing).toBeTruthy();
        });
      });
    });

    describe("tableConfig", () => {
      const getTableConfig = (wrapper: VueWrapper) =>
        findTableComponent(wrapper).vm.$props.tableConfig;

      it("sets basic tableConfig", () => {
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig).toMatchObject({
          enableColumnResizing: false,
          enableVirtualScrolling: false,
          pageConfig: {
            showTableSize: false,
            currentSize: 4,
            pageSize: 4,
            columnCount: 3,
            currentPage: 1,
            tableSize: 6,
          },
          showColumnFilters: false,
          showSelection: false,
          disableSelection: true,
          subMenuItems: [],
        });
      });

      it("shows selection when selectionMode is 'SHOW'", () => {
        props.settings.selectionMode = SelectionMode.SHOW;
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig?.showSelection).toBeTruthy();
        expect(tableConfig?.disableSelection).toBeTruthy();
      });

      it("enables selection when selectionMode is 'EDIT'", () => {
        props.settings.selectionMode = SelectionMode.EDIT;
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig?.showSelection).toBeTruthy();
        expect(tableConfig?.disableSelection).toBeFalsy();
      });

      it("enables column filters", () => {
        props.settings.enableColumnSearch = true;
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig).toMatchObject({
          showColumnFilters: true,
        });
      });

      it("enables column resizing", () => {
        props.enableColumnResizing = true;
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig).toMatchObject({
          enableColumnResizing: true,
        });
      });

      it("enables virtual scrolling", () => {
        props.enableVirtualScrolling = true;
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig).toMatchObject({
          enableVirtualScrolling: true,
        });
      });

      it("sets pageConfig", () => {
        props.page = {
          currentPage: 1,
          currentRowCount: 2,
          totalRowCount: 3,
          columnCount: 4,
        };
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig).toMatchObject({
          pageConfig: {
            currentPage: 1,
            currentSize: 2,
            pageSize: 2,
            tableSize: 3,
            columnCount: 4,
            showTableSize: false,
          },
        });
      });

      it("does not hide table sizes in case of pagination", () => {
        props.page = {
          currentPage: 1,
          currentRowCount: 2,
          totalRowCount: 3,
          columnCount: 4,
        };
        props.settings.enablePagination = true;
        props.settings.showTableSize = false;
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig).toMatchObject({
          pageConfig: expect.objectContaining({
            showTableSize: true,
          }),
        });
      });

      it("sets sortConfig", () => {
        props.sorting = {
          columnSortIndex: 1,
          columnSortDirection: -1,
        };
        props.settings.enableSortingByHeader = true;
        const wrapper = shallowMountDisplay({ props });
        const tableConfig = getTableConfig(wrapper);
        expect(tableConfig).toMatchObject({
          sortConfig: {
            sortColumn: 1,
            sortDirection: -1,
          },
        });
      });

      it("sets searchConfig", () => {
        props.settings.enableGlobalSearch = true;
        props.globalSearchQuery = "test";
        const wrapper = shallowMountDisplay({ props });
        expect(getTableConfig(wrapper)).toMatchObject({
          searchConfig: { searchQuery: props.globalSearchQuery },
        });
      });
    });
  });

  it("sets columnResizeActive state", () => {
    const wrapper = shallowMountDisplay({ props });
    const tableViewDisplay = wrapper.findComponent(TableViewDisplay);
    const tableUIWithAutoSizeCalculation = wrapper.findComponent(
      TableUIWithAutoSizeCalculation,
    );
    const columnResizeActive = (tableViewDisplay.vm as any).columnResizeActive;
    expect(columnResizeActive.state).toBeFalsy();
    tableUIWithAutoSizeCalculation.vm.$emit("columnResizeStart");
    expect(columnResizeActive.state).toBeTruthy();

    tableUIWithAutoSizeCalculation.vm.$emit("columnResizeEnd");
    expect(columnResizeActive.state).toBeFalsy();
  });

  it("emits tableIsReady", () => {
    const wrapper = shallowMountDisplay({ props });
    const tableViewDisplay = wrapper.findComponent(TableViewDisplay);
    const tableUIWithAutoSizeCalculation = wrapper.findComponent(
      TableUIWithAutoSizeCalculation,
    );

    tableUIWithAutoSizeCalculation.vm.$emit("ready");
    expect(tableViewDisplay.emitted()).toHaveProperty("tableIsReady");
  });

  it("shows loading animation after timeout", () => {
    props.rows.loaded = false;
    vi.useFakeTimers();
    const wrapper = shallowMountDisplay({ props });
    expect(
      wrapper.find(".center").findComponent(LoadingIcon).exists(),
    ).toBeFalsy();
    vi.runAllTimers();
    expect(
      wrapper.find(".center").findComponent(LoadingIcon).exists(),
    ).toBeFalsy();
    vi.useRealTimers();
  });

  describe("column size composables", () => {
    it("uses useAutoSizes with correct values", async () => {
      (useAutoSizes as Mock).mockClear();
      props.firstRowImageDimensions = {
        col1: { widthInPx: 20, heightInPx: 50 },
      };
      const wrapper = shallowMountDisplay({ props });
      const [
        {
          settings,
          firstRowImageDimensions,
          currentRowHeight,
          enableDynamicRowHeight,
        },
      ] = (useAutoSizes as any).mock.calls[0];
      expect(unref(settings)).toStrictEqual(props.settings);
      expect(unref(firstRowImageDimensions)).toStrictEqual(
        props.firstRowImageDimensions,
      );
      expect(unref(currentRowHeight)).toBe(props.currentRowHeight);
      expect(unref(enableDynamicRowHeight)).toBe(false);
      await wrapper.setProps({ enableDynamicRowHeight: true });
      expect(unref(enableDynamicRowHeight)).toBe(true);
    });

    it("uses useColumnSizes with correct values", () => {
      (useColumnSizes as Mock).mockClear();
      shallowMountDisplay({ props });
      const [{ settings, header, autoColumnSizes, autoColumnSizesActive }] = (
        useColumnSizes as any
      ).mock.calls[0];

      expect(unref(settings)).toStrictEqual(props.settings);
      expect(unref(header)).toStrictEqual(props.header);
      expect(unref(autoColumnSizes)).toStrictEqual(
        useAutoSizesMock.autoColumnSizes,
      );
      expect(unref(autoColumnSizesActive)).toBe(
        useAutoSizesMock.autoColumnSizesActive,
      );
    });

    it.each([
      ["onColumnResize", "column-resize", [0, 60], ["col1", 60]],
      ["onAllColumnsResize", "all-columns-resize", [60], [60]],
      ["onUpdateAvailableWidth", "update:available-width", [400], [400]],
    ])(
      "calls the method %s within useColumnSizes on emit of %s",
      (composableMethodName, emitMethodName, emitParams, callParams) => {
        const wrapper = shallowMountDisplay({ props });
        const tableUIWithAutoSizeCalculation = wrapper.findComponent(
          TableUIWithAutoSizeCalculation,
        );

        tableUIWithAutoSizeCalculation.vm.$emit(emitMethodName, ...emitParams);
        expect(useColumnSizesMock[composableMethodName]).toHaveBeenCalledWith(
          ...callParams,
        );
      },
    );

    it.each([
      [
        "onAutoColumnSizesUpdate",
        "auto-column-sizes-update",
        { col1: 55, col2: 66, col3: 77 },
        { col1: 55, col2: 66, col3: 77 },
      ],
    ])(
      "calls the method %s within useAutoSizes on emit of %s",
      (composableMethodName, emitMethodName, emitParams, calledWithParams) => {
        const wrapper = shallowMountDisplay({ props });
        const tableUIWithAutoSizeCalculation = wrapper.findComponent(
          TableUIWithAutoSizeCalculation,
        );

        tableUIWithAutoSizeCalculation.vm.$emit(emitMethodName, emitParams);
        expect(useAutoSizesMock[composableMethodName]).toHaveBeenCalledWith(
          calledWithParams,
        );
      },
    );
  });
});
